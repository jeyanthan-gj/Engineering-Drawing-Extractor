import { Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface SummaryPanelProps {
  summary: string;
}

const SummaryPanel = ({ summary }: SummaryPanelProps) => {
  return (
    <div className="w-full animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}>
      <div className="bg-card rounded-xl p-6 md:p-8 card-shadow-elevated border border-border/50 transition-all duration-300 hover:shadow-lg group">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
          Technical Summary & Analysis
        </h2>

        <div className="relative">
          <div className="absolute -left-2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-accent rounded-full transition-all duration-500 group-hover:w-1.5" />
          <div className="pl-4">
            <div className="text-foreground leading-relaxed prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown>{summary}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryPanel;
