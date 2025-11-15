import mongoose, { Schema, Document, Model, Types } from 'mongoose';
import { Event } from './event.model';

// Booking document shape in MongoDB
export interface BookingDocument extends Document {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingModel = Model<BookingDocument>;

// Basic email validation pattern (sufficient for most use-cases)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingSchema = new Schema<BookingDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
      index: true, // Index for faster event-based queries
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => EMAIL_REGEX.test(value),
        message: 'Email must be a valid email address',
      },
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    strict: true,
  }
);

// Indexes for faster queries
// Explicit index on eventId (in addition to schema-level index flag)
bookingSchema.index({ eventId: 1 });
// Index on email for quick lookups by email
bookingSchema.index({ email: 1 });
// Compound index for common query: bookings for a specific event by email
bookingSchema.index({ eventId: 1, email: 1 });

// Pre-save hook to validate booking data:
// - Ensures the referenced Event exists
// - Validates email format at runtime
bookingSchema.pre<BookingDocument>('save', async function (next) {
  try {
    if (!this.eventId) {
      return next(new Error('Event ID is required'));
    }

    // Ensure referenced Event exists before creating a Booking
    const eventExists = await Event.exists({ _id: this.eventId });
    if (!eventExists) {
      return next(new Error('Referenced event does not exist'));
    }

    if (!this.email || !EMAIL_REGEX.test(this.email)) {
      return next(new Error('Email must be a valid email address'));
    }

    next();
  } catch (error) {
    next(error as Error);
  }
});

// Re-use model in development to avoid OverwriteModelError with Next.js HMR
export const Booking: BookingModel =
  (mongoose.models.Booking as BookingModel) ||
  mongoose.model<BookingDocument, BookingModel>('Booking', bookingSchema);

export default Booking;
