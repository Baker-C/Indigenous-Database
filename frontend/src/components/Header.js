import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import SearchBar from '../components/SearchBar'
import '../styles/header.css'

const Header = () => {
    const user = useSelector(selectCurrentUser)

    const usernameURL = user?.username ? `/${user.username}` : ''
    
    let navLinks
    if (user) {
        navLinks = [
            { text: 'search', linkedTo: user ? `${usernameURL}/search` : '/search' },
            { text: 'contact', linkedTo: user ? `${usernameURL}/contact` : '/contact' },
        ]
    } else {
        navLinks = [
            { text: 'search', linkedTo: `/search` },
            { text: 'contact', linkedTo: `/contact` }
        ]
    }



    return (
        <div className='d-flex flex-column container-fluid border-bottom p-0 main-acc'>

            <div className='header shadow-sm d-flex flex-row position-relative align-items-center justify-content-between p-0 overflow-hidden'>
                
                <div className='d-flex justify-content-start align-items-center container-fluid'>

                    <HomeLink user={user} />

                    <SearchButton />

                    <div className='d-none d-lg-block col-2'>
                        <NavLinks navLinks={navLinks} />
                    </div>

                    <div className='col d-md-block d-none container-fluid'>
                        <SearchBar />
                    </div>
                </div>
                
                <div className='bg-primary'>
                    <AccountButtons />
                </div>

            </div>

            <div className='d-lg-none'>
                <NavLinks navLinks={navLinks} />
            </div>
        </div>
    )
}



const HomeLink = ({ user }) => {
    return (
        <div className='left-child-container col align-items-center justify-content-center col-1 me-3 text-nowrap home-link-container'>
            <Link 
            to={`/${user?.username ? user.username : ''}`}
            className='home-link fs-3 text-center d-flex align-items-center justify-content-center'>
                Indigenous DB
            </Link>
        </div>
    )
}



const SearchButton = () => {
    let navigate = useNavigate()

    return (
        <button 
        className='d-flex align-items-center d-md-none py-2 border-0 bg-transparent'
        onClick={() => navigate('/search')}>
            <i className='fas fa-search fs-5' ></i>
        </button>    )
}



const AccountButtons = () => {
    let navigate = useNavigate()

    return (
        <div class="button-container-header d-flex d-md-row">
            <button 
            class="m-3 me-0 shadow-unhover button-header button-one-header"
            onClick={() => navigate('/signup')}>
                Sign Up
            </button>

            <button class="m-3 shadow-unhover button-header button-two-header"
            onClick={() => navigate('/login')}>
                Log In
            </button>
        </div>
    )
}

const NavLinks = ({navLinks}) => {
    return (
        <div className='lower-container'>
            <div className='nav-links-container'>
                {navLinks.map((link, index) => {
                    return (
                        <NavOption
                            key={index}
                            text={link.text}
                            link={link.linkedTo}
                        />
                    )
                })}
            </div>
        </div>
    )
}

const NavOption = ({ text, link }) => {
    let navigate = useNavigate()

    return (
        <div className='navlink-container'>
            <label className="navlink-label px-2" onClick={() => navigate(link)}>
                {text}
            </label>
        </div>
    )
}



export default Header