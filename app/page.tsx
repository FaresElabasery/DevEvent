import EventCard from "@/components/shared/EventCard/EventCard"
import ExploreBtn from "@/components/shared/ExploreBtn/ExploreBtn"
import { IEvent } from "@/database/event.model"
import { cacheLife } from "next/cache"
const Baseurl = process.env.NEXT_PUBLIC_BASE_URL!

const Home = async () => {
  'use cache'
  const res = await fetch(`${Baseurl}/api/events`)
  const events = await res.json().then((data) => data.events)
  cacheLife('default')
  
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can’t Miss</h1>
      <p className='mt-3 text-center'>Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-25 space-y-7" id="events">
        <h3>Featured Events</h3>
        {/* Featured events list or component goes here */}
        <ul className="events">
          {events && events.length > 0 && events.map((event: IEvent) => (
            <li key={event.title} className="">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Home