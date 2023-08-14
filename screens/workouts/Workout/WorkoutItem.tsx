import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import {
  Button,
  useSortExercisesWithinWorkoutRank,
  usePreviousBestSets
} from '../../../common';
import { ExerciseListItem } from './ExerciseListItem';
import { ExercisePickerModal } from '../../../common';
import {
  useCreateSetMutation,
  Workout, Exercise, useListWorkoutsQuery,
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

  const {
    isLoading: workoutQueryIsLoading,
    workout
  } = useListWorkoutsQuery({ workoutId: props.workout.workoutId })

  const {
    isLoading: sortExercisesIsLoading,
    exercisesWithinWorkoutRank,
    exercisesMap,
    sets
  } = useSortExercisesWithinWorkoutRank({ workoutId: props.workout.workoutId })

  const {
    isLoading: previousBestSetsLoading,
    previousSet,
  } = usePreviousBestSets(
    { untilTimeMs: props.workout.startTimeMs ? props.workout.startTimeMs : undefined }
  );

  const { createSet } = useCreateSetMutation();

  const [exercisePickerVisible, changeExercisePickerVisible] = useState(false);
  const [isLoadingFromHeader, changeLoadingFromHeader] = useState(false);

  const isLoading = sortExercisesIsLoading || workoutQueryIsLoading || previousBestSetsLoading;

  let newWorkoutRank: number = sets.reduce((maximum, set) => {
    return (maximum = maximum > set.workoutRank ? maximum : set.workoutRank);
  }, 0) + 1;

  const onClickCreateExercise = (exercise: Exercise) => {
    const previousSetCompleted = (
      previousSet[exercise.exerciseId] ?
        previousSet[exercise.exerciseId][newWorkoutRank] :
        undefined
    );
    createSet({
      exerciseId: exercise.exerciseId,
      workoutId: props.workout.workoutId,
      exerciseRank: 1,
      workoutRank: newWorkoutRank,
      repCount: previousSetCompleted ? previousSetCompleted.repCount : 0,
      weight: previousSetCompleted ? previousSetCompleted.weight : 0,
      template: props.workout.template
    })
    changeExercisePickerVisible(false);
  }

  const renderExercises = () => {

    if (isLoading) {
      return null;
    }

    return Object.values(exercisesWithinWorkoutRank).map((setsList) => {
      const exerciseId = setsList[0].exerciseId;
      return (
        <ExerciseListItem
          key={setsList[0].workoutRank}
          exercise={exercisesMap[exerciseId]}
          sets={setsList}
          workout={props.workout}
          previousSet={previousSet.hasOwnProperty(exerciseId) ? previousSet[exerciseId] : {}}
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
                style={styles.addExerciseButton}
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
    width: '100%',
    backgroundColor: '#e0dcd7',
    height: '100%'
  },
  exercises: {
    width: '100%',
    backgroundColor: '#e0dcd7',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  activityIndicator: {
    display: 'flex',
    flex: 1,
  },
  addExerciseButton: {
    width: '95%',
    borderRadius: 5,
    backgroundColor: '#efefef',
  }
});

export { WorkoutItem }