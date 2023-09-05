import { Set } from "../..";
import { useState } from "react";
import { createSetParams, createSet } from "../actions";

const useCreateSetMutation = () => {

    const [isLoading, changeIsLoading] = useState(false);
    const [set, changeSet] = useState<undefined | Set>(undefined)

    const createSetRequest = async (params: createSetParams) => {
        changeIsLoading(true);
        const set = await createSet(params);
        changeIsLoading(false);
        changeSet(set);
        return set
    }

    return {
        isLoading,
        createSet: createSetRequest,
        set,
    }
}

export { useCreateSetMutation }
