import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin } from "lucide-react";

interface Event {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  time: string;
  location: string;
  category: string;
  date: string;
  eventImage: string;
}

interface EventsListProps {
  events: Event[];
}

export default function EventsList({ events }: EventsListProps) {
  if (!events.length) {
    return <p className="text-center text-gray-500">No events available.</p>;
  }
  console.log(events[0].eventImage)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <div className="relative h-48">
            <Image
              src={event.eventImage || "/placeholder.svg"}
              alt={event.title}
              fill
              className="object-cover"
            />
          </div>
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
              {new Date(event.date).toLocaleDateString()}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="w-4 h-4 mr-2" />
              {event.location}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/events/${event.id}`}  className="text-primary hover:underline">
              Learn More
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
