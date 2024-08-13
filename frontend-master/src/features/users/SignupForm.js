import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import usePersist from '../../hooks/usePersist'
import { useCreateUserMutation } from './usersApiSlice'
import { setUser, setCredentials, selectCurrentUser } from '../auth/authSlice'
import { useLoginMutation } from '../auth/authApiSlice'
import Redirect from '../../components/Redirect'
import '../../styles/form.css'

const SignupForm = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [persist, setPersist] = usePersist()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const newUser = { username, email, password, rePassword }

    const [validUsername, setValidUsername] = useState(false)
    const [validPassword, setValidPassword] = useState(false)
    const [matchPassword, setMatchPassword] = useState(true)
    const [message, setMessage] = useState('')

    // Makes sure inputs follow secific rules
    const USERNAME_RGX = /^[0-9a-zA-Z_.]{5,15}$/
    const PASSWORD_RGX = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,25}$/
    const PASSWORD_TXT = "Must contain at least one number, one uppercase and lowercase letter, and at least 8 - 25 characters"

    const [createUser, {
        isLoading,
        isSuccess,
        isError,
        error
    }] = useCreateUserMutation()

    const [login, { isLoading: loginIsLoading }] = useLoginMutation()

    // to check if user alreadu logged in
    const user = useSelector(selectCurrentUser)

    // resets info and navigates on success
    useEffect(() => {
        if (isSuccess) {
            const holdUsername = username
            setUsername('')
            setEmail('')
            setPassword('')
            setRePassword('')
            setTimeout(() => {
                navigate(`/${holdUsername}/`)
            }, 1000)
        }
    }, [isSuccess])

    // checks for valid username regex
    useEffect(() => {
        setValidUsername(USERNAME_RGX.test(username))
    }, [username])

    // checks if inputs follow patterns and passwords are equivalent
    useEffect(() => {
        setValidPassword(PASSWORD_RGX.test(password) && PASSWORD_RGX.test(rePassword))
        setMatchPassword(password === rePassword)
    }, [password, rePassword])

    

    // submits data
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (validUsername && validPassword && matchPassword && !isLoading) {
            await createUser(newUser)

            if (isError) {
                setMessage(() => `Error: ${JSON.stringify(error?.data?.message)}`)
            } else {
                setMessage("User created")
            
                const { accessToken, user } = await login({ username, password }).unwrap()
                dispatch(setCredentials({ accessToken }))
                dispatch(setUser({ ...user }))
                setMessage("User logged in")
            }
        } else if (!validUsername) {
            setMessage("Username is invalid")
        } else if (!validPassword) {
            setMessage("Password is invalid")
        } else if (!matchPassword) {
            setMessage("Passwords do not match")
        } 
    }



    let content

    if (user?.username && !loginIsLoading) {

        content = <Redirect username={user.username} />

    } else {

        content = (
            <form onSubmit={handleSubmit}>
                <div className='input-container'>
                    <label htmlFor="username">
                        Username
                    </label>
                    <input 
                        type="text" 
                        id="username"
                        placeholder="Enter an Unique Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className='input-container'>
                    <label htmlFor="email">
                        E-Mail
                    </label>
                    <input 
                        type="email" 
                        id="email"
                        placeholder="Enter a Valid Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className='input-container'>
                    <label htmlFor="pass">
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="pass"
                        placeholder="Enter Your Password" 
                        autoComplete="on"
                        title={PASSWORD_TXT}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className='input-container'>
                    <label htmlFor="rePass">
                        Re-Enter Password
                    </label>
                    <input 
                        type="password" 
                        id="rePass"
                        placeholder="Re-Enter Your Password" 
                        autoComplete="on"
                        title={PASSWORD_TXT}
                        value={rePassword}
                        onChange={(e) => setRePassword(e.target.value)}
                    />
                </div>
                <button type="submit" className='submit-button'>Sign Up</button>
                <label htmlFor='persist' className='persist-form'>
                    <input 
                        type="checkbox"
                        className='persist-box'
                        id='persist'
                        onChange={() => setPersist(p => !p)}
                        checked={persist}
                    />
                    Trust This Device
                </label>
                <p id="errmsg">{ message }</p>
            </form>
        )
    
    }

    
    return content
}

export default SignupForm