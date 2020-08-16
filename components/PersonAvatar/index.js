import React, { useEffect } from 'react';
import { Button, View, Text, ActivityIndicator, Image } from 'react-native';
import { useTheme } from '../../theme/ThemeManager';

export default function PersonAvatar({ image, name, ...props }) {
  const { theme } = useTheme();

  return (
    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
      <Image source={image} style={{ height: 70, width: 70, borderRadius: 200, marginBottom: 8 }} resizeMode='cover' />
      <Text style={{ color: theme.primaryText, fontSize: 10 }}>{name}</Text>
    </View>
  );
}
