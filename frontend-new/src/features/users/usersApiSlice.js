import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const usersAdapter = createEntityAdapter({})

const initialState = usersAdapter.getInitialState()

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createUser: builder.mutation({
            query: userData => ({
                url: '/users',
                method: 'POST',
                body: { ...userData, },
            }),
            invalidatesTags: [
                { type: 'User', id:  "LIST" }
            ],
        }),
        deleteUser: builder.mutation({
            query: ({ username }) => ({
                url: '/users',
                method: 'DELETE',
                body: { username },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'User', id: arg.id}
            ],
        }),
        getUsers: builder.query({
            query: () => ({
                url: '/users',
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedUsers = responseData.map(user => {
                    user.id = user._id
                    return user
                })
                return usersAdapter.setAll(initialState, loadedUsers)
            },
            provideTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'User', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'User', id }))
                    ]
                } else return [{ type: 'User', id: 'LIST' }]
            }
        })
    })
})

export const { 
    useCreateUserMutation,
    useDeleteUserMutation, 
    useGetUsersQuery 
} = usersApiSlice

// Results from get users query
export const selectUsersResult = usersApiSlice.endpoints.getUsers.select()

// Creates normalized structure for selector (Redux)
const selectUsersData = createSelector(
    selectUsersResult,
    usersResult => usersResult.data
)

// Get selectors from Redux and rename with aliases
export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors(state => selectUsersData(state) ?? initialState)


