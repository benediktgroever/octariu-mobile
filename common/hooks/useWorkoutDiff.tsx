import { Workout, useListWorkoutsQuery } from "../../store";
import { useSortExercisesWithinWorkoutRank } from "./useSortExercisesWithinWorkoutRank";

type propsWorkoutDiff = {
    workout: Workout,
}

const useWorkoutDiff = (props: propsWorkoutDiff) => {

    const {
        isLoading: isLoadingTemplate,
        exercisesWithinWorkoutRank: currSetsPerWorkoutRank
    } = useSortExercisesWithinWorkoutRank({ workoutId: props.workout.workoutParentId });

    const {
        isLoading: isLoadingWorkout,
        exercisesWithinWorkoutRank: goalSetsPerWorkoutRank
    } = useSortExercisesWithinWorkoutRank({ workoutId: props.workout.workoutId });

    const {
        workout: workoutParent
    } = useListWorkoutsQuery({ workoutId: props.workout.workoutParentId });

    // Have the workout ranks been reordered ?
    const reorderd: boolean = !(workoutParent !== undefined && props.workout.workoutRanksOrder.length >= workoutParent.workoutRanksOrder.length
        && props.workout.workoutRanksOrder.every((value, index) => value === workoutParent.workoutRanksOrder[index]));

    // Determine sets of workout ranks to be created
    const workout_ranks_created = new Set(
        Object.keys(goalSetsPerWorkoutRank).filter(
            (rank) => !currSetsPerWorkoutRank[rank]
        )
    );

    // Determine sets of workout ranks to be deleted
    const workout_ranks_deleted = new Set(
        Object.keys(currSetsPerWorkoutRank).filter(
            (rank) => !goalSetsPerWorkoutRank[rank]
        )
    );

    let countCreatedSets: number = 0;
    let countDeletedSets: number = 0;
    let countUpdatedSets: number = 0;

    // Determine which sets need to be updated, created, deleted in the existing workout ranks
    const workout_ranks_updated = new Set(
        Object.keys(currSetsPerWorkoutRank).filter(
            (rank) => goalSetsPerWorkoutRank[rank]
        )
    );

    for (const workout_rank of workout_ranks_updated) {
        const currSets = currSetsPerWorkoutRank[workout_rank].sort(
            (a, b) => a.exerciseRank - b.exerciseRank
        );
        const goalSets = goalSetsPerWorkoutRank[workout_rank].sort(
            (a, b) => a.exerciseRank - b.exerciseRank
        );
        const MIN = Math.min(currSets.length, goalSets.length);
        for (let i = 0; i < MIN; i++) {
            if (
                currSets[i].weight !== goalSets[i].weight ||
                currSets[i].repCount !== goalSets[i].repCount
            ) {
                countUpdatedSets += 1
            }
        }
        for (let i = MIN; i < currSets.length; i++) {
            // If currSets are longer than goalSets
            countDeletedSets += 1;
        }

        for (let i = MIN; i < goalSets.length; i++) {
            // If goalSets are longer than currSets
            countCreatedSets += 1;
        }
    }

    return {
        isLoading: isLoadingWorkout || isLoadingTemplate,
        countCreatedSets,
        countDeletedSets,
        countUpdatedSets,
        countCreatedExercises: workout_ranks_created.size,
        countDeletedExercises: workout_ranks_deleted.size,
        reorderd
    }
}

export { useWorkoutDiff }