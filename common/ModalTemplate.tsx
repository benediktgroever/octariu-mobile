import { ReactNode } from 'react';
import { View, Modal, StyleSheet, Pressable, Image } from 'react-native';
import Reject from '../assets/cancel.svg';

type ModalTemplateProps = {
    onExit: Function
    children: ReactNode
}

const ModalTemplate = (props: ModalTemplateProps) => {
    return (
        <Modal
            transparent={true}
            visible={true}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    <View style={styles.button}>
                        <Pressable
                            onPress={() => props.onExit()}>
                            <Reject style={styles.icon} />
                        </Pressable>
                    </View>
                    {props.children}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 16,
        height: 16,
    },
    button: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 15,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 20,
        alignItems: 'center',
        width: "95%",
        maxHeight: '90%',
    },
});

export { ModalTemplate }