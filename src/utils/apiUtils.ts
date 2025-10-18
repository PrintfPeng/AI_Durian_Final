import { PredictionResult, AdviceResponse, ApiError } from '@/types';

const API_URL = import.meta.env.VITE_MODEL_API_URL || '';
const API_KEY = import.meta.env.VITE_API_KEY || '';
const ADVICE_API_URL = import.meta.env.VITE_ADVICE_API_URL || '';
const DEMO_MODE = !API_URL;

// Demo data for testing
const DEMO_RESULTS: PredictionResult[] = [
  {
    label: "LEAF_BLIGHT",
    probs: {
      "ALGAL_LEAF_SPOT": 0.12,
      "HEALTHY_LEAF": 0.03,
      "LEAF_BLIGHT": 0.78,
      "PHOMOPSIS_LEAF_SPOT": 0.07
    },
    latency_ms: 245,
    model_version: "demo-model-v1"
  },
  {
    label: "HEALTHY_LEAF", 
    probs: {
      "ALGAL_LEAF_SPOT": 0.05,
      "HEALTHY_LEAF": 0.89,
      "LEAF_BLIGHT": 0.04,
      "PHOMOPSIS_LEAF_SPOT": 0.02
    },
    latency_ms: 198,
    model_version: "demo-model-v1"
  }
];

export const predictDisease = async (imageBase64: string): Promise<PredictionResult> => {
  if (DEMO_MODE) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2000));
    
    // Return random demo result
    const randomResult = DEMO_RESULTS[Math.floor(Math.random() * DEMO_RESULTS.length)];
    console.log('🟡 Demo mode: Returning simulated result', randomResult);
    return randomResult;
  }

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image_base64: imageBase64,
        options: { return_probs: true }
      }),
    });

    if (!response.ok) {
      const error: ApiError = {
        message: 'เซิร์ฟเวอร์ไม่ตอบสนอง กรุณาลองใหม่อีกครั้ง',
        code: response.status.toString()
      };
      throw error;
    }

    const result = await response.json();
    console.log('✅ API Success:', result);
    return result;
    
  } catch (error) {
    console.error('❌ API Error:', error);
    
    if (error instanceof Error) {
      const apiError: ApiError = {
        message: error.message.includes('fetch') 
          ? 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
          : error.message
      };
      throw apiError;
    }
    
    throw error;
  }
};

export const getAdvice = async (
  diagnosis: string,
  probs: Record<string, number>,
  question?: string
): Promise<AdviceResponse> => {
  if (DEMO_MODE || !ADVICE_API_URL) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
    
    // Demo advice based on diagnosis
    const demoAdvice: Record<string, AdviceResponse> = {
      LEAF_BLIGHT: {
        title: "แนวทางการจัดการใบไหม้",
        bullets: [
          "ตัดแต่งใบและกิ่งที่ติดโรค ทิ้งให้พ้นแปลง",
          "พ่นสารป้องกันกำจัดโรคพืชตามคำแนะนำฉลาก",
          "ลดความชื้นในสวน โดยเว้นระยะต้นที่เหมาะสม",
          "สังเกตการระบาดซ้ำและจัดการทันที"
        ],
        disclaimer: "โปรดทดสอบจุดเล็ก ๆ ก่อนและปฏิบัติตามฉลากอย่างเคร่งครัด"
      },
      ALGAL_LEAF_SPOT: {
        title: "แนวทางการจัดการใบจุดสนิม",
        bullets: [
          "เก็บใบที่ติดโรคออกและทำลาย",
          "ลดความชื้นและเพิ่มการระบายอากาศ",
          "พ่นสารทองแดงตามคำแนะนำ",
          "ตรวจสอบอาการและจัดการต่อเนื่อง"
        ],
        disclaimer: "โปรดปฏิบัติตามคำแนะนำและฉลากผลิตภัณฑ์อย่างเคร่งครัด"
      },
      PHOMOPSIS_LEAF_SPOT: {
        title: "แนวทางการจัดการใบติดเชื้อ Phomopsis",
        bullets: [
          "ตัดแต่งส่วนที่ติดโรคทิ้ง",
          "ใช้สารฆ่าเชื้อราที่เหมาะสม",
          "ระบายน้ำให้ดี หลีกเลี่ยงน้ำขัง",
          "ป้องกันการแพร่กระจายด้วยการสุขาภิบาลในสวน"
        ],
        disclaimer: "ควรปรึกษาผู้เชี่ยวชาญเพื่อการวินิจฉัยและแก้ไขที่แม่นยำ"
      },
      HEALTHY_LEAF: {
        title: "แนวทางการดูแลรักษา",
        bullets: [
          "ใบมีสุขภาพดี ควรรักษาสภาพแวดล้อมปัจจุบัน",
          "ตรวจสอบสุขภาพของต้นเป็นประจำ",
          "ให้ปุ๋ยและน้ำอย่างเหมาะสม",
          "ป้องกันโรคด้วยการดูแลสุขาภิบาล"
        ],
        disclaimer: "การดูแลเชิงป้องกันเป็นสิ่งสำคัญในการรักษาสุขภาพพืช"
      }
    };
    
    const advice = demoAdvice[diagnosis] || demoAdvice.HEALTHY_LEAF;
    console.log('🟡 Demo mode: Returning simulated advice', advice);
    return advice;
  }

  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (API_KEY) {
      headers.Authorization = `Bearer ${API_KEY}`;
    }

    const response = await fetch(`${ADVICE_API_URL}/advise`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        diagnosis,
        probs,
        question: question || undefined
      }),
    });

    if (!response.ok) {
      const error: ApiError = {
        message: 'ไม่สามารถขอคำแนะนำได้ กรุณาลองใหม่อีกครั้ง',
        code: response.status.toString()
      };
      throw error;
    }

    const result = await response.json();
    console.log('✅ Advice API Success:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Advice API Error:', error);
    
    if (error instanceof Error) {
      const apiError: ApiError = {
        message: error.message.includes('fetch') 
          ? 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต'
          : error.message
      };
      throw apiError;
    }
    
    throw error;
  }
};

export const isDemoMode = () => DEMO_MODE;