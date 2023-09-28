import React from 'react'
import { Link } from 'react-router-dom'
import SearchBarCSS from './SearchBar.module.css'

const SearchBar = () => {

    return (
        <div className={SearchBarCSS.barContainer}>
            <Bar />
            <SearchIcon />
        </div>
    )
}

const Bar = () => {
    return (
        <label>
            <input className={SearchBarCSS.bar} type="search" placeholder="Search for books, groups, areas..."/>
        </label>
    )
}

const SearchIcon = () => {
    return (
        <div className={SearchBarCSS.iconContainer}>
            <Link to="search.html" className={SearchBarCSS.icon}></Link>
        </div>
    )
}

export default SearchBar