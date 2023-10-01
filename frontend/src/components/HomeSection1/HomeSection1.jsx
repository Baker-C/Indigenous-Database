import React from 'react'
import HomeSection1CSS from './HomeSection1.module.css'
import './../variables.css'

const HeroSection1 = () => {

    return (
        <section className={HomeSection1CSS.container}>
            <h1 className={`{HomeSection1CSS.title} heading`}>Find the sources you need to experience the indigenous world</h1>
            <ContentBox 
                heading="Search by categories"
                text="Choose"
            />
            <ContentBox 
                heading=""
                text=""
            /><ContentBox 
                heading=""
                text=""
            />
            <ContentBox 
                heading=""
                text=""
            />
        </section>
    )
}

const Title = ({ children }) => {
    return (
        <h1 className={`{HomeSection1CSS.title} heading`}>{children}</h1>
    )
}


const ContentBox = (props) => {
    const { heading, text } = props

    return (
        <div className={HomeSection1CSS.contentContainer}>
            <h2 className={HomeSection1CSS.heading}>
                { heading }
            </h2>
            <p className={HomeSection1CSS.text}>
                { text }
            </p>
        </div>
    )
}

export default HeroSection1