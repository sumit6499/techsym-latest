import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-red-500
 text-white">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Elevating Innovation Through Competition TechSymposium 2k25</h1>
          <p className="text-xl md:text-2xl mb-8">Join exciting gatherings, workshops, and experiences in your area.</p>
          <Button asChild size="lg" variant="secondary">
            <Link href="/events">Explore Events</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

