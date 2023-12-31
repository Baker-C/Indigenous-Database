import React from 'react'
import Header from './Header/Header'
import NavBar from './NavBar/NavBar'
import Hero from './Hero/Hero'
import Intro from './Intro/Intro'
import HomeSwitcher from './HomeSwitcher/HomeSwitcher'
import HomeBoxes from './HomeBoxes/HomeBoxes'
import HomeBanner from './GroupBanner/GroupBanner'
import Footer from './Footer/Footer'
import './styles.css'
 


const Home = () => {
    const content = (
        <html lang="en">
            <body>
                <Header />
                <NavBar />
                <Hero />
                <Intro />
                <HomeSwitcher />
                <HomeBoxes />
                <HomeBanner />
                <Footer />
            </body>
        </html>
    )
    return content
}

export default Home