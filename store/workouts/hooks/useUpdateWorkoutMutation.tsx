import { Workout } from "../..";
import { useState } from "react";
import { updateWorkoutParams, updateWorkout } from "../actions";

const useUpdateWorkoutMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [workout, changeWorkout] = useState<undefined | Workout>(undefined)

    const request = async (params: updateWorkoutParams) => {
        changeIsLoading(true);
        const workout = await updateWorkout(params);
        changeIsLoading(false);
        changeWorkout(workout);
    }

    return {
        isLoading,
        updateWorkout: request,
        workout,
    }
}

export { useUpdateWorkoutMutation }
