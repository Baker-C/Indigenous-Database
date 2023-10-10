import React from 'react'
import HeroCSS from './Hero.module.css'

const Hero = () => {
        
    const changeBGPosition = () => {
        const scrollDist = window.scrollY
        document.documentElement.style.setProperty('--bg-position', (scrollDist*(-1.4))+"px")
    }
    window.addEventListener('scroll', changeBGPosition)

    return (
        <div className={HeroCSS.container}>
            <HeroTitle>
                modern indigenous resources all in one place
            </HeroTitle>
            <HeroText>
                Search through our collections of sources, organizations, and opportunities
            </HeroText>
            <SearchButton />
            <SwipeIcon>
                /assets/droparrow.svg
            </SwipeIcon>
        </div>
    )
}



const HeroTitle = ({ children }) => {    
    return (
        <div className={HeroCSS.titleContainer}>
            <h1 className={HeroCSS.title}>
                {children}
            </h1>
        </div>
    )
}

const HeroText = ({ children }) => {    
    return (
        <div className={HeroCSS.textContainer}>
            <p className={HeroCSS.text}>
                {children}
            </p>
        </div>
    )
}

const SearchButton = () => {
    return (
        <button type="button" className={HeroCSS.searchButton}>Start Your Search Today</button>
    )
}

const SwipeIcon = ({ children }) => {
    return (
        <img src={children} className={HeroCSS.swipeIcon} />
    )
}

export default Hero