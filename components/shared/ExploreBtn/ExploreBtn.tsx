'use client'

import Image from "next/image"

const ExploreBtn = () => {
    return (
        <button className="explore-btn mx-auto mt-7" onClick={() => console.log('click')}>

            <a href="#events" className="flex-center">
                Explore Events
                <Image src={'icons/arrow-down.svg'} width={24} height={24} alt="arrow down"></Image>
            </a>
        </button>
    )
}

export default ExploreBtn