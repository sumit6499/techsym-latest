"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { FormData } from "@/app/register/page";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  collegeName: z.string().min(1, { message: "College name is required." }),
  academicYear: z.string().min(1, { message: "Please select your academic year." }),
  event: z.string().min(1, { message: "Please select an event." }),
  email: z.string().email({ message: "Please enter a valid email" }),
});

interface PersonalInfoStepProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
}

export default function PersonalInfoStep({ formData, updateFormData, onNext }: PersonalInfoStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/events"); 
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.log(error)
        setError("Error fetching events. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: formData.name,
      phone: formData.phone,
      collegeName: formData.collegeName,
      academicYear: formData.academicYear,
      event: formData.event,
      email: formData.email,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    setTimeout(() => {
      updateFormData(values);
      setIsSubmitting(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        <p className="text-muted-foreground">Please provide your personal details to register for the event</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="collegeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>College Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your college name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="academicYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Year 1</SelectItem>
                    <SelectItem value="2">Year 2</SelectItem>
                    <SelectItem value="3">Year 3</SelectItem>
                    <SelectItem value="4">Year 4</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="event"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event</FormLabel>
                {loading ? (
                  <p>Loading events...</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an event to register for" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
