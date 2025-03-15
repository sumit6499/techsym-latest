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

    const existingEvent = await db.event.findFirst({
      where: { id: event },
      select: { id: true },
    });

    if (!existingEvent) {
      return new NextResponse(
        JSON.stringify({ msg: "Event not found" }),
        { status: HTTP_CODE.NOT_FOUND, headers: { "Content-Type": "application/json" } }
      );
    }

    const isAlreadyRegistered = await db.student.findFirst({
      where: {
        email: email,
        events: {
          some: { id: existingEvent.id },
        },
      },
    });
 
    if (isAlreadyRegistered) {
      return new NextResponse(
        JSON.stringify({ msg: "Student is already registered for this event" }),
        { status: HTTP_CODE.FORBIDDEN, headers: { "Content-Type": "application/json" } }
      );
    }

    const participantCount = eventType === "group" ? teamMembers.length + 1 : 1;

    const result = await db.$transaction(async (prisma) => {
      const student = await prisma.student.create({
        data: {
          name,
          email,
          phoneNo: phone,
          collegeName,
          Year: year,
          events: {
            connect: { id: existingEvent.id },
          },
        },
      });

      const registration = await prisma.registration.create({
        data: {
          registrationType: eventType,
          totalAmount: totalFee,
          participantCount,
          student: {
            connect: { id: student.id },
          },
          event: {
            connect: { id: existingEvent.id },
          },
        },
      });

      const payment = await prisma.payment.create({
        data: {
          image: paymentImage,
          paymentMethod,
          paymentStatus: "Paid",
          paymentId,
          amount: totalFee,
          Student: {
            connect: { id: student.id },
          },
          registration: {
            connect: { id: registration.id },
          },
        },
      });

      if (eventType === "group" && teamMembers.length > 0) {
        const teamMemberPromises = teamMembers.map(async (member: { name: string; email: string }) => {
          const existingStudent = await prisma.student.findUnique({
            where: { email: member.email },
          });

          return prisma.teamMember.create({
            data: {
              name: member.name,
              email: member.email,
              teamLeader: {
                connect: { id: student.id },
              },
              registration: {
                connect: { id: registration.id },
              },
              ...(existingStudent && {
                studentMember: {
                  connect: { id: existingStudent.id },
                },
              }),
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
      payment: result.payment
    }, { status: 201 });
    
  } catch (error) {
    if (error instanceof ZodError) {
      return new NextResponse(
        JSON.stringify({ msg: error.flatten().fieldErrors, error: error.flatten().formErrors }),
        { status: HTTP_CODE.BAD_REQUEST, headers: { "Content-Type": "application/json" } }
      );
    }

    if (error instanceof CustomError) {
      return new Response(JSON.stringify({ msg: error.message }), { status: error.statusCode });
    }

    if (error instanceof PrismaClientInitializationError) {
      console.log(error);
      return new NextResponse(
        JSON.stringify({ msg: "Database Initialization error", err: "Prisma Initialization error" }),
        { status: HTTP_CODE.BAD_REQUEST, headers: { "Content-Type": "application/json" } }
      );
    }

    console.error("Error registering student:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: HTTP_CODE.SERVER_ERROR });
  }
}