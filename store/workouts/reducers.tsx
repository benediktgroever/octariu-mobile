import { Reducer } from "redux";

import { WorkoutActionTypes, workoutsState } from "./types";
export const initialState: workoutsState = {
    workouts: [],
    errors: undefined,
    isLoading: false
};

const workoutsReducer: Reducer<workoutsState> = (state = initialState, action) => {
    switch (action.type) {
        case WorkoutActionTypes.API_ERROR: {
            return { ...state, loading: false, errors: action.payload };
        }
        case WorkoutActionTypes.CREATE_WORKOUT: {
            return {
                errors: undefined,
                isLoading: false,
                workouts: [...state.workouts, action.payload]
            };
        }
        case WorkoutActionTypes.DELETE_WORKOUT: {
            return {
                errors: undefined,
                isLoading: false,
                workouts: state.workouts.filter(workout => workout.workoutId !== action.payload.workoutId)
            };
        }
        case WorkoutActionTypes.LISTS_WORKOUTS: {
            return {
                errors: undefined,
                isLoading: false,
                workouts: action.payload,
            };
        }
        case WorkoutActionTypes.UPDATE_WORKOUT: {
            return {
                errors: undefined,
                isLoading: false,
                workouts: state.workouts.map((workout) => {
                    if (workout.workoutId !== action.payload.workoutId) {
                        // This isn't the item we care about - keep it as-is
                        return workout
                    }
                    // Otherwise, this is the one we want - return an updated value
                    return action.payload
                })
            }
        }
        default: {
            return state;
        }
    }
};

export { workoutsReducer };