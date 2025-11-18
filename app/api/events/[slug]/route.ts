import { Event } from "@/database";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server"

type GetEventDetails = {
    params: Promise<{
        slug: string
    }>
}
export async function GET(request: Request, { params }: GetEventDetails) {
    try {
        await dbConnect();
        const { slug } = await params;

        // validate slug 
        if(!slug || typeof slug !== 'string'|| slug.trim()==''){
            return NextResponse.json({message:'Invalid event slug'},{status:400})
        }
        
        // sanitized slug
        const sanitizedSlug = slug.trim().toLowerCase();
        
        // find event by sanitized slug
        const event = await Event.findOne({ slug: sanitizedSlug }).lean();  
        if(!event) return NextResponse.json({message:'Event not found'},{status:404})
        return NextResponse.json({message:'Event details fetched successfully',event:event},{status:200})

    } catch (e) {
        return NextResponse.json({ message: "Failed to fetch event details", error: e }, { status: 500 })
    }    
}