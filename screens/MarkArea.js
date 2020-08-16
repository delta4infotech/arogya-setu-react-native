import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Animated, Easing } from 'react-native';
import Layout from '../components/Layout';
import MapView, { Marker, Polygon, AnimatedRegion, Callout, PROVIDER_GOOGLE, Heatmap, Circle } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeManager';
import { Entypo, FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import LottieView from 'lottie-react-native';
import MapViewDirections from 'react-native-maps-directions';

import BottomSheet from 'reanimated-bottom-sheet';

import MapStyles from '../MapStyles';

import Virus1 from '../components/Svg/Virus1';

import InfoModal from '../components/InfoModal';

import Doctor1 from '../components/Svg/Doctor1';

import * as MARKERS from '../contsatnts/locations';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
const INITIAL_REGION = { latitude: 30.73928401748803, latitudeDelta: 0.3901870576383999, longitude: 76.76073247566819, longitudeDelta: 0.22698495537042618 };

let FENCE_ID = 0;

export default function MapScreen(props) {
  const { mode, theme } = useTheme();

  const [infoModalOpen, setInfoModalOpen] = useState(true);
  const [fencePoints, setFencePoints] = useState([]);
  const [polygonPoints, setPolygonPoints] = useState([]);

  const [doctor1Anim] = useState(new Animated.Value(0));

  const mapRef = useRef(null);
  const bottomSheet = useRef(null);

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

  const onMapPress = (cord) => {
    console.log(cord.nativeEvent.coordinate);
    const fencePoint = { id: JSON.stringify(cord.nativeEvent.coordinate), cords: { ...cord.nativeEvent.coordinate } };
    setFencePoints((fence) => [...fence, fencePoint]);
  };
  const onPoiClick = (point) => {
    const fencePoint = { id: JSON.stringify(point.nativeEvent.coordinate), cords: { ...point.nativeEvent.coordinate } };
    setFencePoints((fence) => [...fence, fencePoint]);
  };

  const onFencePointMove = (data) => {
    let newFence = [...fencePoints];
    const index = fencePoints.findIndex((item) => item.id === data.id);
    console.log(index);
    newFence[index].cords = { ...data.coordinate };
    setFencePoints(newFence);
  };

  const removePoint = () => {
    const arr = [...fencePoints];
    arr.pop();

    setFencePoints(arr);
  };
  const onRegionChange = (e) => {
    // console.log(e);
    //"latitude": 30.71082920664371, "latitudeDelta": 0.07580919073083336, "longitude": 76.77174646407366, "longitudeDelta": 0.05308225750923157

    if (e.longitudeDelta < 0.07978934794664383) {
      Animated.timing(doctor1Anim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      }).start();
    } else {
      doctor1Anim.setValue(0);
    }
  };

  useEffect(() => {
    const points = fencePoints.map((item) => {
      return {
        latitude: item.cords.latitude,
        longitude: item.cords.longitude,
      };
    });

    setPolygonPoints(points);
    console.log(polygonPoints);
  }, [fencePoints.length > 0]);

  return (
    <Layout>
      <View style={styles.root}>
        <MapView
          showsPointsOfInterest={false}
          style={styles.mapStyle}
          showsUserLocation={true}
          customMapStyle={mode === 'dark' ? MapStyles.dark : []}
          showsCompass={false}
          ref={mapRef}
          onPress={onMapPress}
          onPoiClick={onPoiClick}
          initialRegion={INITIAL_REGION}
          onRegionChangeComplete={onRegionChange}
        >
          {startPoint ? <Marker coordinate={startPoint} title='Hello' /> : null}
          {fencePoints.map((item) => {
            return <Marker coordinate={item.cords} title={item.title} draggable onDragEnd={(e) => onFencePointMove({ id: item.id, ...e.nativeEvent })} />;
          })}
          {fencePoints.length > 2 ? (
            <Polygon
              fillColor={mode === 'dark' ? 'rgba(255, 255, 255,0.4)' : 'rgba(0,0,0,0.4)'}
              coordinates={fencePoints.map((item) => {
                return { latitude: item.cords.latitude, longitude: item.cords.longitude };
              })}
            />
          ) : null}
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
          <Circle center={{ latitude: 30.689235, longitude: 76.766459 }} radius={800} fillColor='rgba(248,255,42,0.2)' />
          <Circle center={{ latitude: 30.70061, longitude: 76.697099 }} radius={800} fillColor='rgba(248,255,42,0.2)' />

          {/* Rendering Doctors */}

          {MARKERS.doctors.map((item, i) => {
            return (
              <Marker coordinate={{ latitude: item.latitude, longitude: item.longitude }} title={item.title}>
                <View style={{ height: 60, width: 80, paddingLeft: 10 }}>
                  <Animated.View
                    style={{
                      opacity: doctor1Anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
                      transform: [{ translateY: doctor1Anim.interpolate({ inputRange: [0, 1], outputRange: [12, 8] }) }, { scale: doctor1Anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }],
                    }}
                  >
                    <Doctor1 size={40} />
                  </Animated.View>
                </View>
              </Marker>
            );
          })}
        </MapView>

        <View style={{ position: 'absolute', right: 20, top: 200, backgroundColor: '#fff', borderRadius: 300 }}>
          <TouchableOpacity style={{}} onPress={removePoint}>
            <View style={{ backgroundColor: theme.blue, width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marBottom: 10 }}>
              <Entypo name='minus' size={32} color='#fff' />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={() => setInfoModalOpen(true)}>
            <View style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', marBottom: 10 }}>
              <FontAwesome name='question' size={24} color='#000' />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ position: 'absolute', bottom: 20, left: 10 }}>
          <TouchableOpacity onPress={getMyLocation}>
            <View style={{ backgroundColor: theme.blue, height: 60, width: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons name='my-location' size={22} color='#fff' />
            </View>
          </TouchableOpacity>
        </View>

        {fencePoints.length > 2 ? (
          <View style={{ position: 'absolute', bottom: 20, right: 20 }}>
            <TouchableOpacity onPress={() => props.navigation.navigate('Map')}>
              <View style={{ backgroundColor: theme.green, borderRadius: 60, height: 60, width: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                <FontAwesome5 name='check' size={24} color='#fff' />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <InfoModal open={infoModalOpen} onClose={() => setInfoModalOpen(false)} />
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
});
