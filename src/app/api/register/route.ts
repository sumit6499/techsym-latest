import { NextRequest, NextResponse } from "next/server";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { studentSchema } from "@/schema/student.schema";
import { ZodError } from "zod";
import { HTTP_CODE } from "@/lib/http-codes";
import { db } from "@/lib/db";
import { CustomError } from "@/lib/error";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const {
      name,
      phone,
      collegeName,
      year,
      paymentImage,
      paymentMethod,
      email,
      event,
      eventType = "individual",
      teamMembers = [],
      paymentId,
      totalFee = 100,
    } = studentSchema.parse(payload);

    // ✅ Check if the event exists
    const existingEvent = await db.event.findUnique({
      where: { id: event },
      select: { id: true },
    });

    if (!existingEvent) {
      return new NextResponse(
        JSON.stringify({ msg: "Event not found" }),
        { status: HTTP_CODE.NOT_FOUND, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Check if the student is already registered for this event
    const isAlreadyRegistered = await db.registration.findFirst({
      where: {
        student: { email },
        event: { id: existingEvent.id },
      },
    });

    if (isAlreadyRegistered) {
      return new NextResponse(
        JSON.stringify({ msg: "Student is already registered for this event" }),
        { status: HTTP_CODE.FORBIDDEN, headers: { "Content-Type": "application/json" } }
      );
    }

    // ✅ Fetch existing team members to prevent multiple DB queries in loop
    const existingStudents = await db.student.findMany({
      where: { email: { in: teamMembers.map((m) => m.email) } },
    });

    // ✅ Use Prisma transaction to handle all operations atomically
    const result = await db.$transaction(async (prisma) => {
      // 1️⃣ Register the student
      const student = await prisma.student.create({
        data: {
          name,
          email,
          phoneNo: phone,
          collegeName,
          Year: year,
          events: { connect: { id: existingEvent.id } },
        },
      });

      // 2️⃣ Register the student for the event
      const registration = await prisma.registration.create({
        data: {
          registrationType: eventType,
          totalAmount: totalFee,
          participantCount: eventType === "group" ? teamMembers.length + 1 : 1,
          student: { connect: { id: student.id } },
          event: { connect: { id: existingEvent.id } },
        },
      });

      // 3️⃣ Add payment details
      const payment = await prisma.payment.create({
        data: {
          image: paymentImage,
          paymentMethod,
          paymentStatus: "Paid",
          paymentId,
          amount: totalFee,
          Student: { connect: { id: student.id } },
          registration: { connect: { id: registration.id } },
        },
      });

      // 4️⃣ Add team members (if group registration)
      if (eventType === "group" && teamMembers.length > 0) {
        const teamMemberPromises = teamMembers.map((member) => {
          const existingStudent = existingStudents.find((s) => s.email === member.email);

          return prisma.teamMember.create({
            data: {
              name: member.name,
              email: member.email,
              teamLeader: { connect: { id: student.id } },
              registration: { connect: { id: registration.id } },
              ...(existingStudent && { studentMember: { connect: { id: existingStudent.id } } }),
            },
          });
        });

        await Promise.all(teamMemberPromises);
      }

      return { student, registration, payment };
    });

    return NextResponse.json({
      success: true,
      student: result.student,
      registration: result.registration,
      payment: result.payment,
    }, { status: HTTP_CODE.CREATED });

  } catch (error) {
    console.error("Error registering student:", error);

    if (error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({ msg: error.flatten().fieldErrors, error: error.flatten().formErrors }),
        { status: HTTP_CODE.BAD_REQUEST, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof CustomError) {
      return new NextResponse(
        JSON.stringify({ msg: error.message }),
        { status: error.statusCode, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof PrismaClientInitializationError) {
      return new NextResponse(
        JSON.stringify({ msg: "Database Initialization error" }),
        { status: HTTP_CODE.BAD_REQUEST, headers: { "Content-Type": "application/json" } }
      );
    }

    return new NextResponse(
      JSON.stringify({ success: false, error: "Internal Server Error" }),
      { status: HTTP_CODE.SERVER_ERROR, headers: { "Content-Type": "application/json" } }
    );
  }
}
