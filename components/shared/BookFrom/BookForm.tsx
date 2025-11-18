'use client'

import { useState } from "react"

const BookForm = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTimeout(() => {
            setIsSubmitted(true);
        }, 1000);
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
                        <button type="submit" onSubmit={handleSubmit} className="pill">Book Now</button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default BookForm