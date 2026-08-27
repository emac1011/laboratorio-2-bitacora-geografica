import { StatusBar } from 'expo-status-bar';
import { PhotoProvider } from './context/PhotoContext';
import AppNavigator from './navigation/AppNavigator';

export default function App() {
  return (
    <PhotoProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </PhotoProvider>
  );
}
