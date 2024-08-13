import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

const cataloguesAdapter = createEntityAdapter({})

const initialState = cataloguesAdapter.getInitialState()

export const cataloguesApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        createCatalogue: builder.mutation({
            query: catalogueData => ({
                url: '/catalogues',
                method: 'POST',
                body: { ...catalogueData },
            }),
            invalidatesTags: [
                { type: 'catalogue', id:  "LIST" }
            ],
        }),
        deleteCatalogue: builder.mutation({
            query: ({ id }) => ({
                url: `/catalogues`,
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Catalogue', id: arg.id },
                { type: 'Catalogue', id: "LIST" }
            ],
        }),
        updateCatalogue: builder.mutation({
            query: catalogueData => ({
                url: `/catalogues`,
                method: 'PATCH',
                body: { ...catalogueData, },
            }),
            invalidatesTags: (result, error, arg) => [
                { type: 'Catalogue', id: arg.id },
                { type: 'Catalogue', id:  "LIST" }
            ],
        }),
        getCatalogues: builder.query({
            query: ({ q, id, userId }) => ({
                url: id ? `/catalogues?id=${id}` : `/catalogues?q=${q}&userId=${userId}`,
                validateStatus: (response, result) => {
                    return response.status === 200 && !result.isError
                },
            }),
            staleTime: 10 * 60 * 1000,
            transformResponse: responseData => {
                const loadedCatalogues = responseData.map(catalogue => {
                    catalogue.id = catalogue._id
                    return catalogue
                })
                return cataloguesAdapter.setAll(initialState, loadedCatalogues)
            },
            provideTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Catalogue', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Catalogue', id }))
                    ]
                } else return [{ type: 'Catalogue', id: 'LIST' }]
            }
        })
    })
})

export const { 
    useCreateCatalogueMutation,
    useDeleteCatalogueMutation, 
    useUpdateCatalogueMutation,
    useGetCataloguesQuery
} = cataloguesApiSlice

// Results from get users query
export const selectCataloguesResult = cataloguesApiSlice.endpoints.getCatalogues.select()

// Creates normalized structure for selector (Redux)
const selectCataloguesData = createSelector(
    selectCataloguesResult,
    cataloguesResult => cataloguesResult.data
)

// Get selectors from Redux and rename with aliases
export const {
    selectAll: selectAllCatalogues,
    selectById: selectCatalogueById,
    selectIds: selectCatalogueIds
} = cataloguesAdapter.getSelectors(state => selectCataloguesData(state) ?? initialState)

