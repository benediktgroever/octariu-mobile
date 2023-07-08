import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';
import {
    PROTOCOL,
    OSUBMIT
} from '../environment'

type createExerciseParams = {
    name: string,
}

type updateExerciseParams = {
    exerciseId: string,
    bodyPart?: number,
    name?: string,
}

type deleteExerciseParams = {
    exerciseId: string,
}

type listExercisesParams = {
    hidden: boolean
}

const exercisesApi = createApi({
    reducerPath: 'exercises',
    baseQuery: fetchBaseQuery({
        baseUrl: `${PROTOCOL}://${OSUBMIT}/exercises`,
        prepareHeaders: async (headers) => {
            const token = await auth().currentUser?.getIdToken();
            const user = auth().currentUser?.uid;
            headers.set('X-ACCESS-TOKEN', token ? token : '')
            headers.set('X-USER', user ? user : '')
            headers.set('Access-Control-Allow-Origin', '*')
            return headers
        }
    }),
    tagTypes: ['Exercises'],
    endpoints(builder) {
        return {
            createExercise: builder.mutation({
                invalidatesTags: ['Exercises'],
                query: (params: createExerciseParams) => {
                    return {
                        url: '/create',
                        method: 'POST',
                        params
                    }
                }
            }),
            listExercises: builder.query({
                providesTags: ['Exercises'],
                query: (params: listExercisesParams) => {
                    return {
                        url: '/list',
                        method: 'GET',
                        params
                    }
                }
            }),
            updateExercise: builder.mutation({
                invalidatesTags: ['Exercises'],
                query: (params: updateExerciseParams) => {
                    return {
                        url: '/update',
                        method: 'POST',
                        params
                    }
                }
            }),
            deleteExercise: builder.mutation({
                invalidatesTags: ['Exercises'],
                query: (params: deleteExerciseParams) => {
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
    useCreateExerciseMutation,
    useListExercisesQuery,
    useUpdateExerciseMutation,
    useDeleteExerciseMutation,
} = exercisesApi;
export { exercisesApi };
