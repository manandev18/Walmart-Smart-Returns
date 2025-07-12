import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Recycle, TrendingUp, Leaf, ArrowRight } from 'lucide-react';
import { mockAIDecisions } from '../data/mockData';

const AIDecisionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [decision, setDecision] = useState(null);
  
  const { formData, decisionKey } = location.state || {};

  useEffect(() => {
    if (!formData) {
      navigate('/return-form');
      return;
    }

    // Simulate AI processing time
    setTimeout(() => {
      const aiDecision = mockAIDecisions[decisionKey] || mockAIDecisions['electronics-minor-damage-high'];
      setDecision(aiDecision);
      setIsProcessing(false);
    }, 3000);
  }, [formData, decisionKey, navigate]);

  const getActionIcon = (action) => {
    switch (action) {
      case 'donate': return Heart;
      case 'resell': return ShoppingCart;
      case 'recycle': return Recycle;
      default: return Heart;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'donate': return 'text-red-500';
      case 'resell': return 'text-green-500';
      case 'recycle': return 'text-blue-500';
      default: return 'text-red-500';
    }
  };

  const getActionBg = (action) => {
    switch (action) {
      case 'donate': return 'bg-red-100';
      case 'resell': return 'bg-green-100';
      case 'recycle': return 'bg-blue-100';
      default: return 'bg-red-100';
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            AI Analysis in Progress
          </h2>
          
          <div className="space-y-3 text-left">
            {[
              'Analyzing product condition...',
              'Checking market demand...',
              'Calculating environmental impact...',
              'Optimizing disposition strategy...'
            ].map((step, index) => (
              <motion.div
                key={index}
                className="flex items-center text-gray-600"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.8, duration: 0.5 }}
              >
                <motion.div
                  className="w-2 h-2 bg-blue-600 rounded-full mr-3"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ delay: index * 0.8 + 0.5, duration: 0.6, repeat: Infinity }}
                />
                {step}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  if (!decision) return null;

  const ActionIcon = getActionIcon(decision.action);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Decision Header */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div
                className={`w-20 h-20 ${getActionBg(decision.action)} rounded-full flex items-center justify-center mx-auto mb-6`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8, delay: 0.4 }}
              >
                <ActionIcon className={`w-10 h-10 ${getActionColor(decision.action)}`} />
              </motion.div>

              <motion.h1
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Recommended Action: <br />
                <span className={`capitalize ${getActionColor(decision.action)}`}>
                  {decision.action} {decision.destination && `to ${decision.destination}`}
                </span>
              </motion.h1>

              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <div className="px-4 py-2 bg-blue-100 rounded-full">
                  <span className="text-blue-800 font-semibold">
                    {decision.confidence}% Confidence
                  </span>
                </div>
              </motion.div>

              <motion.p
                className="text-gray-600 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
              >
                {decision.explanation}
              </motion.p>
            </motion.div>

            {/* Impact Metrics */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-green-100 rounded-lg mr-4">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Environmental Impact
                    </h3>
                    <p className="text-sm text-gray-600">Carbon footprint reduction</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {decision.carbonSaved} kg CO₂
                </div>
                <p className="text-gray-600 mt-2">saved from landfill</p>
              </div>

              {decision.estimatedProfit && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-blue-100 rounded-lg mr-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Estimated Profit
                      </h3>
                      <p className="text-sm text-gray-600">Recovery value</p>
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${decision.estimatedProfit}
                  </div>
                  <p className="text-gray-600 mt-2">potential recovery</p>
                </div>
              )}
            </motion.div>

            {/* Next Steps */}
            <motion.div
              className="bg-white rounded-xl shadow-sm p-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Next Steps
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600 font-semibold text-sm">
                    1
                  </div>
                  <span>Product tagged for {decision.action} disposition</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600 font-semibold text-sm">
                    2
                  </div>
                  <span>Logistics team will coordinate pickup</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 text-blue-600 font-semibold text-sm">
                    3
                  </div>
                  <span>Impact metrics will be updated in dashboard</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  View Impact Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
                <button
                  onClick={() => navigate('/return-form')}
                  className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  Process Another Return
                </button>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIDecisionPage;