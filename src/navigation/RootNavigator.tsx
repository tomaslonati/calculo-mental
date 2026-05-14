import { DarkTheme, NavigationContainer, Theme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../constants/theme';
import { ConfigScreen } from '../screens/ConfigScreen';
import { GameScreen } from '../screens/GameScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ModeSelectScreen } from '../screens/ModeSelectScreen';
import { ResultsScreen } from '../screens/ResultsScreen';
import { SplashScreen } from '../screens/SplashScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.accent,
    notification: colors.secondary,
  },
};

export const RootNavigator = () => {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Config" component={ConfigScreen} />
        <Stack.Screen name="ModeSelect" component={ModeSelectScreen} />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{ animation: 'fade' }}
        />
        <Stack.Screen
          name="Results"
          component={ResultsScreen}
          options={{ animation: 'fade_from_bottom' }}
        />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
