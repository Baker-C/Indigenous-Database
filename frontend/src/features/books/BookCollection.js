import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { BarLoader } from 'react-spinners'
import { useGetBooksQuery, selectBooksByIds } from './booksApiSlice'
import { selectQuery } from '../search/searchSlice'
import BookCard from './BookCard'
import SearchBar from './../../components/SearchBar'
import '../../styles/search.css'

const BookCollection = ({ title }) => {
    let navigate = useNavigate()
    const [page, setPage] = useState(0)
    const [numPages, setNumPages] = useState(0)
    const [pageSize, setPageSize] = useState(2)
    const [books, setBooks] = useState([])
    const [startTime, setStartTime] = useState(0)
    const [reqSentFlag, setReqSentFlag] = useState(false)
    const [totalTime, setTotalTime] = useState(0)
    console.log(page)

    const query = useSelector(selectQuery)
    
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetBooksQuery(
        { pageSize, page, query }, 
        { pollingInterval: 60 * 1000 }
    )

    useEffect(() => {
        setStartTime(() => (performance.now() / 1000).toFixed(2))
        setReqSentFlag(true)
    }, [query])
    useEffect(() => {
        reqSentFlag
        ? setTotalTime(() => ((performance.now() / 1000) - startTime).toFixed(2))
        : setReqSentFlag(false)        
        setReqSentFlag(false)
    }, [books])

    useEffect(() => {
        if (isSuccess && data?.entities) {
            const { numPagesData, ...booksData } = data?.entities
            
            setBooks(Object.values(booksData))
            setNumPages(numPagesData.numPages)

            const formattedQuery = query?.replace(/\s+/g, '+')
            navigate(`/search?q=${formattedQuery}`)
        }
    }, [data])



    let content

    if (isLoading) {
        const override = {
            margin: "0 auto",
            color: "#000",
            width: "100%",
            height: "70vh",
            overflow: "hidden",
            background: "#FFF"
        }
        content = (<BarLoader cssOverride={override}/>)
    }
    
    
    if (isSuccess || isError) {
        const resultsContent = isError 
        ? <p className="errmsg">{error?.data?.message}</p> 
        : books?.map(book => <BookCard key={book.id} entry={book} />)

        content = (
            <section className="search-page">
                <h1>{title}</h1>
                <SearchBar />
                <div className='results-container'>
                    <ResultsStats 
                    page={page}
                    time={totalTime} 
                    count={books?.length + (pageSize * (numPages-1))} 
                    />
                    {resultsContent}
                </div>
                <PageButtons 
                numPages={numPages} 
                changePage={setPage} 
                />
            </section>
        )
    }

    return content
}


const ResultsStats = ({ page, time, count }) => {
    return (
        <div className="results-stats">
            <p>
                {`Page ${page+1} of approximately ${count} results (${time} seconds)`}
            </p>
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
            onClick={() => changePage((p) => (p < numPages-1) ? p + 1 : p)}>
                Next
            </button>
        </div>
    )
}

export default BookCollection