"use client";

import { useState, useRef } from "react";
import { Container, Panel, PanelHeader } from "@/components/ui";
import { analyzeImage } from "@/lib/api";
import Link from "next/link";

interface ScanResult {
  material_name: string;
  category: string;
  suggested_use: string;
  logged: boolean;
}

export default function ScanPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imagePreview) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Remove the data:image/jpeg;base64, prefix
      const base64Data = imagePreview.split(',')[1];
      
      const data = await analyzeImage(base64Data);
      setResult(data);
    } catch (err: any) {
      console.error("Scan failed:", err);
      setError("Failed to analyze image. Please ensure the backend is running and OPENAI_API_KEY is set.");
    } finally {
      setLoading(false);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="py-10" style={{ background: "var(--color-cream-50)" }}>
      <Container>
        <div className="grid gap-6 lg:grid-cols-2">
          <Panel>
            <PanelHeader
              title="AI Vision Scan"
              subtitle="Upload a photo of your waste material and let our AI identify it and suggest upcycling ideas."
            />
            <div className="p-6">
              <div className="rounded-3xl border border-black/10 bg-cream-100 p-5">
                <div className="text-sm font-semibold text-ink-800 mb-4">
                  Upload Image
                </div>

                {!imagePreview ? (
                  <div 
                    className="flex flex-col items-center justify-center border-2 border-dashed border-black/20 rounded-2xl p-10 bg-cream-50 cursor-pointer hover:bg-cream-200/50 transition"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg className="w-10 h-10 text-ink-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-sm text-ink-600 font-medium">Click to select an image</span>
                    <span className="text-xs text-ink-300 mt-1">JPEG, PNG up to 5MB</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-black/10 bg-black/5 aspect-video flex items-center justify-center">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={clearImage}
                        disabled={loading}
                        className="flex-1 rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-cream-50 disabled:opacity-50"
                      >
                        Clear
                      </button>
                      <button
                        onClick={handleScan}
                        disabled={loading}
                        className="flex-1 rounded-full border border-black/10 bg-ink-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:opacity-50 flex justify-center items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Analyzing...
                          </>
                        ) : "Analyze Material"}
                      </button>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />

                {error && (
                  <div className="mt-4 rounded-xl bg-red-100 p-3 text-xs text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <div className="rounded-3xl bg-scrap-950 p-6 text-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold tracking-[0.28em] text-white/70 mb-8">
                ANALYSIS RESULT
              </div>

              {!result && !loading && (
                <div className="text-white/40 text-sm max-w-xs">
                  Upload an image and run the analysis to see the material identification and upcycling suggestions.
                </div>
              )}

              {loading && (
                <div className="text-scrap-500 animate-pulse text-sm">
                  Our AI is processing your image...
                </div>
              )}

              {result && (
                <div className="w-full max-w-md space-y-4 text-left">
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <div className="text-xs text-white/50 tracking-wider mb-1">MATERIAL</div>
                    <div className="font-[family-name:var(--font-display)] text-2xl font-semibold text-cream-50">
                      {result.material_name}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 flex justify-between items-center">
                    <div className="text-xs text-white/50 tracking-wider">CATEGORY</div>
                    <div className="rounded-full bg-scrap-700 px-3 py-1 text-xs font-semibold text-white">
                      {result.category}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <div className="text-xs text-white/50 tracking-wider mb-2">SUGGESTED USE</div>
                    <div className="text-sm text-white/90 leading-relaxed">
                      {result.suggested_use}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-center">
                    <Link
                      href="/list-waste"
                      className="inline-flex items-center justify-center rounded-full bg-scrap-500 px-5 py-2.5 text-sm font-medium text-scrap-950 transition hover:bg-scrap-400"
                    >
                      List this Material
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
