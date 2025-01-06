import { createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const booksAdapter = createEntityAdapter({})

const initialState = booksAdapter.getInitialState()

export const booksApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createBook: builder.mutation({
            query: bookData => ({
                url: '/books',
                method: 'POST',
                body: { ...bookData, },
            }),
            invalidatesTags: [
                { type: 'book', id:  "LIST" }
            ],
        }),
        deleteBook: builder.mutation({
            query: ({ id }) => ({
                url: `/books`,
                method: 'DELETE',
                body: { id }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Book', id: arg.id }
            ],
        }),
        updateBook: builder.mutation({
            query: ({ bookData }) => ({
                url: `/books`, 
                method: 'PATCH',
                body: { ...bookData }
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Book', id: arg.id }
            ]
        }),
        getNumPages: builder.query({
            query: ({ pageSize, query }) => ({
                url: `/books?&getNumPages=true&s=${pageSize}&q=${query}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                return responseData.numPages
            }
        }),
        getBooks: builder.query({
            query: ({ page, pageSize, query }) => ({
                url: `/books?p=${page}&s=${pageSize}&q=${query}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            transformResponse: responseData => {
                if (!responseData || !Array.isArray(responseData.books)) {
                    console.error('Unexpected response format', responseData)
                    return booksAdapter.getInitialState()
                }
                const loadedBooks = responseData.books.map(book => ({
                    ...book,
                    id: book._id
                }))
                let newState = booksAdapter.setAll(initialState, loadedBooks)
                const loadedNumPages = {
                    id: 'numPagesData',
                    numPages: responseData.numPages
                }
                newState = booksAdapter.addOne(newState, loadedNumPages)
                return newState
            },
            provideTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Book', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Book', id }))
                    ]
                } else return [{ type: 'Book', id: 'LIST' }]
            }
        })
    })
})

export const selectBooksByIds = (state, ids) => {
    const books = booksApiSlice.endpoints.getBooks.select()(state)?.data || []
    return books.filter(book => ids.includes(book._id))
}

export const { 
    useCreateBookMutation,
    useDeleteBookMutation, 
    useUpdateBookMutation,
    useGetBooksQuery 
} = booksApiSlice


