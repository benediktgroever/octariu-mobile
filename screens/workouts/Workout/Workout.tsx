import React, { useState } from 'react';
import {View, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { Button } from '../../../common';
import { ExerciseListItem } from './ExerciseListItem';
import { ExercisePickerModal } from './ExercisePickerModal';
import {
    useCreateSetMutation,
    useListExercisesQuery,
    useListSetsQuery,
} from '../../../store';
import {
  SetType,
  ExerciseType,
  WorkoutType
} from '../../../common/types';
import {
  WorkoutHeader
} from './WorkoutHeader';

type WorkoutProps = {
    workout: WorkoutType,
    navigation: any,
}

const Workout = (props: WorkoutProps) => {

    const listSetsQuery = useListSetsQuery({workoutId: props.workout.workoutId});
    const listExercisesQuery = useListExercisesQuery({hidden: true});
    const [exercisePickerVisible, onClickPickExercise] = useState(false);
    const [isLoadingFromHeader, onLoadingFromHeader] = useState(false);
    const isLoading = listExercisesQuery.isLoading || listSetsQuery.isLoading;
    const error = listExercisesQuery.error || listSetsQuery.error;

    const [createSet] = useCreateSetMutation();

    let sets: SetType[] = [];
    if(listSetsQuery.data){
      sets = listSetsQuery.data.data
    }

    let exercises: { [exerciseId: string]: ExerciseType} = {};
    if(listExercisesQuery.data){
      listExercisesQuery.data.data.map((item: ExerciseType) => {
        exercises[item.exerciseId] = item;
      });
    }

    const onClickCreateExercise = (exerciseId: string) => {
      createSet({
        exerciseId,
        workoutId: props.workout.workoutId,
        exerciseRank: 0,
        workoutRank: sets.length,
        reps: 8,
        weight: 12.5,
        template: props.workout.template
      })
      onClickPickExercise(!exercisePickerVisible);
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
            />
          )
      })
    }

    return (
      <React.Fragment>
        <WorkoutHeader 
          workout={props.workout} 
          navigation={props.navigation} 
          onLoadingFromHeader={onLoadingFromHeader} 
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
                      onClick={() => onClickPickExercise((exercisePickerVisible)=>!exercisePickerVisible)}
                    />
                </View>
                {
                  exercisePickerVisible && <ExercisePickerModal onClickCreateExercise={onClickCreateExercise}/>
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
    modalView: {
      alignItems: 'center',
    },
    exercises: {
      display: 'flex',
      justifyContent: 'center',
      alignContent: 'center',
    },
    textStyle: {
      color: 'darkblue',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    workoutHeaderText: {
      marginBottom: 5,
      marginTop: 5,
      display: 'flex',
      textAlign: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    activityIndicator: {
      display: 'flex',
      flex: 1,
  }
});

export { Workout }