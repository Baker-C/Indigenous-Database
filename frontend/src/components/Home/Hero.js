import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import '../../styles/home.css'
import '../../styles/animations.css'

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
        <div className="hero-container">
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
        <h1 className="slide-up">
            {children}
        </h1>
    )
}

const HeroText = ({ children }) => {    
    return (
        <p className="p1 slide-up-300">
            {children}
        </p>
    )
}

const SearchButton = ({ children }) => {
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser)

    const usernameURL = user?.username ? `/${user.username}` : ''
    return (
        <button type="button" className="searchButton slide-up-600" onClick={() => navigate(`${usernameURL}/search`)}>
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