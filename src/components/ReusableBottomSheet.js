import React, { useRef, useState } from 'react';
import {
    Dimensions,
    StyleSheet,
    View,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CustomBottomSheet = ({ visible, onClose, children }) => {
    const [contentHeight, setContentHeight] = useState(0);

    return (
        <Modal
            isVisible={visible}
            onBackdropPress={onClose}
            onSwipeComplete={onClose}
            swipeDirection={['down']}
            style={styles.modal}
            backdropTransitionOutTiming={0}
            animationIn="slideInUp"         
            animationInTiming={700}
            animationOut="slideOutDown"
            animationOutTiming={700}
        >
            <View style={[styles.sheet, { maxHeight: SCREEN_HEIGHT * 0.95 }]}>

                {children}

            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        overflow: 'hidden',
    },
    contentContainer: {
        maxHeight: SCREEN_HEIGHT * 0.9,
    },
});

export default CustomBottomSheet;
