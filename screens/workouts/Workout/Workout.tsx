import React, { useState } from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { Button } from '../../../common';
import { ExerciseListItem } from './ExerciseListItem';
import { ExercisePickerModal } from '../../../common';
import {
    useListExercisesQuery,
    useListSetsQuery,
    useListWorkoutsQuery,
    useCreateSetMutation,
} from '../../../store';
import {
  SetType,
  ExerciseType,
  WorkoutType
} from '../../../common/types';
import {
  WorkoutHeader
} from './WorkoutHeader';
import { NavigationProp } from '@react-navigation/native';

type WorkoutProps = {
    workout: WorkoutType,
    navigation: NavigationProp<any, any>,
}

const Workout = (props: WorkoutProps) => {

    const workoutQuery = useListWorkoutsQuery({workoutId: props.workout.workoutId})
    const listSetsQuery = useListSetsQuery({workoutId: props.workout.workoutId});
    const listExercisesQuery = useListExercisesQuery({});
    const [exercisePickerVisible, changeExercisePickerVisible] = useState(false);
    const [isLoadingFromHeader, changeLoadingFromHeader] = useState(false);
    const [ createSet ] = useCreateSetMutation();
    const isLoading = workoutQuery.isLoading || listExercisesQuery.isLoading || listSetsQuery.isLoading;
    const error = listExercisesQuery.error || listSetsQuery.error;

    let sets: SetType[] = [];
    let newWorkoutRank: number = 0;
    if(listSetsQuery.data){
      sets = listSetsQuery.data.data
      newWorkoutRank = sets.reduce((maximum, set) => {
        return (maximum = maximum > set.workoutRank ? maximum : set.workoutRank);
      }, 0) + 1;
    }

    let exercises: { [exerciseId: string]: ExerciseType} = {};
    if(listExercisesQuery.data){
      listExercisesQuery.data.data.map((item: ExerciseType) => {
        exercises[item.exerciseId] = item;
      });
    }

    let workout: WorkoutType | undefined = undefined;
    if (workoutQuery.data){
      workout = workoutQuery.data.data[0];
    }

    const onClickCreateExercise = (exercise: ExerciseType) => {
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

      if(isLoading){
        return null;
      }

      const exercisesWithinWorkoutRank: { [workoutRank: string]: SetType[] } = {};

      sets.map((set: SetType) => {
        if(set.workoutRank !== undefined && 
          exercisesWithinWorkoutRank.hasOwnProperty(set.workoutRank)){
          exercisesWithinWorkoutRank[set.workoutRank].push(set)
        }else{
          exercisesWithinWorkoutRank[set.workoutRank] = [set];
        }
      })

      return Object.values(exercisesWithinWorkoutRank).map((setsList: SetType[]) => {
          return (
            <ExerciseListItem 
              key={setsList[0].workoutRank}
              exercise={exercises[setsList[0].exerciseId]}
              sets={setsList}
              workout={props.workout}
            />
          )
      })
    }

    return (
      <React.Fragment>
        <WorkoutHeader 
          workout={ workout !== undefined  ? workout : props.workout} 
          navigation={props.navigation} 
          onLoadingFromHeader={changeLoadingFromHeader} 
        />
        {
          isLoading || error || isLoadingFromHeader ? (
            <ActivityIndicator style={styles.activityIndicator} size="large" />
          ) : <ScrollView>
              <View style={styles.centeredView}>
                <View style={styles.exercises}>
                    { renderExercises() }
                    <Button 
                      text={'Add exercise'} 
                      onClick={() => changeExercisePickerVisible(true)}
                    />
                </View>
                {
                  exercisePickerVisible && <ExercisePickerModal 
                    onExit={()=>changeExercisePickerVisible(false)}
                    onClickPickExercise={onClickCreateExercise}
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

export { Workout }