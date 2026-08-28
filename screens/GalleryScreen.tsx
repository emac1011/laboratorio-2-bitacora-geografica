import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { usePhotos } from '../context/PhotoContext';

export default function GalleryScreen() {
  const { photos } = usePhotos();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.intro}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>
            📷
          </Text>
        </View>

        <Text style={styles.title}>
          Mis fotografías
        </Text>

        <Text style={styles.subtitle}>
          Tus lugares registrados en la bitácora
        </Text>

        {photos.length > 0 && (
          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {photos.length}{' '}
              {photos.length === 1
                ? 'registro'
                : 'registros'}
            </Text>
          </View>
        )}
      </View>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>
              📍
            </Text>
          </View>

          <Text style={styles.emptyTitle}>
            Tu bitácora está vacía
          </Text>

          <Text style={styles.emptyText}>
            Las fotografías que tomes aparecerán aquí
            junto con su descripción y las coordenadas
            GPS del lugar donde fueron capturadas.
          </Text>
        </View>
      ) : (
        photos.map((photo, index) => (
          <View
            key={photo.id}
            style={styles.photoCard}
          >
            <Image
              source={{ uri: photo.photoUri }}
              style={styles.galleryImage}
              resizeMode="cover"
            />

            <View style={styles.photoInfo}>
              <View style={styles.photoHeader}>
                <Text style={styles.photoNumber}>
                  Registro #{photos.length - index}
                </Text>

                <View style={styles.gpsBadge}>
                  <Text style={styles.gpsBadgeText}>
                    GPS
                  </Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionLabel}>
                  DESCRIPCIÓN
                </Text>

                <Text style={styles.descriptionText}>
                  {photo.description ||
                    'Sin descripción'}
                </Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.sectionLabel}>
                  UBICACIÓN
                </Text>

                <View style={styles.coordinateBox}>
                  <Text style={styles.coordinates}>
                    Latitud
                  </Text>

                  <Text style={styles.coordinateValue}>
                    {photo.latitude.toFixed(6)}
                  </Text>

                  <Text style={styles.coordinates}>
                    Longitud
                  </Text>

                  <Text style={styles.coordinateValue}>
                    {photo.longitude.toFixed(6)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FBFD',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  intro: {
    alignItems: 'center',
    marginBottom: 24,
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#B9E6F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  iconText: {
    fontSize: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
    color: '#245568',
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 15,
    color: '#66828D',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },

  counter: {
    marginTop: 13,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#B9E6F2',
  },

  counterText: {
    color: '#245568',
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    marginTop: 55,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DCEFF4',
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#EAF8FC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },

  emptyIconText: {
    fontSize: 30,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
    color: '#245568',
    marginBottom: 10,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#66828D',
    fontFamily: 'sans-serif',
    textAlign: 'center',
  },

  photoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    marginBottom: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#DCEFF4',
  },

  galleryImage: {
    width: '100%',
    height: 245,
  },

  photoInfo: {
    padding: 18,
  },

  photoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  photoNumber: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
    color: '#245568',
  },

  gpsBadge: {
    backgroundColor: '#EAF8FC',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  gpsBadgeText: {
    color: '#3D8EA8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
  },

  infoSection: {
    marginBottom: 16,
  },

  sectionLabel: {
    color: '#3D8EA8',
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
    letterSpacing: 0.8,
    marginBottom: 6,
  },

  descriptionText: {
    color: '#405D66',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'sans-serif',
  },

  coordinateBox: {
    backgroundColor: '#F5FBFD',
    borderRadius: 14,
    padding: 12,
  },

  coordinates: {
    color: '#66828D',
    fontSize: 13,
    fontFamily: 'sans-serif',
    marginBottom: 2,
  },

  coordinateValue: {
    color: '#245568',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'sans-serif-medium',
    marginBottom: 8,
  },
});
