import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';
import {
    PROTOCOL,
    OSUBMIT
} from '../environment'

type createSetParams = {
    exerciseId: string,
    workoutId: string,
    exerciseRank: number,
    workoutRank: number,
    weight: number,
    reps: number,
    template: boolean,
} | {
    copySetId: string,
    exerciseRank: number,
    workoutRank: number
}

type listSetsParams = {
    exerciseId?: string,
    workoutId?: string,
    template?: number,
}

type updateSetParams = {
    setId: string,
    reps?: number
    exerciseRank?: number,
    weight?: number,
    date?: number
}

type deleteSetParams = {
    setId: string
}

const setsApi = createApi({
    reducerPath: 'sets',
    baseQuery: fetchBaseQuery({
        baseUrl: `${PROTOCOL}://${OSUBMIT}/sets`,
        prepareHeaders: async (headers) => {
            const token = await auth().currentUser?.getIdToken();
            headers.set('X-ACCESS-TOKEN', token ? token : '')
            headers.set('Access-Control-Allow-Origin', '*')
            return headers
        }
    }),
    tagTypes: ['Sets'],
    endpoints(builder) {
        return {
            createSet: builder.mutation({
                invalidatesTags: ['Sets'],
                query: (params: createSetParams) => {
                    return {
                        url: '/create',
                        method: 'POST',
                        params
                    }
                }
            }),
            listSets: builder.query({
                providesTags: ['Sets'],
                query: (params: listSetsParams) => {
                    return {
                        url: '/list',
                        method: 'GET',
                        params
                    }
                }
            }),
            updateSet: builder.mutation({
                invalidatesTags: ['Sets'],
                query: (params: updateSetParams) => {
                    return {
                        url: '/update',
                        method: 'POST',
                        params
                    }
                }
            }),
            deleteSet: builder.mutation({
                invalidatesTags: ['Sets'],
                query: (params: deleteSetParams) => {
                    return {
                        url: '/delete',
                        method: 'DELETE',
                        params
                    }
                }
            })
        };
    }
})

export const {
    useCreateSetMutation,
    useListSetsQuery,
    useUpdateSetMutation,
    useDeleteSetMutation,
} = setsApi;
export { setsApi };
