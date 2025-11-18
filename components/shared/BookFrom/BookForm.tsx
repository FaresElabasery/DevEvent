'use client'

import { IEvent } from "@/database/event.model";
import { CreateBooking } from "@/lib/actions/booking.action";
import posthog from "posthog-js";
import { useState } from "react"

const BookForm = ({ eventId, slug }: { eventId: IEvent['_id'], slug: string }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { success } = await CreateBooking({
                eventId,
                slug,
                email,
            });
            if (success) {
                setIsSubmitted(true);
                posthog.capture('booking_success', {
                    eventId,
                    slug,
                    email,
                })
            } else {
                console.error('Error booking event');
                posthog.captureException('Error booking event')
            }
        } catch (error) {
            console.error('Error booking event:', error);
        }
    }
    return (
        <div className="book-event">
            {isSubmitted ? (
                <div className="success-message">
                    Thank you for booking!
                </div>
            ) : (
                <form>
                    <div className="flex-col-gap-2 gap-4">
                        <div>
                            <label htmlFor="Email">Email Address</label>
                            <input
                                type="text"
                                id="Email"
                                name="email"
                                placeholder="Enter your Email"
                                onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <button type="submit" onClick={(e)=>handleSubmit(e)} className="pill">Book Now</button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default BookForm