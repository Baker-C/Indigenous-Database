import React from 'react'
import { Link } from 'react-router-dom'
import HeaderCSS from './Header.module.css'
import './../variables.css'

const Header = () => {

    return (
        
        <header className={HeaderCSS.header}>
            <HeaderLogo>/assets/icon_placeholder.svg</HeaderLogo>
            <HeaderTitle>
                Indigenous Database
            </HeaderTitle> 
            <HeaderSubText>
                Provided By ~ OIC Learning Collective
            </HeaderSubText>

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
            <img className={HeaderCSS.logo} src={children} />
        </div>
    )
}

const HeaderTitle = ({ children }) => {
    return (
        <h1 className={HeaderCSS.title}>{children}</h1>
    )
}

const HeaderSubText = ({ children }) => {
    return (
        <p className={`HeaderCSS.subtext} subtext`}>{children}</p>
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