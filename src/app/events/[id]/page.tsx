import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db"; // Import Prisma instance
import Link from "next/link";

export default async function EventPage({ params }: { params: { id: string } }) {
  // ✅ Fetch the event directly from the database
  const event = await db.event.findUnique({
    where: { id: params.id },
  });

  // If no event is found, return a 404 page
  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Event Image */}
        <div className="relative h-64 md:h-full">
          <Image
            src={event.eventImage || "/placeholder.svg"} // ✅ Corrected field name
            alt={event.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        {/* Event Details */}
        <div>
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
          <Badge className="mb-4">{event.category}</Badge>
          <p className="text-gray-600 mb-6">{event.description}</p>

          {/* Event Metadata */}
          <div className="space-y-2 mb-6">
            <div className="flex items-center">
              <CalendarDays className="w-5 h-5 mr-2 text-gray-500" />
              <span>{new Date(event.date).toLocaleDateString()}</span> {/* ✅ Formatted Date */}
            </div>
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-500" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-gray-500" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Register Button */}
          <Button size="lg">
            <Link href="/register">Register</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
