import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setQuery } from '../features/search/searchSlice'
import '../styles/searchbar.css'


const SearchBar = () => {
    let dispatch = useDispatch()
    let navigate = useNavigate()
    const [input, setInput] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            dispatch(setQuery(input))

            const formattedQuery = input?.replace(/\s+/g, '+')
            navigate(`/search?q=${formattedQuery}`)

            setInput('')
        }
    }

    return (
        <input 
        type="text" 
        className="search-bar fs-6" 
        placeholder={"Start your search"}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        />
    )
}

export default SearchBar