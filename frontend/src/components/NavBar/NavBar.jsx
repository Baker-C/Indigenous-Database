import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavBarCSS from './NavBar.module.css'

const NavBar = () => {
    const navLinks = [
        { text: 'literature', linkedTo: '' },
        { text: 'culture', linkedTo: '' },
        { text: 'arts', linkedTo: '' },
        { text: 'search', linkedTo: '' },
        { text: 'academics', linkedTo: '' },
        { text: 'employment', linkedTo: '' },
        { text: 'contact', linkedTo: '' }
    ]


// makes navbar stick to top after scrolling down
    const [sticky, setSticky] = useState(false)

    const stickyNavbar = () => {
        if (window.scrollY >= 60) { // NavBar has top: 60px
            setSticky(true)
        } else {
            setSticky(false)
        }
    }
    window.addEventListener('scroll', stickyNavbar)

    // makes classeNames more readable in <nav>
    const notStuck = `${NavBarCSS.navbar} ${NavBarCSS.notColored}`
    const stuck = `${NavBarCSS.navbar} ${NavBarCSS.stuck}`
    
    return (
        <nav className={sticky ? stuck : notStuck}>

           {navLinks.map((link) => {
                return (
                    <NavOption
                        text={link.text}
                        link={link.linkedTo}
                    />
                )
            })}
        </nav>
    )
}



const NavOption = ({ text, link }) => {
//hides navlinks on scroll down
    const [hide, setHide] = useState(false)
    const [prevPos, setPrevPos] = useState(window.scrollY)

    const hideNav = () => {
        const currentScrollPos = window.scrollY 
        if (currentScrollPos >= prevPos) {
            setHide(true)
        } else {
            setHide(false)
        }
        setPrevPos(currentScrollPos)
    }
    window.addEventListener('scroll', hideNav)

    const visible = `${NavBarCSS.content}`
    const hidden = `${NavBarCSS.content} ${NavBarCSS.hidden}`

    return (
        <NavLink 
            to={`/${link}.html`} 
            className={hide ? hidden : visible} 
            activeClassName={NavBarCSS.activePage}
        >
            {text}
        </NavLink>
    )
}

export default NavBar