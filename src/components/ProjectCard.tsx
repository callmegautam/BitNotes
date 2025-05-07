
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Project, ThemeColor } from "@/types";
import { Link } from "react-router-dom";
import { CheckCircle, Clock, Edit, Trash2, Pin, PinOff, Palette } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onChangeTheme?: (id: string) => void;
  index?: number;
}

const getThemeClasses = (theme: string = "default") => {
  const themes: Record<ThemeColor, string> = {
    default: "border-primary",
    blue: "border-blue-500 bg-blue-50 dark:bg-blue-950/30",
    green: "border-green-500 bg-green-50 dark:bg-green-950/30",
    purple: "border-purple-500 bg-purple-50 dark:bg-purple-950/30",
    orange: "border-orange-500 bg-orange-50 dark:bg-orange-950/30",
    pink: "border-pink-500 bg-pink-50 dark:bg-pink-950/30",
    teal: "border-teal-500 bg-teal-50 dark:bg-teal-950/30",
    yellow: "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/30",
    red: "border-red-500 bg-red-50 dark:bg-red-950/30"
  };
  
  return themes[theme as ThemeColor] || themes.default;
};

const getProgressBarColor = (theme: string = "default", completed: boolean) => {
  if (completed) return "bg-green-500";
  
  const progressColors: Record<ThemeColor, string> = {
    default: "bg-primary",
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    pink: "bg-pink-500",
    teal: "bg-teal-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500"
  };
  
  return progressColors[theme as ThemeColor] || progressColors.default;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  onEdit, 
  onDelete, 
  onTogglePin,
  onChangeTheme,
  index 
}) => {
  const { id, title, description, completed, tasks, pinned, theme = "default" } = project;
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const themeClass = getThemeClasses(theme);
  const progressBarColor = getProgressBarColor(theme, completed);
  
  return (
    <Card 
      className={`overflow-hidden hover:shadow-md transition-shadow ${pinned ? "border-2" : ""} ${themeClass}`}
      data-index={index}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">{title}</CardTitle>
            {pinned && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                <Pin className="w-3 h-3 mr-1" /> Pinned
              </Badge>
            )}
            {completed && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                <CheckCircle className="w-3 h-3 mr-1" /> Complete
              </Badge>
            )}
            {!completed && tasks.length > 0 && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                <Clock className="w-3 h-3 mr-1" /> In Progress
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {description && <p className="text-sm text-muted-foreground mb-3">{description}</p>}
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress</span>
            <span>{completedTasks} of {totalTasks} tasks</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${progressBarColor}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => onTogglePin(id)}
            title={pinned ? "Unpin project" : "Pin project"}
          >
            {pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
          {onChangeTheme && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onChangeTheme(id)}
              title="Change theme color"
            >
              <Palette className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => onEdit(project)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive" onClick={() => onDelete(id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" asChild>
          <Link to={`/project/${id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
