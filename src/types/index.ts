export interface ProductReturn {
  id: string;
  category: string;
  condition: 'like-new' | 'minor-damage' | 'unusable';
  inventoryLevel: 'low' | 'normal' | 'high';
  imageUploaded: boolean;
  processed: boolean;
}

export interface AIDecision {
  action: 'donate' | 'resell' | 'recycle';
  confidence: number;
  carbonSaved: number;
  estimatedProfit?: number;
  explanation: string;
  destination?: string;
}

export interface ImpactMetrics {
  totalProductsOptimized: number;
  carbonFootprintSaved: number;
  donationsCount: number;
  resalesCount: number;
  recycleCount: number;
  totalProfitRecovered: number;
}