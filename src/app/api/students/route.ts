import { db } from "@/lib/db";
import { HTTP_CODE } from "@/lib/http-codes";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const students = await db.student.findMany({
            include: {
                payment: true,
                events: { // Include event details
                    select: {
                        title: true
                    }
                }
            }
        });

        console.log(students);

        return new NextResponse(JSON.stringify({
            success: true,
            students: students.map((student) => ({
                id: student.id,
                name: student.name,
                email: student.email,
                isPaid: student.payment[0]?.paymentStatus || "Unpaid",
                registrationDate: student.createdAt,
                paymentMethod: "UPI",
                events: student.events[0].title,
                paymentImage:student.payment[0].image
            }))
        }), {
            status: HTTP_CODE.OK,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.log(error);

        if (error instanceof PrismaClientInitializationError) {
            return new NextResponse(JSON.stringify({
                success: false,
                message: "DB Initialization error"
            }), {
                status: HTTP_CODE.BAD_REQUEST,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new NextResponse(JSON.stringify({
            success: false,
            message: "Internal Server error"
        }), {
            status: HTTP_CODE.SERVER_ERROR,
            headers: { "Content-Type": "application/json" }
        });
    }
}
