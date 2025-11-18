import { Suspense } from "react";
import EventDetails from "./EventDetails";

type EventDetailsPageProps = {
    params: Promise<{ slug: string }>
}

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
    const slug = await params.then((p) => p.slug);
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <EventDetails slug={slug} />
        </Suspense>
    )
}
export default EventDetailsPage;