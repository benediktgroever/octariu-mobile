import { Pressable, Text, StyleSheet, View, ActivityIndicator } from "react-native";
import { WORKOUTS } from "../../../Routes";
import {
  Timer
} from '../Timer';
import { Workout } from '../../../store';
import { LargestSetItem } from "./LargestSetItem";
import { NavigationProp } from "@react-navigation/native";
import { useSortExercisesWithinWorkoutRank } from "../../../common";

type WorkoutListItemProps = {
  navigation: NavigationProp<any, any>,
  workout: Workout,
}

const WorkoutListItem = (props: WorkoutListItemProps) => {

  const active = !props.workout.template && props.workout.endTimeMs === 0;
  const template = props.workout.template;
  const previous = !props.workout.template && props.workout.endTimeMs !== 0;

  const {
    isLoading,
    exercisesWithinWorkoutRank,
    exercisesMap
  } = useSortExercisesWithinWorkoutRank({ workoutId: props.workout.workoutId });


  const renderExercises = () => {

    if (isLoading) {
      return null;
    }

    return Object.values(exercisesWithinWorkoutRank).map((setsList) => {
      return <LargestSetItem
        exercise={exercisesMap[setsList[0].exerciseId]}
        sets={setsList}
        key={setsList[0].workoutRank}
      />
    })
  }

  const renderDuration = () => {
    if (active) {
      return <Timer startTime={props.workout.startTimeMs} />;
    } else {
      const duration = props.workout.endTimeMs - props.workout.startTimeMs;
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
    const date = new Date(props.workout.startTimeMs);
    return (
      date.toLocaleDateString('en-US', options)
    )
  }

  return (
    <Pressable
      style={active ? [styles.container, styles.active] : (
        template ? [styles.container, styles.template] : styles.container
      )}
      onPress={() => props.navigation.navigate(WORKOUTS, { workout: props.workout })}>
      <View style={styles.header}>
        <View style={styles.nameDateContainer}>
          <Text style={styles.headerText}> {props.workout.name} </Text>
          {
            previous && <Text style={styles.date}>{" " + renderDate()}</Text>
          }
        </View>
        {!template && <Text>{renderDuration()} </Text>}
      </View>
      {isLoading ? <ActivityIndicator size="small" /> : renderExercises()}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  nameDateContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  date: {
    fontWeight: "200",
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  headerText: {
    fontWeight: "700",
  },
  container: {
    margin: 3,
    borderWidth: 1,
    borderRadius: 5,
    padding: 4,
    backgroundColor: '#efefef',
  },
  active: {
    borderColor: 'red'
  },
  template: {
    borderColor: 'blue'
  }
});

export { WorkoutListItem }