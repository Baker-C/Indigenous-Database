import React from 'react'
import TwoColumnACSS from './TwoColumnA.module.css'

const TwoColumnA = (props) => {
    const { heading, title, text, image } = props

    return (
        <section className={TwoColumnACSS.container}>
            <Heading>{heading}</Heading>
            <TextColumn
                text={text}
                title={title}
            />
            <ImgColumn>{image}</ImgColumn>
        </section>
    )
}



const Heading = ({ children }) => {
    return (
        <div className={TwoColumnACSS.headingContainer}>
            <h1 className={TwoColumnACSS.heading}>
                {children}
            </h1>
        </div>
    )
}

const TextColumn = (props) => {
    const { title, text } = props

    return (
        <div className={TwoColumnACSS.contentContainer}>
            <h2 className={TwoColumnACSS.title}>
                {title}
            </h2>
            <p className={TwoColumnACSS.text}>
                {text}
            </p>
        </div>
    )
}


const ImgColumn = ({ children }) => {
    return (
        <div className={TwoColumnACSS.imgContainer}>
        /*    < img className={TwoColumnACSS.image} href="" src={ children } /> */
        </div>
    )
}

export default TwoColumnA