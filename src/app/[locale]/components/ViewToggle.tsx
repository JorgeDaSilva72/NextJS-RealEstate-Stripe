"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { List, Map } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: "list" | "map";
  onViewChange: (view: "list" | "map") => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onViewChange,
  className,
}) => {
  return (
    <div className={cn("flex items-center gap-2 bg-gray-100 rounded-lg p-1", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("list")}
        className={cn(
          "flex items-center gap-2 transition-colors",
          view === "list" 
            ? "bg-white shadow-sm text-gray-900 hover:bg-white" 
            : "text-gray-600 hover:bg-gray-200"
        )}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">
          Liste
        </span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("map")}
        className={cn(
          "flex items-center gap-2 transition-colors",
          view === "map" 
            ? "bg-white shadow-sm text-gray-900 hover:bg-white" 
            : "text-gray-600 hover:bg-gray-200"
        )}
      >
        <Map className="h-4 w-4" />
        <span className="hidden sm:inline">
          Carte
        </span>
      </Button>
    </div>
  );
};

export default ViewToggle;





