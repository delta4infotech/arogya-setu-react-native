import React, { useEffect } from 'react';
import { Button, View, ActivityIndicator } from 'react-native';
import { useTheme } from '../../theme/ThemeManager';
import Logo from '../Svg/logoText';

export default function AuthLoading() {
  const { theme } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Logo size={50} color={theme.primaryText} />
    </View>
  );
}
