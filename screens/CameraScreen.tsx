import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NuevaFotografia'>;

export default function CameraScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.preview}>
        <Text style={styles.previewText}>
          La cámara aparecerá aquí
        </Text>
      </View>

      <Text style={styles.title}>Nueva fotografía</Text>

      <Text style={styles.info}>
        En este espacio podremos tomar una fotografía,
        obtener las coordenadas GPS y agregar una descripción.
      </Text>

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Tomar fotografía</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('MisFotografias')}
      >
        <Text style={styles.secondaryButtonText}>
          Ver mis fotografías
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  preview: {
    width: '100%',
    height: 280,
    backgroundColor: '#d9d9d9',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  previewText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  info: {
    fontSize: 16,
    lineHeight: 23,
    textAlign: 'center',
    color: '#555',
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#222',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#222',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
