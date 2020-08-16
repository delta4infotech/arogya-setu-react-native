import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFocusEffect } from '@react-navigation/native';
import Layout from '../components/Layout';

export default function Demo() {
  const doctorAnimationRef = useRef(null);

  const [pay, setPlay] = useState(false);

  useEffect(() => {
    console.log('Focused');
    setPlay(false);

    setTimeout(() => {
      setPlay(true);
    }, 4000);
  }, []);

  return (
    <Layout>
      <View style={{ flex: 1 }}>
        {pay ? (
          <LottieView
            // ref={doctorAnimationRef}
            style={{
              width: 100,
              height: 100,
              marginTop: 200,
            }}
            autoPlay={true}
            loop={true}
            source={require('../assets/covidVirus.json')}
          />
        ) : null}
      </View>
    </Layout>
  );
}
