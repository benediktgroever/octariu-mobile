export interface Exercise {
    createdAtMs: number,
    equipment: string,
    exerciseId: string,
    muscleGroup: string,
    name: string,
    updatedAtMs: number,
}

export interface ExerciseRequest {
    createdAtMs: number
    name: string
    requestId: string
    user: string
}

export enum ExerciseActionTypes {
    API_ERROR = "@@exercises/API_ERROR",
    LISTS_EXERCISES = "@@exercises/LISTS_EXERCISES",
    IS_LOADING = "@@exercises/IS_LOADING",
    CREATE_EXERCISE_REQUEST = "@@exercises/CREATE_EXERCISE_REQUEST",
}

export interface exercisesState {
    readonly isLoading: boolean;
    readonly exercises: Exercise[];
    readonly errors?: string;
    readonly lastLoadedTimeMs: number,
}