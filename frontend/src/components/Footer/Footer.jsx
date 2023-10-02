import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FooterCSS from './Footer.module.css'

const Footer = () => {
    const columns = [
        { title: 'column 1', links: [
            { text: 'Home', linkedTo: '' },
            { text: 'About Us', linkedTo: '' },
            { text: 'Services', linkedTo: '' },
            { text: 'Contact Us', linkedTo: '' },
            { text: 'Careers', linkedTo: '' },
            { text: 'Testimonials', linkedTo: '' }
        ]},
        {title: 'column 2', links: [
            { text: 'Pricing Plans', linkedTo: '' },
            { text: 'Discounts', linkedTo: '' },
            { text: 'Partners', linkedTo: '' },
            { text: 'Documentation', linkedTo: '' },
            { text: 'Groups', linkedTo: '' },
            { text: 'Terms of Service', linkedTo: '' }
        ]},
        {title: 'column 3', links: [
            { text: 'Our Team', linkedTo: '' },
            { text: 'Customer Stories', linkedTo: '' },
            { text: 'Get Involved', linkedTo: '' },
            { text: 'Download App', linkedTo: '' },
            { text: 'Sitemap', linkedTo: '' },
            { text: 'Testimonials', linkedTo: '' }
        ]},
        {title: 'column 4', links: [
            { text: 'Special Offers', linkedTo: '' },
            { text: 'Newsletter', linkedTo: '' },
            { text: 'Feedback', linkedTo: '' },
            { text: 'Social Media', linkedTo: '' },
            { text: 'Customer Support', linkedTo: '' },
            { text: 'Accessibility', linkedTo: '' }
        ]}
    ]

    return (
        <section className={FooterCSS.container}>
            {columns.map((column) => {
                return (
                    <div className={FooterCSS.linkContainer}>
                        <ColumnTitle> {column.title} </ColumnTitle>
                        {column.links.map((link) => {
                            return (
                                <ColumnLink text={link.text} linkedTo={link.linkedTo} />
                            )
                        })}
                    </div>
                )
            })}
        </section>
    )
}



const ColumnTitle = ({ children }) => {
    return (
        <h1 className={FooterCSS.title}>
            {children}
        </h1>
    )
}

const ColumnLink = (props) => {
    const { text, linkedTo } = props
    return (
        <Link className={FooterCSS.link} to={linkedTo}>
            {text}
        </Link>
    )
}

export default Footer