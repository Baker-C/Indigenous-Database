import React from 'react'
import Hero from './Hero'


const Home = () => {

    return (
    <div>
        <Hero 
            heading="What We Do"
            text="The Indigenous Database serves as a resource 
            for locating a indigenous-made materials, including books, 
            art, music, resources, and and much more. We have created this as
            a centralized platform as not only a database, but as a place for 
            communities to develop. Our overarching objective is to foster 
            connections within indigenous communities by providing a center 
            for access to resources & platforms to communicate."
            image="./"
        />
        <About />
        <Database />
        <Community />
        <Feedback />
        <Contact />
    </div>
    )
}


const About = ({ heading, text, image }) => {
    return (
        <div className="introText">
            <p className="text">
                {heading}
            </p>
            <img className="introImage" src={image} alt='' />
            <p className="text">
                {text}
            </p>
            <div className="introBotLine" />
        </div>
    )
}

const Database = ({ heading, text, image }) => {
    return (
        <div className="introText">
            <p className="text">
                {heading}
            </p>
            <img className="introImage" src={image} alt='' />
            <p className="text">
                {text}
            </p>
            <div className="introBotLine" />
        </div>
    )
}

const Community = ({ heading, text, image }) => {
    return (
        <div className="introText">
            <p className="text">
                {heading}
            </p>
            <img className="introImage" src={image} alt='' />
            <p className="text">
                {text}
            </p>
            <div className="introBotLine" />
        </div>
    )
}

const Feedback = ({ heading, text, image }) => {
    return (
        <div className="introText">
            <p className="text">
                {heading}
            </p>
            <img className="introImage" src={image} alt='' />
            <p className="text">
                {text}
            </p>
            <div className="introBotLine" />
        </div>
    )
}

const Contact = ({ heading, text, image }) => {
    return (
        <div className="introText">
            <p className="text">
                {heading}
            </p>
            <img className="introImage" src={image} alt='' />
            <p className="text">
                {text}
            </p>
            <div className="introBotLine" />
        </div>
    )
}

export default Home