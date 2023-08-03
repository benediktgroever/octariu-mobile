import { Set } from "../..";
import { useState } from "react";
import { deleteSetParams, deleteSet } from "../actions";

const useDeleteSetMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [set, changeWorkout] = useState<undefined | Set>(undefined)

    const deleteSetRequest = async (params: deleteSetParams) => {
        changeIsLoading(true);
        const set = await deleteSet(params);
        changeIsLoading(false);
        changeWorkout(set);
    }

    return {
        isLoading,
        deleteSet: deleteSetRequest,
        set,
    }
}

export { useDeleteSetMutation }
