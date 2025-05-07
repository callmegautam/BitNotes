
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Toggle } from "@/components/ui/toggle";
import { ThemeColor } from "@/types";
import { Check } from "lucide-react";

interface ThemeColorPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (theme: ThemeColor) => void;
  selectedTheme: ThemeColor;
}

const themes: Array<{ name: ThemeColor; color: string; bgClass: string }> = [
  { name: "default", color: "hsl(var(--primary))", bgClass: "bg-primary/20" },
  { name: "blue", color: "#3b82f6", bgClass: "bg-blue-100 dark:bg-blue-950/40" },
  { name: "green", color: "#22c55e", bgClass: "bg-green-100 dark:bg-green-950/40" },
  { name: "purple", color: "#a855f7", bgClass: "bg-purple-100 dark:bg-purple-950/40" },
  { name: "orange", color: "#f97316", bgClass: "bg-orange-100 dark:bg-orange-950/40" },
  { name: "pink", color: "#ec4899", bgClass: "bg-pink-100 dark:bg-pink-950/40" },
  { name: "teal", color: "#14b8a6", bgClass: "bg-teal-100 dark:bg-teal-950/40" },
  { name: "yellow", color: "#eab308", bgClass: "bg-yellow-100 dark:bg-yellow-950/40" },
  { name: "red", color: "#ef4444", bgClass: "bg-red-100 dark:bg-red-950/40" }
];

const ThemeColorPicker: React.FC<ThemeColorPickerProps> = ({ 
  open, 
  onClose, 
  onSelect,
  selectedTheme 
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Choose a theme color</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          {themes.map((theme) => (
            <div key={theme.name} className={`rounded-lg p-4 ${theme.bgClass}`}>
              <Toggle
                variant="outline"
                pressed={selectedTheme === theme.name}
                onPressedChange={() => onSelect(theme.name)}
                className="w-full h-14 rounded-md border relative"
                style={{ backgroundColor: theme.color }}
              >
                {selectedTheme === theme.name && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                )}
              </Toggle>
              <p className="text-xs text-center mt-2 capitalize">{theme.name}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ThemeColorPicker;
