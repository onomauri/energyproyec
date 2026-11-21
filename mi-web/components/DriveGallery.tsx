'use client';

import { useEffect, useState } from 'react';
import { SecureImage } from '@/components/SecureImage';

interface Photo {
  id: string;
  name: string;
  url: string;
}

interface DateFolder {
  folderId: string;
  date: string;
  photos: Photo[];
}

export default function DriveGallery({ clientEmail }: { clientEmail: string }) {
  const [gallery, setGallery] = useState<DateFolder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    if (!clientEmail) return;

    fetch(`/api/client/gallery?email=${encodeURIComponent(clientEmail)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setGallery(data.gallery || []);
        }
      })
      .catch(() => setError('No se pudieron cargar las fotos del proyecto'))
      .finally(() => setLoading(false));
  }, [clientEmail]);

  if (loading) {
    return <p className="text-sm text-gray-500 py-4">Cargando galería de avances...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500 py-4">{error}</p>;
  }

  if (gallery.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-4">
        Aún no hay registros fotográficos disponibles para tu cuenta.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {gallery.map((folder) => (
        <div key={folder.folderId} className="border rounded-xl p-5 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">
              📅 Avances del {folder.date}
            </h3>
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
              {folder.photos.length} {folder.photos.length === 1 ? 'foto' : 'fotos'}
            </span>
          </div>

          {folder.photos.length === 0 ? (
            <p className="text-sm text-gray-400">Carpeta vacía por el momento.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {folder.photos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setSelectedPhoto(photo)}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100 cursor-pointer"
                >
                  <SecureImage thumb src={photo.url}
                    alt={photo.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-xs text-white truncate">{photo.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal para ver foto en tamaño completo */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl"
          >
            <SecureImage src={selectedPhoto.url}
              alt={selectedPhoto.name}
              className="max-h-[80vh] w-auto object-contain mx-auto" />
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
              <span className="text-sm font-medium text-gray-700">{selectedPhoto.name}</span>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="px-3 py-1 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
