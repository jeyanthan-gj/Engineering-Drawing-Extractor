import { useState } from "react";
import { toast } from "sonner";
import Header from "@/components/Header";
import UploadCard from "@/components/UploadCard";
import ImageComparison from "@/components/ImageComparison";
import SummaryPanel from "@/components/SummaryPanel";
import CropGrid from "@/components/CropGrid";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import ExtractionTable from "@/components/ExtractionTable";

interface Crop {
  cls_name: string;
  conf: number;
  raw_crop: string;
  enhanced_crop: string;
  vlm_text: string;
  box?: number[];
}

interface AnalysisResult {
  annotated_image: string;
  llm_summary: string;
  crops: Crop[];
  full_page_vlm_text?: string;
  page_extract_text?: string;
  page_extract_table?: Record<string, string>;
  page_extract_csv_path?: string;
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
      const formData = new FormData();
      formData.append("file", file);
      if (vlmUrl) {
        formData.append("vlm_url", vlmUrl);
      }

      setStatusText("Initializing analysis...");

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // Initialize a partial result object to accumulate data
      let currentResult: AnalysisResult = {
        annotated_image: "",
        llm_summary: "",
        crops: [],
      };

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        // Keep the last line in the buffer as it might be incomplete
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const event = JSON.parse(line);

            switch (event.type) {
              case "status":
                setStatusText(event.message);
                break;

              case "yolo_result":
                // First visual update
                currentResult = {
                  ...currentResult,
                  annotated_image: event.data.annotated_image,
                };
                setResult({ ...currentResult });
                break;

              case "page_extract":
                // Add page extraction data
                currentResult = {
                  ...currentResult,
                  full_page_vlm_text: event.data.full_page_vlm_text,
                  page_extract_text: event.data.page_extract_text,
                  page_extract_table: event.data.page_extract_table,
                  page_extract_csv_path: event.data.page_extract_csv_path,
                };
                setResult({ ...currentResult });
                break;

              case "crop_result":
                // Append new crop (Live update!)
                currentResult = {
                  ...currentResult,
                  crops: [...currentResult.crops, event.data],
                };
                setResult({ ...currentResult });
                break;

              case "summary":
                // Final summary
                currentResult = {
                  ...currentResult,
                  llm_summary: event.data.llm_summary,
                };
                setResult({ ...currentResult });
                break;

              case "error":
                toast.error(`Server Error: ${event.message}`);
                setStatusText(`Error: ${event.message}`);
                break;
            }
          } catch (e) {
            console.error("Error parsing stream chunk:", e);
          }
        }
      }

      setStatusText("Analysis complete!");
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
            <div className="space-y-8 animate-fade-in">
              {/* Image Comparison - Show as soon as we have annotated image */}
              {result.annotated_image && (
                <ImageComparison
                  originalImage={originalImage}
                  annotatedImage={result.annotated_image}
                  annotatedBase64={result.annotated_image}
                />
              )}

              {/* LLM Summary - Shows after generation (requested placement) */}
              {result.llm_summary && (
                <SummaryPanel summary={result.llm_summary} />
              )}

              {/* Extraction Table - Show when available */}
              {result.page_extract_table && (
                <ExtractionTable data={result.page_extract_table} />
              )}

              {/* Crop Grid - Shows live updates as crops array grows */}
              {result.crops.length > 0 && (
                <CropGrid crops={result.crops} />
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
