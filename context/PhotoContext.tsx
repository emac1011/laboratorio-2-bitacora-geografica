import { createContext, ReactNode, useContext, useState } from 'react';

export type PhotoEntry = {
  id: string;
  photoUri: string;
  latitude: number;
  longitude: number;
};

type PhotoContextType = {
  photos: PhotoEntry[];
  addPhoto: (
    photoUri: string,
    latitude: number,
    longitude: number
  ) => void;
};

const PhotoContext = createContext<PhotoContextType | undefined>(
  undefined
);

type PhotoProviderProps = {
  children: ReactNode;
};

export function PhotoProvider({
  children,
}: PhotoProviderProps) {
  const [photos, setPhotos] = useState<PhotoEntry[]>([]);

  const addPhoto = (
    photoUri: string,
    latitude: number,
    longitude: number
  ) => {
    const newPhoto: PhotoEntry = {
      id: Date.now().toString(),
      photoUri,
      latitude,
      longitude,
    };

    setPhotos((currentPhotos) => [
      newPhoto,
      ...currentPhotos,
    ]);
  };

  return (
    <PhotoContext.Provider
      value={{
        photos,
        addPhoto,
      }}
    >
      {children}
    </PhotoContext.Provider>
  );
}

export function usePhotos() {
  const context = useContext(PhotoContext);

  if (!context) {
    throw new Error(
      'usePhotos debe utilizarse dentro de PhotoProvider'
    );
  }

  return context;
}
