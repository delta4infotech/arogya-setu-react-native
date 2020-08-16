import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, Button } from 'react-native';
import NavigationHeader from '../components/NavigationHeader';
import MapView, { Marker, Polygon, AnimatedRegion, Callout, PROVIDER_GOOGLE } from 'react-native-maps';

import * as geolib from 'geolib';

import * as Location from 'expo-location';

import { useTheme } from '../theme/ThemeManager';
import Layout from '../components/Layout';

const POLYGON = [
  { latitude: 30.730365, longitude: 76.706038 },
  { latitude: 30.794336, longitude: 76.767378 },
  { latitude: 30.726962, longitude: 76.8176 },
  { latitude: 30.691359, longitude: 76.771981 },
  { latitude: 30.683295, longitude: 76.714668 },
];

export default function Home() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { mode } = useTheme();

  let mapStyle = [];

  if (mode === 'dark') {
    mapStyle = [
      {
        elementType: 'geometry',
        stylers: [
          {
            color: '#1d2c4d',
          },
        ],
      },
      {
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#8ec3b9',
          },
        ],
      },
      {
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1a3646',
          },
        ],
      },
      {
        featureType: 'administrative.country',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4b6878',
          },
        ],
      },
      {
        featureType: 'administrative.land_parcel',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#64779e',
          },
        ],
      },
      {
        featureType: 'administrative.province',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#4b6878',
          },
        ],
      },
      {
        featureType: 'landscape.man_made',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#334e87',
          },
        ],
      },
      {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers: [
          {
            color: '#023e58',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'geometry',
        stylers: [
          {
            color: '#283d6a',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#6f9ba5',
          },
        ],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1d2c4d',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#023e58',
          },
        ],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#3C7680',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
          {
            color: '#304a7d',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#98a5be',
          },
        ],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1d2c4d',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
          {
            color: '#2c6675',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
          {
            color: '#255763',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#b0d5ce',
          },
        ],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#023e58',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#98a5be',
          },
        ],
      },
      {
        featureType: 'transit',
        elementType: 'labels.text.stroke',
        stylers: [
          {
            color: '#1d2c4d',
          },
        ],
      },
      {
        featureType: 'transit.line',
        elementType: 'geometry.fill',
        stylers: [
          {
            color: '#283d6a',
          },
        ],
      },
      {
        featureType: 'transit.station',
        elementType: 'geometry',
        stylers: [
          {
            color: '#3a4762',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
          {
            color: '#0e1626',
          },
        ],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
          {
            color: '#4e6d70',
          },
        ],
      },
    ];
  } else {
    mapStyle = [];
  }

  const mapRef = useRef(null);
  const currentMarker = useRef(null);

  const [currentLocation, setCurrentLocation] = useState({ latitude: 30.77436, longitude: 76.78064 });
  const [animatedMarker, setAnimatedMarker] = useState(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
    })
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

      let location = await Location.getCurrentPositionAsync({ latitude: 0, longitude: 0 });
      setCurrentLocation(location);
    })();
  });

  useEffect(() => {
    watchPosition();
  }, []);

  useEffect(() => {
    const condition = geolib.isPointInPolygon(currentLocation, POLYGON);
  }, [currentLocation]);

  const watchPosition = () => {
    Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 100, distanceInterval: 1 }, (data) => {
      // console.log({ latitude: data.coords.latitude, longitude: data.coords.longitude });
      setCurrentLocation({ latitude: data.coords.latitude, longitude: data.coords.longitude });

      // if (currentMarker) {
      //   currentMarker.current._component.animateMarkerToCoordinate({ latitude: data.coords.latitude, longitude: data.coords.longitude }, 500);
      // }
    });
  };

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <>
      <Layout>
        <MapView region={{ ...currentLocation }} style={styles.mapStyle} customMapStyle={mapStyle} showsUserLocation={true} showsMyLocationButton={true} showsCompass={false}>
          <Marker.Animated ref={currentMarker} coordinate={currentLocation} title='Hello'>
            <View>
              <Image source={require('../assets/me.png')} style={{ width: 40, height: 40 }} />
            </View>

            <Callout tooltip alphaHitTest style={styles.customView}>
              <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20 }}>
                <Text>{`This is a custom callout bubble view`}</Text>
                <View style={[styles.calloutButton]}>
                  <Text>Click me</Text>
                </View>
              </View>
            </Callout>
          </Marker.Animated>
          <Marker coordinate={{ latitude: 30.77794, longitude: 76.782815 }} title='Ronnie'>
            <View>
              <Image source={require('../assets/me.png')} style={{ width: 40, height: 40 }} />
            </View>

            <Callout tooltip alphaHitTest style={styles.customView}>
              <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20 }}>
                <Text>{`This is a custom callout bubble view`}</Text>
                <View style={[styles.calloutButton]}>
                  {/* <Button title='Hello' /> */}
                  <Text>Click me</Text>
                </View>
              </View>
            </Callout>
          </Marker>

          <Polygon coordinates={POLYGON} tappable={true} fillColor='rgba(255,0,0,0.1)' strokeColor='green' strokeWidth={4} />
        </MapView>

        <View style={{ position: 'absolute', bottom: 0, left: 160 }}>
          <Text style={{}}>sdasd</Text>
        </View>
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: '100%',
    zIndex: -1,
  },

  customView: {
    width: 140,
    height: 140,
    borderRadius: 20,

    overflow: 'hidden',
  },
});
