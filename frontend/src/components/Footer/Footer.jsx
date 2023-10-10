import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FooterCSS from './Footer.module.css'

const Footer = () => {
    // here lies the hard coded names and links
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
    // maps through columns, 
    // then maps through the links in each column
        <section className={FooterCSS.container}>

            {columns.map((column) => {
                return (
                    <div className={FooterCSS.linkContainer}>
                        <ColumnTitle title={column.title} />

                        {column.links.map((link) => {
                            return (
                                <ColumnLink text={link.text} linkedTo={link.linkedTo} />
                            )
                        })}
                    </div>
                )
            })}
            <div className={FooterCSS.bottomText}>
                <p> CopyRight OIC Learning Collective 2023</p>
                <p>Accessibility Statement | Cyber Security | Terms of Use | Cookies | Privacy</p>
            </div>
        </section>
    )
}



const ColumnTitle = ({ title }) => {
    return (
        <h1 className={FooterCSS.title}>
            {title}
        </h1>
    )
}

const ColumnLink = ({ text, linkedTo }) => {
    return (
        <Link className={FooterCSS.link} to={linkedTo}>
            {text}
        </Link>
    )
}

export default Footer