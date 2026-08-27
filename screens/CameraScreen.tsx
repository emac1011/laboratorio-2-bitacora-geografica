import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NuevaFotografia'>;

export default function CameraScreen({ navigation }: Props) {
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionResponse | null>(null);

  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const checkPermissions = async () => {
    try {
      const locationResult =
        await Location.getForegroundPermissionsAsync();

      setLocationPermission(locationResult);

      console.log('Permisos actualizados:', {
        camera: cameraPermission?.status,
        location: locationResult.status,
      });
    } catch (error) {
      console.error('Error comprobando permisos:', error);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const requestPermissions = async () => {
    setLoadingPermissions(true);

    try {
      if (
        cameraPermission &&
        !cameraPermission.granted &&
        cameraPermission.canAskAgain
      ) {
        await requestCameraPermission();
      }

      const currentLocationPermission =
        await Location.getForegroundPermissionsAsync();

      if (
        !currentLocationPermission.granted &&
        currentLocationPermission.canAskAgain
      ) {
        await Location.requestForegroundPermissionsAsync();
      }

      await checkPermissions();
    } catch (error) {
      console.error('Error solicitando permisos:', error);
      setLoadingPermissions(false);
    }
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error('No se pudo abrir la configuración:', error);
    }
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState) => {
        if (nextAppState === 'active') {
          checkPermissions();
        }
      }
    );

    return () => {
      subscription.remove();
    };
  }, [cameraPermission]);

  if (loadingPermissions || !cameraPermission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Comprobando permisos...
        </Text>
      </View>
    );
  }

  const cameraGranted =
    cameraPermission.status === 'granted';

  const locationGranted =
    locationPermission?.status ===
    Location.PermissionStatus.GRANTED;

  const permissionsGranted =
    cameraGranted && locationGranted;

  const cameraCanAskAgain =
    cameraPermission.canAskAgain;

  const locationCanAskAgain =
    locationPermission?.canAskAgain ?? true;

  const needsSettings =
    (!cameraGranted && !cameraCanAskAgain) ||
    (!locationGranted && !locationCanAskAgain);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Nueva fotografía
      </Text>

      <Text style={styles.description}>
        La Bitácora Geográfica necesita acceso a la
        cámara y a la ubicación para registrar cada
        fotografía junto con sus coordenadas.
      </Text>

      <View style={styles.permissionCard}>
        <Text style={styles.permissionTitle}>
          📷 Cámara
        </Text>

        <Text style={styles.permissionStatus}>
          {cameraGranted
            ? 'Permiso concedido'
            : 'Permiso pendiente'}
        </Text>
      </View>

      <View style={styles.permissionCard}>
        <Text style={styles.permissionTitle}>
          📍 Ubicación
        </Text>

        <Text style={styles.permissionStatus}>
          {locationGranted
            ? 'Permiso concedido'
            : 'Permiso pendiente'}
        </Text>
      </View>

      {!permissionsGranted && (
        <>
          <Text style={styles.warning}>
            {needsSettings
              ? 'Uno o más permisos fueron rechazados y deben habilitarse desde la configuración del teléfono.'
              : 'Para tomar una fotografía geográfica debes conceder ambos permisos.'}
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={
              needsSettings
                ? openSettings
                : requestPermissions
            }
          >
            <Text style={styles.buttonText}>
              {needsSettings
                ? 'Abrir configuración'
                : 'Conceder permisos'}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {permissionsGranted && (
        <>
          <View style={styles.successCard}>
            <Text style={styles.successText}>
              ✓ Todos los permisos están concedidos
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => {
              // La cámara se implementará en el siguiente paso.
            }}
          >
            <Text style={styles.buttonText}>
              Tomar fotografía
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() =>
              navigation.navigate('MisFotografias')
            }
          >
            <Text style={styles.secondaryButtonText}>
              Ver mis fotografías
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  permissionStatus: {
    fontSize: 15,
    color: '#666',
  },
  warning: {
    fontSize: 15,
    color: '#8a5a00',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 16,
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#222',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  secondaryButtonText: {
    color: '#222',
    fontSize: 17,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
});
