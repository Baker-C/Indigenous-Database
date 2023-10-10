import React from 'react'
import Header from './Header/Header'
import NavBar from './NavBar/NavBar'
import Hero from './Hero/Hero'
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
                <HomeSwitcher />
                <HomeBanner />
                <HomeBoxes />
                <Footer />
            </body>
        </html>
    )
    return content
}

export default Home