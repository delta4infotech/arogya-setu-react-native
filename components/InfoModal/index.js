import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Easing, StatusBar, TouchableNativeFeedback, Dimensions, Animated } from 'react-native';

import { useTheme } from '../../theme/ThemeManager';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

export default function InfoModal({ open, onClose, ...props }) {
  const { theme, mode } = useTheme();

  const [anim] = useState(new Animated.Value(0));

  const openModal = () => {
    Animated.spring(anim, {
      toValue: 1,
    }).start();
  };
  const closeModal = () => {
    console.log('Closing modal');
    Animated.timing(anim, {
      toValue: 0,
      duration: 900,
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
    }).start();
    onClose();
  };

  useEffect(() => {
    if (open) {
      openModal();
    }
  }, [open]);

  const infoText = {
    color: theme.greyText1,
    marginBottom: 6,
  };

  return (
    <View style={{ position: 'absolute', height: '100%', width: WIDTH }}>
      <Animated.View
        style={{
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.4)',
          position: 'absolute',
          height: '100%',
          width: WIDTH,
          top: 0,
          left: 0,
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 0.02, 1], outputRange: [HEIGHT + 100, 0, 0] }) }],
        }}
      >
        <TouchableOpacity onPress={() => closeModal()}>
          <View style={{ height: HEIGHT, width: WIDTH }}></View>
        </TouchableOpacity>

        <Animated.View
          style={{
            width: 300,
            backgroundColor: theme.paper,
            transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
            opacity: anim,
            borderRadius: 20,
            position: 'absolute',
            left: (WIDTH - 300) / 2,
            top: (HEIGHT - 200) / 2,
            padding: 30,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primaryText, marginBottom: 10 }}>Instructions </Text>

          <View style={{ marginBottom: 10 }}>
            <Text style={[classes.infoText, infoText]}>Mark the area by tapping </Text>
            <Text style={[classes.infoText, infoText]}>Move the added point by holding upon that point </Text>
            <Text style={[classes.infoText, infoText]}>Delete last pointed marker using the minus sign in the right</Text>
          </View>
          <View style={{ borderRadius: 100, overflow: 'hidden' }}>
            <TouchableNativeFeedback onPress={() => closeModal()}>
              <View style={{ backgroundColor: theme.blue, borderRadius: 100, padding: 14, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>I've got it !</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const classes = StyleSheet.create({});
