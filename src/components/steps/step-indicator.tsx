import { CheckCircle2 } from "lucide-react"

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
}

export default function StepIndicator({ currentStep, }: StepIndicatorProps) {
  const steps = [
    { number: 1, title: "Personal Information" },
    { number: 2, title: "Payment" },
    { number: 3, title: "Confirmation" },
  ]

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                currentStep > step.number
                  ? "bg-primary border-primary text-primary-foreground"
                  : currentStep === step.number
                    ? "border-primary text-primary"
                    : "border-gray-300 text-gray-300"
              }`}
            >
              {currentStep > step.number ? <CheckCircle2 className="h-6 w-6" /> : step.number}
            </div>
            <p className={`mt-2 text-sm font-medium ${currentStep >= step.number ? "text-primary" : "text-gray-500"}`}>
              {step.title}
            </p>
            {index < steps.length - 1 && (
              <div className="absolute hidden sm:block" style={{ left: `${(index + 1) * (100 / steps.length) - 10}%` }}>
                <div
                  className={`h-0.5 w-[calc(100vw/3)] max-w-[150px] ${
                    currentStep > step.number ? "bg-primary" : "bg-gray-300"
                  }`}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

