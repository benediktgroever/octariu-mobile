import { Workout } from "../..";
import { useState } from "react";
import { deleteWorkoutParams, deleteWorkout } from "../actions";

const useDeleteWorkoutMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [workout, changeWorkout] = useState<undefined | Workout>(undefined)

    const request = async (params: deleteWorkoutParams) => {
        changeIsLoading(true);
        const workout = await deleteWorkout(params);
        changeIsLoading(false);
        changeWorkout(workout);
    }

    return {
        isLoading,
        deleteWorkout: request,
        workout,
    }
}

export { useDeleteWorkoutMutation }
