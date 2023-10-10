import React from 'react'
import { Link } from 'react-router-dom'
import HomeBoxesCSS from './HomeBoxes.module.css'

const HomeBoxes = () => {

    return (
        <section className={HomeBoxesCSS.container}>
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
        <div className={HomeBoxesCSS.titleContainer}>
            <h1 className={`heading ${HomeBoxesCSS.title}`}>{children}</h1>
        </div>
    )
}


const ContentBox = ({ heading, text }) => {
    return (
        <Link to="" className={HomeBoxesCSS.contentContainer}>
            <h2 className={HomeBoxesCSS.heading}>
                { heading }
            </h2>
            <Arrow>/assets/circlearrow.svg</Arrow>
            <p className={HomeBoxesCSS.text}>
                { text }
            </p>
        </Link>
    )
}

const Arrow = ({ children }) => {
    return (
        <div className={HomeBoxesCSS.arrowContainer}>
            <img src={children} className={HomeBoxesCSS.arrow} />
        </div>
    )
}

export default HomeBoxes