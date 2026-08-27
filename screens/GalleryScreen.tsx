import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { usePhotos } from '../context/PhotoContext';

export default function GalleryScreen() {
  const { photos } = usePhotos();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        Mis fotografías
      </Text>

      {photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>
            No hay fotografías todavía
          </Text>

          <Text style={styles.emptyText}>
            Las fotografías que tomes aparecerán aquí
            junto con su descripción y coordenadas GPS.
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
              <Text style={styles.photoNumber}>
                Fotografía #{photos.length - index}
              </Text>

              <Text style={styles.coordinatesTitle}>
                Coordenadas GPS
              </Text>

              <Text style={styles.coordinates}>
                Latitud: {photo.latitude.toFixed(6)}
              </Text>

              <Text style={styles.coordinates}>
                Longitud: {photo.longitude.toFixed(6)}
              </Text>
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
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    lineHeight: 23,
    color: '#666',
    textAlign: 'center',
  },
  photoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  galleryImage: {
    width: '100%',
    height: 260,
  },
  photoInfo: {
    padding: 16,
  },
  photoNumber: {
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  coordinatesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  coordinates: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
});
