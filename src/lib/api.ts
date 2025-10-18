// src/lib/api.ts
export const API_URL =
  // รองรับทั้ง Vite (VITE_) และ CRA (REACT_APP_)
  (import.meta as any)?.env?.VITE_API_URL ??
  (process.env as any)?.REACT_APP_API_URL ??
  "http://localhost:8000/predict";

export type PredictResponse = {
  label: string;
  probs: Record<string, number>;
  model_version?: string;
};

// เรียก FastAPI /predict โดยส่งไฟล์ชื่อฟิลด์ "file"
export async function predictImage(file: File): Promise<PredictResponse> {
  const fd = new FormData();
  fd.append("file", file); // ชื่อฟิลด์ต้องเป็น 'file'
  const r = await fetch(API_URL, { method: "POST", body: fd });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
