export interface IEvent {
  title: string;
  image: string;
  slug: string;
  location: string;
  date: string;
  time: string;
}

export const events: IEvent[] = [
  {
    title: "React Summit 2025",
    image: "/images/event1.png",
    slug: "react-summit-2025",
    location: "Amsterdam, Netherlands",
    date: "June 5-6, 2025",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "Next.js Conf 2025",
    image: "/images/event2.png",
    slug: "nextjs-conf-2025",
    location: "San Francisco, USA",
    date: "May 15-16, 2025",
    time: "8:30 AM - 4:30 PM",
  },
  {
    title: "Web Summit 2025",
    image: "/images/event3.png",
    slug: "web-summit-2025",
    location: "Lisbon, Portugal",
    date: "November 3-5, 2025",
    time: "10:00 AM - 6:00 PM",
  },
  {
    title: "DevOps Days",
    image: "/images/event4.png",
    slug: "devops-days",
    location: "New York, USA",
    date: "July 22-23, 2025",
    time: "9:00 AM - 5:00 PM",
  },
  {
    title: "TypeScript Congress",
    image: "/images/event5.png",
    slug: "typescript-congress",
    location: "Berlin, Germany",
    date: "September 10-11, 2025",
    time: "8:00 AM - 4:00 PM",
  },
  {
    title: "AI & ML DevCon 2025",
    image: "/images/event6.png",
    slug: "ai-ml-devcon",
    location: "Singapore",
    date: "August 20-21, 2025",
    time: "9:30 AM - 5:30 PM",
  },
];
