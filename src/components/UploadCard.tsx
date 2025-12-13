import { useState, useRef } from "react";
import { Upload, Link, Loader2, ImageIcon, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadCardProps {
  onAnalyze: (file: File, vlmUrl: string) => void;
  isLoading: boolean;
  statusText: string;
}

const UploadCard = ({ onAnalyze, isLoading, statusText }: UploadCardProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [vlmUrl, setVlmUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onAnalyze(selectedFile, vlmUrl);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className="glass-panel rounded-2xl p-6 md:p-8 animate-fade-in transition-all duration-300 hover:shadow-2xl hover:border-primary/20 relative overflow-hidden group"
        style={{ animationDelay: "0.15s", animationFillMode: "backwards" }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="space-y-6 relative z-10">
          {/* File Upload Area */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Upload Engineering Drawing
            </Label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging
                ? "border-primary bg-primary/10 scale-[1.02]"
                : preview
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {preview ? (
                <div className="relative animate-scale-in">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-lg object-contain shadow-md"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile();
                    }}
                    className="absolute -top-2 -right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-all duration-200 hover:scale-110 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {selectedFile?.name}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className={`mx-auto w-14 h-14 rounded-full bg-muted flex items-center justify-center transition-all duration-300 ${isDragging ? "scale-110 bg-primary/20" : ""}`}>
                    <ImageIcon className={`w-7 h-7 transition-colors duration-300 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">
                      Drop your image here, or{" "}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Supports PNG, JPG, JPEG
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Advanced Settings Toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2 transition-colors duration-200"
            >
              {showAdvanced ? (
                <>
                  <span>Hide Advanced Settings</span>
                  <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Show Advanced Settings</span>
                  <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* VLM URL Input (Collapsible) */}
          {showAdvanced && (
            <div className="space-y-2 animate-fade-in">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Link className="w-4 h-4 text-muted-foreground" />
                Vision-Language Model (Gradio URL)
                <span className="text-xs font-normal text-muted-foreground">
                  — Optional
                </span>
              </Label>
              <Input
                type="url"
                placeholder="https://your-vlm-gradio-space.hf.space"
                value={vlmUrl}
                onChange={(e) => setVlmUrl(e.target.value)}
                className="h-11 transition-all duration-200 focus:scale-[1.01]"
              />
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              variant="hero"
              size="lg"
              onClick={handleSubmit}
              disabled={!selectedFile || isLoading}
              className={`w-full ${isLoading ? "" : "animate-pulse-glow"}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Analyze Drawing
                </>
              )}
            </Button>
          </div>

          {/* Status Text */}
          {statusText && (
            <div className="text-center animate-fade-in">
              <p className="text-sm text-muted-foreground">
                <span className="inline-block animate-pulse">{statusText}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadCard;
