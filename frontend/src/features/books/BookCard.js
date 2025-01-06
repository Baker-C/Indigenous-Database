import React, { useState } from 'react'
import '../../styles/bookcard.css'
import ManageCatalogues from '../catalogues/ManageCatalogues'

const BookCard = ({ entry }) => {
    const [show, setShow] = useState(false)



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
                <div class="button-container-book-card">
                    <button 
                    onClick={() => setShow(true)}
                    class="button-book-card button-one-book-card">Save for Later</button>
                    <a href={`${entry.link}`} target="_blank">
                        <button class="button-book-card button-two-book-card">Get a Copy</button>
                    </a>
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