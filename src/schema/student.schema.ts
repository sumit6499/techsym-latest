import { z } from "zod";

const teamMemberSchema = z.object({
  name: z.string().min(1, "Team member name is required"),
  email: z.string().email("Valid email is required for team member"),
});

export const studentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().length(10, "Phone number must be exactly 10 digits"),
  collegeName: z.string().min(1, "College name is required"),
  year: z.string().default("1"),
  paymentImage: z.string().url("Payment image must be a valid URL"),
  paymentMethod: z.string().default("UPI"),
  event: z.string().min(1, "Event is required"),
  email: z.string().email("Valid email is required"),
  
  eventType: z.enum(["individual", "group"]).default("individual"),
  teamMembers: z.array(teamMemberSchema).optional().default([]),
  paymentId: z.string().min(1, "Payment ID is required"),
  totalFee: z.number().positive("Fee must be positive").default(100),
  
  academicYear: z.string().optional(),
});