import { Button } from "@/components/ui/button"
import type { FormData } from "@/app/register/page"
import { CheckCircle2 } from "lucide-react"

interface ConfirmationStepProps {
  formData: FormData
  onPrev: () => void
}

export default function ConfirmationStep({ formData,  }: ConfirmationStepProps) {
  // Get the event name based on the selected event ID
  const getEventName = (eventId: string) => {
    const events: Record<string, string> = {
      hackathon: "Hackathon 2025",
      ai_workshop: "AI Workshop",
      webdev: "Web Development Conference",
      cybersecurity: "Cybersecurity Summit",
      datascience: "Data Science Symposium",
    }
    return events[eventId] || eventId
  }

  

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold">Registration Complete!</h2>
        <p className="text-muted-foreground">Your registration has been successfully submitted</p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4 border-b pb-2">Registration Summary</h3>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-500">Personal Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium">Full Name</p>
                <p>{formData.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p>{formData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium">College Number</p>
                <p>{formData.collegeName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Academic Year</p>
                <p>Year {formData.academicYear}</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Event Details</h4>
            <div className="mt-2">
              <p className="text-sm font-medium">Event</p>
              <p>{getEventName(formData.event)}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500">Payment Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm font-medium">Payment Reference ID</p>
                <p>{formData.paymentId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">{"What's"} Next?</h4>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li>You will receive a confirmation email shortly</li>
          <li>
            Save your registration ID:{" "}
            <span className="font-mono font-medium">
              REG-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </span>
          </li>
          <li>For any questions, contact the event organizers</li>
        </ul>
      </div>

      <div className="pt-4 flex justify-between">
        <Button type="button" onClick={()=> window.location.reload()}>
                Register for Another Event   
        </Button>
      </div>
    </div>
  )
}

