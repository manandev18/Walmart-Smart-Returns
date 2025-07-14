import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, Package, Settings, X, CheckCircle, MapPin, AlertCircle } from 'lucide-react';
import { ProductReturnDefaults } from '../types';
import { productCategories } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';

const ReturnFormPage = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [detectedCondition, setDetectedCondition] = useState('');
  const [duplicateImageAlert, setDuplicateImageAlert] = useState('');
  const [locationData, setLocationData] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationPermissionAsked, setLocationPermissionAsked] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState('default');
  const [showLocationPrompt, setShowLocationPrompt] = useState(true);
  const [formData, setFormData] = useState({
    ...ProductReturnDefaults
  });

  // Request notification permission and then location access
  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    if (!("Notification" in window)) {
      setLocationError("This browser does not support notifications.");
      return;
    }

    const permission = Notification.permission;
    setNotificationPermission(permission);

    if (permission === 'default') {
      // Don't auto-request, wait for user interaction
      setShowLocationPrompt(true);
    } else if (permission === 'granted') {
      // If notifications are already granted, we can proceed with location
      setShowLocationPrompt(true);
    } else {
      setLocationError('Notification permissions are required for location access.');
    }
  };

  const requestNotificationAndLocationPermission = async () => {
    try {
      // First request notification permission
      const notificationPermission = await Notification.requestPermission();
      setNotificationPermission(notificationPermission);

      if (notificationPermission === 'granted') {
        // Show notification about location request
        new Notification('Walmart Smart Returns', {
          body: 'Please allow location access to process your return request.',
          icon: '/favicon.ico',
          requireInteraction: true
        });

        // Wait a moment then request location
        setTimeout(() => {
          requestLocationAccess();
        }, 1000);
      } else {
        setLocationError('Notification permission denied. Location access requires notification permission.');
      }
    } catch (error) {
      setLocationError('Error requesting permissions: ' + error.message);
    }
  };

  const requestLocationAccess = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setLocationPermissionAsked(true);
      return;
    }

    setIsLoadingLocation(true);
    setLocationPermissionAsked(true);
    setShowLocationPrompt(false);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 0 // Force fresh location request every time
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocationData({
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          accuracy: position.coords.accuracy,
          timestamp: new Date().toLocaleString()
        });
        setIsLoadingLocation(false);
        setLocationError('');

        // Show success notification
        if (notificationPermission === 'granted') {
          new Notification('Location Access Granted', {
            body: 'Your location has been successfully captured for return processing.',
            icon: '/favicon.ico'
          });
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        let errorMessage = '';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred while retrieving location.';
            break;
        }
        setLocationError(errorMessage);

        // Show error notification
        if (notificationPermission === 'granted') {
          new Notification('Location Access Failed', {
            body: errorMessage,
            icon: '/favicon.ico'
          });
        }
      },
      options
    );
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Clear any previous duplicate alerts
    setDuplicateImageAlert('');
    
    // Reset the file input to allow re-selection of the same files
    event.target.value = '';
    
    const newImages = files.slice(0, 6 - uploadedImages.length);
    
    const imagePromises = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageData = {
            id: Date.now() + Math.random(),
            file: file,
            url: e.target.result,
            name: file.name,
            size: file.size,
            lastModified: file.lastModified,
            type: file.type,
            // Create a hash-like identifier from file properties and content
            fingerprint: `${file.name}_${file.size}_${file.lastModified}_${file.type}`
          };
          resolve(imageData);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(newImageData => {
      // Check for duplicates within the new upload batch
      const newFingerprints = newImageData.map(img => img.fingerprint);
      const hasDuplicatesInBatch = newFingerprints.length !== new Set(newFingerprints).size;
      
      if (hasDuplicatesInBatch) {
        setDuplicateImageAlert('You selected duplicate images in this upload. Please select only unique images.');
        // Force a small delay to ensure state update is visible
        setTimeout(() => {
          console.log('Duplicate alert set:', 'You selected duplicate images in this upload. Please select only unique images.');
        }, 100);
        return;
      }
      
      // Check for duplicates against already uploaded images
      const existingFingerprints = uploadedImages.map(img => img.fingerprint);
      const duplicateImages = newImageData.filter(newImg => 
        existingFingerprints.includes(newImg.fingerprint)
      );
      
      if (duplicateImages.length > 0) {
        const duplicateNames = duplicateImages.map(img => img.name).join(', ');
        const alertMessage = `The following image(s) have already been uploaded: ${duplicateNames}. Please select different images.`;
        setDuplicateImageAlert(alertMessage);
        // Force a small delay to ensure state update is visible
        setTimeout(() => {
          console.log('Duplicate alert set:', alertMessage);
        }, 100);
        return;
      }
      
      // Additional content-based duplicate check for images with same visual content but different metadata
      const contentDuplicates = [];
      for (const newImg of newImageData) {
        for (const existingImg of uploadedImages) {
          // Compare base64 content (excluding metadata)
          const newContent = newImg.url.split(',')[1];
          const existingContent = existingImg.url.split(',')[1];
          
          // Simple content comparison - in a real app, you might use more sophisticated image comparison
          if (newContent === existingContent) {
            contentDuplicates.push(newImg.name);
            break;
          }
        }
      }
      
      if (contentDuplicates.length > 0) {
        const alertMessage = `Duplicate image content detected: ${contentDuplicates.join(', ')}. Please select different images with unique content.`;
        setDuplicateImageAlert(alertMessage);
        // Force a small delay to ensure state update is visible
        setTimeout(() => {
          console.log('Content duplicate alert set:', alertMessage);
        }, 100);
        return;
      }
      
      // If no duplicates found, proceed with adding images
      const updatedImages = [...uploadedImages, ...newImageData];
      setUploadedImages(updatedImages);
      
      // Start AI analysis only when we have exactly 6 unique images
      if (updatedImages.length === 6) {
        setTimeout(() => {
          startAIAnalysis(updatedImages);
        }, 500);
      }
    });
  };

  const startAIAnalysis = (images) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const conditions = ['new', 'like-new', 'minor-damage', 'unusable'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      setDetectedCondition(randomCondition);
      setFormData(prev => ({ ...prev, condition: randomCondition, imageUploaded: true }));
      setAiAnalysisComplete(true);
      setIsAnalyzing(false);
    }, 3000);
  };

  const removeImage = (imageId) => {
    const updatedImages = uploadedImages.filter(img => img.id !== imageId);
    setUploadedImages(updatedImages);
    
    // Clear duplicate alert when removing images
    setDuplicateImageAlert('');
    
    // Reset AI analysis state when removing images
    setAiAnalysisComplete(false);
    setDetectedCondition('');
    setFormData(prev => ({ ...prev, condition: '', imageUploaded: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUploaded || !formData.category) return;
    
    // Create decision key for mock data lookup
    const decisionKey = `${formData.category.toLowerCase().replace(/\s+/g, '-')}-${formData.condition}-normal`;
    
    // Include location data in form submission
    const submissionData = {
      ...formData,
      location: locationData
    };
    
    navigate('/ai-decision', { state: { formData: submissionData, decisionKey } });
  };

  const isFormValid = formData.imageUploaded && formData.category;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Product Return Analysis
            </h1>
            <p className="text-blue-100 mt-2">
              Upload exactly 6 unique product images for AI based condition analysis.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Location Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location Information
              </label>
              
              {isLoadingLocation ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <LoadingSpinner message="Requesting location access..." />
                </div>
              ) : locationData ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800">Location Detected</p>
                      <p className="text-sm text-green-600">
                        Your location has been captured for return processing
                      </p>
                    </div>
                  </div>
                  <div className="ml-13 text-sm text-green-700">
                    <p>Latitude: {locationData.latitude}</p>
                    <p>Longitude: {locationData.longitude}</p>
                    <p>Accuracy: ±{Math.round(locationData.accuracy)}m</p>
                    <p>Last Updated: {locationData.timestamp}</p>
                  </div>
                </div>
              ) : locationError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-red-800">Location Access Failed</p>
                      <p className="text-sm text-red-600">{locationError}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={requestNotificationAndLocationPermission}
                    className="ml-13 mt-2 px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : showLocationPrompt ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800">Location Access Required</p>
                      <p className="text-sm text-blue-600">
                        We need your location to process your return request efficiently
                      </p>
                    </div>
                  </div>
                  <div className="ml-13">
                    <button
                      type="button"
                      onClick={requestNotificationAndLocationPermission}
                      className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Allow Location Access
                    </button>
                    <p className="text-xs text-blue-500 mt-2">
                      You'll receive a notification request followed by location permission
                    </p>
                  </div>
                </div>
              ) : null}
            </motion.div>

            {/* Image Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Camera className="w-4 h-4 inline mr-2" />
                Product Images (Must upload exactly 6 unique images)
              </label>
              
              {/* Duplicate Image Alert */}
              {duplicateImageAlert && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-red-800">Duplicate Image Detected</p>
                      <p className="text-sm text-red-600">{duplicateImageAlert}</p>
                    </div>
                    <button
                      onClick={() => setDuplicateImageAlert('')}
                      className="ml-2 p-1 hover:bg-red-100 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </motion.div>
              )}
              
              {/* Image Upload Area */}
              {uploadedImages.length < 6 && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors mb-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Click to upload product images ({uploadedImages.length}/6)
                    </p>
                    {uploadedImages.length < 6 && (
                      <p className="text-sm text-red-600 mb-4">
                        All 6 unique images are required for AI analysis
                      </p>
                    )}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
                    >
                      Upload Images
                    </label>
                  </motion.div>
                </div>
              )}

              {/* Uploaded Images Grid */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  {uploadedImages.map((image) => (
                    <motion.div
                      key={image.id}
                      className="relative group"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* AI Analysis Status */}
              {uploadedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {uploadedImages.length < 6 ? (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <Camera className="w-5 h-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium text-yellow-800">Upload More Images</p>
                          <p className="text-sm text-yellow-600">
                            {6 - uploadedImages.length} more unique images needed for AI analysis
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : isAnalyzing ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <LoadingSpinner message="Analyzing images with AI..." />
                    </div>
                  ) : aiAnalysisComplete ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-green-800">AI Analysis Complete</p>
                        <p className="text-sm text-green-600">
                          All 6 unique images analyzed successfully
                        </p>
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </motion.div>

            {/* Product Category */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Package className="w-4 h-4 inline mr-2" />
                Product Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select category...</option>
                {productCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </motion.div>



            {/* Product Condition - AI Detected */}
            {aiAnalysisComplete && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <Settings className="w-4 h-4 inline mr-2" />
                  AI Detected Product Condition
                </label>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <span className="text-blue-800 font-medium">
                      AI Analysis Result: {detectedCondition === 'like-new' ? 'Like New' : 
                                         detectedCondition === 'minor-damage' ? 'Minor Damage' : 'Unusable'}
                    </span>
                  </div>
                  <p className="text-sm text-blue-600 mt-1">
                    Based on the uploaded images, our AI has detected this product condition.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all ${
                  isFormValid
                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Analyze with AI
              </button>
            </motion.div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnFormPage;