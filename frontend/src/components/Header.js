import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import SearchBar from '../components/SearchBar'
import HeaderCopy from '../copy/HeaderCopy'
import '../styles/header.css'

const Header = () => {
    const user = useSelector(selectCurrentUser)

    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY.current || currentScrollY < 100) {
                setShowHeader(true);
            } else {
                setShowHeader(false);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    return (
        <div className={`d-flex flex-column container-fluid border-bottom p-0 bg-2 header ${showHeader ? '' : 'hide-header'}`}>
            <div className='header shadow-sm d-flex flex-row position-relative align-items-center justify-content-between p-0 overflow-hidden'>
                <div className='d-flex justify-content-start align-items-center container-fluid'>
                    <HomeLink />
                    <SearchButton />
                    <div className='col d-sm-block d-none container-fluid'>
                        <SearchBar />
                    </div>
                    <div className='d-none d-xl-block col-2'>
                        <NavLinks navLinks={HeaderCopy.NavLinks} />
                    </div>
                </div>
                {/* <AccountButtons /> */}
            </div>

            <div className='lower-container d-xl-none'>
                <NavLinks navLinks={HeaderCopy.NavLinks} />
            </div>
        </div>
    )
}



const HomeLink = ({ user }) => {
    return (
        <div className='h-100 me-3 text-nowrap home-link-container'>
            <Link to="" className='fs-3 text-center d-flex align-items-center justify-content-center'>
                Indigenous DB
            </Link>
        </div>
    )
}

const SearchButton = () => {
    let navigate = useNavigate()

    return (
        <button 
        className='d-flex align-items-center d-sm-none py-2 border-0 bg-transparent'
        onClick={() => navigate('/search')}>
            <i className='fas fa-search fs-5' ></i>
        </button>    )
}



const AccountButtons = () => {
    let navigate = useNavigate()

    return (
        <div className="button-container-header d-flex d-md-row">
            <button className="dark-btn m-3 me-0 shadow-unhover button-header button-one-header"
            onClick={() => navigate('/signup')}>
                Sign Up
            </button>

            <button className="light-btn m-3 shadow-unhover button-header button-two-header"
            onClick={() => navigate('/login')}>
                Log In
            </button>
        </div>
    )
}

const NavLinks = ({navLinks}) => {
    let navigate = useNavigate()

    return (
            <div className='nav-links-container'>
                {navLinks.map((link, index) => {
                    return (
                        <label key={index} className="navlink" onClick={() => navigate(link.Link)}>
                            {link.Text}
                        </label>
                    )
                })}
            </div>
    )
}


export default Header