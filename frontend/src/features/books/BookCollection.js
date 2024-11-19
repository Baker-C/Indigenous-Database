import React, { useState, useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { useGetBooksQuery, useGetNumPagesQuery } from './booksApiSlice'
import BookCard from './BookCard'
import '../../styles/search.css'

const BookCollection = ({ title }) => {
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0)
    const [numPages, setNumPages] = useState(0)
    const [books, setBooks] = useState([])
    const [callCount, setCallCount] = useState(0)
    const pageSize = 10

    const {
        data: booksData,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBooksQuery(
        { page, pageSize, query }, 
        { pollingInterval: 60 * 1000 }
    )


    // Only used to get number of pages from search query
    const { 
        data: numPagesData
     } = useGetNumPagesQuery(
        { pageSize, query }
    )

    useEffect(() => {
        setNumPages(numPagesData)
    }, [numPagesData])
   
    useEffect(() => {
        if (booksData) {
            setBooks(booksData?.entities ? Object.values(booksData?.entities) : [])
            setCallCount((num) => num+1)
            console.log(callCount)
        }
    }, [booksData])

    useGetNumPagesQuery({ page, pageSize, query })
    useGetBooksQuery({ pageSize, query })

    useEffect(() => {
        console.log(booksData)
    }, [page, query])


    // Cleans input and sets query
    const handleSubmit = (searchInput) => {
        const searchQuery = searchInput?.replace(/\s+/g, '+')
        setQuery(searchQuery)
    }


    let content

    if (isLoading) content = (
        <BarLoader 
        color={'#000'} 
        style={{margin: '0 100%'}} 
        />
    )
    
    
    if (isSuccess || isError) {
        const resultsContent = isError 
        ? <p className="errmsg">{error?.data?.message}</p> 
        : books?.map(book => <BookCard key={book.id} entry={book} />)
                
        content = (
            <section className="search-page">
                <h1>{title}</h1>
                <SearchBar handleSubmit={handleSubmit} />
                <div className='results-container'>
                    {resultsContent}
                </div>
                <div>
                    <PageButtons 
                    numPages={numPages} 
                    changePage={setPage} 
                    />
                </div>
            </section>
        )
    }

    return content
}



const SearchBar = ({ handleSubmit }) => {
    const [input, setInput] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(input)
        }
    }

    return (
        <div className="search-container">
            <input 
            type="text" 
            className="search-bar" 
            placeholder="Start your search with an author or title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            />
        </div>
    )
}



const PageButtons = ({ numPages, changePage }) => {
    // create number array of size numPages
    const numArray = Array.from({ length: numPages }, (_, index) => index)

    // turn numbers into the corresponding buttons
    const numberedButtons = numArray.map((num) => (
        <button 
        className='numbered-button' 
        key={num} 
        onClick={() => changePage(num)}> 
            {num + 1} 
        </button>
    ))

    return (
        <div>
            <button 
            className='move-button' 
            onClick={() => changePage((p) => (p > 0) ? p - 1 : p)}>
                Back
            </button>
            {numberedButtons}
            <button 
            className='move-button' 
            onClick={() => changePage((p) => (p < numPages - 1) ? p + 1 : p)}>
                Next
            </button>
        </div>
    )
}

export default BookCollection