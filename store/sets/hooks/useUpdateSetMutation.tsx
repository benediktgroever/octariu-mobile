import { Set } from "../..";
import { useState } from "react";
import { updateSetParams, updateSet } from "../actions";

const useUpdateSetMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [set, changeSet] = useState<undefined | Set>(undefined)

    const updateSetRequest = async (params: updateSetParams) => {
        changeIsLoading(true);
        const set = await updateSet(params);
        changeIsLoading(false);
        changeSet(set);
    }

    return {
        isLoading,
        updateSet: updateSetRequest,
        set,
    }
}

export { useUpdateSetMutation }
