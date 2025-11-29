import useDarkmode from "../../../../hooks/useDarkmode";
import { cn } from "../../../../utils/utils";
import Card from "../../../../components/Card";
import { type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon; // pass any lucide-react icon
}

const DashboardCard = ({ label, value, icon: Icon }: DashboardCardProps) => {
  const isDark = useDarkmode();
  
  return (
    <Card className={cn(
      "will-change-transform relative p-6 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl group overflow-hidden",
      isDark 
        ? "bg-gradient-to-br from-red-950/40 to-[#121212] border-red-800/30 shadow-red-900/20" 
        : "bg-gradient-to-br from-white/90 via-red-50/60 to-white/95 border-gray-500/40 shadow-red-100/50"
    )}>
      {/* Animated background glow */}
      <div className={cn(
        "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        isDark 
          ? "bg-gradient-to-br from-red-900/10 to-transparent" 
          : "bg-white"
      )} />
      
      {/* Top decorative line */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        isDark 
          ? "from-red-500 via-red-600 to-red-500" 
          : "from-red-400 via-red-500 to-red-400"
      )} />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isDark ? "bg-red-400" : "bg-red-500"
            )} />
            <p className={cn(
              "text-sm font-semibold tracking-wide uppercase",
              isDark ? "text-red-300" : "text-red-600"
            )}>
              {label}
            </p>
          </div>
          
          <h1 className={cn(
            "text-2xl font-black tracking-tight bg-gradient-to-r bg-clip-text text-transparent",
            isDark 
              ? "from-white via-red-100 to-gray-200" 
              : "from-gray-800 via-red-700 to-gray-900"
          )}>
            {value}
          </h1>
          
          {/* Subtle progress indicator */}
          <div className="mt-3 flex items-center gap-2">
            <div className={cn(
              "h-1 w-16 rounded-full bg-gradient-to-r",
              isDark 
                ? "from-red-500/50 to-red-600/50" 
                : "from-red-400/60 to-red-500/60"
            )} />
            <span className={cn(
              "text-xs font-medium",
              isDark ? "text-gray-500" : "text-gray-400"
            )}>
              Live data
            </span>
          </div>
        </div>

        {Icon && (
          <div className="relative">
            {/* Icon background glow */}
            <div className={cn(
              "absolute inset-0 rounded-2xl blur-xl transition-all duration-300 group-hover:blur-2xl",
              isDark 
                ? "bg-red-500/20 group-hover:bg-red-500/30" 
                : "bg-red-400/20 group-hover:bg-red-400/30"
            )} />
            
            {/* Icon container */}
            <div className={cn(
              "relative p-4 rounded-2xl backdrop-blur-sm border transition-all duration-300 group-hover:scale-110",
              isDark 
                ? "bg-red-900/30 border-red-700/30 shadow-red-500/20" 
                : "bg-white/70 border-red-300/40 shadow-red-300/30"
            )}>
              <Icon className={cn(
                "w-8 h-8 transition-all duration-300",
                isDark 
                  ? "text-red-400 group-hover:text-red-300" 
                  : "text-red-600 group-hover:text-red-700"
              )} />
              
              {/* Pulsing ring around icon */}
              <div className={cn(
                "absolute inset-0 rounded-2xl border-2 animate-ping opacity-20",
                isDark ? "border-red-400" : "border-red-500"
              )} />
            </div>
          </div>
        )}
      </div>
      
      {/* Bottom decorative elements */}
      <div className="absolute bottom-2 right-4 flex gap-1">
        <div className={cn(
          "w-1 h-1 rounded-full animate-pulse",
          isDark ? "bg-red-500/40" : "bg-red-400/40"
        )} />
        <div className={cn(
          "w-1 h-1 rounded-full animate-pulse",
          isDark ? "bg-red-400/30" : "bg-red-300/30"
        )} style={{ animationDelay: "0.5s" }} />
        <div className={cn(
          "w-1 h-1 rounded-full animate-pulse",
          isDark ? "bg-red-300/20" : "bg-red-200/20"
        )} style={{ animationDelay: "1s" }} />
      </div>
    </Card>
  );
};

export default DashboardCard;