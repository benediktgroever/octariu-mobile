import React from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";
import { NavigationProp } from '@react-navigation/native';
import { Exercise, Set, useListSetsQuery } from '../../store';
import { getOneMaxRep } from '../../common/helper';

type HistoryListProps = {
    navigation: NavigationProp<any, any>
    exercise: Exercise
}

const HistoryList = (props: HistoryListProps) => {

    const { sets } = useListSetsQuery({
        exerciseId: props.exercise.exerciseId,
        template: false,
        completed: true,
        bestSetPerDayOnly: true,
    })

    if (sets.length === 0) {
        return null;
    }

    let sortedSets: Set[] = sets.sort(function (a, b) {
        return b.completedAtMs - a.completedAtMs;
    });

    const optionsDate: Intl.DateTimeFormatOptions = {
        weekday: undefined,
        year: '2-digit',
        month: 'short',
        day: '2-digit',
    };

    const renderSet = ({ item }: { item: Set }) => {
        return (
            <View style={[styles.setlistitem, { paddingVertical: 1 }]}>
                <Text style={[styles.text, styles.dateText]}> {`${new Date(item.completedAtMs).toLocaleDateString('en-US', optionsDate)}`}</Text>
                <Text style={[styles.text, styles.weightText]}> {item.weight}</Text>
                <Text style={[styles.text, styles.repsText]}> {item.repCount}</Text>
                <Text style={[styles.text, styles.onermText]}> {getOneMaxRep(item)}</Text>
            </View>
        );
    }

    return (
        <React.Fragment>
            <View style={[styles.setlistitem, { width: '80%' }]}>
                <Text style={[styles.text, styles.headingText, styles.dateText]}> Date</Text>
                <Text style={[styles.text, styles.headingText, styles.weightText]}> Weight </Text>
                <Text style={[styles.text, styles.headingText, styles.repsText,]}> Reps</Text>
                <Text style={[styles.text, styles.headingText, styles.onermText]}> 1 RM</Text>
            </View>
            <FlatList
                data={sortedSets}
                renderItem={renderSet}
                keyExtractor={set => set.setId}
                style={styles.flatlist}
            />
        </React.Fragment>

    );
};

const styles = StyleSheet.create({
    setlistitem: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    flatlist: {
        display: 'flex',
        flexDirection: 'column',
        width: '80%',
        marginVertical: 10,
    },
    text: {
        textAlign: 'left',
    },
    dateText: {
        width: 80
    },
    weightText: {
        width: 60,
        textAlign: 'center'
    },
    repsText: {
        width: 40,
        textAlign: 'center'
    },
    onermText: {
        width: 40,
        textAlign: 'center',
    },
    headingText: {
        fontWeight: "500",
    },
})

export { HistoryList }