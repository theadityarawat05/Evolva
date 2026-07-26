import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ChatScreen from './src/screens/ChatScreen';
import { RootStackParamList } from './src/navigation/types';
import { theme } from './src/theme/theme';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: { fontWeight: '600' },
          cardStyle: { backgroundColor: theme.colors.background }
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ title: 'Transmission' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
