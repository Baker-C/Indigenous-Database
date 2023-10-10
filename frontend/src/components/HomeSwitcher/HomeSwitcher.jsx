import React, { useState, useEffect } from 'react'
import HomeSwitcherCSS from './HomeSwitcher.module.css'
import ArrowButton from './../ArrowButton/ArrowButton'

const HomeSwitcher = () => {

    const [icons, setIcons] = useState([
        {source: '/assets/icon_placeholder.svg', id: 1},
        {source: '/assets/icon_placeholder.svg', id: 2},
        {source: '/assets/icon_placeholder.svg', id: 3},
        {source: '/assets/icon_placeholder.svg', id: 4}
    ])
    const content = [
        {
            id: 1,
            image: '/assets/bgUser.jpg',
            name: 'Search for Books',
            text: 'Find books by indigenous groups worldwide, effortlessly find reliable sources for your research and interests.',
            button: 'books'
        },
        {
            id: 2,
            image: '/assets/bgUser.jpg',
            name: 'Search for Art',
            text: 'Discover art by artists spanning generations. Dive into the diverse world of indigenous artists.',
            button: 'art'
        },
        {
            id: 3,
            image: '/assets/bgUser.jpg',
            name: 'Search for Articles',
            text: 'Step back through time and experience history through articles organized by date or topic.',
            button: 'articles'
        },
        {
            id: 4,
            image: '/assets/bgUser.jpg',
            name: 'Search for Music',
            text: 'Find modern and traditional indigenous music from across multiple generations.',
            button: 'music'
        }
    ]
    const [view, setView] = useState(1)
    const chooseView = (id) => {
        const newView = content.filter(content => content.id === view)
        console.log(newView)
        setView(() => id)
    }

    return (
            <section className={HomeSwitcherCSS.container}>
                <IconList icons={icons} chooseView={chooseView}></IconList>
                <View content={content} view={view}/>
            </section>
    )
}

const IconList = ({ icons, chooseView }) => {
    return (
        <div className={HomeSwitcherCSS.iconList}>
        {icons.map((icon) => {
            return (
                <label onClick={() => chooseView(icon.id)} className={HomeSwitcherCSS.iconContainer}>
                    <img src={icon.source}  alt="" className={HomeSwitcherCSS.icon} />
                </label>
            )
        })}
    </div>
    )
}

const View = ({ content, view }) => {
    content = content.filter(content => content.id === view)[0]
    return (
        <div className={HomeSwitcherCSS.contentContainer}>
            <p>{content.name}</p>
            <p>{content.text}</p>
            <ArrowButton>Start your search</ArrowButton>
            <img className={HomeSwitcherCSS.image} src={content.image} alt="" />
        </div>
    )
}

export default HomeSwitcher
