'use server'

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
        await Booking.create({eventId,slug,email});
        return {
            success: true,
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
        }
    }
}