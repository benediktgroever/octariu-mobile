import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';
import {
    PROTOCOL,
    OSUBMIT
} from '../environment'

type requestExerciseParams = {
    name: string,
}

type listExerciseParams = {
    completed?: number
}

const exercisesApi = createApi({
    reducerPath: 'exercises',
    baseQuery: fetchBaseQuery({
        baseUrl: `${PROTOCOL}://${OSUBMIT}/exercises`,
        prepareHeaders: async (headers) => {
            const token = await auth().currentUser?.getIdToken();
            headers.set('X-ACCESS-TOKEN', token ? token : '')
            headers.set('Access-Control-Allow-Origin', '*')
            return headers
        }
    }),
    tagTypes: ['Exercises'],
    endpoints(builder) {
        return {
            requestExercise: builder.mutation({
                invalidatesTags: ['Exercises'],
                query: (params: requestExerciseParams) => {
                    return {
                        url: '/request',
                        method: 'POST',
                        params
                    }
                }
            }),
            listExercises: builder.query({
                providesTags: ['Exercises'],
                query: (params: listExerciseParams) => {
                    return {
                        url: '/list',
                        method: 'GET',
                        params
                    }
                }
            }),
        };
    }
})

export const {
    useRequestExerciseMutation,
    useListExercisesQuery,
} = exercisesApi;
export { exercisesApi };
