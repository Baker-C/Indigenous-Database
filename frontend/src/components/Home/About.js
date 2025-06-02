import React from "react"
import '../../styles/home.css'

const About = ({ Copy }) => {
    return (
        <section className="home-about-container">
            <h2>
                {Copy.Heading}
            </h2>
            <div className="d-flex flex-column flex-lg-row">
                <div className="w-100">
                    <img />
                </div>
                <div className="w-100">
                    <p className="p1">
                        {Copy.TopText}
                    </p>
                    <p className="p1">
                        {Copy.BottomText}
                    </p>
                </div>
            </div>
            
        </section>
    )
}

export default About