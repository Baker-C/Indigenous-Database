import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavBarCSS from './NavBar.module.css'

const NavBar = (props) => {
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
            <NavOption>literature</NavOption>
            <NavOption>culture</NavOption>
            <NavOption>arts</NavOption>
            <NavOption>search</NavOption>
            <NavOption>employment</NavOption>
            <NavOption>academics</NavOption>
            <NavOption>contact</NavOption>
        </nav>
    )
}



const NavOption = ({ children }) => {
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
            to={`/${children}.html`} 
            className={hide ? hidden : visible} 
            activeClassName={NavBarCSS.activePage}
        >
            {children}
        </NavLink>
    )
}

export default NavBar