
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Edit, Plus, Trash2, Pin, PinOff, Palette, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import TaskItem from "@/components/TaskItem";
import TaskForm from "@/components/TaskForm";
import ProjectForm from "@/components/ProjectForm";
import ThemeColorPicker from "@/components/ThemeColorPicker";
import EmptyState from "@/components/EmptyState";
import { useProjects } from "@/context/ProjectContext";
import { Task, Project, ThemeColor } from "@/types";

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    getProject, 
    updateProject, 
    deleteProject, 
    addTask, 
    updateTask, 
    deleteTask, 
    togglePinProject,
    darkMode,
    toggleDarkMode,
    updateProjectTheme
  } = useProjects();
  
  const project = getProject(id || "");
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  if (!project) {
    navigate("/");
    return null;
  }

  const handleBack = () => {
    navigate("/");
  };

  const handleOpenTaskForm = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleSubmitTask = (task: Omit<Task, "id" | "createdAt">) => {
    if (editingTask) {
      updateTask(project.id, editingTask.id, task);
    } else {
      addTask(project.id, task);
    }
  };

  const handleToggleTaskComplete = (taskId: string, completed: boolean) => {
    updateTask(project.id, taskId, { completed });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(project.id, taskId);
  };

  const handleOpenEditProject = () => {
    setIsProjectFormOpen(true);
  };

  const handleCloseProjectForm = () => {
    setIsProjectFormOpen(false);
  };

  const handleSubmitProject = (updatedProject: Omit<Project, "id" | "createdAt" | "tasks" | "pinned">) => {
    updateProject(project.id, updatedProject);
  };

  const handleDeleteProject = () => {
    deleteProject(project.id);
    navigate("/");
  };

  const handleToggleProjectComplete = () => {
    updateProject(project.id, { completed: !project.completed });
  };

  const handleTogglePin = () => {
    togglePinProject(project.id);
  };

  const handleOpenThemePicker = () => {
    setThemePickerOpen(true);
  };

  const handleThemeSelect = (theme: ThemeColor) => {
    updateProjectTheme(project.id, theme);
    setThemePickerOpen(false);
  };

  // Sort tasks: incomplete first, then by creation date (newest first)
  const sortedTasks = [...project.tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt.getTime() - a.createdAt.getTime();
    }
    return a.completed ? 1 : -1;
  });

  // Get theme classes
  const getThemeClasses = (theme: string = "default") => {
    const themes: Record<string, string> = {
      default: "",
      blue: "bg-blue-50 dark:bg-blue-900/10",
      green: "bg-green-50 dark:bg-green-900/10",
      purple: "bg-purple-50 dark:bg-purple-900/10",
      orange: "bg-orange-50 dark:bg-orange-900/10",
      pink: "bg-pink-50 dark:bg-pink-900/10",
      teal: "bg-teal-50 dark:bg-teal-900/10",
      yellow: "bg-yellow-50 dark:bg-yellow-900/10",
      red: "bg-red-50 dark:bg-red-900/10"
    };
    
    return themes[theme] || themes.default;
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""} bg-background ${getThemeClasses(project.theme)}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">{project.title}</h1>
              {project.pinned && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800">
                  <Pin className="w-3 h-3 mr-1" /> Pinned
                </Badge>
              )}
              {project.completed && (
                <Badge className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800">
                  <Check className="w-3 h-3 mr-1" /> Completed
                </Badge>
              )}
            </div>
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Button 
              variant="outline"
              onClick={handleToggleProjectComplete}
            >
              {project.completed ? "Mark as In Progress" : "Mark as Complete"}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={toggleDarkMode}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleOpenThemePicker}
              title="Change theme color"
            >
              <Palette className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleTogglePin}
              title={project.pinned ? "Unpin project" : "Pin project"}
            >
              {project.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleOpenEditProject}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="text-destructive"
              onClick={handleDeleteProject}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Tasks</h2>
            <Button 
              size="sm"
              onClick={handleOpenTaskForm}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          
          {sortedTasks.length === 0 ? (
            <EmptyState
              title="No tasks yet"
              description="Add your first task to get started"
              action={handleOpenTaskForm}
              actionLabel="Add Task"
            />
          ) : (
            <div className="space-y-3">
              {sortedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleTaskComplete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <TaskForm
        open={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        onSubmit={handleSubmitTask}
        initialData={editingTask}
      />

      <ProjectForm
        open={isProjectFormOpen}
        onClose={handleCloseProjectForm}
        onSubmit={handleSubmitProject}
        initialData={project}
      />

      <ThemeColorPicker 
        open={themePickerOpen}
        onClose={() => setThemePickerOpen(false)}
        onSelect={handleThemeSelect}
        selectedTheme={(project.theme as ThemeColor) || "default"}
      />
    </div>
  );
};

export default ProjectDetail;
