import {z} from 'zod'   

export const studentSchema = z.object({
    name: z.string().min(1),
    phone: z.string().length(10),
    collegeName: z.string().min(1),
    year: z.string().default("1"),
    paymentImage: z.string().url(),
    paymentMethod: z.string().default("UPI"),
    event: z.string().min(1),
    email: z.string().email(),
});
