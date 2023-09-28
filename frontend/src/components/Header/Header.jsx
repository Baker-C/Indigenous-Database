import React from 'react'
import { Link } from 'react-router-dom'
import HeaderCSS from './Header.module.css'

const Header = () => {

    return (
        <header className={HeaderCSS.header}>
            <HeaderLogo 
                image={"/assets/icon_placeholder.svg"}
            />
            <HeaderTitle 
                title={"INDIGENOUS DATABASE"}
                subtext={"PROVIDED BY ~ OIC LEARNING COLLECTIVE"}
            /> 
            <div className={HeaderCSS.optionsContainer}>
                <AccountOption>signup</AccountOption>
                <AccountOption>login</AccountOption>
                <DonateOption>donate</DonateOption>
            </div>
        </header>
    )
}



const HeaderLogo = ({ children }) => {
    return (
        <div className={HeaderCSS.logoContainer}>
            <img className={HeaderCSS.logo} src="/assets/icon_placeholder.svg"/>
        </div>
    )
}

const HeaderTitle = (props) => {
    const { title, subtext } = props

    return (
        <div className={HeaderCSS.titleContainer}>
            <h1 className={HeaderCSS.title}>{title}</h1>
            <p className={HeaderCSS.subtext}>{subtext}</p>
        </div>
    )
}

const AccountOption = ({ children }) => {
    return (
        <Link to={`/${children}.html`} className={HeaderCSS.option}>{children}</Link>
    )
}

const DonateOption = ({ children }) => {
    return (
        <Link to={`/${children}.html`} className={`${HeaderCSS.option} ${HeaderCSS.donate}`}>{children}</Link>
    )
}


export default Header