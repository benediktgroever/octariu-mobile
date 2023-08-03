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
    workoutRank: number,
}

export enum SetActionTypes {
    API_ERROR = "@@set/API_ERROR",
    CREATE_SET = "@@set/CREATE_SET",
    DELETE_SET = "@@set/DELETE_SET",
    LISTS_SETS = "@@set/LISTS_SETS",
    IS_LOADING = "@@set/IS_LOADING",
    UPDATE_SET = "@@set/UPDATE_SET",
}

export interface setsState {
    readonly isLoading: boolean;
    readonly sets: Set[];
    readonly errors?: string;
}