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
    const { name, phone, collegeName, year, paymentImage, paymentMethod, email, event } = studentSchema.parse(payload);

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

    // Check if student is already registered for the same event
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

    const student = await db.student.create({
      data: {
        name,
        email,
        phoneNo: phone,
        collegeName,
        Year: year,
        payment: {
          create: {
            image: paymentImage,
            paymentMethod,
            paymentStatus: "Paid",
          },
        },
        events: {
          connect: { id: existingEvent.id }, 
        },
      },
      include: {
        payment: true,
      },
    });

    return NextResponse.json({ success: true, student }, { status: 201 });

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
