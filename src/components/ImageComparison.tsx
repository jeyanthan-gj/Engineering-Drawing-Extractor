import { ImageIcon, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/download";
import { toast } from "sonner";

interface ImageComparisonProps {
  originalImage: string;
  annotatedImage: string;
  annotatedBase64: string;
}

const ImageComparison = ({ originalImage, annotatedImage, annotatedBase64 }: ImageComparisonProps) => {
  const handleDownloadAnnotated = () => {
    downloadImage(annotatedBase64, "annotated_drawing.png");
    toast.success("Annotated image downloaded!");
  };

  return (
    <div className="w-full animate-slide-up">
      <div className="bg-card rounded-xl p-6 md:p-8 card-shadow-elevated border border-border/50 transition-all duration-300 hover:shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Detection Results
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAnnotated}
            className="gap-2 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            Download Annotated
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Image */}
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Original Drawing
              </h3>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-muted/30 transition-all duration-300 group-hover:border-primary/30 group-hover:shadow-md">
              <img
                src={originalImage}
                alt="Original engineering drawing"
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Annotated Image */}
          <div className="space-y-3 group">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                YOLO Annotated
              </h3>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-primary/5 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/10">
              <img
                src={annotatedImage}
                alt="Annotated detection result"
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageComparison;
