import React from 'react'
import Header from './../Header/Header'
import NavBar from './../NavBar/NavBar'
import Hero from './../Hero/Hero'
import Footer from './../Footer/Footer'
import '../styles.css'
 


const Home = () => {
    const content = (
        <html lang="en">
            <body>
                <Header />
                <NavBar />
                <Hero />
                <Footer />
            </body>
        </html>
    )
    return content
}

export default Home