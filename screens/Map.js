import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Animated as Animated2 } from 'react-native';
import Layout from '../components/Layout';
import MapView, { Marker, Polygon, AnimatedRegion, Callout, PROVIDER_GOOGLE, Heatmap, Circle } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeManager';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import MapViewDirections from 'react-native-maps-directions';

import BottomSheet from 'reanimated-bottom-sheet';

import Animated from 'react-native-reanimated';
import MapStyles from '../MapStyles';

import Virus1 from '../components/Svg/Virus1';
import { FontAwesome5 } from '@expo/vector-icons';

import { useN } from '@react-navigation/native';

import PersonAvatar from '../components/PersonAvatar';
import Divider from '../components/Divider';

import * as Persons from '../contsatnts/Persons';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

let FENCE_ID = 0;

const INITIAL_REGION = { latitude: 30.731936865251257, latitudeDelta: 0.19510874325650462, longitude: 76.76743363961577, longitudeDelta: 0.1366468146443509 };

export default function MapScreen(props) {
  const { mode, theme } = useTheme();

  const [bottomSheetAnim] = useState(new Animated.Value(1));
  const [sheetContentAnim] = useState(new Animated2.Value(0));
  const [markerAnim] = useState(new Animated2.Value(0));

  const [pointInfo, setPointInfo] = useState({});
  const [fetchingPoint, setFetchingPoint] = useState(false);

  const [fencePoints, setFencePoints] = useState([]);
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [displayDoctors, setDisplayDoctors] = useState(false);

  const mapRef = useRef(null);
  const bottomSheet = useRef(null);
  const doctorAnimationRef = useRef(null);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [startPoint, setStartPoint] = useState(null);

  const getMyLocation = async () => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      return;
    }
    let location = await Location.getCurrentPositionAsync({ accuracy: 3, timeout: 10000 });
    mapRef.current.animateCamera({ center: { latitude: location.coords.latitude, longitude: location.coords.longitude }, zoom: 18 }, { duration: 1400 });
  };

  const onRegionChange = (e) => {
    if (e.longitudeDelta < 0.15) {
      setDisplayDoctors(true);
    } else {
      setDisplayDoctors(false);
    }
  };

  const onBottomSheetScroll = (e) => {
    bottomSheet.current.snapTo(0);
    console.log(e.nativeEvent.contentOffset.y);
  };

  const renderShadow = () => {
    const animatedShadowOpacity = Animated.interpolate(bottomSheetAnim, {
      inputRange: [0, 0.5],
      outputRange: [0.1, 0],
    });

    return (
      <Animated.View
        pointerEvents='none'
        style={[
          {
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: animatedShadowOpacity,
            backgroundColor: '#000',
          },
        ]}
      ></Animated.View>
    );
  };

  const onAreaPress = () => {
    setFetchingPoint(true);
    bottomSheet.current.snapTo(1);
    sheetContentAnim.setValue(0);
    setTimeout(() => {
      setFetchingPoint(false);

      Animated2.timing(sheetContentAnim, {
        duration: 600,
        toValue: 1,
      }).start();
    }, 3000);
  };

  const sheetContent = {
    opacity: sheetContentAnim,
    transform: [
      {
        translateY: sheetContentAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }),
      },
    ],
  };

  useEffect(() => {
    if (displayDoctors) {
      Animated2.loop(
        Animated2.sequence([
          Animated2.timing(markerAnim, {
            toValue: 1,
            duration: 2000,
          }),
          Animated2.timing(markerAnim, {
            toValue: 0,
            duration: 2000,
          }),
        ])
      ).start();
    } else {
      markerAnim.setValue(0);
    }
  }, [displayDoctors]);

  return (
    <Layout>
      <View style={styles.root}>
        <MapView
          style={styles.mapStyle}
          showsUserLocation={true}
          customMapStyle={mode === 'dark' ? MapStyles.dark : []}
          showsCompass={false}
          ref={mapRef}
          onRegionChangeComplete={onRegionChange}
          initialRegion={INITIAL_REGION}
          showsMyLocationButton={false}
        >
          {startPoint ? <Marker coordinate={startPoint} title='Hello' /> : null}

          <Heatmap
            points={[
              { latitude: 30.78277, longitude: 76.79938, weight: 300 },
              { latitude: 30.763434, longitude: 76.79411, weight: 100 },
            ]}
            radius={40}
            opacity={0.7}
          />
          <Heatmap
            points={[
              { latitude: 29.411199, longitude: 78.750891, weight: 400 },
              { latitude: 28.87394, longitude: 80.369019, weight: 100 },
            ]}
            radius={40}
            opacity={0.7}
          />
          <Heatmap
            points={[
              { latitude: 29.411199, longitude: 78.750891, weight: 400 },
              { latitude: 28.87394, longitude: 80.369019, weight: 100 },
              { latitude: 11.059821, longitude: 78.387451, weight: 100 },
              { latitude: 17.123184, longitude: 79.208824, weight: 200 },
              { latitude: 29.065773, longitude: 76.040497, weight: 100 },
              { latitude: 25.794033, longitude: 78.116531, weight: 100 },
              { latitude: 19.601194, longitude: 75.552979, weight: 300 },
              { latitude: 23.745127, longitude: 91.746826, weight: 100 },
              { latitude: 17.874857, longitude: 78.100815, weight: 100 },
              { latitude: 11.127123, longitude: 78.656891, weight: 300 },
              { latitude: 28.6448, longitude: 77.216721, weight: 100 },
              { latitude: 27.391277, longitude: 73.432617, weight: 300 },
              { latitude: 32.084206, longitude: 77.571167, weight: 300 },
              { latitude: 22.978624, longitude: 87.747803, weight: 100 },
              { latitude: 15.317277, longitude: 75.71389, weight: 200 },
              { latitude: 25.989836, longitude: 79.450035, weight: 100 },
              { latitude: 23.223047, longitude: 82.87056, weight: 100 },
              { latitude: 22.422455, longitude: 85.760651, weight: 100 },
              { latitude: 23.597969, longitude: 72.969818, weight: 300 },
              { latitude: 25.369179, longitude: 85.53006, weight: 300 },
            ]}
            radius={40}
            opacity={0.7}
          />

          <Circle center={{ latitude: 30.742168, longitude: 76.761427 }} radius={1200} fillColor='rgba(255,0,0,0.2)' />
          <Circle center={{ latitude: 30.704647, longitude: 76.789292 }} radius={800} fillColor='rgba(248,255,42,0.2)' />

          <Circle center={{ latitude: 30.70061, longitude: 76.697099 }} radius={800} fillColor='rgba(248,255,42,0.2)' />

          {displayDoctors ? (
            <>
              <Marker coordinate={{ latitude: 30.742168, longitude: 76.761427 }} anchor={{ x: 0.5, y: 0.5 }} onPress={onAreaPress}>
                <View>
                  <LottieView
                    style={{
                      width: 100,
                      height: 100,
                    }}
                    autoPlay={true}
                    loop={true}
                    source={require('../assets/covidVirus.json')}
                  />
                </View>
              </Marker>
              <Marker.Animated coordinate={{ latitude: 30.740861, longitude: 76.718234 }}>
                {/* <View style={{ height: 20, width: 20, borderRadius: 120, backgroundColor: theme.blue }} /> */}

                <View style={{ height: 120, width: 120, borderRadius: 200, overflow: 'hidden' }}>
                  <Animated2.View
                    style={[
                      {
                        height: 20,
                        width: 20,
                        left: 50,
                        top: 50,
                        backgroundColor: theme.blue,
                        borderRadius: 300,
                        opacity: markerAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }),
                        transform: [{ scale: markerAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 6] }) }],
                      },
                    ]}
                  ></Animated2.View>
                  <View style={{ height: 14, width: 14, backgroundColor: theme.blue, borderRadius: 40, left: 55, top: 33 }} />
                </View>
              </Marker.Animated>

              <Marker.Animated coordinate={{ latitude: 30.689235, longitude: 76.766459 }}>
                <View style={{ height: 120, width: 120, borderRadius: 200, overflow: 'hidden' }}>
                  <Animated2.View
                    style={[
                      {
                        height: 20,
                        width: 20,
                        left: 50,
                        top: 50,
                        backgroundColor: theme.red,
                        borderRadius: 300,
                        opacity: markerAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 0.4] }),
                        transform: [{ scale: markerAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 4] }) }],
                      },
                    ]}
                  ></Animated2.View>
                  <View style={{ height: 14, width: 14, backgroundColor: theme.red, borderRadius: 40, left: 55, top: 33 }} />
                </View>
              </Marker.Animated>
            </>
          ) : null}
        </MapView>

        <View style={{ position: 'absolute', bottom: 20, left: 10 }}>
          <TouchableOpacity onPress={getMyLocation}>
            <View style={{ backgroundColor: theme.blue, height: 50, width: 50, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name='my-location' size={24} color='#fff' />
            </View>
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', bottom: 20, right: 10 }}>
          <TouchableOpacity onPress={() => props.navigation.navigate('MarkMap')}>
            <View style={{ backgroundColor: theme.blue, borderRadius: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingVertical: 12, paddingHorizontal: 20 }}>
              <FontAwesome name='bookmark' size={20} color='#fff' />
              <Text style={{ color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 15 }}> Mark Locations</Text>
            </View>
          </TouchableOpacity>
        </View>

        <BottomSheet
          snapPoints={['60%', 260, 0]}
          initialSnap={2}
          ref={bottomSheet}
          renderContent={() => (
            <View style={{ height: '100%', width: '100%', backgroundColor: theme.paper }}>
              <ScrollView onScroll={onBottomSheetScroll} overScrollMode='never'>
                {fetchingPoint ? (
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <LottieView
                      style={{
                        width: 260,
                        height: 260,
                      }}
                      autoPlay
                      loop
                      source={require('../assets/handWashing.json')}
                    />
                  </View>
                ) : (
                  <Animated2.View style={[{ padding: 20 }, sheetContent]}>
                    <Text style={{ color: theme.primaryText, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Sector 24 - Sector 34 , Chandigarh </Text>
                    <Text style={{ color: theme.greyText1, marginBottom: 16 }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has </Text>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                      <View style={[{ backgroundColor: theme.red }, styles.figureBox]}>
                        <Text style={[{ color: '#fff' }, styles.figureNumber]}>12</Text>
                        <Text style={{ color: '#fff', fontSize: 14 }}>Positive</Text>
                      </View>
                      <View style={[{ backgroundColor: '#FFCBCE' }, styles.figureBox]}>
                        <Text style={[{ color: '#000' }, styles.figureNumber]}>20</Text>
                        <Text style={{ color: '#000', fontSize: 14 }}>Qurantined</Text>
                      </View>
                      <View style={[{ backgroundColor: '#F6F6F6' }, styles.figureBox]}>
                        <Text style={[{ color: '#000' }, styles.figureNumber]}>12</Text>
                        <Text style={{ color: '#000', fontSize: 14 }}>Recovered</Text>
                      </View>
                    </View>
                    <Divider style={{ marginBottom: 14 }} />

                    <Text style={{ color: theme.primaryText, fontWeight: 'bold', marginBottom: 10 }}>QURANTINED</Text>
                    <ScrollView horizontal={true} style={{ marginHorizontal: -20 }} bounces={false} showsHorizontalScrollIndicator={false} overScrollMode='never'>
                      <View style={{ flexDirection: 'row' }}>
                        {Persons.quarantined.map((item, i) => {
                          return (
                            <View style={[styles.personAvatar, { marginLeft: i === 0 ? 20 : 0, marginRight: i === Persons.positive.length - 1 ? 20 : 8 }]}>
                              <PersonAvatar name={item.name} image={item.image} />
                            </View>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </Animated2.View>
                )}
              </ScrollView>
            </View>
          )}
          renderHeader={() => (
            <View style={{ backgroundColor: theme.paper, height: 40, borderTopRightRadius: 40, borderTopLeftRadius: 40, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ height: 6, width: 80, backgroundColor: theme.primaryText, marginVertical: 10, borderRadius: 100 }} />
            </View>
          )}
          enabledInnerScrolling
          enabledContentGestureInteraction={false}
          enabledBottomClamp={true}
          callbackThreshold={0.2}
          callbackNode={bottomSheetAnim}
        />
        {renderShadow()}
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  mapStyle: {
    flex: 1,
  },
  figureBox: {
    alignItems: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 200,
    height: 100,
    width: 100,
  },
  figureNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 4,
  },
  figureLabel: {},
  personAvatar: {
    marginRight: 8,
    paddingHorizontal: 6,
  },
});
