import mongoose, { Schema, Document, Model, SchemaTypeOptions } from 'mongoose';

// Event document shape in MongoDB
export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // Stored as ISO date string (YYYY-MM-DD)
  time: string; // Stored as 24h time (HH:mm)
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventModel = Model<IEvent>;

// Helper to validate non-empty trimmed strings
const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.trim().length > 0;
};

// Helper to normalize title into a URL-friendly slug
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dashes
    .replace(/^-+|-+$/g, ''); // Trim leading/trailing dashes
};

// Helper to normalize date to ISO (YYYY-MM-DD)
const normalizeDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('Invalid date format. Expected a valid date string.');
  }

  // Keep only the date portion (YYYY-MM-DD)
  return date.toISOString().split('T')[0];
};

// Helper to normalize time to HH:mm (24h)
const normalizeTime = (value: string): string => {
  if (!isNonEmptyString(value)) {
    throw new Error('Time is required.');
  }

  const trimmed = value.trim();
  // Accept H:mm or HH:mm and normalize to HH:mm
  const match = trimmed.match(/^([0-1]?\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    throw new Error('Invalid time format. Expected HH:mm in 24-hour format.');
  }

  const hours = match[1].padStart(2, '0');
  const minutes = match[2];

  return `${hours}:${minutes}`;
};

const stringField = (fieldName: string): SchemaTypeOptions<string> => ({
  type: String,
  required: [true, `${fieldName} is required`] as [true, string],
  trim: true,
  validate: {
    validator: isNonEmptyString,
    message: `${fieldName} cannot be empty`,
  },
});

const stringArrayField = (fieldName: string): SchemaTypeOptions<string[]> => ({
  type: [String],
  required: [true, `${fieldName} is required`] as [true, string],
  validate: {
    validator: (values: unknown): values is string[] => {
      return (
        Array.isArray(values) &&
        values.length > 0 &&
        values.every((value) => isNonEmptyString(value))
      );
    },
    message: `${fieldName} must be a non-empty array of non-empty strings`,
  },
});

const eventSchema = new Schema<IEvent>(
  {
    title: stringField('Title'),
    slug: {
      type: String,
      required: true,
      trim: true,
    },
    description: stringField('Description'),
    overview: stringField('Overview'),
    image: stringField('Image'),
    venue: stringField('Venue'),
    location: stringField('Location'),
    date: {
      type: String,
      required: [true, 'Date is required'],
      trim: true,
      validate: {
        validator: (value: string) => {
          try {
            normalizeDate(value);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Date must be a valid date string',
      },
    },
    time: {
      type: String,
      required: [true, 'Time is required'],
      trim: true,
      validate: {
        validator: (value: string) => {
          try {
            normalizeTime(value);
            return true;
          } catch {
            return false;
          }
        },
        message: 'Time must be in HH:mm 24-hour format',
      },
    },
    mode: stringField('Mode'),
    audience: stringField('Audience'),
    agenda: stringArrayField('Agenda'),
    organizer: stringField('Organizer'),
    tags: stringArrayField('Tags'),
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    strict: true,
  }
);

// Unique index on slug for fast lookups and enforcing uniqueness
eventSchema.index({ slug: 1 }, { unique: true });

// Pre-validate hook to ensure slug exists before required validation
eventSchema.pre<IEvent>('validate', function (next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = generateSlug(this.title);
  }
  next();
});
// Pre-save hook for runtime checks and date/time normalization
// - Normalizes date to ISO (YYYY-MM-DD)
// - Normalizes time to HH:mm (24-hour)
eventSchema.pre<IEvent>('save', function (next) {
  // Ensure title and other required fields are non-empty at runtime
  const requiredStringFields: Array<keyof IEvent> = [
    'title',
    'description',
    'overview',
    'image',
    'venue',
    'location',
    'mode',
    'audience',
    'organizer',
  ];

  for (const field of requiredStringFields) {
    const value = this[field];

    if (!isNonEmptyString(value)) {
      return next(new Error(`${String(field)} is required and cannot be empty`));
    }
  }

  try {
    // Normalize date and time into consistent string formats
    this.date = normalizeDate(this.date);
    this.time = normalizeTime(this.time);
  } catch (error) {
    return next(error as Error);
  }

  next();
});

// Re-use model in development to avoid OverwriteModelError with Next.js HMR
export const Event: EventModel =
  (mongoose.models.Event as EventModel) ||
  mongoose.model<IEvent, EventModel>('Event', eventSchema);
