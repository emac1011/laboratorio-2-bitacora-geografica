import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
import * as Location from 'expo-location';
import { usePhotos } from '../context/PhotoContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'NuevaFotografia'>;

export default function CameraScreen({ navigation }: Props) {
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionResponse | null>(null);

  const [loadingPermissions, setLoadingPermissions] = useState(true);

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const [capturing, setCapturing] = useState(false);

  const [captureError, setCaptureError] = useState<string | null>(
    null
  );

  const cameraRef = useRef<CameraView>(null);

  const { addPhoto } = usePhotos();

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

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) {
      return;
    }

    setCapturing(true);
    setCaptureError(null);

    try {
      const currentLocationPermission =
        await Location.getForegroundPermissionsAsync();

      if (!currentLocationPermission.granted) {
        setCaptureError(
          'No se puede tomar la fotografía porque el permiso de ubicación no está disponible.'
        );
        return;
      }

      const location =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const photo =
        await cameraRef.current.takePictureAsync();

      if (!photo?.uri) {
        setCaptureError(
          'No se pudo obtener la fotografía.'
        );
        return;
      }

      addPhoto(
        photo.uri,
        location.coords.latitude,
        location.coords.longitude
      );

      setPhotoUri(photo.uri);
    } catch (error) {
      console.error(
        'Error tomando fotografía con GPS:',
        error
      );

      setCaptureError(
        'No se pudo tomar la fotografía con su ubicación. Intenta nuevamente.'
      );
    } finally {
      setCapturing(false);
    }
  };

  const retakePhoto = () => {
    setPhotoUri(null);
    setCaptureError(null);
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
      <View style={styles.centerContainer}>
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

  if (!permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
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
      </View>
    );
  }

  if (photoUri) {
    return (
      <View style={styles.photoContainer}>
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          resizeMode="cover"
        />

        <View style={styles.photoActions}>
          <Text style={styles.photoTitle}>
            Fotografía capturada
          </Text>

          <Text style={styles.gpsSuccess}>
            ✓ Fotografía guardada con coordenadas GPS
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={retakePhoto}
          >
            <Text style={styles.buttonText}>
              Tomar otra fotografía
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
        </View>
      </View>
    );
  }

  return (
    <View style={styles.cameraContainer}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="back"
      />

      <View style={styles.cameraOverlay}>
        <Text style={styles.cameraTitle}>
          Nueva fotografía
        </Text>

        {captureError && (
          <Text style={styles.captureError}>
            {captureError}
          </Text>
        )}

        <TouchableOpacity
          style={styles.captureButton}
          onPress={takePhoto}
          disabled={capturing}
        >
          {capturing ? (
            <ActivityIndicator size="large" />
          ) : (
            <Text style={styles.captureButtonText}>
              📸
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cameraTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  captureButton: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: '#ddd',
  },
  captureButtonText: {
    fontSize: 32,
  },
  photoContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  photo: {
    flex: 1,
    width: '100%',
  },
  photoActions: {
    padding: 20,
    backgroundColor: '#fff',
  },
  photoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  gpsSuccess: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
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
  captureError: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginHorizontal: 20,
    marginBottom: 15,
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
