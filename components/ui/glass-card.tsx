import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    className?: string;
    intensity?: "low" | "medium" | "high";
}

export function GlassCard({ children, className, intensity = "medium", ...props }: GlassCardProps) {
    const intensityMap = {
        low: "bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border-white/20",
        medium: "bg-white/70 dark:bg-zinc-900/60 backdrop-blur-md border-white/30",
        high: "bg-white/90 dark:bg-zinc-900/80 backdrop-blur-lg border-white/40",
    };

    return (
        <div
            className={cn(
                "rounded-2xl border shadow-sm transition-all duration-200",
                intensityMap[intensity],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
