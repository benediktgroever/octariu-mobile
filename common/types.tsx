import { ViewStyle, Falsy } from 'react-native';

export type SetType = {
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

export type WorkoutType = {
    createdTimeMs: number,
    endTimeMs: number,
    name: string,
    repIntensity: number,
    startTimeMs: number,
    template: boolean,
    user: string,
    weightIntensity: number,
    workoutId: string,
    workoutPlanId: string,
}

export type ExerciseType = {
    createdAtMs: number,
    equipment: string,
    exerciseId: string,
    muscleGroup: string,
    name: string,
    updatedAtMs: number,
}

export type StyleType = ViewStyle | Falsy
