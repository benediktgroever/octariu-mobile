import { Pressable, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { WorkoutType } from "../../../common/types";
import { useListExercisesQuery, useListSetsQuery } from "../../../store";
import { WORKOUTS } from "../../../Routes";
import {
    Timer
} from '../Timer';
import {
    SetType,
    ExerciseType,
} from '../../../common/types';
import { LargestSetItem } from "./LargestSetItem";
import { NavigationProp } from "@react-navigation/native";

type WorkoutListItemProps = {
    navigation: NavigationProp<any, any>,
    workout: WorkoutType,
}

const WorkoutListItem = (props: WorkoutListItemProps) => {

    const active = !props.workout.template && props.workout.endTime === 0;
    const template = props.workout.template;
    const previous = !props.workout.template && props.workout.endTime !==0;

    const listSetsQuery = useListSetsQuery({workoutId: props.workout.workoutId});
    const listExercisesQuery = useListExercisesQuery({});
    const isLoading = listExercisesQuery.isLoading || listSetsQuery.isLoading;
    const error = listExercisesQuery.error || listSetsQuery.error;

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
            return <LargestSetItem 
              exercise={exercises[setsList[0].exerciseId]}
              sets={setsList}
              key={setsList[0].workoutRank}
            />
        })
    }

    const renderDuration = () => {
      if (active){
        return <Timer startTime={props.workout.startTime} />;
      }else {
        const duration = props.workout.endTime - props.workout.startTime;
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        const mints = Math.floor((duration / 1000 / 60) % 60);
        return (
          hours + "h " + mints + "min"
        );
      }
    };

    const renderDate = () => {
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'short',
        year: undefined, 
        month: 'short', 
        day: '2-digit'
      };
      const date = new Date(props.workout.startTime);
      return (
        date.toLocaleDateString('en-US', options)
      )
    }

    return (
        <Pressable 
            style={active ? [styles.container, styles.active] : ( 
              template ? [styles.container, styles.template] : styles.container
            ) } 
            onPress={() => props.navigation.navigate(WORKOUTS, {workout: props.workout})}>
              <View style={styles.header}>
                <Text style={styles.headerText}>{active || template ? props.workout.name : props.workout.name + ', ' + renderDate() } </Text>
                { !template && <Text>{ renderDuration() } </Text>}
              </View>
            { isLoading || error ? <ActivityIndicator size="small" /> : renderExercises() }
        </Pressable>
    )
}

const styles = StyleSheet.create({
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    headerText: {
      fontWeight: "700",
    },
    container: {
      margin: 3,
      borderWidth: 1,
      borderRadius: 5,
      padding: 2,
    },
    active: {
      borderColor: 'red'
    },
    template: {
      borderColor: 'blue'
    }
});

export { WorkoutListItem }