import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
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
            staleTime: 10 * 60 * 1000,  
            transformResponse: responseData => {
                const loadedBooks = responseData.books.map(book => {
                    book.id = book._id
                    return book
                })
                return booksAdapter.setAll(initialState, loadedBooks)
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

export const { 
    useCreateBookMutation,
    useDeleteBookMutation, 
    useUpdateBookMutation,
    useGetNumPagesQuery,
    useGetBooksQuery 
} = booksApiSlice