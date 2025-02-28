"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import PersonalInfoStep from "@/components/steps/personal-info-step"
import PaymentStep from "@/components/steps/payment-step"
import ConfirmationStep from "@/components/steps/confirmation-step"
import StepIndicator from "@/components/steps/step-indicator"

export type FormData = {
  name: string
  email: string
  phone: string
  collegeName: string
  academicYear: string
  event: string
  paymentId: string
  paymentScreenshot: File | null
  paymentImage: string
}

export default function RegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email:"",
    phone: "",
    collegeName: "",
    academicYear: "",
    event: "",
    paymentScreenshot: null,
    paymentId: "",
    paymentImage: "",
  })

  const updateFormData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} onNext={nextStep} />
      case 2:
        return <PaymentStep formData={formData} updateFormData={updateFormData} onNext={nextStep} onPrev={prevStep} />
      case 3:
        return <ConfirmationStep formData={formData} onPrev={prevStep} />
      default:
        return null
    }
  }

  return (
    <Card className="w-full shadow-lg">
      <CardContent className="p-6">
        <StepIndicator currentStep={currentStep} totalSteps={3} />
        <div className="mt-8">{renderStep()}</div>
      </CardContent>
    </Card>
  )
}

