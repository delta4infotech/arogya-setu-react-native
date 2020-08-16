import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
import Layout from '../components/Layout';

MapboxGL.setAccessToken('pk.eyJ1Ijoic2FoaWw1OTYzIiwiYSI6ImNrYnE3NG9raDFxYmwydHI1MHZudnkyczAifQ.zRTtDLcR9ffxBp0BAcwY5Q');

// MapboxGL.setConnected(true);

export default function MapBox() {
  useEffect(() => {}, []);

  return (
    <Layout>
      <View style={{ flex: 1 }}>
        <MapboxGL.MapView style={{ flex: 1 }} />
      </View>
    </Layout>
  );
}
