import { Workout } from "../..";
import { useState } from "react";
import { createWorkoutParams, createWorkout } from "../actions";

const useCreateWorkoutMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [workout, changeWorkout] = useState<undefined | Workout>(undefined)

    const createWorkoutRequest = async (params: createWorkoutParams) => {
        changeIsLoading(true);
        const workout = await createWorkout(params);
        changeIsLoading(false);
        changeWorkout(workout);
    }

    return {
        isLoading,
        createWorkout: createWorkoutRequest,
        workout,
    }
}

export { useCreateWorkoutMutation }
