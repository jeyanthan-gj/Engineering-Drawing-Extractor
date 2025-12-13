export const downloadImage = (base64Data: string, filename: string) => {
  // Handle both raw base64 and data URL formats
  const dataUrl = base64Data.startsWith("data:")
    ? base64Data
    : `data:image/png;base64,${base64Data}`;

  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadAllCrops = (
  crops: Array<{
    cls_name: string;
    raw_crop: string;
    enhanced_crop: string;
  }>,
  type: "raw" | "enhanced"
) => {
  crops.forEach((crop, index) => {
    const base64 = type === "raw" ? crop.raw_crop : crop.enhanced_crop;
    const filename = `${crop.cls_name}_${index + 1}_${type}.png`;

    setTimeout(() => {
      downloadImage(base64, filename);
    }, index * 200); // Stagger downloads to avoid browser blocking
  });
};
