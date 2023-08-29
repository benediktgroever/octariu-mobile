import Drag from './../../../assets/all-directions.svg';
import UpArrow from './../../../assets/up-arrow.svg';
import DownArrow from './../../../assets/down-arrow.svg';
import { View, Text, StyleSheet, TouchableOpacity, GestureResponderEvent, Pressable } from 'react-native';
import { SetListItem } from './SetListItem';
import { Button } from '../../../common';
import {
  Exercise, Workout, Set,
  useCreateSetMutation,
} from '../../../store';
import {
  FOREGROUND_COLOR,
  BACKGROUND_COLOR
} from '../../../common/constants'


type ExerciseListItemProps = {
  exercise: Exercise,
  sets: Set[],
  workout: Workout,
  setsVisible: boolean,
  drag: (event: GestureResponderEvent) => void,
  previousSet: { [exerciseRank: string]: Set },
  onExerciseListItemNameClick: Function,
}

const ExerciseListItem = (props: ExerciseListItemProps) => {


  const { createSet } = useCreateSetMutation();

  const sortedSets: Set[] = props.sets.sort(function (a, b) {
    return a.exerciseRank - b.exerciseRank;
  });

  const onClickCreateSet = () => {
    createSet({
      copySetId: sortedSets[sortedSets.length - 1].setId,
    })
  }

  const allCompleted: boolean = props.sets.reduce(
    (accumulator, set: Set) => accumulator && set.completedAtMs !== 0, true);

  return (
    <View style={[styles.container, { "backgroundColor": allCompleted ? 'rgb(230, 255, 230)' : FOREGROUND_COLOR }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.exerciseNameTouchable} onPress={() => {
          props.onExerciseListItemNameClick(props.sets[0].workoutRank)
        }}>
          <View style={[styles.dragButton, styles.exerciseNameButton]}>
            {
              props.setsVisible ?
                <UpArrow width={15} height={15} style={styles.icon} fill={'black'} /> :
                <DownArrow width={15} height={15} style={styles.icon} fill={'black'} />
            }
          </View>
          <Text style={styles.exerciseName}> {props.exercise.name} </Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', justifyContent: 'center' }}>
          <Pressable
            style={styles.dragButton}
            onLongPress={props.drag}>
            <Drag width={20} height={20} style={styles.icon} fill={'black'} />
          </Pressable>
        </View>
      </View>
      <View style={props.setsVisible ? [styles.setsList] : [styles.setsList, styles.hidden]}>
        {
          sortedSets && sortedSets.map((set: Set) => {
            return <SetListItem
              key={set.setId}
              counter={set.exerciseRank}
              set={set}
              workout={props.workout}
              previousSet={
                props.previousSet.hasOwnProperty(set.exerciseRank.toString()) ?
                  props.previousSet[set.exerciseRank.toString()] : undefined
              }
            />
          })
        }
      </View>
      {
        props.setsVisible && <Button text={'Add set'} onClick={onClickCreateSet} style={styles.addExerciseButton} />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  exerciseName: {
    fontWeight: "300",
    paddingVertical: 3,
  },
  exerciseNameTouchable: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: "center",
  },
  exerciseNameButton: {
    backgroundColor: BACKGROUND_COLOR,
  },
  container: {
    width: '100%',
    backgroundColor: FOREGROUND_COLOR,
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
  },
  addExerciseButton: {
    borderRadius: 5,
  },
  hidden: {
    display: "none"
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
  },
  setsList: {
    display: "flex",
  },
  dragButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
    marginRight: 5,
  },
  icon: {
    height: 20,
    width: 20,
  }
});

export { ExerciseListItem }