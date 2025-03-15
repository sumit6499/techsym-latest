"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { FormData } from "@/app/register/page"
import { Upload, AlertCircle, Users } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Image from "next/image"
import dummyQR from '@/public/dummyqr.png'
import axios from 'axios'
import { toast } from "sonner"
import { getImageURL } from "@/actions/uploadImage"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

const formSchema = z.object({
  paymentId: z.string().min(1, { message: "Payment ID is required." }),
  paymentScreenshot: z
    .any()
    .refine((file) => file !== null, "Payment screenshot is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "File size must be less than 5MB.")
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported.",
    ),
})

interface PaymentStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
}

export default function PaymentStep({ formData, updateFormData, onNext, onPrev }: PaymentStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [totalFee, setTotalFee] = useState(100)
  const [participantCount, setParticipantCount] = useState(1)

  
  useEffect(() => {
    const baseRate = 100 
    let count = 1 

    if (formData.eventType === "group" && formData.teamMembers && formData.teamMembers.length > 0) {
      
      count = formData.teamMembers.length + 1
    }

    setParticipantCount(count)
    setTotalFee(baseRate * count)
  }, [formData.eventType, formData.teamMembers])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      paymentId: formData.paymentId,
      paymentScreenshot: formData.paymentScreenshot,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    formData.paymentId = values.paymentId
    formData.totalFee = totalFee 
    console.log(formData)
    
    try {
        const res = await axios.post('/api/register', formData, {
            headers: {
              "Content-Type": "application/json"
            }
        })

        console.log(res)
        toast.success("Event registration success!")

        setTimeout(() => {
            updateFormData({
              ...values,
              totalFee: totalFee
            })
            setIsSubmitting(false)
            onNext()
        }, 500)

    } catch (error) {
        console.log(error)
        toast.error("Failed to register for event!", {
            description: "Please try again!"
        })
        setIsSubmitting(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
        console.log(file)
      form.setValue("paymentScreenshot", file)
      const imageUrl = await getImageURL(file);
      formData.paymentImage = String(imageUrl.url);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      form.setValue("paymentScreenshot", null)
      setPreviewUrl(null)
    }
  }

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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Payment Information</h2>
        <p className="text-muted-foreground">Please complete your payment to confirm your registration</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-lg mb-2">Registration Summary</h3>
        <div className="space-y-2">
          <p>
            <span className="font-medium">Event:</span> {getEventName(formData.event)}
          </p>
          <p>
            <span className="font-medium">Registration Type:</span> {formData.eventType === "group" ? "Group" : "Individual"}
          </p>
          
          {formData.eventType === "group" && formData.teamMembers && (
            <div className="flex items-center gap-1 text-sm">
              <Users className="h-4 w-4" />
              <span>{participantCount} participants (You + {participantCount - 1} team members)</span>
            </div>
          )}
          
          <div className="pt-2 border-t mt-2">
            <div className="flex justify-between">
              <span className="font-medium">Base Fee:</span>
              <span>₹100 per participant</span>
            </div>
            
            {formData.eventType === "group" && (
              <div className="flex justify-between text-sm text-gray-600">
                <span>Calculation:</span>
                <span>₹100 × {participantCount} participants</span>
              </div>
            )}
            
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total Fee:</span>
              <span>₹{totalFee.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-6">
        <div className="text-center">
          <h3 className="font-medium mb-2">Scan QR Code to Pay</h3>
          <div className="bg-white p-4 rounded-lg shadow-sm inline-block">
            <Image src={dummyQR} width={48} height={48} alt="Payment QR Code" className="w-48 h-48" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <h3 className="font-medium mb-2">Payment Instructions</h3>
          <ol className="list-decimal list-inside text-sm space-y-1 text-left">
            <li>Scan the QR code with your banking app</li>
            <li>Complete the payment of ₹{totalFee.toFixed(2)}</li>
            <li>Take a screenshot of your payment confirmation</li>
            <li>Upload the screenshot below</li>
            <li>Enter the payment reference ID</li>
          </ol>
        </div>
      </div>

      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important</AlertTitle>
        <AlertDescription>
          Please keep your payment confirmation for your records. You may need it for verification.
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="paymentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Reference ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the payment reference ID from your receipt" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="paymentScreenshot"
            render={() => (
              <FormItem>
                <FormLabel>Payment Screenshot</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center justify-center w-full">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      {previewUrl ? (
                        <div className="w-full h-full flex items-center justify-center p-2">
                          <Image
                            src={previewUrl || "/placeholder.svg"}
                            alt="Payment screenshot preview"
                            className="max-h-full max-w-full object-contain"
                            width={48}
                            height={48}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-4 text-gray-500" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG or WEBP (MAX. 5MB)</p>
                        </div>
                      )}
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-between">
            <Button type="button" variant="outline" onClick={onPrev}>
              Back
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Complete Registration"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}