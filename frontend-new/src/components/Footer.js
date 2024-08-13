import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/footer.css'

const columnEntries = [
    [
        { name: 'Home', link: '/' },
        { name: 'Search', link: '/' },
        { name: 'Contact', link: '/' },
    ],
    [
        { name: 'OIC Learning Collective', link: '/' },
        { name: 'Other Resources', link: '/' },
        { name: 'Get Involved', link: '/' },
    ],
    [
        { name: 'Contact', link: '/' },
        { name: 'Report a Problem', link: '/' },
        { name: 'Something Else', link: '/' },
    ]
]

const Footer = () => {
    return (
        <footer>
            <div className="footer">
                {columnEntries.map((column, index) => <FooterColumn key={index} column={column} />)}
            </div>
            <div className="footer-bottom">
            &copy; OIC Learning Collective 2024 . All rights reserved.
            </div>
        </footer>
    )
}

const FooterColumn = ({column}) => {
    return (
        <div className="footer-column">
            {column.map((entry, index) => <Link key={index} to={entry.link} className='footer-text'>{entry.name}</Link>)}
        </div>
    )
}

export default Footer