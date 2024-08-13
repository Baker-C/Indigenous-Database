import React, { useState, useEffect } from 'react'
import '../../styles/bookcard.css'
import ManageCatalogues from '../catalogues/ManageCatalogues'

const BookCard = ({ entry }) => {
    const [show, setShow] = useState(false)

    return (
        <div className="book-card">
            <div className="book-header">
                <div className="book-image-container">
                    <img src="/assets/Book_Img_Placeholder.jpg" className="book-image" />
                </div>
                <div className="book-info">
                    <h2 className="book-title">{entry?.title}</h2>
                    <p className="book-author">{entry?.author}</p>
                </div>
            </div>
            <div className="book-footer">
                <a href={`${entry.link}`} className="book-url">Click Here to Find this Book</a>
                <label onClick={() => setShow(true)} className='book-add'>
                    {window.location.href.includes('catalogue-dash') ? '-' : '+'}
                </label>
            </div>
            {show && <ManageCatalogues entryId={entry?._id} setShow={setShow} />}
        </div>
    )

    
}


export default BookCard