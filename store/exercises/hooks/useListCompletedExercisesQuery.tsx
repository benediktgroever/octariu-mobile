import { useListExercisesQuery } from "../..";
import { useListSetsQuery } from "../..";


const useListCompletedExercisesQuery = () => {

    const { isLoading: isLoadingSets, sets } = useListSetsQuery({})
    const { isLoading: isLoadingExercises, exercises, uniqueEquipments,
        uniqueMuscleGroups, changeFilterEquipment, changeFilterMuscleGroup } = useListExercisesQuery()

    const isLoading = isLoadingExercises || isLoadingSets;

    const completedExerciseIds = new Set<string>();
    sets.map((set) => {
        completedExerciseIds.add(set.exerciseId);
    })

    return {
        isLoading,
        exercises: exercises.filter(exercise => completedExerciseIds.has(exercise.exerciseId)),
        uniqueEquipments,
        uniqueMuscleGroups,
        changeFilterMuscleGroup,
        changeFilterEquipment,
    }
}

export { useListCompletedExercisesQuery }
