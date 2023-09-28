import React from 'react'
import Header from './../Header/Header'
import NavBar from './../NavBar/NavBar'
import Hero from './../Hero/Hero'
import TwoColumnA from './../TwoColumns/TwoColumnA/TwoColumnA'
import Footer from './../Footer/Footer'
import '../styles.css'
 


const Home = () => {
    const content = (
        <html lang="en">
            <body>
                <Header />
                <NavBar />
                <Hero />
                <TwoColumnA 
                    heading="enjoy free access to countless resources"
                    title="what you can search for"
                    text="We offer this this and that as services for FREE!"
                    image="This is the image"
                />
                <Footer />
            </body>
        </html>
    )
    return content
}

export default Home