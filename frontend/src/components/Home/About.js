import React from "react"
import '../../styles/home.css'

const About = ({ Copy }) => {
    return (
        <section className="home-about-container">
            <h2>
                {Copy.Heading}
            </h2>
            <div className="d-flex flex-row flex-md-column">
                <div className="w-100 w-lg-50">
                    <img />
                </div>
                <div className="w-100 q-lg-50">
                    <p className="p2">
                        {Copy.TopText}
                    </p>
                    <p className="p2">
                        {Copy.BottomText}
                    </p>
                </div>
            </div>
            
        </section>
    )
}

export default About