import React from 'react'
import { Link } from 'react-router-dom'
import HomeBannerCSS from './HomeBanner.module.css'
import './../variables.css'

const HomeBanner = () => {
    return (
        <div className={HomeBannerCSS.container}>
            <Title>
                This is gonna be the title
            </Title>
            <Content>
                This is gonna be the content
            </Content>
            <Button>
                Butt lol
            </Button>
        </div>
    )
}

const Title = ({ children }) => {
    return (
        <h1 className={`heading ${HomeBannerCSS.title}`}>{children}</h1>
    )
}

const Content = ({ children }) => {
    return (
        <p className={`text ${HomeBannerCSS.content}`}>{children}</p>
    )
}

const Button = ({ children }) => {
    return (
        <Link className={HomeBannerCSS.button}>{children}</Link>
    )
}

export default HomeBanner
