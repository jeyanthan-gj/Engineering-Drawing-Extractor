import { Box, Eye, Sparkles, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/download";
import { toast } from "sonner";

interface CropCardProps {
  index: number;
  className: string;
  confidence: number;
  rawCropImage: string;
  enhancedCropImage: string;
  rawBase64: string;
  enhancedBase64: string;
  vlmDescription: string;
  animationDelay?: number;
}

const CropCard = ({
  index,
  className,
  confidence,
  rawCropImage,
  enhancedCropImage,
  rawBase64,
  enhancedBase64,
  vlmDescription,
  animationDelay = 0,
}: CropCardProps) => {
  const confidencePercent = (confidence * 100).toFixed(1);

  const handleDownloadRaw = () => {
    downloadImage(rawBase64, `${className}_${index + 1}_raw.png`);
    toast.success("Raw crop downloaded!");
  };

  const handleDownloadEnhanced = () => {
    downloadImage(enhancedBase64, `${className}_${index + 1}_enhanced.png`);
    toast.success("Enhanced crop downloaded!");
  };

  return (
    <div
      className="bg-card rounded-xl overflow-hidden card-shadow-elevated border border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 animate-slide-up group"
      style={{ animationDelay: `${animationDelay}ms`, animationFillMode: "backwards" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
              <Box className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground capitalize">
                {className.replace(/_/g, " ")}
              </h3>
            </div>
          </div>
          <Badge
            variant="secondary"
            className="font-mono text-xs transition-all duration-300 group-hover:bg-primary/10 group-hover:text-primary"
          >
            {confidencePercent}%
          </Badge>
        </div>
      </div>

      {/* Images */}
      <div className="p-5">
        <div className="grid grid-cols-2 gap-4 mb-5">
          {/* Raw Crop */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Raw Crop
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                onClick={handleDownloadRaw}
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <div className="aspect-square relative overflow-hidden rounded-lg border border-border bg-muted/30 transition-all duration-300 hover:border-primary/30">
              <img
                src={rawCropImage}
                alt={`Raw crop ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>

          {/* Enhanced Crop */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Enhanced
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                onClick={handleDownloadEnhanced}
              >
                <Download className="w-3 h-3" />
              </Button>
            </div>
            <div className="aspect-square relative overflow-hidden rounded-lg border border-accent/20 bg-accent/5 transition-all duration-300 hover:border-accent/40">
              <img
                src={enhancedCropImage}
                alt={`Enhanced crop ${index + 1}`}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>

        {/* VLM Description */}
        {vlmDescription && (
          <div className="pt-4 border-t border-border/50">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Component Analysis
              </span>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {vlmDescription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CropCard;
