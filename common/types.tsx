export type SetType = {
    createdAt: number,
    setId: string,
    exerciseId: string,
    workoutRank: number,
    exerciseRank: number,
    workoutId: string,
    reps: number,
    weight: number,
    date: number,
    template: boolean,
    user: string,
}

export type WorkoutType = {
    endTime: number,
    name: string,
    repIntensity: number,
    startTime: number,
    template: boolean,
    user: string,
    weightIntensity: number,
    workoutId: string
}

export type ExerciseType = {
    createdAt: number,
    exerciseId: string,
    name: string,
    user: string,
}

