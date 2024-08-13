import React from 'react'
import SignupForm from '../features/users/SignupForm'
import '../styles/formwrapper.css'

const Signup = () => {
    return (
        <section className='page'>
            <h1 className='title-wrapper'>
                Signup for an Account
            </h1>
            <SignupForm />
        </section>
    )
}

export default Signup