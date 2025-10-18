export interface PredictionResult {
  label: string;
  probs: Record<string, number>;
  latency_ms: number;
  model_version: string;
}

export interface AdviceResponse {
  title: string;
  bullets: string[];
  disclaimer: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export type DiseaseLabel = 
  | "ALGAL_LEAF_SPOT"
  | "HEALTHY_LEAF" 
  | "LEAF_BLIGHT"
  | "PHOMOPSIS_LEAF_SPOT";

export type ProcessingState = 
  | "idle"
  | "uploading" 
  | "processing"
  | "success"
  | "error";

export const DISEASE_LABELS: Record<DiseaseLabel, string> = {
  "ALGAL_LEAF_SPOT": "ใบจุดสนิม",
  "HEALTHY_LEAF": "ใบปกติ", 
  "LEAF_BLIGHT": "ใบไหม้",
  "PHOMOPSIS_LEAF_SPOT": "ใบติดเชื้อ Phomopsis"
};