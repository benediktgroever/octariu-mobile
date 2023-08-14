import { fetchSets } from "../actions";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../..";
import {
    getOneMaxRep
} from '../../../common/helper';
import {
    Set
} from '../../../store';

type useListSetQueryProps = {
    workoutId?: string,
    exerciseId?: string,
    template?: boolean,
    completed?: boolean,
    bestSetPerDayOnly?: boolean,
}

const useListSetsQuery = (props: useListSetQueryProps) => {

    const { isLoading, sets } = useSelector((state: RootState) => state.sets);

    useEffect(() => {
        fetchSets(false);
    }, [fetchSets])

    let filteredSets = sets
    if (props.workoutId) {
        filteredSets = filteredSets.filter(set => set.workoutId === props.workoutId)
    }
    if (props.exerciseId) {
        filteredSets = filteredSets.filter(set => set.exerciseId === props.exerciseId)
    }
    if (props.template !== undefined) {
        filteredSets = filteredSets.filter(set => set.template === false)
    }
    if (props.completed === true) {
        filteredSets = filteredSets.filter(set => set.completedAtMs !== 0)
    }
    if (props.bestSetPerDayOnly === true) {
        const bestSetPerDay: { [date: string]: Set } = {};
        const optionsDate: Intl.DateTimeFormatOptions = {
            weekday: undefined,
            year: undefined,
            month: '2-digit',
            day: '2-digit',
        };
        filteredSets.map((set) => {
            const date = new Date(set.completedAtMs).toLocaleTimeString('en-US', optionsDate)
            if (!bestSetPerDay[date] || getOneMaxRep(bestSetPerDay[date]) < getOneMaxRep(set)) {
                bestSetPerDay[date] = set;
            }
        })
        filteredSets = Object.values(bestSetPerDay);
    }

    return {
        isLoading,
        sets: filteredSets
    }
}

export { useListSetsQuery }