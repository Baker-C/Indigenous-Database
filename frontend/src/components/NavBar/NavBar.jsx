import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import NavBarCSS from './NavBar.module.css'

const NavBar = (props) => {
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
    const stuck = `${NavBarCSS.navbar} ${NavBarCSS.stuck}`
    const notStuck = `${NavBarCSS.navbar}`
    
    return (
        <div className={NavBarCSS.navbarContainer}>
            <nav className={sticky ? stuck : notStuck}>
                <NavOption>literature</NavOption>
                <NavOption>culture</NavOption>
                <NavOption>arts</NavOption>
                <NavOption>search</NavOption>
                <NavOption>employment</NavOption>
                <NavOption>academics</NavOption>
                <NavOption>contact</NavOption>
            </nav>
        </div>
    )
}



const NavOption = ({ children }) => {
    return (
        <NavLink 
            to={`/${children}.html`} 
            className={NavBarCSS.content} 
            activeClassName={NavBarCSS.activePage}
        >
            {children}
        </NavLink>
    )
}

export default NavBar