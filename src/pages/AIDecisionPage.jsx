import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Recycle, TrendingUp, Leaf, ArrowRight, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, X, Package, Trash2 } from 'lucide-react';
import { mockAIDecisions } from '../data/mockData';

const AIDecisionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [decision, setDecision] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  const { formData, decisionKey } = location.state || {};

  // Mock alternative options data
  const generateAlternativeOptions = (chosenAction, condition) => {
    const allActions = ['resell', 'donate', 'recycle', 'dispose', 'restock'];
    const alternatives = allActions.filter(action => action !== chosenAction);
    
    const alternativeData = {
      resell: {
        carbonSaved: 8.5,
        estimatedProfit: 45,
        operationalCost: 12,
        reason: condition === 'unusable' ? 'Product condition too poor for resale' : 'Market demand too low',
        score: condition === 'like-new' ? 85 : condition === 'minor-damage' ? 65 : 25,
        status: condition === 'like-new' ? 'good' : condition === 'minor-damage' ? 'warning' : 'poor'
      },
      donate: {
        carbonSaved: 12.3,
        estimatedProfit: 0,
        operationalCost: 8,
        reason: 'Lower carbon impact than chosen option',
        score: 78,
        status: 'good'
      },
      recycle: {
        carbonSaved: 15.2,
        estimatedProfit: 5,
        operationalCost: 15,
        reason: 'Higher operational costs outweigh benefits',
        score: 60,
        status: 'warning'
      },
      dispose: {
        carbonSaved: 0,
        estimatedProfit: 0,
        operationalCost: 25,
        reason: 'Environmentally harmful, last resort only',
        score: 15,
        status: 'poor'
      },
      restock: {
        carbonSaved: 20.1,
        estimatedProfit: 85,
        operationalCost: 5,
        reason: condition === 'like-new' ? 'Minimal quality issues detected' : 'Product condition below restock standards',
        score: condition === 'like-new' ? 90 : 35,
        status: condition === 'like-new' ? 'good' : 'poor'
      }
    };

    return alternatives.map(action => ({
      action,
      ...alternativeData[action]
    }));
  };

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
      case 'dispose': return Trash2;
      case 'restock': return Package;
      default: return Heart;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'donate': return 'text-red-500';
      case 'resell': return 'text-green-500';
      case 'recycle': return 'text-blue-500';
      case 'dispose': return 'text-gray-500';
      case 'restock': return 'text-purple-500';
      default: return 'text-red-500';
    }
  };

  const getActionBg = (action) => {
    switch (action) {
      case 'donate': return 'bg-red-100';
      case 'resell': return 'bg-green-100';
      case 'recycle': return 'bg-blue-100';
      case 'dispose': return 'bg-gray-100';
      case 'restock': return 'bg-purple-100';
      default: return 'bg-red-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'good': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'poor': return X;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'good': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'poor': return 'bg-red-100';
      default: return 'bg-yellow-100';
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
  const alternativeOptions = generateAlternativeOptions(decision.action, formData?.condition);

  // Alternative Card Component
  const AlternativeCard = ({ option }) => {
    const OptionIcon = getActionIcon(option.action);
    const StatusIcon = getStatusIcon(option.status);
    
    return (
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className={`p-3 ${getActionBg(option.action)} rounded-lg mr-3`}>
              <OptionIcon className={`w-5 h-5 ${getActionColor(option.action)}`} />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 capitalize">{option.action}</h4>
              <p className="text-sm text-gray-500">Alternative Option</p>
            </div>
          </div>
          <div className={`p-2 ${getStatusBg(option.status)} rounded-lg`}>
            <StatusIcon className={`w-4 h-4 ${getStatusColor(option.status)}`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Carbon Impact</p>
            <p className="font-semibold text-green-600">{option.carbonSaved} kg CO₂</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Est. Profit</p>
            <p className="font-semibold text-blue-600">${option.estimatedProfit}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Op. Cost</p>
            <p className="font-semibold text-gray-600">${option.operationalCost}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">AI Score</p>
            <p className="font-semibold text-gray-900">{option.score}/100</p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-2">Why not chosen:</p>
          <p className="text-sm text-gray-800">{option.reason}</p>
        </div>
      </motion.div>
    );
  };

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

            {/* Alternative Options Comparison Panel */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <button
                onClick={() => setShowAlternatives(!showAlternatives)}
                className="w-full px-8 py-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg mr-4">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Why Not the Other Options?
                    </h3>
                    <p className="text-sm text-gray-600">
                      Compare AI analysis for all possible actions
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: showAlternatives ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showAlternatives && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 border-t border-gray-200">
                      <div className="pt-6">
                        <div className="flex items-center mb-6">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">
                            Chosen: <span className="capitalize text-green-600">{decision.action}</span> 
                            {decision.destination && ` to ${decision.destination}`}
                          </span>
                        </div>
                        
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {alternativeOptions.map((option, index) => (
                            <motion.div
                              key={option.action}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                              <AlternativeCard option={option} />
                            </motion.div>
                          ))}
                        </div>

                        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-start">
                            <div className="p-2 bg-blue-100 rounded-lg mr-3">
                              <TrendingUp className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-blue-900 mb-1">AI Decision Logic</h4>
                              <p className="text-sm text-blue-800">
                                The AI weighted environmental impact (40%), profit potential (30%), 
                                operational costs (20%), and market demand (10%) to determine the optimal action.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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