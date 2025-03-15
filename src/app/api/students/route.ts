import { db } from "@/lib/db";
import { HTTP_CODE } from "@/lib/http-codes";
import { PrismaClientInitializationError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const students = await db.student.findMany({
            include: {
                payment: {
                    select: {
                        paymentStatus: true,
                        image: true,
                        paymentMethod: true,
                        amount: true
                    }
                },
                registrations: {
                    include: {
                        event: {
                            select: {
                                title: true
                            }
                        },
                        teamMembers: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
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
                event: student.registrations.length > 0 ? student.registrations[0].event.title : "N/A",
                registrationType: student.registrations.length > 0 ? student.registrations[0].registrationType : "N/A",
                teamMembers: student.registrations.length > 0 ? student.registrations[0].teamMembers.map(member => ({
                    id: member.id,
                    name: member.name
                })) : [],
                totalAmountPaid: student.payment.length > 0 ? student.payment.reduce((sum, p) => sum + p.amount, 0) : 0,
                isPaid: student.payment.length > 0 && student.payment.some(p => p.paymentStatus === "Paid"),
                paymentMethod: student.payment.length > 0 ? student.payment[0].paymentMethod : "N/A",
                paymentImage: student.payment.length > 0 ? student.payment[0].image : null,
                registrationDate: student.createdAt
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
