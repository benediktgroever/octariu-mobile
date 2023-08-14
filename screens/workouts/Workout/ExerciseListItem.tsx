import { View, Text, StyleSheet } from 'react-native';
import { SetListItem } from './SetListItem';
import { Button } from '../../../common';
import {
  Exercise, Workout, Set,
  useCreateSetMutation,
} from '../../../store';


type ExerciseListItemProps = {
  exercise: Exercise,
  sets: Set[],
  workout: Workout,
  previousSet: { [exerciseRank: string]: Set }
}

const ExerciseListItem = (props: ExerciseListItemProps) => {


  const { createSet } = useCreateSetMutation();

  const maxExerciseRank: number = Math.max(...props.sets.map((set: Set) => {
    return set.exerciseRank
  }))

  const sortedSets: Set[] = props.sets.sort(function (a, b) {
    return a.exerciseRank - b.exerciseRank;
  });

  const onClickCreateSet = () => {
    createSet({
      copySetId: sortedSets[sortedSets.length - 1].setId,
      exerciseRank: maxExerciseRank + 1,
      workoutRank: sortedSets[0].workoutRank,
    })
  }

  return (
    <View style={styles.container}>
      <Text> {props.exercise.name} </Text>
      {
        sortedSets && sortedSets.map((set: Set, index: number) => {
          return <SetListItem
            key={set.setId}
            counter={index + 1}
            set={set}
            workout={props.workout}
            previousSet={
              props.previousSet.hasOwnProperty(set.exerciseRank.toString()) ?
                props.previousSet[set.exerciseRank.toString()] : undefined
            }
          />
        })
      }
      <Button text={'Add set'} onClick={onClickCreateSet} style={styles.addExerciseButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '95%',
    backgroundColor: '#efefef',
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  addExerciseButton: {
    borderRadius: 5,
  }
});

export { ExerciseListItem }