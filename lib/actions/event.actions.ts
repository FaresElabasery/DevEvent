'use server'

import { Event } from "@/database"
import dbConnect from "../mongodb"
import { IEvent } from "@/database/event.model"

export async function getSimilarEventsBySlug(slug:string) {
    try {
        await dbConnect()
        const event = await Event.findOne({ slug }) as IEvent
        return await Event.find({_id : {$ne : event._id}, tags : {$in : event.tags}}).lean()
    } catch (error) {
        console.log(error);
        return []
    }
}