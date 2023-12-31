import React, { useState, useRef, useEffect } from 'react'
import HomeSwitcherCSS from './HomeSwitcher.module.css'
import ArrowButton from './../ArrowButton/ArrowButton'

const HomeSwitcher = () => {
    const content = [
        {
            id: 1,
            icon: '/assets/icon_placeholder.svg',
            image: '/assets/books.jpg',
            name: 'Search for Books',
            text: 'Find books by indigenous groups worldwide, effortlessly find reliable sources for your research and interests.',
            button: 'books'
        },
        {
            id: 2,
            icon: '/assets/icon_placeholder.svg',
            image: '/assets/art.jpg',
            name: 'Search for Art',
            text: 'Discover art by artists spanning generations. Dive into the diverse world of indigenous artists.',
            button: 'art'
        },
        {
            id: 3,
            icon: '/assets/icon_placeholder.svg',
            image: '/assets/articles.jpg',
            name: 'Search for Articles',
            text: 'Step back through time and experience history through articles organized by date or topic.',
            button: 'articles'
        },
        {
            id: 4,
            icon: '/assets/icon_placeholder.svg',
            image: '/assets/music.jpg',
            name: 'Search for Music',
            text: 'Find modern and traditional indigenous music from across multiple generations.',
            button: 'music'
        }
    ]

    const [view, setView] = useState(1)
    const [cont, setCont] = useState(() => (content.filter(content => content.id === view)[0]))

    useEffect(() => {
        setCont(() => (content.filter(content => content.id === view)[0]))
        console.log(cont)
    }, [view])

    return (
            <section className={HomeSwitcherCSS.container}>
                <div className={HomeSwitcherCSS.iconList}>
                    {content.map((content) => {
                        return (
                            <button onClick={() => setView(() => content.id)} className={HomeSwitcherCSS.iconButton}>
                                <img src={content.icon}  alt="" className={HomeSwitcherCSS.icon} />
                            </button>
                        )
                    })}
                </div>
                <View key={Math.random()} content={cont} />
            </section>
    )
}

const View = ({ content }) => {

    var color = `${HomeSwitcherCSS.contentContainer} ${HomeSwitcherCSS.books}`
    switch(content.id) {
        case 1: color = `${HomeSwitcherCSS.contentContainer} ${HomeSwitcherCSS.books}`
            break
        case 2: color = `${HomeSwitcherCSS.contentContainer} ${HomeSwitcherCSS.art}`
            break
        case 3: color = `${HomeSwitcherCSS.contentContainer} ${HomeSwitcherCSS.articles}`
            break
        case 4: color = `${HomeSwitcherCSS.contentContainer} ${HomeSwitcherCSS.music}`
    }

    return (
        <div className={color}>
            <p>{content.name}</p>
            <p>{content.text}</p>
            <ArrowButton>Start your search</ArrowButton>
            <div className={HomeSwitcherCSS.imageContainer}>
                <img 
                    className={HomeSwitcherCSS.image}
                    src={content.image} 
                    alt=""
                />
            </div>
        </div>
    )
}



export default HomeSwitcher
