import { useState, useEffect } from "react";
import { fetchExercises } from "../actions";
import { useSelector } from "react-redux";
import { RootState } from "../..";

const useListExercisesQuery = () => {

    const { isLoading, exercises } = useSelector((state: RootState) => state.exercises);

    useEffect(() => {
        fetchExercises();
    }, [fetchExercises])

    const [filterMuscleGroup, changeFilterMuscleGroup] = useState("")
    const [filterEquipment, changeFilterEquipment] = useState("")

    const uniqueMuscleGroups = new Set<string>();
    const uniqueEquipments = new Set<string>();

    let exercisesFiltered = [...exercises];
    if (exercises.length !== 0) {
        exercises.map((exercise) => {
            uniqueMuscleGroups.add(exercise.muscleGroup);
            uniqueEquipments.add(exercise.equipment);
        })
        if (filterMuscleGroup) {
            exercisesFiltered = exercisesFiltered.filter((exercise) => exercise.muscleGroup == filterMuscleGroup);
        }
        if (filterEquipment) {
            exercisesFiltered = exercisesFiltered.filter((exercise) => exercise.equipment == filterEquipment);
        }
    }

    return {
        isLoading,
        exercises: exercisesFiltered,
        uniqueMuscleGroups: Array.from(uniqueMuscleGroups),
        uniqueEquipments: Array.from(uniqueEquipments),
        changeFilterMuscleGroup,
        changeFilterEquipment,
    }
}

export { useListExercisesQuery }
