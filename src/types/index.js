// Product Return Interface
export const ProductReturnDefaults = {
  id: '',
  category: '',
  condition: 'like-new',
  inventoryLevel: 'normal',
  imageUploaded: false,
  processed: false
};

// AI Decision Interface
export const AIDecisionDefaults = {
  action: 'donate',
  confidence: 0,
  carbonSaved: 0,
  estimatedProfit: 0,
  explanation: '',
  destination: ''
};

// Impact Metrics Interface
export const ImpactMetricsDefaults = {
  totalProductsOptimized: 0,
  carbonFootprintSaved: 0,
  donationsCount: 0,
  resalesCount: 0,
  recycleCount: 0,
  totalProfitRecovered: 0
};