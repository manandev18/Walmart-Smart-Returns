import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingCart, Recycle, TrendingUp, Leaf, ArrowRight, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, X, Package, Trash2, MapPin, Navigation } from 'lucide-react';
import { mockAIDecisions } from '../data/mockData';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Icon, Circle, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';
import 'ol/ol.css';

const AIDecisionPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [decision, setDecision] = useState(null);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  const { formData, decisionKey } = location.state || {};

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generate nearby entities based on AI decision and user's actual location
  const generateNearbyEntities = (aiDecision, userLat, userLng) => {
    // Convert distance in km to approximate latitude/longitude offset
    // 1 km ≈ 0.009 degrees latitude, longitude varies by latitude but ~0.011 degrees at mid-latitudes
    const kmToLatDegrees = 0.009;
    const kmToLngDegrees = 0.011;
    
    // Define entity types and their mapping to actions
    const entityActionMap = {
      'warehouse': ['restock'],
      'secondhand': ['resell'],
      'donation': ['donate'],
      'recycling': ['recycle'],
      'disposal': ['dispose']
    };
    
    // Find which entity type should be closest based on AI decision
    const recommendedAction = aiDecision?.action || 'donate';
    let closestEntityType = 'donation'; // default
    
    for (const [entityType, actions] of Object.entries(entityActionMap)) {
      if (actions.includes(recommendedAction)) {
        closestEntityType = entityType;
        break;
      }
    }
    
    const entities = [];
    
    // Helper function to generate coordinates at a specific distance and direction
    const generateCoordinates = (distanceKm, angle) => {
      const latOffset = (distanceKm * kmToLatDegrees) * Math.cos(angle * Math.PI / 180);
      const lngOffset = (distanceKm * kmToLngDegrees) * Math.sin(angle * Math.PI / 180);
      return {
        lat: userLat + latOffset,
        lng: userLng + lngOffset
      };
    };
    
    // Walmart Warehouses (Blue) - closest if restock is recommended
    const warehouseDistance = closestEntityType === 'warehouse' ? 0.8 : 3.2;
    const warehouse1 = generateCoordinates(warehouseDistance + 1, 145);
    const warehouse2 = generateCoordinates(warehouseDistance + 0.4, 315);
    entities.push(
      { type: 'warehouse', name: 'Walmart Distribution Center', lat: warehouse1.lat, lng: warehouse1.lng, color: '#1E40AF', distance: warehouseDistance },
      { type: 'warehouse', name: 'Walmart Supercenter Hub', lat: warehouse2.lat, lng: warehouse2.lng, color: '#1E40AF', distance: warehouseDistance + 0.4 }
    );
    
    // Donation Centers (Red) - closest if donate is recommended
    const donationDistance = closestEntityType === 'donation' ? 0.9 : 4.1;
    const donation1 = generateCoordinates(donationDistance, 120);
    const donation2 = generateCoordinates(donationDistance + 0.5, 300);
    const donation3 = generateCoordinates(donationDistance + 0.8, 180);
    entities.push(
      { type: 'donation', name: 'Goodwill Donation Center', lat: donation1.lat, lng: donation1.lng, color: '#DC2626', distance: donationDistance },
      { type: 'donation', name: 'Salvation Army', lat: donation2.lat, lng: donation2.lng, color: '#DC2626', distance: donationDistance + 0.5 },
      { type: 'donation', name: 'Community Outreach Center', lat: donation3.lat, lng: donation3.lng, color: '#DC2626', distance: donationDistance + 0.8 }
    );
    
    // Second-hand Markets (Orange) - closest if resell is recommended
    const secondhandDistance = closestEntityType === 'secondhand' ? 1.1 : 3.8;
    const secondhand1 = generateCoordinates(secondhandDistance, 90);
    const secondhand2 = generateCoordinates(secondhandDistance + 0.6, 270);
    const secondhand3 = generateCoordinates(secondhandDistance + 0.9, 30);
    entities.push(
      { type: 'secondhand', name: 'Local Thrift Market', lat: secondhand1.lat, lng: secondhand1.lng, color: '#EA580C', distance: secondhandDistance },
      { type: 'secondhand', name: 'Resale Marketplace', lat: secondhand2.lat, lng: secondhand2.lng, color: '#EA580C', distance: secondhandDistance + 0.6 },
      { type: 'secondhand', name: 'Second Chance Store', lat: secondhand3.lat, lng: secondhand3.lng, color: '#EA580C', distance: secondhandDistance + 0.9 }
    );
    
    // Recycling Centers (Green) - closest if recycle is recommended
    const recyclingDistance = closestEntityType === 'recycling' ? 1.3 : 5.5;
    const recycling1 = generateCoordinates(recyclingDistance, 150);
    const recycling2 = generateCoordinates(recyclingDistance + 0.7, 330);
    const recycling3 = generateCoordinates(recyclingDistance + 1.1, 60);
    entities.push(
      { type: 'recycling', name: 'E-Waste Recycling Center', lat: recycling1.lat, lng: recycling1.lng, color: '#16A34A', distance: recyclingDistance },
      { type: 'recycling', name: 'Green Recycling Hub', lat: recycling2.lat, lng: recycling2.lng, color: '#16A34A', distance: recyclingDistance + 0.7 },
      { type: 'recycling', name: 'Eco-Friendly Processing', lat: recycling3.lat, lng: recycling3.lng, color: '#16A34A', distance: recyclingDistance + 1.1 }
    );
    
    // Disposal Sites (Gray) - closest if dispose is recommended (rarely)
    const disposalDistance = closestEntityType === 'disposal' ? 2.1 : 7.2;
    const disposal1 = generateCoordinates(disposalDistance + 1, 135);
    const disposal2 = generateCoordinates(disposalDistance, 370);
    entities.push(
      { type: 'disposal', name: 'Waste Management Facility', lat: disposal1.lat, lng: disposal1.lng, color: '#6B7280', distance: disposalDistance },
      { type: 'disposal', name: 'Landfill Processing Center', lat: disposal2.lat, lng: disposal2.lng, color: '#6B7280', distance: disposalDistance + 1.2 }
    );
    
    console.log(`Generated ${entities.length} entities around user location (${userLat}, ${userLng})`);
    entities.forEach(entity => {
      console.log(`${entity.name}: ${entity.distance}km at (${entity.lat.toFixed(4)}, ${entity.lng.toFixed(4)})`);
    });
    
    return entities;
  };

  // Mock alternative options data
  const generateAlternativeOptions = (chosenAction, condition) => {
    const allActions = ['restock', 'donate', 'recycle', 'dispose']; // Reordered and removed resell since it's chosen
    const alternatives = allActions.filter(action => action !== chosenAction);
    
    const alternativeData = {
      restock: {
        carbonSaved: 10.2,
        estimatedProfit: 85,
        operationalCost: 5,
        reason: 'While inventory levels are normal, the carbon footprint from reverse logistics and quality validation exceeds the environmental benefits of the reselling route.',
        score: 78,
        status: 'warning'
      },
      donate: {
        carbonSaved: 12.3,
        estimatedProfit: 0,
        operationalCost: 8,
        reason: 'Donation provides social impact but generates higher carbon emissions due to additional transportation and processing requirements compared to direct resale.',
        score: 65,
        status: 'warning'
      },
      recycle: {
        carbonSaved: 15.2,
        estimatedProfit: 5,
        operationalCost: 15,
        reason: 'Material recovery is environmentally beneficial, however operational costs and processing complexities outweigh the economic advantages of resale.',
        score: 60,
        status: 'warning'
      },
      dispose: {
        carbonSaved: 25.7,
        estimatedProfit: 0,
        operationalCost: 25,
        reason: 'Disposal to landfill represents the least sustainable option with zero environmental benefits and should only be considered as a last resort.',
        score: 15,
        status: 'poor'
      }
    };

    return alternatives.map(action => ({
      action,
      ...alternativeData[action]
    }));
  };

  // Initialize OpenLayers Map
  useEffect(() => {
    if (!formData?.location || !mapRef.current || !decision) return;

    const userLat = parseFloat(formData.location.latitude);
    const userLng = parseFloat(formData.location.longitude);
    
    console.log(`Initializing map for user location: ${userLat}, ${userLng}`);
    
    // Generate entities based on AI decision and user's actual location
    const nearbyEntities = generateNearbyEntities(decision, userLat, userLng);
    
    // Clear previous map if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setTarget(null);
    }
    
    // Create vector source for markers
    const vectorSource = new VectorSource();
    
    // Add user location marker (yellow circle)
    const userFeature = new Feature({
      geometry: new Point(fromLonLat([userLng, userLat])),
      name: 'Your Location',
      type: 'user'
    });
    
    userFeature.setStyle(new Style({
      image: new Circle({
        radius: 15,
        fill: new Fill({ color: '#fbff00' }),
        stroke: new Stroke({ color: 'black', width: 3 })
      })
    }));
    
    vectorSource.addFeature(userFeature);
    console.log(`Adding user location marker at: ${userLat}, ${userLng}`);
    
    // Add nearby entities markers with more visible styling
    nearbyEntities.forEach((entity, index) => {
      console.log(`Adding entity marker: ${entity.name} at lat: ${entity.lat}, lng: ${entity.lng} (${entity.distance}km away)`);
      
      const feature = new Feature({
        geometry: new Point(fromLonLat([entity.lng, entity.lat])),
        name: entity.name,
        type: entity.type,
        color: entity.color,
        distance: entity.distance
      });
      
      feature.setStyle(new Style({
        image: new Circle({
          radius: 12,
          fill: new Fill({ color: entity.color }),
          stroke: new Stroke({ color: 'white', width: 3 })
        })
      }));
      
      vectorSource.addFeature(feature);
    });
    
    // Create vector layer
    const vectorLayer = new VectorLayer({
      source: vectorSource
    });
    
    // Create map with appropriate zoom to show all markers
    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([userLng, userLat]),
        zoom: 11 // Start with zoom level that shows good area coverage
      })
    });
    
    // Fit view to show all markers with padding
    setTimeout(() => {
      const extent = vectorSource.getExtent();
      if (extent && extent.some(coord => isFinite(coord))) {
        map.getView().fit(extent, {
          padding: [50, 50, 50, 50],
          maxZoom: 14 // Limit max zoom to keep context
        });
      }
    }, 100);
    
    mapInstanceRef.current = map;
    setMapLoaded(true);
    
    console.log(`Map loaded with ${nearbyEntities.length} entity markers + 1 user marker around location: ${userLat}, ${userLng}`);
    
    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(null);
      }
    };
  }, [formData?.location, decision]);

  useEffect(() => {
    if (!formData) {
      navigate('/return-form');
      return;
    }

    // Simulate AI processing time
    setTimeout(() => {
      const aiDecision = mockAIDecisions[decisionKey] || mockAIDecisions['electronics-&-appliances-like-new-normal'];
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* OpenLayers Map Section */}
            <motion.div
              className="bg-white rounded-xl shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <MapPin className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">Nearby Processing Centers</h3>
                </div>
                <p className="text-gray-600">
                  AI recommendation based on proximity and logistics optimization
                </p>
              </div>
              
              <div className="relative">
                <div
                  ref={mapRef}
                  className="w-full h-96"
                  style={{ minHeight: '400px' }}
                />
                {!mapLoaded && formData?.location && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Loading Map...</h4>
                      <p className="text-gray-600 text-sm">
                        Mapping nearby processing centers
                      </p>
                    </div>
                  </div>
                )}
                {!formData?.location && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <div className="text-center p-8">
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">Location Required</h4>
                      <p className="text-gray-600 text-sm">
                        Location access needed to show nearby processing centers
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Map Legend */}
              <div className="p-6 bg-gray-50">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Map Legend</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-5 h-5 rounded-full bg-[#fbff00] mr-2 border-2 border-black"></div>
                    <span className="text-gray-700 font-medium">Your Location</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{backgroundColor: '#1E40AF'}}></div>
                    <span className="text-gray-700">Walmart Centers {decision?.action === 'restock' ? '✓' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{backgroundColor: '#EA580C'}}></div>
                    <span className="text-gray-700">Resale Markets {decision?.action === 'resell' ? '✓' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{backgroundColor: '#DC2626'}}></div>
                    <span className="text-gray-700">Donation Centers {decision?.action === 'donate' ? '✓' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{backgroundColor: '#16A34A'}}></div>
                    <span className="text-gray-700">Recycling Centers {decision?.action === 'recycle' ? '✓' : ''}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-2 border-2 border-white" style={{backgroundColor: '#6B7280'}}></div>
                    <span className="text-gray-700">Disposal Sites {decision?.action === 'dispose' ? '✓' : ''}</span>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-start">
                    <div className="p-1 bg-blue-100 rounded mr-2">
                      <TrendingUp className="w-3 h-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-blue-800 font-medium">AI Decision Logic</p>
                      <p className="text-xs text-blue-700 mt-1">
                        The AI selected the closest available {decision?.action === 'restock' ? 'Walmart center' : 
                        decision?.action === 'resell' ? 'resale market' : 
                        decision?.action === 'donate' ? 'donation center' : 
                        decision?.action === 'recycle' ? 'recycling center' : 'disposal site'} 
                        (✓) to minimize transportation costs and environmental impact.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Decision Header */}
            <motion.div
              className="bg-white rounded-2xl shadow-sm p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div
                className={`w-20 h-20 ${getActionBg(decision.action)} rounded-full flex items-center justify-center mx-auto mb-6`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8, delay: 0.6 }}
              >
                <ActionIcon className={`w-10 h-10 ${getActionColor(decision.action)}`} />
              </motion.div>

              <motion.h1
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
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
                transition={{ duration: 0.6, delay: 1.0 }}
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
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                {decision.explanation}
              </motion.p>
            </motion.div>

            {/* Impact Metrics */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
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
              transition={{ duration: 0.6, delay: 1.8 }}
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