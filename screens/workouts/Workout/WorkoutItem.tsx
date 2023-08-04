import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button } from '../../../common';
import { ExerciseListItem } from './ExerciseListItem';
import { ExercisePickerModal } from '../../../common';
import {
  useListSetsQuery,
  useListWorkoutsQuery,
  useCreateSetMutation,
  useListExercisesQuery,
  Workout, Exercise, Set,
} from '../../../store';
import {
  WorkoutHeader
} from './WorkoutHeader';
import { NavigationProp } from '@react-navigation/native';

type WorkoutProps = {
  workout: Workout,
  navigation: NavigationProp<any, any>,
}

const WorkoutItem = (props: WorkoutProps) => {

  const { isLoading: workoutQueryIsLoading, workout } = useListWorkoutsQuery({ workoutId: props.workout.workoutId })
  const { isLoading: setsQueryIsLoading, sets } = useListSetsQuery({ workoutId: props.workout.workoutId });
  const { isLoading: exerciseIsLoading, exercises } = useListExercisesQuery();
  const { createSet } = useCreateSetMutation();

  const [exercisePickerVisible, changeExercisePickerVisible] = useState(false);
  const [isLoadingFromHeader, changeLoadingFromHeader] = useState(false);

  const isLoading = workoutQueryIsLoading || setsQueryIsLoading || exerciseIsLoading;

  let newWorkoutRank: number = sets.reduce((maximum, set) => {
    return (maximum = maximum > set.workoutRank ? maximum : set.workoutRank);
  }, 0) + 1;

  let exercisesMap: { [exerciseId: string]: Exercise } = {};
  exercises.map((item: Exercise) => {
    exercisesMap[item.exerciseId] = item;
  });

  const onClickCreateExercise = (exercise: Exercise) => {
    createSet({
      exerciseId: exercise.exerciseId,
      workoutId: props.workout.workoutId,
      exerciseRank: 0,
      workoutRank: newWorkoutRank,
      repCount: 8,
      weight: 12,
      template: props.workout.template
    })
    changeExercisePickerVisible(false);
  }

  const renderExercises = () => {

    if (isLoading) {
      return null;
    }

    const exercisesWithinWorkoutRank: { [workoutRank: string]: Set[] } = {};

    sets.map((set: Set) => {
      if (set.workoutRank !== undefined &&
        exercisesWithinWorkoutRank.hasOwnProperty(set.workoutRank)) {
        exercisesWithinWorkoutRank[set.workoutRank].push(set)
      } else {
        exercisesWithinWorkoutRank[set.workoutRank] = [set];
      }
    })

    return Object.values(exercisesWithinWorkoutRank).map((setsList: Set[]) => {
      return (
        <ExerciseListItem
          key={setsList[0].workoutRank}
          exercise={exercisesMap[setsList[0].exerciseId]}
          sets={setsList}
          workout={props.workout}
        />
      )
    })
  }

  return (
    <React.Fragment>
      <WorkoutHeader
        workout={workout !== undefined ? workout : props.workout}
        navigation={props.navigation}
        onLoadingFromHeader={changeLoadingFromHeader}
      />
      {
        isLoading || isLoadingFromHeader ? (
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        ) : <ScrollView>
          <View style={styles.centeredView}>
            <View style={styles.exercises}>
              {renderExercises()}
              <Button
                text={'Add exercise'}
                onClick={() => changeExercisePickerVisible(true)}
              />
            </View>
            {
              exercisePickerVisible && <ExercisePickerModal
                onExit={() => changeExercisePickerVisible(false)}
                onClickPickExercise={onClickCreateExercise}
                questionText='Which exercise do you want to add?'
              />
            }
          </View>
        </ScrollView>
      }
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    overflow: 'scroll',
    alignItems: 'center',
  },
  exercises: {
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
  },
  activityIndicator: {
    display: 'flex',
    flex: 1,
  }
});

export { WorkoutItem }