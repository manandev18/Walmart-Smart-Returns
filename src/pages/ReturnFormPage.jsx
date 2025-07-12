import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Upload, Package, BarChart3, Settings } from 'lucide-react';
import { ProductReturnDefaults } from '../types';
import { productCategories } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';

const ReturnFormPage = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    ...ProductReturnDefaults
  });

  const handleImageUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setFormData(prev => ({ ...prev, imageUploaded: true }));
    }, 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.imageUploaded || !formData.category) return;
    
    // Create decision key for mock data lookup
    const decisionKey = `${formData.category.toLowerCase().replace(/\s+/g, '-')}-${formData.condition}-${formData.inventoryLevel}`;
    
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
                Product Image
              </label>
              
              {!formData.imageUploaded ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                  {isUploading ? (
                    <LoadingSpinner message="Analyzing image with AI..." />
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">Click to upload product image</p>
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Upload Image
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div
                  className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Camera className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Image uploaded successfully</p>
                    <p className="text-sm text-green-600">AI analysis complete</p>
                  </div>
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

            {/* Inventory Level */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Current Inventory Level
              </label>
              <select
                value={formData.inventoryLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, inventoryLevel: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low Inventory</option>
                <option value="normal">Normal Inventory</option>
                <option value="high">High Inventory</option>
              </select>
            </motion.div>

            {/* Product Condition */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Settings className="w-4 h-4 inline mr-2" />
                Product Condition
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { value: 'like-new', label: 'Like New', color: 'green' },
                  { value: 'minor-damage', label: 'Minor Damage', color: 'yellow' },
                  { value: 'unusable', label: 'Unusable', color: 'red' }
                ].map(condition => (
                  <motion.label
                    key={condition.value}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.condition === condition.value
                        ? `border-${condition.color}-500 bg-${condition.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      formData.condition === condition.value
                        ? `border-${condition.color}-500 bg-${condition.color}-500`
                        : 'border-gray-300'
                    }`}>
                      {formData.condition === condition.value && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{condition.label}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

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