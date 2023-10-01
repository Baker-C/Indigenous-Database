import React from 'react'
import { Link } from 'react-router-dom'
import HomeSection1CSS from './HomeSection1.module.css'
import './../variables.css'

const HeroSection1 = () => {

    return (
        <section className={HomeSection1CSS.container}>
            <Title>Find the sources you need to experience the indigenous world.</Title>
            <ContentBox 
                heading="Search by categories"
                text="Explore our diverse collection of indigenous works for inspiration or simply to browse and discover."
            />
            <ContentBox 
                heading="Find student aid"
                text="Discover how you can unlock a treasure trove of indigenous student resources with just one click!"
            /><ContentBox 
                heading="Explore communities"
                text="Discover fascinating communities near and far. Explore the world's diverse cultures and connect with your local groups."
            />
            <ContentBox 
                heading="Support important issues"
                text="Join the movement! Stand with indigenous communities and support their fight for crucial issues. Let's make a difference!"
            />
        </section>
    )
}

const Title = ({ children }) => {
    return (
        <div className={HomeSection1CSS.titleContainer}>
            <h1 className={`heading ${HomeSection1CSS.title}`}>{children}</h1>
        </div>
    )
}


const ContentBox = (props) => {
    const { heading, text } = props

    return (
        <Link to="" className={HomeSection1CSS.contentContainer}>
            <h2 className={HomeSection1CSS.heading}>
                { heading }
            </h2>
            <Arrow>/assets/rightarrow.svg</Arrow>
            <p className={HomeSection1CSS.text}>
                { text }
            </p>
        </Link>
    )
}

const Arrow = ({ children }) => {
    return (
        <div className={HomeSection1CSS.arrowContainer}>
            <img src={children} className={HomeSection1CSS.arrow} />
        </div>
    )
}

export default HeroSection1