import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { GameSession } from '../types/game';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Config: undefined;
  ModeSelect: undefined;
  Game: undefined;
  Results: { session: GameSession };
  History: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;
