import BookForm from "@/components/shared/BookFrom/BookForm"
import EventCard from "@/components/shared/EventCard/EventCard"
import { IEvent } from "@/database/event.model"
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions"
import Image from "next/image"
import { notFound } from "next/navigation"

type EventDetailsPageProps = {
    params: Promise<{ slug: string }>
}
type EventDetailsItemProps = {
    alt: string,
    img: string,
    label: string
}

const EventDetailsItem = ({ alt, img, label }: EventDetailsItemProps) => {
    return (
        <div className="flex-row-gap-2">
            <Image src={img} alt={alt} width={17} height={17} />
            <p>{label}</p>
        </div>
    )
}

const EventDetailsAgenda = ({ agenda }: { agenda: string[] }) => {
    return (
        <div className="flex-col-gap-2">
            <h2>Agenda</h2>
            <ul>
                {agenda.map((item, index) => (
                    <li className="list-disc" key={index}>{item}</li>
                ))}
            </ul>
        </div>
    )
}

const EventDetailsTags = ({ tags }: { tags: string[] }) => {
    return (
        <div className="flex-row-gap-2">
            {tags.map((tag, index) => (
                <span className="pill" key={index}>{tag}</span>
            ))}
        </div>
    )
}



const NumberOfBookings = 10; // Example static number


const BaseURL = process.env.NEXT_PUBLIC_BASE_URL!

const EventDetailsPage = async ({ params }: EventDetailsPageProps) => {
    const { slug } = await params
    const similar = await getSimilarEventsBySlug(slug)

    let eventData: IEvent | null = null;
    try {
        const res = await fetch(`${BaseURL}/api/events/${slug}`);

        // Check if response is OK (2xx status)
        if (!res.ok) {
            console.error(`Failed to fetch event: ${res.status} ${res.statusText}`);
            return notFound();
        }

        const responseJson = await res.json();
        eventData = responseJson.event;

        // Ensure critical fields exist
        if (!eventData || !eventData.description) {
            return notFound();
        }
    } catch (error) {
        // Handle network errors, parse errors, or other exceptions
        console.error('Error fetching event details:', error);
        return notFound();
    }

    // Destructure after successful fetch
    const { title, description, overview, image, date, time, location, tags, agenda, organizer, audience, mode } = eventData;

    // JSX construction is outside try/catch
    return (
        <section className="event">
            <div className="header">
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <div className="details">
                {/* left side */}
                <div className="content">
                    <Image className="banner" src={image} alt={title} width={800} height={400} />
                    <div className="flex-col-gap-2">
                        <h2>Overview</h2>
                        <p>{overview}</p>
                    </div>
                    <div className="flex-col-gap-2">
                        <h2>Event Details</h2>
                        <EventDetailsItem alt="date" img="/icons/calendar.svg" label={date} />
                        <EventDetailsItem alt="time" img="/icons/clock.svg" label={time} />
                        <EventDetailsItem alt="location" img="/icons/pin.svg" label={location} />
                        <EventDetailsItem alt="mode" img="/icons/mode.svg" label={mode} />
                        <EventDetailsItem alt="audience" img="/icons/audience.svg" label={audience} />
                    </div>
                    <EventDetailsAgenda agenda={agenda} />
                    <div className="flex-col-gap-2">
                        <h2>About the Organizer</h2>
                        <p>{organizer}</p>
                    </div>
                    <EventDetailsTags tags={tags} />
                </div>


                {/* right side */}
                <aside className="booking group">
                    <div className="signup-card">
                        <h2>Book Your Spot</h2>
                        {NumberOfBookings > 0 ? (
                            <p className="text-sm -my-4 capitalize h-0 overflow-hidden group-hover:h-5 group-hover:-my-3 duration-200 group-hover:block group-hover:animate-in">join <span className="text-gradient font-bold">{NumberOfBookings}</span> people who have already booked their spot</p>
                        ) : (
                            <p className="text-sm -my-4 capitalize h-0 overflow-hidden group-hover:h-5 group-hover:-my-3 duration-200 group-hover:block group-hover:animate-in">Be the first to book your spot</p>
                        )}
                        <BookForm eventId={eventData._id} slug={slug} />
                    </div>
                </aside>
            </div>

            <div className="mt-20">
                <h2>Similar Events</h2>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {similar.map((event) => (
                        <EventCard key={title} {...event} />
                    ))}
                </div>
            </div>

        </section>
    );
}
export default EventDetailsPage;