import React from 'react'
import { Link } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'

const Redirect = ({ username }) => {
    const [sendLogout, data] = useSendLogoutMutation()

    const handleLogout = () => {
        sendLogout()
        setTimeout(() => {
            window.location.reload()
        }, 500)
    }

    let content
    // if user logged in, redirect to home / logut, else direct to login / signup
    if (!username) {
        content = (
            <p style={{color: 'black'}}>
                You need to log in to view this page
                <br />
                <Link to={`/login`}>Click Here to Login</Link>
                <br />
                or
                <br />
                <Link to={`/signup`}>Click Here to Signup</Link>
            </p>
        )
    } else {
        content = (
            <p>
                You are already logged in
                <br />
                <Link to={`/${username}/`}>Return to Home</Link>
                <br />
                or
                <br />
                <label for='logout' onClick={() => handleLogout()}>
                    <Link to={`/`}>Click Here to Logout</Link>
                </label>
            </p>
        )
    }

    return content
}

export default Redirect