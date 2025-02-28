import type { Event } from "./types"

const events: Event[] = [
  {
    id: "1",
    title: "Tech Conference 2025",
    description:
      "Join us for the biggest tech conference of the year, featuring keynotes from industry leaders and hands-on workshops.",
    date: "August 15-17, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco Convention Center",
    category: "Technology",
    image: "https://source.unsplash.com/random/800x600?tech",
  },
  {
    id: "2",
    title: "Art in the Park",
    description: "A celebration of local artists showcasing their work in a beautiful outdoor setting.",
    date: "July 8, 2025",
    time: "11:00 AM - 7:00 PM",
    location: "Central Park, New York City",
    category: "Art",
    image: "https://source.unsplash.com/random/800x600?art",
  },
  {
    id: "3",
    title: "Food Truck Festival",
    description:
      "Sample delicious cuisine from over 50 food trucks, featuring a wide variety of international flavors.",
    date: "June 22-23, 2025",
    time: "12:00 PM - 9:00 PM",
    location: "Waterfront Park, Seattle",
    category: "Food & Drink",
    image: "https://source.unsplash.com/random/800x600?food",
  },
  {
    id: "4",
    title: "Music in the Mountains",
    description:
      "A two-day music festival featuring top artists across multiple genres, set against a stunning mountain backdrop.",
    date: "September 5-6, 2025",
    time: "2:00 PM - 11:00 PM",
    location: "Rocky Mountain National Park, Colorado",
    category: "Music",
    image: "https://source.unsplash.com/random/800x600?concert",
  },
  {
    id: "5",
    title: "Startup Pitch Competition",
    description: "Watch innovative startups pitch their ideas to a panel of expert judges and investors.",
    date: "October 12, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Innovation Hub, Austin",
    category: "Business",
    image: "https://source.unsplash.com/random/800x600?startup",
  },
  {
    id: "6",
    title: "Wellness Retreat",
    description: "A weekend of relaxation, meditation, and yoga to rejuvenate your mind, body, and soul.",
    date: "May 18-20, 2025",
    time: "All Day",
    location: "Serenity Resort & Spa, Sedona",
    category: "Health & Wellness",
    image: "https://source.unsplash.com/random/800x600?wellness",
  },
]

export function getAllEvents(): Event[] {
  return events
}

export function getFeaturedEvents(): Event[] {
  return events.slice(0, 3)
}

export function getEventById(id: string): Event | undefined {
  return events.find((event) => event.id === id)
}

