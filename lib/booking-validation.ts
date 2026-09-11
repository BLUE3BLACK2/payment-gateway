import { z } from "zod";

export const bookingInputSchema = z
  .object({
    accommodationId: z.string().min(1).max(64),
    guestName: z.string().trim().min(2).max(120),
    guestEmail: z.email(),
    guestPhone: z.string().trim().min(8).max(32),
    notes: z.string().trim().max(1000).optional(),
    checkIn: z.iso.date(),
    checkOut: z.iso.date(),
    guestCount: z.coerce.number().int().min(1).max(20),
  })
  .refine((data) => new Date(data.checkOut) > new Date(data.checkIn), {
    message: "Tanggal check-out harus setelah check-in",
    path: ["checkOut"],
  });

export type BookingInput = z.infer<typeof bookingInputSchema>;
