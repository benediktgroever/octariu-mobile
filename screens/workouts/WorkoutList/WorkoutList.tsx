import { useState } from 'react';
import { View, Text, StyleSheet, SectionList, ActivityIndicator, Pressable, Image } from 'react-native';
import {
    WorkoutListItem,
} from './WorkoutListItem';
import {
    useListWorkoutsQuery,
} from '../../../store';
import {
    CreateWorkoutModal
} from './CreateWorkoutModal';
import {
    WorkoutType
} from '../../../common/types';
import { NavigationProp } from '@react-navigation/native';

type WorkoutListProps = {
    navigation: NavigationProp<any, any>;
}

const WorkoutList = (props: WorkoutListProps) => {

    const { data, error, isLoading } = useListWorkoutsQuery({});

    const [showAddWorkoutModal, changeShowAddWorkoutModal] = useState(false);

    let workoutTemplates: WorkoutType[] = [];
    let workoutsActive: WorkoutType[] = [];
    let workoutsPerformed: WorkoutType[] = [];
    const DATA = [];
    if (data) {
        workoutTemplates = data.data.filter((workout: WorkoutType) => workout.template === true);
        if (workoutTemplates) {
            workoutTemplates.sort((workoutA: any, workoutB: any) => workoutB.createdAt - workoutA.createdAt);
            DATA.push(
                {
                    title: 'Templates',
                    data: workoutTemplates,
                }
            )
        }
        workoutsActive = data.data.filter((workout: WorkoutType) => workout.template === false && workout.endTimeMs === 0);
        if (workoutsActive.length) {
            workoutsActive.sort((workoutA: any, workoutB: any) => workoutB.endTime - workoutA.endTime);
            DATA.push(
                {
                    title: 'Active workouts',
                    data: workoutsActive,
                }
            )
        }
        workoutsPerformed = data.data.filter((workout: WorkoutType) => workout.template === false && workout.endTimeMs !== 0);
        if (workoutsPerformed.length) {
            workoutsPerformed.sort((workoutA: any, workoutB: any) => workoutB.endTimeMs - workoutA.endTimeMs);
            DATA.push(
                {
                    title: 'Previous workouts',
                    data: workoutsPerformed,
                }
            )
        }
    }

    const renderWorkout = ({ item }: { item: WorkoutType }) => {
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

    if (isLoading || error) {
        return <ActivityIndicator style={styles.activityIndicator} size="large" />
    }

    return (
        <View>
            <View style={styles.container}>
                <SectionList
                    sections={DATA}
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