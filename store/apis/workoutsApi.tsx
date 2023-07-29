import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import auth from '@react-native-firebase/auth';

import {
    PROTOCOL,
    OSUBMIT
} from '../environment'

type createWorkoutParams = {
    name: string,
} | {
    name: string,
    copyWorkoutId: string,
    weightIntensity: number,
    repIntensity: number,
    startTimeMs: number
}

type listWorkoutParams = {
    workoutId?: string,
}

type updateWorkoutParams = {
    workoutId: string,
    name?: string,
    startTimeMs?: number,
    endTimeMs?: number
}

type deleteWorkoutParams = {
    workoutId: string,
}

const workoutsApi = createApi({
    reducerPath: 'workouts',
    baseQuery: fetchBaseQuery({
        baseUrl: `${PROTOCOL}://${OSUBMIT}/workouts`,
        prepareHeaders: async (headers) => {
            const token = await auth().currentUser?.getIdToken();
            headers.set('X-ACCESS-TOKEN', token ? token : '')
            headers.set('Access-Control-Allow-Origin', '*')
            return headers
        }
    }),
    tagTypes: ['Workouts'],
    endpoints(builder) {
        return {
            createWorkout: builder.mutation({
                invalidatesTags: ['Workouts'],
                query: (params: createWorkoutParams) => {
                    return {
                        url: '/create',
                        method: 'POST',
                        params
                    }
                }
            }),
            updateWorkout: builder.mutation({
                invalidatesTags: ['Workouts'],
                query: (params: updateWorkoutParams) => {
                    return {
                        url: '/update',
                        method: 'POST',
                        params
                    }
                }
            }),
            listWorkouts: builder.query({
                providesTags: ['Workouts'],
                query: (params: listWorkoutParams) => {
                    return {
                        url: '/list',
                        method: 'GET',
                        params
                    }
                }
            }),
            deleteWorkout: builder.mutation({
                invalidatesTags: ['Workouts'],
                query: (params: deleteWorkoutParams) => {
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
    useCreateWorkoutMutation,
    useListWorkoutsQuery,
    useUpdateWorkoutMutation,
    useDeleteWorkoutMutation,
} = workoutsApi;
export { workoutsApi };
