import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
    name: 'auth',
    initialState: { 
        token: null,
        user: null
    },
    reducers: {
        setUser: (state, action) => {
            const { user } = action.payload
            state.user = { ...user }
        },
        setCredentials: (state, action) => {
            const { accessToken } = action.payload // payload contains token
            state.token = accessToken // use state.auth.token outside of auth slice
        },
        logout: (state, action) => {
            state.token = null // cookie handled in backend
            state.user = null
        },
    }
})

export const { setUser, setCredentials, logout } = authSlice.actions

export default authSlice.reducer

// just for getting token
export const selectCurrentToken = (state) => state?.auth.token

export const selectCurrentUser = (state) => state?.auth.user