import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
    return (
        <header>
            <nav>
                <div className="logo">
                    <Image src={'/icons/logo.png'} width={24} height={24} alt="logo" />
                    <p>DevEvent</p>
                </div>
                <ul className="nav-links">
                    <Link href={'/home'}>Home</Link >
                    <Link href={'/events'}>Events</Link >
                    <Link href={'/createEvent'}>Create Event</Link >
                </ul>
            </nav>
        </header>
    )
}

export default Navbar