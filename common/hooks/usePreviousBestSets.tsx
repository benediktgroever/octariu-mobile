import { useListSetsQuery, useListExercisesQuery, Exercise, Set } from "../../store";

type propsPreviousAndBestSets = {
    untilTimeMs?: number
}


const usePreviousBestSets = (props: propsPreviousAndBestSets) => {

    const { isLoading: setsQueryIsLoading, sets } = useListSetsQuery({});
    const { isLoading: exerciseIsLoading, exercises } = useListExercisesQuery();

    let exercisesMap: { [exerciseId: string]: Exercise } = {};
    exercises.map((item: Exercise) => {
        exercisesMap[item.exerciseId] = item;
    });

    const exerciseCount: { [exerciseId: string]: number } = {}
    const previousSet: { [exerciseId: string]: { [exerciseRank: string]: Set } } = {};

    sets.map((set: Set) => {
        if (set.completedAtMs === 0) {
            // discard uncompleted sets
            return;
        }
        if (props.untilTimeMs !== undefined && props.untilTimeMs < set.completedAtMs) {
            // discard sets completed after untilTimeMs
            return;
        }
        const exerciseId = set.exerciseId;
        const exerciseRank: string = set.exerciseRank.toString();
        exerciseCount[set.exerciseId] = (
            exerciseCount.hasOwnProperty(exerciseId) ?
                exerciseCount[exerciseId] + 1 : 1
        )
        if (!previousSet.hasOwnProperty(exerciseId)) {
            previousSet[exerciseId] = {}
        }
        if (!previousSet[exerciseId].hasOwnProperty(exerciseRank)) {
            previousSet[exerciseId][exerciseRank] = set;
        }
        if (previousSet[exerciseId][exerciseRank].completedAtMs < set.completedAtMs) {
            previousSet[exerciseId][exerciseRank] = set;
        }
    })

    return {
        isLoading: setsQueryIsLoading || exerciseIsLoading,
        exercisesMap,
        exerciseCount,
        previousSet,
    }
}

export { usePreviousBestSets }