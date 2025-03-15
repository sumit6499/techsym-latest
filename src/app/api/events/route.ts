import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const events = await db.event.findMany({
      include: { students: true },
    });
    return NextResponse.json(events);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}
