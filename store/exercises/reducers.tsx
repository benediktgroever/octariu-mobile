import { Reducer } from "redux";
import { ExerciseActionTypes, exercisesState } from "./types";
export const initialState: exercisesState = {
    exercises: [],
    errors: undefined,
    isLoading: false,
    lastLoadedTimeMs: 0,
};

const exercisesReducer: Reducer<exercisesState> = (state = initialState, action) => {
    switch (action.type) {
        case ExerciseActionTypes.API_ERROR: {
            return { ...state, loading: false, errors: action.payload, lastLoadedTimeMs: 0 };
        }
        case ExerciseActionTypes.LISTS_EXERCISES: {
            return {
                errors: state.errors,
                isLoading: false,
                exercises: action.payload,
                lastLoadedTimeMs: new Date().getTime()
            };
        }
        case ExerciseActionTypes.IS_LOADING: {
            return {
                ...state,
                isLoading: true
            }
        }
        default: {
            return state;
        }
    }
};

export { exercisesReducer };