import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useTheme } from '../../theme/ThemeManager';

export default function Divider(props) {
  const { theme, mode } = useTheme();

  return <View style={[{ backgroundColor: mode === 'dark' ? '#2A2A2A' : '#EBEBEB', height: 1, width: '100%' }, props.style]}></View>;
}
