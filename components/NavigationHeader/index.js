import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useTheme } from '../../theme/ThemeManager';

import { useNavigation } from '@react-navigation/native';

export default function NavigatorHeader() {
  const navigation = useNavigation();

  const { mode, theme, toggle } = useTheme();

  return (
    <>
      <View style={{ position: 'absolute', left: 20, top: 40, height: 50, width: 50, zIndex: 100 }}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <View style={{ height: 50, width: 50, backgroundColor: mode === 'dark' ? '#fff' : '#000', borderRadius: 25, elevation: 5, alignItems: 'center', justifyContent: 'center' }}>
            <Entypo name='menu' size={24} color={theme.paper} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ position: 'absolute', right: 20, top: 50, zIndex: 100 }}>
        <Switch thumbColor={theme.primaryText} trackColor={{ false: '#fff', true: theme.blue }} style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }] }} ios_backgroundColor='#3e3e3e' onValueChange={toggle} value={mode === 'dark'} />
      </View>
    </>
  );
}
