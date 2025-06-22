import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import { THEME_COLOR } from '../helper/colors';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('MapScreen');
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation="zoomIn"
        duration={1200}
        style={styles.logoBox}
        easing="ease-out"
      >
        <Text style={styles.logoText}>📍 RouteCraft</Text>
      </Animatable.View>

      <Animatable.Text
        animation="fadeInUp"
        delay={1000}
        duration={1000}
        style={styles.subText}  
      >
        Navigating Smarter
      </Animatable.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 100,
    elevation: 8,
  },
  logoText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: THEME_COLOR,
  },
  subText: {
    marginTop: 20,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
