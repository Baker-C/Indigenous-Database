import React from 'react'
import LoginForm from '../features/auth/LoginForm'
import '../styles/formwrapper.css'

const Login = () => {
    return (
        <section className='page'>
            <h1 className='title-wrapper'>
                Login to Your Account
            </h1>
            <LoginForm />
        </section>
    )
}

export default Login