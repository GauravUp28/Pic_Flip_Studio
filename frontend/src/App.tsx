import { useState } from 'react';
import ImageUpload from './components/ImageUpload';
import ImageList from './components/ImageList';
import { ImageData } from './services/api';

function App() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUploadSuccess = (image: ImageData) => {
    setSuccess(`Image "${image.originalFilename}" processed successfully!`);
    setError(null);
    setRefreshTrigger(prev => prev + 1);
    // Clear success message after 5 seconds
    setTimeout(() => setSuccess(null), 5000);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccess(null);
    // Clear error message after 5 seconds
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-red-600 to-purple-600 bg-clip-text text-transparent mb-3 leading-normal pb-1">
            Pic Flip Studio
          </h1>
          <p className="text-gray-600 text-lg">
            Upload a pic to remove its background and flip it horizontally
          </p>
        </header>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{error}</span>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-xl leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{success}</span>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 hover:text-green-800 text-xl leading-none"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Upload Section */}
        <section className="mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Upload Pic
            </h2>
            <ImageUpload
              onUploadSuccess={handleUploadSuccess}
              onError={handleError}
            />
          </div>
        </section>

        {/* Images List Section */}
        <section>
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Flipped Pics
            </h2>
            <ImageList key={refreshTrigger} onError={handleError} />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>Pic Flip Studio - Background Removal & Horizontal Flip</p>
        </footer>
      </div>
    </div>
  );
}

export default App;

