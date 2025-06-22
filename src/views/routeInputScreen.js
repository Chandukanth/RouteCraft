import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRecoilValue } from 'recoil';
import { endPointState, startPointState } from '../recoil/routeAtoms';
import { THEME_COLOR } from '../helper/colors';

export default function InputScreen() {
 
  const picking = React.useRef(null);
   const start = useRecoilValue(startPointState);
  const end = useRecoilValue(endPointState);
  const navigation = useNavigation();
 
 
  const onPick = (key) => {
    picking.current = key;
    navigation.navigate('SearchScreen', { key });
  };

  const onConfirm = async () => {
    try {
     
      navigation.navigate('MapView');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plan Your Route</Text>

      <TouchableOpacity style={styles.inputBox} onPress={() => onPick('start')}>
        <Text style={styles.label}>Start Point</Text>
        <Text style={styles.value}>
          {start?.label || 'Select starting location'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.inputBox} onPress={() => onPick('end')}>
        <Text style={styles.label}>End Point</Text>
        <Text style={styles.value}>
          {end?.label || 'Select destination'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { opacity: !start || !end ? 0.6 : 1 }]}
        onPress={onConfirm}
        disabled={!start || !end}
      >
        <Text style={styles.buttonText}>Get Route</Text>
      </TouchableOpacity>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdfdfd',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME_COLOR,
    marginBottom: 40,
    textAlign: 'center',
  },
  inputBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  button: {
    backgroundColor: THEME_COLOR,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
