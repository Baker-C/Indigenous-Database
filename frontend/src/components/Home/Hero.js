import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../../features/auth/authSlice'
import '../../styles/home.css'
import '../../styles/animations.css'

const Hero = ({ Copy }) => {
    const changeBGPosition = () => {
        const scrollDist = window.scrollY
        document.documentElement.style.setProperty('--bg-position', (scrollDist*(-1.5))+"px")
    }
    window.addEventListener('scroll', changeBGPosition)

    return (
        <div className="home-hero-container">
            <div className="w-75 g-3">
                <h1 className="slide-up py-3 light-text-1">
                    {Copy.Heading}
                </h1>
                <h2 className="slide-up-300 py-3 m-auto w-50 light-text-1">
                    {Copy.Text}
                </h2>
                <SearchButton>
                    {Copy.Button}    
                </SearchButton>
            </div>
        </div>
    )
}

const SearchButton = ({ children }) => {
    const navigate = useNavigate()
    const user = useSelector(selectCurrentUser)

    const usernameURL = user?.username ? `/${user.username}` : ''
    return (
        <button type="button" className="dark-btn hero-btn slide-up-600 my-3" onClick={() => navigate(`${usernameURL}/search`)}>
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