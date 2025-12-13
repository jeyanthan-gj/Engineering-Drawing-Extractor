import { Cpu, Zap } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-4 animate-fade-in">
          <div className="p-2.5 rounded-xl bg-primary/10 text-primary animate-float">
            <Cpu className="w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Engineering Drawing Extractor
          </h1>
        </div>
        <div 
          className="flex items-center justify-center gap-2 text-muted-foreground animate-fade-in"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          <Zap className="w-4 h-4 text-accent" />
          <p className="text-base md:text-lg font-medium">
            YOLO Detection + VLM + LLM Pipeline
          </p>
          <Zap className="w-4 h-4 text-accent" />
        </div>
      </div>
    </header>
  );
};

export default Header;
