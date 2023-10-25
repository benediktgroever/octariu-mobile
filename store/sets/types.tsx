export interface Set {
    completedAtMs: number,
    createdAtMs: number,
    exerciseId: string,
    exerciseRank: number,
    repCount: number,
    setId: string,
    template: boolean,
    user: string,
    weight: number,
    workoutId: string,
    workoutRank: string,
}

export enum SetActionTypes {
    API_ERROR = "@@set/API_ERROR",
    CREATE_SETS = "@@set/CREATE_SETS",
    DELETE_SETS = "@@set/DELETE_SETS",
    DELETE_SETS_BY_WORKOUT_ID = "@@set/DELETE_SETS_BY_WORKOUT_ID",
    LISTS_SETS = "@@set/LISTS_SETS",
    IS_LOADING = "@@set/IS_LOADING",
    UPDATE_SETS = "@@set/UPDATE_SETS",
}

export interface setsState {
    readonly isLoading: boolean;
    readonly sets: Set[];
    readonly errors?: string;
    readonly lastLoadedTimeMs: number;
}