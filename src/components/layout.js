import * as React from 'react';
import { View, useWindowDimensions, StyleSheet } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRecoilState } from 'recoil';
// Screens
import MapScreen from '../views/mapScreen';
import InputScreen from '../views/routeInputScreen';
import BottomSheetScreen from '../views/bottomsheetscreen';
import { tabIndexState } from '../recoil/routeAtoms';
import { THEME_COLOR } from '../helper/colors';

const renderScene = SceneMap({
  first: MapScreen,
  second: InputScreen,
  third: BottomSheetScreen,
});

const renderTabBar = props => (
  <TabBar
    {...props}
    style={styles.tabBar}
    indicatorStyle={styles.indicator}
    labelStyle={styles.label}
  />
);

export default function TabViewExample() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useRecoilState(tabIndexState);

  const [routes] = React.useState([
    { key: 'first', title: 'Route Drawing' },
    { key: 'second', title: 'Place Finder' },
    { key: 'third', title: 'Bottom Sheet' },
  ]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME_COLOR,
  },
  tabView: {
    backgroundColor: 'black',
  },
  tabBar: {
    backgroundColor: THEME_COLOR,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
  },
  indicator: {
    backgroundColor: 'white',
  },
  scene: {
    flex: 1,
    backgroundColor: 'black',
  },
});
