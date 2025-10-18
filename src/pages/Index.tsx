import { useRef, useState } from "react";
import { predictImage, type PredictResponse } from "../lib/api";

const labelTH: Record<string, string> = {
  ALGAL_LEAF_SPOT: "ใบจุดสนิม",
  HEALTHY_LEAF: "ใบปกติ",
  LEAF_BLIGHT: "ใบไหม้",
  PHOMOPSIS_LEAF_SPOT: "ใบติดเชื้อ Phomopsis",
  ALLOCARIDARA_ATTACK: "แมลงเจาะ/ทำลายใบ",
};

export default function IndexPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgURL, setImgURL] = useState<string>("");
  const [result, setResult] = useState<PredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ⬇️ เพิ่ม refs สำหรับเปิด file picker (แกลเลอรี่) และกล้อง
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const onFile = (f?: File) => {
    setResult(null);
    setErr("");
    if (!f) {
      setFile(null);
      setImgURL("");
      return;
    }
    setFile(f);
    setImgURL(URL.createObjectURL(f));
  };

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setErr("");
    setResult(null);
    try {
      const res = await predictImage(file);
      setResult(res);
    } catch (e: any) {
      setErr(e?.message || "API error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b border-emerald-100">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl md:text-2xl font-bold text-emerald-700">
            Durian Leaf Analyzer
          </h1>
          <p className="text-sm text-emerald-900/60">
            อัปโหลดภาพใบทุเรียนหรือถ่ายภาพ แล้วให้โมเดลวิเคราะห์อาการ
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: Uploader */}
          <section className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-emerald-800">อัปโหลด/ถ่ายภาพ</h2>

            {/* Dropzone-like */}
            <label
              htmlFor="file-gallery"
              className={`mt-4 block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition
              ${imgURL ? "border-emerald-200 bg-emerald-50/40" : "border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50/30"}`}
            >
              <div className="mx-auto max-w-md">
                <svg
                  viewBox="0 0 24 24"
                  className="mx-auto h-10 w-10 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5V8.25A2.25 2.25 0 0 1 5.25 6h13.5A2.25 2.25 0 0 1 21 8.25V15A2.25 2.25 0 0 1 18.75 17.25H8.25L3 21v-4.5z" />
                </svg>
                <p className="mt-2 text-sm text-emerald-900/70">
                  คลิกเพื่อเลือกไฟล์ภาพ หรือ ลากรูปมาวางที่นี่
                </p>
                <p className="text-xs text-emerald-900/50 mt-1">รองรับ .jpg .jpeg .png</p>
              </div>

              {/* file picker สำหรับแกลเลอรี่/ไฟล์ */}
              <input
                id="file-gallery"
                type="file"
                accept="image/*"
                ref={galleryInputRef}
                onChange={(e) => onFile(e.target.files?.[0] || undefined)}
                className="sr-only"
              />
            </label>

            {/* ปุ่มคู่: เลือกจากเครื่อง / ถ่ายด้วยกล้อง */}
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="rounded-xl border border-emerald-200 bg-white py-2.5 text-emerald-800 hover:bg-emerald-50"
              >
                เลือกจากเครื่อง
              </button>

              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="rounded-xl bg-emerald-600 text-white py-2.5 hover:bg-emerald-700"
              >
                ถ่ายด้วยกล้อง
              </button>
            </div>

            {/* input สำหรับกล้อง (มือถือจะเปิดกล้องฝาหลังด้วย capture="environment") */}
            <input
              id="file-camera"
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={(e) => onFile(e.target.files?.[0] || undefined)}
              className="hidden"
            />

            {/* Preview */}
            {imgURL && (
              <figure className="mt-4 overflow-hidden rounded-xl border border-emerald-100">
                <img
                  src={imgURL}
                  alt="preview"
                  className="w-full max-h-[420px] object-contain bg-white"
                />
              </figure>
            )}

            {/* Action */}
            <button
              onClick={handleSubmit}
              disabled={!file || loading}
              className="mt-4 w-full rounded-xl bg-emerald-600 text-white py-3 font-medium shadow hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
                    <path d="M21 12a9 9 0 0 1-9 9" />
                  </svg>
                  กำลังวิเคราะห์...
                </span>
              ) : (
                "วิเคราะห์ภาพ"
              )}
            </button>

            {/* Error */}
            {err && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </div>
            )}

            {/* หมายเหตุการใช้งานมือถือ */}
            <p className="mt-3 text-xs text-emerald-900/60">
              📸 บนมือถือ ปุ่ม “ถ่ายด้วยกล้อง” จะเปิดกล้องอัตโนมัติ (รองรับ iOS/Android สมัยใหม่)
            </p>
          </section>

          {/* Right: Result */}
          <section className="bg-white border border-emerald-100 rounded-2xl shadow-sm p-5">
            <h2 className="text-lg font-semibold text-emerald-800">ผลการวินิจฉัย</h2>

            {!result && (
              <div className="mt-4 h-64 grid place-items-center rounded-xl border border-emerald-100 text-emerald-900/60">
                {imgURL ? "กดปุ่ม “วิเคราะห์ภาพ” เพื่อดูผล" : "ยังไม่มีภาพ — อัปโหลด/ถ่ายภาพก่อน"}
              </div>
            )}

            {result && (
              <>
                <div className="mt-4 rounded-xl border border-emerald-100 p-4 bg-emerald-50/40">
                  <p className="text-sm text-emerald-900/60">ผลลัพธ์</p>
                  <p className="mt-1 text-xl font-semibold text-emerald-900">
                    {labelTH[result.label] ?? result.label}
                  </p>
                  {result.model_version && (
                    <p className="text-xs text-emerald-900/50 mt-1">
                      รุ่นโมเดล: {result.model_version}
                    </p>
                  )}
                </div>

                {/* Prob bars */}
                <div className="mt-4 space-y-3">
                  {Object.entries(result.probs)
                    .sort((a, b) => b[1] - a[1])
                    .map(([k, v]) => (
                      <div key={k}>
                        <div className="flex justify-between text-sm">
                          <span className="text-emerald-900/80">
                            {labelTH[k] ?? k}
                          </span>
                          <span className="font-medium text-emerald-900">
                            {(v * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="h-2 rounded bg-emerald-100 overflow-hidden">
                          <div className="h-2 bg-emerald-600" style={{ width: `${v * 100}%` }} />
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </section>
        </div>

        {/* Note */}
        <p className="text-center text-emerald-900/60 text-sm mt-10">
          💡 ถ้าความมั่นใจต่ำ (&le; 40%) ลองถ่ายใหม่ให้สว่างขึ้น/เข้าใกล้วัตถุ และให้เห็นใบชัดเจน
        </p>
      </main>
    </div>
  );
}
