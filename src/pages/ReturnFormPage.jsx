import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, Package, Settings, X, CheckCircle } from 'lucide-react';
import { ProductReturnDefaults } from '../types';
import { productCategories } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';

const ReturnFormPage = () => {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [detectedCondition, setDetectedCondition] = useState('');
  const [formData, setFormData] = useState({
    ...ProductReturnDefaults
  });

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.slice(0, 6 - uploadedImages.length);
    
    const imagePromises = newImages.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve({
          id: Date.now() + Math.random(),
          file: file,
          url: e.target.result,
          name: file.name
        });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      const updatedImages = [...uploadedImages, ...images];
      setUploadedImages(updatedImages);
      
      // Start AI analysis if we have 6 images or user is done uploading
      if (updatedImages.length === 6 || updatedImages.length > 0) {
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
      const conditions = ['like-new', 'minor-damage', 'unusable'];
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
    
    if (updatedImages.length === 0) {
      setAiAnalysisComplete(false);
      setDetectedCondition('');
      setFormData(prev => ({ ...prev, condition: '', imageUploaded: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUploaded || !formData.category) return;
    
    // Create decision key for mock data lookup
    const decisionKey = `${formData.category.toLowerCase().replace(/\s+/g, '-')}-${formData.condition}-normal`;
    
    navigate('/ai-decision', { state: { formData, decisionKey } });
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
              Upload product image and provide details for AI optimization
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Image Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Camera className="w-4 h-4 inline mr-2" />
                Product Images (Upload up to 6 images)
              </label>
              
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
                  {isAnalyzing ? (
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
                          {uploadedImages.length} images analyzed successfully
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