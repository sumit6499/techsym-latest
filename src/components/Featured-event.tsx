import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";
import { db } from "@/lib/db"; // Import Prisma instance

export default async function EventsPage() {
  // ✅ Fetch events directly from the database
  const events = await db.event.findMany({
    orderBy: { date: "asc" }, // Order by upcoming dates
  });

  // Handle empty state
  if (!events.length) {
    return <p className="text-center text-gray-500">No events available.</p>;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden">
              {/* Event Image */}
              <div className="relative h-48">
                <Image
                  src={event.eventImage || "/placeholder.svg"} // ✅ Fixed field name
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Event Details */}
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl font-semibold">{event.title}</CardTitle>
                  <Badge>{event.category}</Badge>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  {new Date(event.date).toLocaleDateString()} {/* ✅ Format date */}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="w-4 h-4 mr-2" />
                  {event.location}
                </div>
              </CardContent>

              {/* Learn More Button */}
              <CardFooter>
                <Link href={`/events/${event.id}`} className="text-primary hover:underline">
                  Learn More
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
