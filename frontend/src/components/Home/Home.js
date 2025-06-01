import React from 'react'
import Hero from './Hero'
import About from './About'
import Features from './Features'
import HomeCopy from '../../copy/HomeCopy'


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
            image=""
        />
        <div className="home-body-container">
            <About Copy={HomeCopy.AboutCopy}/>
            <Features Copy={HomeCopy.FeaturesCopy} />
        </div>
    </div>
    )
}

export default Home