import { Reducer } from "redux";

import { Workout, WorkoutActionTypes, workoutsState } from "./types";
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
        case WorkoutActionTypes.CREATE_WORKOUTS: {
            const workouts: Workout[] = action.payload;
            return {
                errors: undefined,
                isLoading: false,
                workouts: [...state.workouts, ...workouts]
            };
        }
        case WorkoutActionTypes.DELETE_WORKOUTS: {
            const workoutIds: { [workoutId: string]: Workout } = {};
            const workouts = action.payload as Workout[];
            workouts.map((workout: Workout) => workoutIds[workout.workoutId] = workout)
            return {
                errors: undefined,
                isLoading: false,
                workouts: state.workouts.filter(workout => workoutIds.hasOwnProperty(workout.workoutId) == false)
            };
        }
        case WorkoutActionTypes.LISTS_WORKOUTS: {
            return {
                errors: undefined,
                isLoading: false,
                workouts: action.payload,
            };
        }
        case WorkoutActionTypes.UPDATE_WORKOUTS: {
            const workoutsToBeUpdated: { [workoutId: string]: Workout } = {};
            const workouts: Workout[] = action.payload;
            workouts.map((workout: Workout) => workoutsToBeUpdated[workout.workoutId] = workout)
            return {
                errors: undefined,
                isLoading: false,
                workouts: state.workouts.map((workout) => {
                    if (workoutsToBeUpdated.hasOwnProperty(workout.workoutId) === false) {
                        // This isn't the item we care about - keep it as-is
                        return workout
                    }
                    // Otherwise, this is the one we want - return an updated value
                    return workoutsToBeUpdated[workout.workoutId]
                })
            }
        }
        default: {
            return state;
        }
    }
};

export { workoutsReducer };