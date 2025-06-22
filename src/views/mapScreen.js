import React, { useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { STORAGE_KEY } from '../helper/AsyncStorage';
import { useRecoilValue } from 'recoil';
import { tabIndexState } from '../recoil/routeAtoms';


export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [path, setPath] = useState([]);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const watchSubscription = useRef(null);
  const indexValue = useRecoilValue(tabIndexState)

  // Load saved path
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) setPath(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved path', e);
      }
    })();
  }, [indexValue]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required.');
        return;
      }

      if (Platform.OS === 'android') {
        await Location.requestBackgroundPermissionsAsync();
      }

      const current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
      setPath((prev) => [...prev, current.coords]);
      setLoading(false);

      watchSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          const newCoord = loc.coords;
          setLocation(newCoord);
          setPath((prev) => {
            const updated = [...prev, newCoord];
            AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
          });

          mapRef.current?.animateCamera({
            center: {
              latitude: newCoord.latitude,
              longitude: newCoord.longitude,
            },
            zoom: 16,
          });
        }
      );
    })();

    return () => {
      // Clean up watcher
      if (watchSubscription.current) {
        watchSubscription.current.remove();
      }
    };
  }, [indexValue]);

  // Re-center map on focus
  useFocusEffect(
    React.useCallback(() => {
      if (location && mapRef.current) {
        mapRef.current.animateCamera({
          center: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
          zoom: 16,
        });
      }
    }, [location, indexValue])
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={null}
        showsUserLocation
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {path.length > 0 && (
          <Polyline coordinates={path} strokeColor="blue" strokeWidth={4} />
        )}
        {location && <Marker coordinate={location} />}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
