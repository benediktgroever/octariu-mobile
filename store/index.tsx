import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setsReducer } from './sets/reducer';
import { workoutsReducer } from "./workouts/reducers";
import { exercisesReducer } from "./exercises/reducers";
import { settingsReducer } from './settings/reducer';
import { legacy_createStore as createStore } from 'redux'
import { combineReducers } from "@reduxjs/toolkit";

const createRootReducer = () => combineReducers({
    sets: setsReducer,
    workouts: workoutsReducer,
    exercises: exercisesReducer,
    settings: settingsReducer,
});

export {
    useCreateSetMutation,
    useDeleteSetMutation,
    useUpdateSetMutation,
    useListSetsQuery,
} from './sets/hooks'

export {
    useCreateWorkoutMutation,
    useDeleteWorkoutMutation,
    useListWorkoutsQuery,
    useUpdateWorkoutMutation,
} from './workouts/hooks'

export {
    useListExercisesQuery,
    useRequestExerciseMutation,
    useListCompletedExercisesQuery,
} from './exercises/hooks'

export {
    useCountDownTimer,
    useListSettingsQuery,
} from './settings/hooks'

export {
    setCountDownTime,
} from './settings/actions';

export type {
    Set
} from './sets/types';

export type {
    Workout
} from './workouts/types';

export type {
    Exercise
} from './exercises/types';

const store = createStore(createRootReducer())

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export { store }
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;