import { Set } from "../..";
import { useState } from "react";
import { requestExercise, requestExerciseParams } from "../actions";
import { ExerciseRequest } from "../types";

const useRequestExerciseMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [request, changeRequest] = useState<undefined | ExerciseRequest>(undefined)

    const requestExerciseRequest = async (params: requestExerciseParams) => {
        changeIsLoading(true);
        const request = await requestExercise(params);
        changeIsLoading(false);
        changeRequest(request);
    }

    return {
        isLoading,
        requestExercise: requestExerciseRequest,
        request,
    }
}

export { useRequestExerciseMutation }
