import React from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSetRecoilState } from 'recoil';
import { useFocusEffect } from '@react-navigation/native';
import { BackHandler } from 'react-native';
import { endPointState, startPointState, tabIndexState } from '../recoil/routeAtoms';
import { THEME_COLOR } from '../helper/colors';

export default function SearchScreen({ navigation, route }) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const setStart = useSetRecoilState(startPointState);
  const setEnd = useSetRecoilState(endPointState);
  const setIndex = useSetRecoilState(tabIndexState);

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

  const fetchPlaces = async (q) => {
    setLoading(true);
    try {
      const url = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(q)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
      const res = await axios.get(url);
      setResults(res.data.results || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    if (query.length > 2) {
      const timeout = setTimeout(() => fetchPlaces(query), 300);
      return () => clearTimeout(timeout);
    } else {
      setResults([]);
    }
  }, [query]);

  const onSelect = (item) => {
    const selected = {
      label: item.ADDRESS,
      lat: parseFloat(item.LATITUDE),
      lng: parseFloat(item.LONGITUDE),
    };

    if (route.params.key === 'start') {
      setStart(selected);
    } else {
      setEnd(selected);
    }
    setIndex(1)
    navigation.navigate('MapScreen');
  };


  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <TextInput
          placeholder="Search location..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        {loading && <ActivityIndicator style={{ marginTop: 16 }} color={THEME_COLOR} />}

        <FlatList
          data={results}
          keyExtractor={(item) => item.LATITUDE + item.LONGITUDE}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
              <Text style={styles.cardTitle}>{item.ADDRESS}</Text>
              <Text style={styles.cardSubtitle}>Lat: {item.LATITUDE}, Lng: {item.LONGITUDE}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fdfdfd',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#111',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  cardSubtitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },
});
