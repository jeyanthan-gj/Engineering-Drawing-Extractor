import { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import UploadCard from "@/components/UploadCard";
import ImageComparison from "@/components/ImageComparison";
import SummaryPanel from "@/components/SummaryPanel";
import CropGrid from "@/components/CropGrid";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";

interface Crop {
  cls_name: string;
  conf: number;
  raw_crop: string;
  enhanced_crop: string;
  vlm_text: string;
}

interface AnalysisResult {
  annotated_image: string;
  llm_summary: string;
  crops: Crop[];
}

const API_URL = "https://engineering-drawing-extractor-backend.onrender.com/analyze-page";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (file: File, vlmUrl: string) => {
    setIsLoading(true);
    setStatusText("Uploading image...");
    setResult(null);

    // Store original image for display
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      setStatusText("Running YOLO detection...");

      const formData = new FormData();
      formData.append("file", file);
      if (vlmUrl) {
        formData.append("vlm_url", vlmUrl);
      }

      setStatusText("Processing with VLM & LLM pipeline...");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data: AnalysisResult = await response.json();

      setStatusText("Analysis complete!");
      setResult(data);
      toast.success("Analysis completed successfully!");
    } catch (error) {
      console.error("Analysis error:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      setStatusText(`Error: ${errorMessage}`);
      toast.error("Failed to analyze the drawing. Please try again.");
    } finally {
      setIsLoading(false);
      setTimeout(() => setStatusText(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden selection:bg-primary/20">
      {/* Live Particle Background */}
      <ParticleBackground />

      {/* Subtle Static Glow for Depth - reduced opacity */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-accent/5 rounded-full blur-[100px] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16 relative z-10">
        <Header />

        <div className="space-y-8">
          {/* Upload Section */}
          <UploadCard
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            statusText={statusText}
          />

          {/* Results Section */}
          {result && originalImage && (
            <div className="space-y-8">
              {/* Image Comparison */}
              <ImageComparison
                originalImage={originalImage}
                annotatedImage={result.annotated_image}
                annotatedBase64={result.annotated_image}
              />

              {/* LLM Summary */}
              {result.llm_summary && (
                <SummaryPanel summary={result.llm_summary} />
              )}

              {/* Crop Grid */}
              <CropGrid crops={result.crops} />
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
