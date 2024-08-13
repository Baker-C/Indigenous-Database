import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const groupsAdapter = createEntityAdapter({})

const initialState = groupsAdapter.getInitialState()

export const groupsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createGroup: builder.mutation({
            query: groupData => ({
                url: '/groups',
                method: 'POST',
                body: { ...groupData, },
            }),
            invalidatesTags: [
                { type: 'group', id:  "LIST" }
            ],
        }),
        deleteGroup: builder.mutation({
            query: ({ id }) => ({
                url: `/groups`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Group', id: arg.id }
            ],
        }),
        updateGroup: builder.mutation({
            query: groupData => ({
                url: `/groups`,
                method: 'PATCH',
                body: { ...groupData, },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'group', id: arg.id },
                { type: 'group', id:  "LIST" }
            ]
        }),
        getGroups: builder.query({
            query: ({ id, title, userId }) => ({
                url: `/groups?id=${id}&title=${title}&userId=${userId}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            keepUnusedDataFor: 60,
            transformResponse: responseData => {
                const loadedGroups = responseData.map(group => {
                    group.id = group._id
                    return group
                })

                return groupsAdapter.setAll(initialState, loadedGroups)
            },
            provideTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Group', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Group', id }))
                    ]
                } else return [{ type: 'Group', id: 'LIST' }]
            }
        })
    })
})

export const { 
    useCreateGroupMutation,
    useDeleteGroupMutation, 
    useUpdateGroupMutation,
    useGetGroupsQuery
} = groupsApiSlice

// Results from get users query
export const selectGroupsResult = groupsApiSlice.endpoints.getGroups.select()

// Creates normalized structure for selector (Redux)
const selectGroupsData = createSelector(
    selectGroupsResult,
    groupsResult => groupsResult.data
)

// Get selectors from Redux and rename with aliases
export const {
    selectAll: selectAllGroups,
    selectById: selectGroupById,
    selectIds: selectGroupIds
} = groupsAdapter.getSelectors(state => selectGroupsData(state) ?? initialState)

