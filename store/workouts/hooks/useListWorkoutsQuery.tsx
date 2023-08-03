import { RootState } from "../..";
import { fetchWorkouts } from "../actions";
import { useEffect } from "react";
import { useSelector } from "react-redux";

type listWorkoutsQuery = {
    workoutId?: string,
}

const useListWorkoutsQuery = (props: listWorkoutsQuery) => {

    const { isLoading, workouts } = useSelector((state: RootState) => state.workouts);

    useEffect(() => {
        fetchWorkouts();
    }, [fetchWorkouts])

    const workoutsTemplates = workouts.filter((workout) => workout.template === true);
    workoutsTemplates.sort((workoutA, workoutB) => workoutB.createdAtMs - workoutA.createdAtMs);

    const workoutsActive = workouts.filter((workout) => workout.template === false && workout.endTimeMs === 0);
    workoutsActive.sort((workoutA, workoutB) => workoutB.endTimeMs - workoutA.endTimeMs);

    const workoutsPerformed = workouts.filter((workout) => workout.template === false && workout.endTimeMs !== 0);
    workoutsPerformed.sort((workoutA, workoutB) => workoutB.endTimeMs - workoutA.endTimeMs);

    const workoutSections = []
    workoutSections.push({ title: 'Templates', data: workoutsTemplates, })

    if (workoutsActive.length) {
        workoutSections.push({ title: 'Active workouts', data: workoutsActive, })
    }
    if (workoutsPerformed.length) {
        workoutSections.push({ title: 'Previous workouts', data: workoutsPerformed, })
    }

    const workout = props.workoutId ? workouts.filter(workout => workout.workoutId === props.workoutId) : []

    return {
        isLoading,
        workout: workout.length ? workout[0] : undefined,
        workoutsTemplates,
        workoutsActive,
        workoutsPerformed,
        workoutSections
    }
}

export { useListWorkoutsQuery }
