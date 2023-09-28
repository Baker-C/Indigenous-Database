import React from 'react'
import SearchBar from './../SearchBar/SearchBar'
import HeroCSS from './Hero.module.css'

const Hero = () => {
        
    const changeBGPosition = () => {
        const scrollDist = window.scrollY
        document.documentElement.style.setProperty('--bg-position', (scrollDist*(-1.5))+"px")
    }
    window.addEventListener('scroll', changeBGPosition)

    return (
        <div className={HeroCSS.hero}>
            <HeroTitle>
                SIMPLY NAVIGATE THROUGH THE MODERN INDIGENOUS WORLD
            </HeroTitle>
            <HeroText>
                Search through our collection of resources, organizations, and indigenous works
            </HeroText>
            <SearchBar />
        </div>
    )
}



const HeroTitle = ({ children }) => {    
    return (
        <div class={HeroCSS.titleContainer}>
            <h1 class={HeroCSS.title}>
                {children}
            </h1>
        </div>
    )
}

const HeroText = ({ children }) => {    
    return (
        <div class={HeroCSS.textContainer}>
            <p class={HeroCSS.text}>
                {children}
            </p>
        </div>
    )
}

export default Hero