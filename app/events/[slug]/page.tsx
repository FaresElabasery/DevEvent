import { Suspense } from "react";
import EventDetails from "./EventDetails";

export const dynamic = 'force-dynamic';

type EventDetailsPageProps = {
    params: Promise<{ slug: string }>
}

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
    const { slug } = await params;
    return (
        <Suspense fallback={<div>Loading event details...</div>}>
            <EventDetails slug={Promise.resolve(slug)} />
        </Suspense>
    )
}
export default EventDetailsPage;