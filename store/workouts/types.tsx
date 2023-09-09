export interface Workout {
    createdAtMs: number,
    endTimeMs: number,
    name: string,
    repIntensity: number,
    startTimeMs: number,
    template: boolean,
    user: string,
    weightIntensity: number,
    workoutId: string,
    workoutParentId: string,
    workoutPlanId: string,
    workoutRanksOrder: string[],
}

export enum WorkoutActionTypes {
    API_ERROR = "@@workout/API_ERROR",
    CREATE_WORKOUTS = "@@workout/CREATE_WORKOUTS",
    DELETE_WORKOUTS = "@@workout/DELETE_WORKOUTS",
    LISTS_WORKOUTS = "@@workout/LISTS_WORKOUTS",
    UPDATE_WORKOUTS = "@@workout/UPDATE_WORKOUTS",
    IS_LOADING = "@@workout/IS_LOADING",
}

export interface workoutsState {
    readonly isLoading: boolean;
    readonly workouts: Workout[];
    readonly errors?: string;
}