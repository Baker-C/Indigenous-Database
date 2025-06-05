import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/bookcard.css'
import ManageCatalogues from '../features/catalogues/ManageCatalogues'

const BookCard = ({ entry }) => {
    const [show, setShow] = useState(false)
    const navigate = useNavigate()

    return (
        <div className="book-card">
            <div className="book-image-container">
                <img src="/assets/Book_Img_Placeholder.jpg" className="book-image" />
            </div>
            <div className="book-header">
                <div className="book-info">
                    <h2 className="book-title">{entry?.title}</h2>
                    <p className="book-author">{`by ${entry?.author}`}</p>
                </div>
                <div class="g-1">
                    <button onClick={() => setShow(true)}
                    className="light-btn">
                        Save for Later
                    </button>
                    <button onClick={() => navigate(entry?.link)}
                    className="dark-btn">
                        Find a Copy
                    </button>
                </div>
            </div>

            {show && <ManageCatalogues entryId={entry?._id} setShow={setShow} />}
        </div>
    )
/*
            <div className="book-footer">
                <a href={`${entry.link}`} className="book-url">Get a Copy</a>
                <label onClick={() => setShow(true)} className='book-add'>
                    {window.location.href.includes('catalogue-dash') ? '-' : '+'}
                </label>
            </div>
*/
}


export default BookCard