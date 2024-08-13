import React from "react"
import '../../styles/home.css'

const Intro = () => {
    return (
        <section className="introContainer">
            <Heading>
                What Is This ?
            </Heading> 
            <Text 
                textTop=
                "The Indigenous Database serves as a valuable resource 
                for locating a diverse range of materials, including books, 
                art, music, articles, and historical documents. Additionally, 
                we offer a centralized platform for identifying accessible 
                resources, outreach groups, collectives, and activism groups.
                Our overarching objective is to foster greater connectivity 
                within the indigenous community by providing easy access to 
                relevant information."

                textBottom=
                "Access our information for free, anywhere, anytime. Simply search 
                for what you need, and if we have it available we will provide it. 
                If not, we will soon add it to the database to make it accessible in 
                the future. If you are just browsing, you can also search by topic."

                image="/assets/bgUser.jpg" 
            />
        </section>
    )
}


const Heading = ({ children }) => {
    return (
        <div className="introHeading">
            <div className="introTopLine" />
            <h1 className="heading">
                {children}
            </h1>
        </div>
    )
}

const Text = ({ textTop, textBottom, image }) => {
    return (
        <div className="introText">
            <p className="text">
                {textTop}
            </p>
            <img className="introImage" src={image} alt='' />
            <p className="text">
                {textBottom}
            </p>
            <div className="introBotLine" />
        </div>
    )
}

export default Intro