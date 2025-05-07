
import React from "react";
import { Task } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string, completed: boolean) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-border bg-card hover:bg-accent/10 transition-colors">
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <Checkbox
          checked={task.completed}
          onCheckedChange={(checked) => onToggleComplete(task.id, checked as boolean)}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "text-sm font-medium truncate",
            task.completed && "text-muted-foreground line-through"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className={cn(
              "text-xs text-muted-foreground mt-1 line-clamp-2",
              task.completed && "line-through"
            )}>
              {task.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex gap-1 ml-4">
        <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
          <Edit className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(task.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TaskItem;
