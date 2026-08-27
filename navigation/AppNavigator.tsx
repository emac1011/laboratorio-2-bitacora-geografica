import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';

export type RootStackParamList = {
  NuevaFotografia: undefined;
  MisFotografias: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function NuevaFotografiaPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva fotografía</Text>
      <Text style={styles.text}>
        Aquí podremos tomar una fotografía y obtener las coordenadas GPS.
      </Text>
    </View>
  );
}

function MisFotografiasPlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis fotografías</Text>
      <Text style={styles.text}>
        Aquí aparecerán las fotografías tomadas.
      </Text>
    </View>
  );
}

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
          component={NuevaFotografiaPlaceholder}
          options={{
            title: 'Nueva fotografía',
          }}
        />

        <Stack.Screen
          name="MisFotografias"
          component={MisFotografiasPlaceholder}
          options={{
            title: 'Mis fotografías',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});
