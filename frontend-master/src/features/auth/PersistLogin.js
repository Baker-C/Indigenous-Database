import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NOCE_ENV !== 'development') { // So that we only do this once (useEffect)
           
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    await refresh()
                    // isSuccess can be true before credentials are sent in refresh
                    // this setState gives it that extra time it needs otherwise
                    // it isn't done before mounting child components (this is a wrapper)
                    setTrueSuccess(true)
                } catch (err) {
                    console.error(err)
                }
            }
            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

        // to disable warnings about only mounting once in useEffect
        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) { // dont want to persist login
        console.log('no persist')
        content = <Outlet />
    } else if (isLoading) { // loading while getting access token
        console.log('loading')
        content = <p>Loading ...</p>
    } else if (isError) { // no refresh token
        console.log('error: no refresh token')
        content = (
            <p>
                {error.data?.message}
                <Link to='/login'>Please Login Again</Link>
            </p>
        )
    } else if (isSuccess && trueSuccess) { // youre good to go
        console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { // refresh function still needs to mount
        console.log('token but need to init refresh')
        content = <Outlet />
    }

    return content
}

export default PersistLogin