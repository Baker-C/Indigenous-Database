import React from 'react'
import BookEntryForm from '../features/books/BookEntryForm'
import '../styles/formwrapper.css'

const BookEntry = () => {
    return (
        <section className='page'>
            <h1 className='header'>
                Enter Book Info
            </h1>
            <BookEntryForm />
        </section>
    )
}

export default BookEntry