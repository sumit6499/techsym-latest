import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Techsymposium
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-gray-600 hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link href="/events" className="text-gray-600 hover:text-primary">
                Events
              </Link>
            </li>
            <li>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

