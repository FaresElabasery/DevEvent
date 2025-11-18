import { Event } from "@/database";
import dbConnect from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import {v2 as cloudinary} from 'cloudinary'

// Required fields for creating an event
const REQUIRED_EVENT_FIELDS = [
  'title',
  'description',
  'overview',
  'venue',
  'location',
  'date',
  'time',
  'mode',
  'audience',
  'agenda',
  'organizer',
  'tags',
];

/**
 * Validates that all required event fields are present and non-empty.
 * Returns error response if validation fails, otherwise null.
 */
function validateEventFields(event: Record<string, FormDataEntryValue>): NextResponse | null {
    for (const field of REQUIRED_EVENT_FIELDS) {
    const value = event[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
        return NextResponse.json(
        { message: `Validation failed: ${field} is required` },
        { status: 400 }
        );
    }
    }
    return null;
}

export async function POST(req:NextRequest) {
    try {
        await dbConnect()
        const formdata = await req.formData();
        // Initialize event as a map of form entries to avoid `undefined` later
        let event: Record<string, FormDataEntryValue> = {};
        try {
            event = Object.fromEntries(formdata.entries()) as Record<string, FormDataEntryValue>;
        } catch (e) {
            console.log(e);
            return NextResponse.json({message:'Invalid JSON Format'},{status:400});
        }

        // Validate required fields
        const validationError = validateEventFields(event);
        if (validationError) return validationError;

        const file = formdata.get('image') as File
        if(!file) return NextResponse.json({message:'Image is required'},{status:400})
        
        const arrayBuffer = await file.arrayBuffer();
        const buffer =Buffer.from(arrayBuffer);

        const uploadResult = await new Promise<unknown>((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { resource_type: 'image', folder: 'devEvents' },
                (error, result) => {
                    if (error) return reject(error);
                    return resolve(result);
                }
            );
            stream.end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createEvent = await Event.create(event as Record<string, unknown>);
        return NextResponse.json({message:'Event Created Successfully',event:createEvent},{status:201})
    } catch (e) {
        console.log(e);
        return NextResponse.json({message:'Event Creation Failed',error:e instanceof Error?e.message:'Unknown'},{status:500})
    }
}

export async function GET(): Promise<NextResponse> {
    try {
        await dbConnect();
        const events = await Event.find().sort({createdAt:-1});     
        return NextResponse.json({message:'Events Fetched Successfully',events},{status:200})
    } catch (e) {
        return NextResponse.json({message:'Failed to fetch events',error:e},{status:500})
    }
}