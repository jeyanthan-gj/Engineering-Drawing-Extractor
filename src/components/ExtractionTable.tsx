import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ExtractionTableProps {
  data: Record<string, string>;
  title?: string;
}

const ExtractionTable = ({ data, title = "Extracted Details" }: ExtractionTableProps) => {
  if (!data || Object.keys(data).length === 0) {
    return null;
  }

  const handleDownloadCsv = () => {
    try {
      // Create CSV content
      const headers = ["Field", "Value"];
      const rows = Object.entries(data).map(([key, value]) => [
        // Escape quotes and wrap in quotes if necessary
        `"${key.replace(/"/g, '""')}"`,
        `"${value.replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Create blob and download link
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "page_extract.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV downloaded successfully!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download CSV");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto animate-fade-in" style={{ animationDelay: "0.2s" }}>
       <div className="glass-panel rounded-2xl p-6 md:p-8 overflow-hidden relative group">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              {title}
            </h2>
            <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDownloadCsv}
                className="gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-300"
            >
              <Download className="w-4 h-4" />
              Download CSV
            </Button>
          </div>

          <div className="rounded-xl border border-border/50 overflow-hidden bg-background/30 backdrop-blur-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/60">
                  <TableHead className="w-1/3 font-semibold text-foreground">Field</TableHead>
                  <TableHead className="font-semibold text-foreground">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(data).map(([key, value], index) => (
                  <TableRow key={index} className="hover:bg-primary/5 transition-colors duration-200">
                    <TableCell className="font-medium text-foreground/80">{key}</TableCell>
                    <TableCell className="text-muted-foreground">{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
       </div>
    </div>
  );
};

export default ExtractionTable;
