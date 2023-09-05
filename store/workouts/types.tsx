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
    CREATE_WORKOUT = "@@workout/CREATE_WORKOUT",
    DELETE_WORKOUT = "@@workout/DELETE_WORKOUT",
    LISTS_WORKOUTS = "@@workout/LISTS_WORKOUTS",
    UPDATE_WORKOUT = "@@workout/UPDATE_WORKOUT",
    IS_LOADING = "@@workout/IS_LOADING",
}

export interface workoutsState {
    readonly isLoading: boolean;
    readonly workouts: Workout[];
    readonly errors?: string;
}