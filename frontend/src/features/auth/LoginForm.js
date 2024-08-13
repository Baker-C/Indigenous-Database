import { useRef, useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import usePersist from '../../hooks/usePersist'
import { useDispatch, useSelector } from 'react-redux'
import { BarLoader } from 'react-spinners'
import { setUser, setCredentials, selectCurrentUser } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import Redirect from '../../components/Redirect'
import '../../styles/form.css'




const LoginForm = () => {
    const userRef = useRef(null) // holds user input
    const errRef = useRef(null) // holds err
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const [persist, setPersist] = usePersist()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    // to check if user already logged in
    const user = useSelector(selectCurrentUser)

    const [login, { 
        isLoading, 
        isError, 
        error 
    }] = useLoginMutation()
    
    // puts focus into username field on load
    useEffect(() => {
        userRef.current?.focus()
    }, [])

    // resets message when input is changed
    useEffect(() => {
        setMessage('')
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault() // prevents page reload

        // need unwrap for try/catch in RTK query when not using isError
        try {
            const { accessToken, user } = await login({ username, password }).unwrap()
            dispatch(setCredentials({ accessToken }))
            dispatch(setUser({ user }))
            setUsername(() => '')
            setPassword(() => '')
            navigate(`/${user.username}/`)
            console.log(isError)
            console.log(error)
        } catch (err) {
            if (!err.status) {
                setMessage('No Response From Server')
            } else if (err.status === 400) {
                setMessage('Missing Username or Password')
            } else if (err.status === 401) {
                setMessage('Username or Password is Incorrect')
            } else {
                setMessage(err.data?.message)
            }
            errRef.current?.focus()
        }
    }


    
    let content

    if (isLoading) {
        content = (
            <BarLoader 
            color={'#000'} 
            style={{margin: '0 100%'}} 
            />
        )
    } else if (user?.username && !isLoading) {

        content = (
            <Redirect username={user.username} />
        )

    } else {

        content = (
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">
                        Username
                    </label>
                    <input 
                        type="text" 
                        id="username"
                        ref={userRef}
                        placeholder="Enter an Unique Username" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="pass">
                        Password
                    </label>
                    <input 
                        type="password" 
                        id="pass"
                        placeholder="Enter Your Password" 
                        autoComplete="on"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit">Sign In</button>
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
                <p className='persist-text' id="errmsg" ref={errRef} aria-live="assertive">{ message }</p>
            </form>
        )
    }

    return content
}

export default LoginForm