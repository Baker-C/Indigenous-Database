import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import '../styles/sidebar.css'

const SideBar = () => {
    const user = useSelector(selectCurrentUser)

    let navLinks
    if (user) {
        navLinks = [
            [
                { text: 'my library', linkedTo: `/${user.username}/catalogue-dash` },
                { text: 'my groups', linkedTo: `/${user.username}/group-dash` }
            ],
            [
                { text: 'book entry', linkedTo: `/${user.username}/books/new-entry` },
                { text: 'book list', linkedTo: `/${user.username}/books` }
            ],
            [                
                { text: 'contact', linkedTo: `/${user.username}/contact` }
            ]
        ]
    } else {
        navLinks = [
            [
                { text: 'signup', linkedTo: '/signup' },
                { text: 'login', linkedTo: '/login' }
            ],
            [
                { text: 'contact', linkedTo: '/contact' }
            ]
        ]
    }
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [sendLogout, { isLoading }] = useSendLogoutMutation()

    const handleLogout = () => {
        sendLogout()
        setTimeout(() => {
            window.location.reload()
        }, 750)
    }

    const handleClick = () => {
        if (open && user) navigate(`/${user.username}/dash`)
        setOpen(true)
    }

    let icon
    let userOption
    if (user) {
        icon = (
            <label 
                className={`user-icon ${open ? 'open' : ''}`} 
                onClick={() => handleClick()}
                style={{backgroundColor: 'blue'}}
            >
                👤
            </label>
        )
        userOption = (
            <label htmlFor='logout' onClick={() => handleLogout()}>
                <Link id='logout' to={''} className='sidebar-link bottom'>
                    logout
                </Link>
            </label>
        )

    } else {
        icon = (
            <div className={`icon ${open ? 'open' : ''}`} onClick={() => setOpen(true)}>
                ☰
            </div>
        )
        userOption = (
            <Link className='sidebar-link bottom' to={'/signup'}>
                sign up
            </Link>
        )
    }

    return (
        <div className="App">
            {icon}
            <div className={`film ${open ? 'open' : ''}`} onClick={() => setOpen(false)} />
            <div className={`sidebar ${open ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <p>{user?.username}</p>
                    <button className="close-btn" onClick={() => setOpen(false)}>×</button>
                </div>
                <div className='thin-grey-line'></div>
                {navLinks.map((section, index) => (
                    <div className="sidebar-links" key={index}>
                        <LinkSection section={section} />
                        <div className='thin-grey-line'></div>
                    </div>
                    
                ))}
                {userOption}
            </div>
        </div>
    )
}

const LinkSection = ({ section }) => {
    return (
        section.map(entry => {
            return (
                <Link to={entry.linkedTo} className='sidebar-link'>
                    {entry.text}
                </Link>
            )
        })
    )
}


export default SideBar