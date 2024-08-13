import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import '../../styles/home.css'

const Hero = () => {
    const titleMsg = "modern indigenous resources all in one place"
    const heroMsg = "Search through our collections of sources, organizations, and opportunities"
    const searchBtnMsg = "Start your search today!"
        
    const changeBGPosition = () => {
        const scrollDist = window.scrollY
        document.documentElement.style.setProperty('--bg-position', (scrollDist*(-1.5))+"px")
    }
    window.addEventListener('scroll', changeBGPosition)

    return (
        <div className="container">
            <HeroTitle>
                {titleMsg}
            </HeroTitle>
            <HeroText>
                {heroMsg}
            </HeroText>
            <SearchButton>
                {searchBtnMsg}    
            </SearchButton>
        </div>
    )
}



const HeroTitle = ({ children }) => {    
    return (
        <div className="titleContainer">
            <h1 className="title">
                {children}
            </h1>
        </div>
    )
}

const HeroText = ({ children }) => {    
    return (
        <div className="textContainer">
            <p className="hero-text">
                {children}
            </p>
        </div>
    )
}

const SearchButton = ({ children }) => {
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser)

    const usernameURL = user?.username ? `/${user.username}` : ''
    return (
        <button type="button" className="searchButton" onClick={() => navigate(`${usernameURL}/search`)}>
            {children}
        </button>
    )
}

const SwipeIcon = ({ children }) => {
    return (
        <img src={children} className="swipeIcon" />
    )
}

export default Hero