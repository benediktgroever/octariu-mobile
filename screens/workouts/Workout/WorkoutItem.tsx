import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View } from 'react-native';
import {
  Button,
  useSortExercisesWithinWorkoutRank,
  usePreviousBestSets
} from '../../../common';
import { ExerciseListItem } from './ExerciseListItem';
import { ExercisePickerModal } from '../../../common';
import {
  useCreateSetMutation,
  Workout, Exercise, useListWorkoutsQuery, useUpdateWorkoutMutation,
} from '../../../store';
import {
  WorkoutHeader
} from './WorkoutHeader';
import { NavigationProp } from '@react-navigation/native';
import {
  WORKOUT_ITEM_BACKGROUND_COLOR, FOREGROUND_COLOR
} from '../../../common/constants';
import DraggableFlatList, { RenderItemParams, ShadowDecorator } from 'react-native-draggable-flatlist';

type WorkoutProps = {
  workout: Workout,
  navigation: NavigationProp<any, any>,
}

type Item = {
  workoutRank: string;
};

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
  const [expandedWorkoutRankSet, setExpandedWorkoutRankSet] = useState<Set<string>>(new Set<string>(
    Object.keys(exercisesWithinWorkoutRank)
  ));
  const [data, setData] = useState([] as Item[]);
  const { updateWorkout } = useUpdateWorkoutMutation();
  const [isLoadingFromHeader, changeLoadingFromHeader] = useState(false);

  const isLoading = sortExercisesIsLoading || workoutQueryIsLoading || previousBestSetsLoading;

  useEffect(() => {
    if (workout) {
      setData(workout.workoutRanksOrder.map(workoutRank => ({ workoutRank: workoutRank })))
    }
  }, [workout])

  const collapseAll = () => {
    const updatedSet = new Set<string>([]);
    setExpandedWorkoutRankSet(updatedSet);
  };

  const expandAll = () => {
    const updatedSet = new Set<string>(
      Object.keys(exercisesWithinWorkoutRank)
    );
    setExpandedWorkoutRankSet(updatedSet);
  };

  const onClickCreateExercise = async (exercise: Exercise) => {
    const previousSetCompleted = (
      previousSet[exercise.exerciseId] ?
        previousSet[exercise.exerciseId]["1"] :
        undefined
    );
    const set = await createSet({
      exerciseId: exercise.exerciseId,
      workoutId: props.workout.workoutId,
      repCount: previousSetCompleted ? previousSetCompleted.repCount : 0,
      weight: previousSetCompleted ? previousSetCompleted.weight : 0,
      template: props.workout.template ? 1 : 0
    })
    // ensure that the newly created set is expanded
    const updatedSet = new Set(expandedWorkoutRankSet);
    if (set) {
      updatedSet.add(set.workoutRank);
    }
    setExpandedWorkoutRankSet(updatedSet);
    changeExercisePickerVisible(false);
  }

  const onExerciseListItemNameClick = (workoutRank: string) => {
    const updatedSet = new Set(expandedWorkoutRankSet);
    if (expandedWorkoutRankSet.has(workoutRank)) {
      updatedSet.delete(workoutRank);
      setExpandedWorkoutRankSet(updatedSet);
    } else {
      updatedSet.add(workoutRank);
      setExpandedWorkoutRankSet(updatedSet);
    }
  }

  const onDragEnd = (data: Item[]) => {
    setData(data);
    updateWorkout({
      workoutId: props.workout.workoutId,
      workoutRanksOrder: data.map(item => item.workoutRank)
    })
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    if (!exercisesWithinWorkoutRank.hasOwnProperty(item.workoutRank)) {
      return null;
    }
    const setsList = exercisesWithinWorkoutRank[item.workoutRank];
    const exerciseId = setsList[0].exerciseId;
    return (
      <ShadowDecorator>
        <ExerciseListItem
          key={setsList[0].workoutRank}
          exercise={exercisesMap[exerciseId]}
          sets={setsList}
          workout={props.workout}
          previousSet={previousSet.hasOwnProperty(exerciseId) ? previousSet[exerciseId] : {}}
          drag={drag}
          setsVisible={expandedWorkoutRankSet.has(item.workoutRank)}
          onExerciseListItemNameClick={onExerciseListItemNameClick}
        />
      </ShadowDecorator>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <WorkoutHeader
        workout={workout !== undefined ? workout : props.workout}
        navigation={props.navigation}
        onLoadingFromHeader={changeLoadingFromHeader}
        expandAll={expandAll}
        collapseAll={collapseAll}
      />
      {
        isLoading || isLoadingFromHeader ? (
          <ActivityIndicator style={styles.activityIndicator} size="large" />
        ) : <View style={styles.centeredView}>
          <DraggableFlatList
            containerStyle={styles.flatlist}
            data={data}
            onDragEnd={({ data }) => onDragEnd(data)}
            keyExtractor={(item) => item.workoutRank.toString()}
            renderItem={renderItem}
            ListFooterComponent={<Button
              text={'Add exercise'}
              onClick={() => changeExercisePickerVisible(true)}
              style={styles.addExerciseButton}
            />}
          />
        </View>
      }
      {
        exercisePickerVisible && <ExercisePickerModal
          onExit={() => changeExercisePickerVisible(false)}
          onClickPickExercise={onClickCreateExercise}
          questionText='Which exercise do you want to add?'
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    backgroundColor: WORKOUT_ITEM_BACKGROUND_COLOR,
    display: 'flex',
    alignItems: 'center',
    flex: 1,
  },
  flatlist: {
    width: '95%',
    backgroundColor: WORKOUT_ITEM_BACKGROUND_COLOR,
  },
  activityIndicator: {
    display: 'flex',
    flex: 1,
  },
  addExerciseButton: {
    borderRadius: 5,
    backgroundColor: FOREGROUND_COLOR,
    height: 40,
    marginVertical: 5,
  }
});

export { WorkoutItem }