import { fetchSets } from "../actions";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../..";

type useListSetQueryProps = {
    workoutId?: string,
    exerciseId?: string,
}

const useListSetsQuery = (props: useListSetQueryProps) => {

    const { isLoading, sets } = useSelector((state: RootState) => state.sets);

    useEffect(() => {
        fetchSets(false);
    }, [fetchSets])

    let filteredSets = undefined
    if (props.workoutId) {
        filteredSets = sets.filter(set => set.workoutId === props.workoutId)
    }
    if (props.exerciseId) {
        filteredSets = sets.filter(set => set.exerciseId === props.exerciseId)
    }

    return {
        isLoading,
        sets: filteredSets ? filteredSets : sets
    }
}

export { useListSetsQuery }