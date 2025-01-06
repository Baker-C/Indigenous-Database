import { createSlice } from '@reduxjs/toolkit'

const searchSlice = createSlice({
    name: 'Search',
    initialState: {
        query: '', // Shared query state
    },
    reducers: {
        setQuery(state, action) {
          state.query = action.payload
        },
        clearQuery(state) {
          state.query = ''
        },
    },
})

export const { setQuery, clearQuery } = searchSlice.actions

export default searchSlice.reducer

export const selectQuery = (state) => state?.search.query