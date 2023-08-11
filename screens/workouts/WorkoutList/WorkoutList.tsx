import { useState } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, Pressable, Image } from 'react-native';
import {
  WorkoutListItem,
} from './WorkoutListItem';
import {
  useListExercisesQuery,
  useListSetsQuery,
  useListWorkoutsQuery,
} from '../../../store';
import {
  CreateWorkoutModal
} from './CreateWorkoutModal';
import {
  Workout
} from '../../../store/workouts/types';
import { NavigationProp } from '@react-navigation/native';

type WorkoutListProps = {
  navigation: NavigationProp<any, any>;
}

const WorkoutList = (props: WorkoutListProps) => {

  const { isLoading: isLoadingWorkouts, workoutSections } = useListWorkoutsQuery({});
  const { isLoading: isLoadingSets } = useListSetsQuery({});
  const { isLoading: isLoadingExercises } = useListExercisesQuery();

  const [showAddWorkoutModal, changeShowAddWorkoutModal] = useState(false);

  const renderWorkout = ({ item }: { item: Workout }) => {
    return (
      <WorkoutListItem
        key={item.workoutId}
        navigation={props.navigation}
        workout={item}
      />
    )
  }

  const renderWorkoutSectionTitle = ({ section: { title } }: { section: { title: string } }) => (
    <View style={styles.templateHeader}>
      <Text style={styles.header}> {title}</Text>
      {
        title == "Templates" && <Pressable
          style={styles.button}
          onPress={() => changeShowAddWorkoutModal(!showAddWorkoutModal)}>
          <Image
            source={require('../../../assets/plus-button.png')}
            style={styles.icon}
          />
          <Text style={styles.buttonText}>
            Add
          </Text>
        </Pressable>
      }
    </View>
  )

  if (isLoadingSets || isLoadingWorkouts || isLoadingExercises) {
    return <ActivityIndicator style={styles.activityIndicator} size="large" />
  }

  return (
    <View>
      <View style={styles.container}>
        <SectionList
          sections={workoutSections}
          keyExtractor={(item, index) => item.workoutId + index}
          renderItem={renderWorkout}
          renderSectionHeader={renderWorkoutSectionTitle}
        />
      </View>
      {
        showAddWorkoutModal && <CreateWorkoutModal onExit={() => changeShowAddWorkoutModal(false)} navigation={props.navigation} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  icon: {
    width: 20,
    height: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
    marginRight: 20,
  },
  buttonText: {
    fontSize: 10,
  },
  templateHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    margin: 10,
  },
  container: {
    backgroundColor: 'white'
  },
  activityIndicator: {
    display: 'flex',
    flex: 1,
  }
});

export { WorkoutList }