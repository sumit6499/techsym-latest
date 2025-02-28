import EventsList from "@/components/event-list";
import { db } from "@/lib/db";

export default async function EventsPage() {
  const events = await db.event.findMany({
    orderBy: { date: "asc" }, // Order by date
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-8">All Events</h1>
      <EventsList events={events} />
    </div>
  );
}
