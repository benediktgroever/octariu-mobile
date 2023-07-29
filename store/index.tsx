import {
    configureStore
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { workoutsApi } from "./apis/workoutsApi";
import { setsApi } from "./apis/setsApi";
import { exercisesApi } from "./apis/exerciseApi";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

const store = configureStore({
    reducer: {
        [workoutsApi.reducerPath]: workoutsApi.reducer,
        [setsApi.reducerPath]: setsApi.reducer,
        [exercisesApi.reducerPath]: exercisesApi.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware().concat(
            workoutsApi.middleware,
            setsApi.middleware,
            exercisesApi.middleware
        )
    }
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export { store }
export {
    useCreateWorkoutMutation,
    useListWorkoutsQuery,
    useUpdateWorkoutMutation,
    useDeleteWorkoutMutation,
} from './apis/workoutsApi';
export {
    useCreateSetMutation,
    useListSetsQuery,
    useUpdateSetMutation,
    useDeleteSetMutation,
} from './apis/setsApi';
export {
    useRequestExerciseMutation,
    useListExercisesQuery,
} from './apis/exerciseApi';
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;