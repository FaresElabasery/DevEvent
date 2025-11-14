import EventCard from "@/components/shared/EventCard/EventCard"
import ExploreBtn from "@/components/shared/ExploreBtn/ExploreBtn"
import { events } from "@/lib/constants"

const Home = () => {
  return (
    <section className=' '>
      <h1 className="text-center">The Hub for Every Dev <br /> Event You Can’t Miss</h1>
      <p className='mt-3 text-center'>Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn />
      <div className="mt-25 space-y-7">
        <h3>Featured Events</h3>
        {/* Featured events list or component goes here */}
        <ul className="events">
          {events.map((event) => (
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