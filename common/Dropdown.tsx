import { useState } from 'react';
import { Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { BACKGROUND_COLOR, FOREGROUND_COLOR } from './constants';

type DropdownProps = {
    label?: string,
    default?: string,
    data: Array<string>,
    onSelect: Function,
}

const Dropdown = (props: DropdownProps) => {

    const [dropdownSelection, changeDropdownSelection] = useState<string>("");
    const [dropdownVisible, changeDropdownVisible] = useState<boolean>(false);

    const onItemPress = (item: string) => {
        if (item === dropdownSelection) {
            item = "";
        }
        if (props.label && item === props.label) {
            item = "";
        }
        changeDropdownSelection(item);
        changeDropdownVisible(false);
        props.onSelect(item);
    }

    const renderDropdownItem = ({ item }: { item: string }) => {
        const style = dropdownSelection === item ? [styles.text, styles.selected] : [styles.text];
        return (
            <TouchableOpacity style={style} onPress={() => onItemPress(item)}>
                <Text> {item} </Text>
            </TouchableOpacity>
        );
    }

    const toggleDropdown = () => {
        changeDropdownVisible(!dropdownVisible);
    };

    const label = (dropdownSelection || props.label) ? dropdownSelection || props.label : props.default;

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={toggleDropdown}
        >
            <Text style={styles.buttonText}>{label}</Text>
            {dropdownVisible && <FlatList
                data={(dropdownSelection && props.label) ? [props.label, ...props.data] : props.data}
                renderItem={renderDropdownItem}
                keyExtractor={item => item}
                style={styles.dropdown}
            />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: FOREGROUND_COLOR,
        height: 50,
        width: '50%',
        zIndex: 1,
        margin: 5,
    },
    buttonText: {
        flex: 1,
        textAlign: 'center',
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: BACKGROUND_COLOR,
        top: 50,
        zIndex: 100,
        width: '100%',
    },
    text: {
        padding: 10,
        margin: 2,
        backgroundColor: FOREGROUND_COLOR,
        width: '100%'
    },
    selected: {
        backgroundColor: 'lightblue'
    }
});

export { Dropdown }