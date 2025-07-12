import { AIDecision, ImpactMetrics } from '../types';

export const productCategories = [
  'Electronics',
  'Clothing & Apparel', 
  'Home & Garden',
  'Sports & Outdoors',
  'Books & Media',
  'Toys & Games',
  'Health & Beauty',
  'Automotive'
];

export const mockAIDecisions: Record<string, AIDecision> = {
  'electronics-minor-damage-high': {
    action: 'resell',
    confidence: 87,
    carbonSaved: 4.2,
    estimatedProfit: 45,
    explanation: 'High inventory level + minor damage = ideal for secondary market resale',
    destination: 'Walmart Restored Marketplace'
  },
  'clothing-like-new-low': {
    action: 'donate',
    confidence: 92,
    carbonSaved: 2.3,
    explanation: 'Low inventory + excellent condition = maximize social impact through donation',
    destination: 'Local Community Shelter'
  },
  'home-unusable-normal': {
    action: 'recycle',
    confidence: 95,
    carbonSaved: 1.8,
    explanation: 'Unusable condition requires material recovery for sustainability',
    destination: 'Certified Recycling Partner'
  }
};

export const mockImpactMetrics: ImpactMetrics = {
  totalProductsOptimized: 12847,
  carbonFootprintSaved: 28456.7,
  donationsCount: 4521,
  resalesCount: 6890,
  recycleCount: 1436,
  totalProfitRecovered: 284590
};