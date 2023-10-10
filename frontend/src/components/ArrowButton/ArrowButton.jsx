import React from "react"
import { Link } from 'react-router-dom'
import ArrowButtonCSS from './ArrowButton.module.css'

const ArrowButton = ({ children }) => {
    return (
        <Link className={ArrowButtonCSS.button}>
            <div className={ArrowButtonCSS.buttonText}>
                <p>{children}</p>
            </div>
            <div className={ArrowButtonCSS.arrowContainer}>
                <img src='/assets/arrow.svg' className={ArrowButtonCSS.arrow} />
            </div>
        </Link>
    )
}

export default ArrowButton