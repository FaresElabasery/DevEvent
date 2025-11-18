'use server '

import { Booking } from "@/database";
import dbConnect from "../mongodb";
import { IEvent } from "@/database/event.model";

type CreateBookingProps = {
  eventId: IEvent['_id'];
  slug: string;
  email: string;
}
export async function CreateBooking({eventId,slug,email}:CreateBookingProps) {
    try {
        await dbConnect()
        const booking = (await Booking.create({eventId,slug,email})).lean();
        return {
            success: true,
            booking,
        }
    } catch (error) {
        return {
            success: false,
            message: 'Failed to create booking',
            error
        }
    }
}