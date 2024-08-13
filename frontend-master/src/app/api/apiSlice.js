import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'
const baseUrl = 'http://localhost:3500'


const baseQuery = fetchBaseQuery({
    baseUrl,
    credentials: 'include', // Always sends cookie
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token

        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    // args = req url, method, body
    // api = signal, dispatch, getState()
    // passes in access token from state in baseQuery
   
    let result = await baseQuery(args, api, extraOptions)

    // if query fails, reset token
    if (result?.error?.status === 403) {
        console.log('sending refresh token')

        // Send refresh token for new access token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

        if (refreshResult?.data) {
            api.dispatch(setCredentials({ ...refreshResult.data })) // set new token
            result = await baseQuery(args, api, extraOptions) // retry failed query with new token
        } else {
            if (refreshResult?.error?.status === 403) {
                refreshResult.error.data.message = 'Your login has expired'
            }
            return refreshResult
        }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({}),
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true,
    keepUnusedDataFor: 60,
    tagTypes: ['User', 'Book', 'Catalogue'],
})

