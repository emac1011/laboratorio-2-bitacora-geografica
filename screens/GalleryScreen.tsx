import { StyleSheet, Text, View } from 'react-native';

export default function GalleryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis fotografías</Text>

      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>
          No hay fotografías todavía
        </Text>

        <Text style={styles.emptyText}>
          Las fotografías que tomes aparecerán aquí
          junto con su descripción y coordenadas GPS.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
});
