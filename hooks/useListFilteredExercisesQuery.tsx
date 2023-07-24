import { useState } from "react";
import { useListExercisesQuery } from "../store";
import { ExerciseType } from "../common/types";

const useListFilteredExerciseQuery = () => {

    const { data } = useListExercisesQuery({});

    const [filterMuscleGroup, changeFilterMuscleGroup] = useState("")
    const [filterEquipment, changeFilterEquipment] = useState("")
    let exercises: ExerciseType[] | undefined = undefined;
    const uniqueMuscleGroups = new Set<string>();
    const uniqueEquipments = new Set<string>();
    
    if(data){
        exercises = data.data
        if(exercises){
            exercises.map((exercise: ExerciseType)=>{
                uniqueMuscleGroups.add(exercise.muscleGroup);
                uniqueEquipments.add(exercise.equipment);
            })
            if(filterMuscleGroup){
                exercises = exercises.filter((exercise: ExerciseType) => exercise.muscleGroup == filterMuscleGroup);
            }
            if(filterEquipment){
                exercises = exercises.filter((exercise: ExerciseType) => exercise.equipment == filterEquipment);
            }
        }
    }

    return {
        exercises,
        uniqueMuscleGroups: Array.from(uniqueMuscleGroups),
        uniqueEquipments: Array.from(uniqueEquipments),
        changeFilterMuscleGroup,
        changeFilterEquipment,
    }
}

export { useListFilteredExerciseQuery }