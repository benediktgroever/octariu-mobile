import { useListSetsQuery, useListExercisesQuery, Exercise, Set } from "../../store";

type propsSortExercisesWithinWOrkoutRank = {
    workoutId: string
}


const useSortExercisesWithinWorkoutRank = (props: propsSortExercisesWithinWOrkoutRank) => {

    const { isLoading: setsQueryIsLoading, sets } = useListSetsQuery({ workoutId: props.workoutId });
    const { isLoading: exerciseIsLoading, exercises } = useListExercisesQuery();

    let exercisesMap: { [exerciseId: string]: Exercise } = {};
    exercises.map((item: Exercise) => {
        exercisesMap[item.exerciseId] = item;
    });

    const exercisesWithinWorkoutRank: { [workoutRank: string]: Set[] } = {};

    sets.map((set: Set) => {
        if (set.workoutRank !== undefined &&
            exercisesWithinWorkoutRank.hasOwnProperty(set.workoutRank)) {
            exercisesWithinWorkoutRank[set.workoutRank].push(set)
        } else {
            exercisesWithinWorkoutRank[set.workoutRank] = [set];
        }
    })

    return {
        isLoading: setsQueryIsLoading || exerciseIsLoading,
        exercisesWithinWorkoutRank,
        exercisesMap,
        sets,
        exercises,
    }
}

export { useSortExercisesWithinWorkoutRank }
