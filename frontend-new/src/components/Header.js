import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import SideBar from './SideBar'
import '../styles/header.css'

const Header = () => {
    const user = useSelector(selectCurrentUser)

    const usernameURL = user?.username ? `/${user.username}` : ''

    let navLinks
    if (user) {
        navLinks = [
            { text: 'signup', linkedTo: '/signup' },
            { text: 'login', linkedTo: '/login' },
            { text: 'search', linkedTo: user ? `${usernameURL}/search` : '/search' },
            { text: 'contact', linkedTo: user ? `${usernameURL}/contact` : '/contact' },
        ]
    } else {
        navLinks = [
            { text: 'signup', linkedTo: '/signup' },
            { text: 'login', linkedTo: '/login' },
            { text: 'search', linkedTo: `/search` },
            { text: 'contact', linkedTo: `/contact` }
        ]
    }

    
    return (
        <div className='header'>
            <div className='upper-container'>
                <div className='left-child-container'>
                    <Link 
                        to={`/${user?.username ? user.username : ''}`}
                        className='home-link'
                    >
                        <h2>Indigenous DB</h2>
                        <h3>Provided By ~ OIC Learning Collective</h3>
                    </Link>
                </div>
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
                <div className='right-child-container'>
                    <SideBar />
                </div>
            </div>
        </div>
    )
}

const NavOption = ({ text, link }) => {
    const navigate = useNavigate()

    const handleClick = async (e) => {
        e.preventDefault()
        navigate(link)
    }

    return (
        <label className="content-container" onClick={(e) => handleClick(e)}>
            <p className='content'>{text}</p>
        </label>
    )
}

export default Header