import { Grid3X3, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import CropCard from "./CropCard";
import { downloadAllCrops } from "@/lib/download";
import { toast } from "sonner";

interface Crop {
  cls_name: string;
  conf: number;
  raw_crop: string;
  enhanced_crop: string;
  vlm_text: string;
}

interface CropGridProps {
  crops: Crop[];
}

const CropGrid = ({ crops }: CropGridProps) => {
  if (!crops || crops.length === 0) {
    return null;
  }

  const handleDownloadAllRaw = () => {
    downloadAllCrops(crops, "raw");
    toast.success(`Downloading ${crops.length} raw crops...`);
  };

  const handleDownloadAllEnhanced = () => {
    downloadAllCrops(crops, "enhanced");
    toast.success(`Downloading ${crops.length} enhanced crops...`);
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">
            Detected Components
          </h2>
          <span className="text-sm text-muted-foreground">
            ({crops.length} found)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAllRaw}
            className="gap-2 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            All Raw
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAllEnhanced}
            className="gap-2 transition-all duration-200 hover:scale-105"
          >
            <Download className="w-4 h-4" />
            All Enhanced
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {crops.map((crop, index) => (
          <CropCard
            key={index}
            index={index}
            className={crop.cls_name}
            confidence={crop.conf}
            rawCropImage={crop.raw_crop}
            enhancedCropImage={crop.enhanced_crop}
            rawBase64={crop.raw_crop}
            enhancedBase64={crop.enhanced_crop}
            vlmDescription={crop.vlm_text}
            animationDelay={index * 100}
          />
        ))}
      </div>
    </div>
  );
};

export default CropGrid;
