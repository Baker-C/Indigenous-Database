import React from 'react'
import { Link } from 'react-router-dom'
import GroupBannerCSS from './GroupBanner.module.css'
import './../variables.css'

const GroupBanner = () => {
    return (
        <div className={GroupBannerCSS.container}>
            <Title>
                Connect with your peers, <br /> become part of a group today!
            </Title>
            <Content>
                Join or create a group to share and collaborate on the resource collections you make!
            </Content>
            <Create>
                Create a group
            </Create>
            <Button>
                Join a group
            </Button>
        </div>
    )
}

const Title = ({ children }) => {
    return (
        <div className={GroupBannerCSS.title}>{children}</div>
    )
}

const Content = ({ children }) => {
    return (
        <p className={GroupBannerCSS.content}>{children}</p>
    )
}

const Create = ({ children }) => {
    return (
        <div className={GroupBannerCSS.createContainer}>
            {children}
        </div>
    )
}

const Button = ({ children }) => {
    return (
        <Link className={GroupBannerCSS.button}>
            <div className={GroupBannerCSS.buttonText}>
                <p>{children}</p>
            </div>
            <div className={GroupBannerCSS.arrowContainer}>
                <img src='/assets/arrow.svg' className={GroupBannerCSS.arrow} />
            </div>
        </Link>
    )
}

export default GroupBanner
