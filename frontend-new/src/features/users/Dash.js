import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { selectUserById } from './usersApiSlice'

const SideNavOption = () => {
    return (
        <div>

        </div>
    )
}

const SideNav = () => {
    return (
        <div>
            
        </div>
    )
}

const Dash = () => {
    const { userId } = useParams()

    const user = useSelector(state => selectUserById(state, userId))

    if (user) {
        // Saved Collections
        // Saved Individuals
        // Saved Friends


    } else return null
}
export default Dash