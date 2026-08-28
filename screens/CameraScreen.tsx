import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'NuevaFotografia'
>;

export default function CameraScreen({ navigation }: Props) {
  const [cameraPermission, requestCameraPermission] =
    useCameraPermissions();

  const [locationPermission, setLocationPermission] =
    useState<Location.PermissionResponse | null>(null);

  const [loadingPermissions, setLoadingPermissions] =
    useState(true);

  const [photoUri, setPhotoUri] =
    useState<string | null>(null);

  const [description, setDescription] =
    useState('');

  const [savedDescription, setSavedDescription] =
    useState('');

  const [savedLatitude, setSavedLatitude] =
    useState<number | null>(null);

  const [savedLongitude, setSavedLongitude] =
    useState<number | null>(null);

  const [capturing, setCapturing] =
    useState(false);

  const [captureError, setCaptureError] =
    useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  const { addPhoto } = usePhotos();

  const checkPermissions = async () => {
    try {
      const cameraResult =
        await requestCameraPermission();

      const locationResult =
        await Location.getForegroundPermissionsAsync();

      setLocationPermission(locationResult);

      console.log('Permisos actualizados:', {
        camera: cameraResult.status,
        location: locationResult.status,
      });
    } catch (error) {
      console.error(
        'Error comprobando permisos:',
        error
      );
    } finally {
      setLoadingPermissions(false);
    }
  };

  const requestPermissions = async () => {
    setLoadingPermissions(true);

    try {
      let cameraResult = cameraPermission;

      if (
        cameraPermission &&
        !cameraPermission.granted &&
        cameraPermission.canAskAgain
      ) {
        cameraResult =
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

      const updatedLocationPermission =
        await Location.getForegroundPermissionsAsync();

      if (cameraResult) {
        console.log(
          'Cámara:',
          cameraResult.status
        );
      }

      setLocationPermission(
        updatedLocationPermission
      );
    } catch (error) {
      console.error(
        'Error solicitando permisos:',
        error
      );
    } finally {
      setLoadingPermissions(false);
    }
  };

  const openSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (error) {
      console.error(
        'No se pudo abrir la configuración:',
        error
      );
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current || capturing) {
      return;
    }

    const cleanDescription =
      description.trim();

    if (!cleanDescription) {
      setCaptureError(
        'Escribe una descripción antes de tomar la fotografía.'
      );
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

      const latitude =
        location.coords.latitude;

      const longitude =
        location.coords.longitude;

      addPhoto(
        photo.uri,
        latitude,
        longitude,
        cleanDescription
      );

      setSavedDescription(
        cleanDescription
      );

      setSavedLatitude(latitude);
      setSavedLongitude(longitude);
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
    setDescription('');
    setSavedDescription('');
    setSavedLatitude(null);
    setSavedLongitude(null);
    setCaptureError(null);
  };

  useEffect(() => {
    checkPermissions();
  }, []);

  useEffect(() => {
    const subscription =
      AppState.addEventListener(
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
  }, []);

  if (
    loadingPermissions ||
    !cameraPermission
  ) {
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
    (!cameraGranted &&
      !cameraCanAskAgain) ||
    (!locationGranted &&
      !locationCanAskAgain);

  if (!permissionsGranted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>
          Nueva fotografía
        </Text>

        <Text style={styles.description}>
          La Bitácora Geográfica necesita acceso
          a la cámara y a la ubicación para
          registrar cada fotografía junto con
          sus coordenadas.
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

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate(
              'MisFotografias'
            )
          }
        >
          <Text
            style={styles.secondaryButtonText}
          >
            Ver mis fotografías
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

        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
          style={styles.photoBottomArea}
        >
          <ScrollView
            contentContainerStyle={
              styles.photoActions
            }
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.photoTitle}>
              Fotografía capturada
            </Text>

            <Text style={styles.savedDescriptionLabel}>
              Descripción
            </Text>

            <Text style={styles.savedDescription}>
              {savedDescription}
            </Text>

            <View style={styles.gpsBox}>
              <Text style={styles.gpsTitle}>
                ✓ Coordenadas GPS registradas
              </Text>

              <Text style={styles.gpsText}>
                Latitud:{' '}
                {savedLatitude !== null
                  ? savedLatitude.toFixed(6)
                  : '--'}
              </Text>

              <Text style={styles.gpsText}>
                Longitud:{' '}
                {savedLongitude !== null
                  ? savedLongitude.toFixed(6)
                  : '--'}
              </Text>
            </View>

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
                navigation.navigate(
                  'MisFotografias'
                )
              }
            >
              <Text
                style={
                  styles.secondaryButtonText
                }
              >
                Ver mis fotografías
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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

        <TextInput
          style={styles.descriptionInput}
          value={description}
          onChangeText={(text) => {
            setDescription(text);
            setCaptureError(null);
          }}
          placeholder="Escribe una descripción..."
          placeholderTextColor="#777"
          multiline
          maxLength={120}
        />

        {captureError && (
          <Text style={styles.captureError}>
            {captureError}
          </Text>
        )}

        <View style={styles.cameraActions}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() =>
              navigation.navigate(
                'MisFotografias'
              )
            }
          >
            <Text style={styles.galleryButtonText}>
              Mis fotografías
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
            disabled={capturing}
          >
            {capturing ? (
              <ActivityIndicator
                size="large"
              />
            ) : (
              <Text
                style={styles.captureButtonText}
              >
                <Ionicons name="camera" size={36} color="#2F6075" />
              </Text>
            )}
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 20,
    paddingBottom: 38,
    paddingTop: 22,
    backgroundColor:
      'rgba(0,0,0,0.42)',
  },

  cameraTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },

  descriptionInput: {
    width: '100%',
    minHeight: 52,
    maxHeight: 90,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#222',
    marginBottom: 14,
  },

  cameraActions: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  galleryButton: {
    position: 'absolute',
    left: 0,
    bottom: 10,
    backgroundColor:
      'rgba(255,255,255,0.92)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  galleryButtonText: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
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

  photoBottomArea: {
    backgroundColor: '#fff',
    maxHeight: '48%',
  },

  photoActions: {
    padding: 20,
  },

  photoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 14,
  },

  savedDescriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },

  savedDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 14,
  },

  gpsBox: {
    backgroundColor: '#eef8f3',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  gpsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 7,
  },

  gpsText: {
    fontSize: 15,
    color: '#555',
    marginBottom: 3,
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
    marginHorizontal: 10,
    marginBottom: 12,
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
    marginBottom: 8,
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

