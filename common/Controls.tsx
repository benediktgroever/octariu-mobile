import { StyleSheet, View } from "react-native";
import { Button } from "./Button";
import { FOREGROUND_COLOR } from "./constants";

type ControlsProps = {
    selections: string[]
    selected: string
    onSelectionClick: (selection: string) => void
}

const Controls = (props: ControlsProps) => {
    return (
        <View style={styles.controlls}>
            {
                props.selections && props.selections.map(selection => 
                    <Button
                        key={selection}
                        style={styles.selection}
                        backgroundColor={selection === props.selected ? 'lightblue' : FOREGROUND_COLOR}
                        text={selection}
                        onClick={() => props.onSelectionClick(selection)}
                    />
                )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    selection: {
        paddingHorizontal: 10,
        paddingVertical: 2,
        margin: 3,
        backgroundColor: FOREGROUND_COLOR,
    },
    controlls: {
        display: 'flex',
        flexDirection: 'row',
    },
})

export { Controls }