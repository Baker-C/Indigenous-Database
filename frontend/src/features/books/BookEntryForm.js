import React, { useState, useEffect } from 'react'
import { useCreateBookMutation } from './booksApiSlice'

const BookEntryForm = () => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [link, setLink] = useState('')
    const book = { title, author, link }

    const [createBook, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useCreateBookMutation()

    const handleSubmit= async (e) => {
        e.preventDefault()

        await createBook(book)
        setTitle('')
        setAuthor('')
        setLink('')
    }


    return (
       <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="title">
                    Title
                </label>
                <input 
                type="text" 
                id="title" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="author">
                    Author
                </label>
                <input 
                type="text" 
                id="author" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="link">
                    Link
                </label>
                <input 
                type="text" 
                id="link" 
                value={link}
                onChange={(e) => setLink(e.target.value)}
                />
            </div>
            <button type="submit">Submit Book</button>
        </form>
    )
}

export default BookEntryForm