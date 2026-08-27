import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CameraScreen from '../screens/CameraScreen';
import GalleryScreen from '../screens/GalleryScreen';

export type RootStackParamList = {
  NuevaFotografia: undefined;
  MisFotografias: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="NuevaFotografia"
        screenOptions={{
          headerTitleAlign: 'center',
        }}
      >
        <Stack.Screen
          name="NuevaFotografia"
          component={CameraScreen}
          options={{
            title: 'Nueva fotografía',
          }}
        />

        <Stack.Screen
          name="MisFotografias"
          component={GalleryScreen}
          options={{
            title: 'Mis fotografías',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
