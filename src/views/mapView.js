import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { startPointState, endPointState, tabIndexState } from '../recoil/routeAtoms';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function MapScreen() {
  const start = useRecoilValue(startPointState);
  const end = useRecoilValue(endPointState);
  const setIndex = useSetRecoilState(tabIndexState);

  const [coordinates, setCoordinates] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation()

  const mapRef = useRef(null);

   useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        setIndex(1); 
        navigation.navigate('MapScreen'); 
        return true; 
      };
  
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
  
      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        if (start && end) {
          const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
          const res = await fetch(url);
          const json = await res.json();

          const routeCoords = json.routes[0].geometry.coordinates.map(([lng, lat]) => ({
            latitude: lat,
            longitude: lng,
          }));

          setCoordinates(routeCoords);
          setDistance((json.routes[0].distance / 1000).toFixed(2)); // km
          setDuration((json.routes[0].duration / 60).toFixed(1));   // minutes

          setTimeout(() => {
            mapRef.current?.fitToCoordinates(routeCoords, {
              edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
              animated: true,
            });
          }, 500);
        }
      } catch (err) {
        console.error('Failed to fetch route:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [start, end]);

  if (loading || !start || !end) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={null}
        ref={mapRef}
        style={styles.map}
      >
        <Marker coordinate={{ latitude: start.lat, longitude: start.lng }} title="Start" />
        <Marker coordinate={{ latitude: end.lat, longitude: end.lng }} title="End" />
        <Polyline coordinates={coordinates} strokeColor="#1e90ff" strokeWidth={4} />
      </MapView>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>🛣 Distance: {distance} km</Text>
        <Text style={styles.infoText}>⏱ Duration: {duration} min</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
  },
  infoText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
  },
});
