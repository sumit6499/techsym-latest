import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CallToAction() {
  return (
    <section className="bg-primary text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Discover More?</h2>
        <p className="text-xl mb-8">Explore our full list of events and find your next adventure.</p>
        <Button asChild size="lg" variant="secondary">
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
    </section>
  )
}

