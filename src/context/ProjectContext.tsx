
import React, { createContext, useContext, useState, useEffect } from "react";
import { Project, Task } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt" | "tasks" | "pinned">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (projectId: string, task: Omit<Task, "id" | "createdAt">) => void;
  updateTask: (projectId: string, taskId: string, task: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  getProject: (id: string) => Project | undefined;
  togglePinProject: (id: string) => void;
  reorderProjects: (startIndex: number, endIndex: number) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  updateProjectTheme: (id: string, theme: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    const savedProjects = localStorage.getItem("projects");
    if (savedProjects) {
      try {
        // Parse dates correctly
        const parsed = JSON.parse(savedProjects);
        return parsed.map((project: any) => ({
          ...project,
          pinned: project.pinned || false,
          theme: project.theme || "default",
          createdAt: new Date(project.createdAt),
          tasks: project.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt)
          }))
        }));
      } catch (error) {
        console.error("Failed to parse projects from localStorage", error);
        return [];
      }
    }
    return [];
  });

  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("darkMode");
    return savedMode ? JSON.parse(savedMode) : 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    toast({
      title: !darkMode ? "Dark mode enabled" : "Light mode enabled",
      description: !darkMode ? "Switched to dark mode" : "Switched to light mode"
    });
  };

  const addProject = (project: Omit<Project, "id" | "createdAt" | "tasks" | "pinned">) => {
    const newProject: Project = {
      ...project,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      tasks: [],
      pinned: false,
      theme: project.theme || "default"
    };
    setProjects([newProject, ...projects]); // Add to the beginning of the array
    toast({
      title: "Project created",
      description: "Your new project has been created successfully."
    });
  };

  const updateProject = (id: string, updatedFields: Partial<Project>) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, ...updatedFields } : project
      )
    );
    toast({
      title: "Project updated",
      description: "Your project has been updated successfully."
    });
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter((project) => project.id !== id));
    toast({
      title: "Project deleted",
      description: "Your project has been deleted.",
      variant: "destructive"
    });
  };

  const togglePinProject = (id: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, pinned: !project.pinned } : project
      )
    );
    
    const project = projects.find(p => p.id === id);
    const isPinning = project ? !project.pinned : false;
    
    toast({
      title: isPinning ? "Project pinned" : "Project unpinned",
      description: isPinning 
        ? "Your project has been pinned to the top." 
        : "Your project has been unpinned."
    });
  };

  const updateProjectTheme = (id: string, theme: string) => {
    setProjects(
      projects.map((project) =>
        project.id === id ? { ...project, theme } : project
      )
    );
    
    toast({
      title: "Theme updated",
      description: "Project theme has been updated."
    });
  };

  const reorderProjects = (startIndex: number, endIndex: number) => {
    // Create a copy of projects to work with
    const allProjects = [...projects];
    
    // First sort them to get the current visual order
    const sortedProjects = allProjects.sort((a, b) => {
      // First by pin status
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }
      // Then by completion status
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      // Finally by date (newer first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    // Get the projects in the current sections
    const pinnedProjects = sortedProjects.filter(p => p.pinned);
    const inProgressProjects = sortedProjects.filter(p => !p.pinned && !p.completed);
    const completedProjects = sortedProjects.filter(p => !p.pinned && p.completed);
    
    // Determine which section we're reordering within
    let sourceArray, targetIndex;
    const pinnedCount = pinnedProjects.length;
    const inProgressCount = inProgressProjects.length;
    
    if (startIndex < pinnedCount) {
      // Reordering within pinned projects
      sourceArray = pinnedProjects;
      targetIndex = endIndex;
    } else if (startIndex < pinnedCount + inProgressCount) {
      // Reordering within in-progress projects
      sourceArray = inProgressProjects;
      targetIndex = endIndex - pinnedCount;
    } else {
      // Reordering within completed projects
      sourceArray = completedProjects;
      targetIndex = endIndex - (pinnedCount + inProgressCount);
    }
    
    // Perform the reordering within the section
    const sourceIndex = startIndex < pinnedCount ? startIndex : 
                        startIndex < (pinnedCount + inProgressCount) ? 
                        startIndex - pinnedCount : 
                        startIndex - (pinnedCount + inProgressCount);
    
    const [removed] = sourceArray.splice(sourceIndex, 1);
    sourceArray.splice(targetIndex, 0, removed);
    
    // Reassemble the full projects list
    const newProjectsOrder = [...pinnedProjects, ...inProgressProjects, ...completedProjects];
    setProjects(newProjectsOrder);
    
    toast({
      title: "Projects reordered",
      description: "Your projects have been reordered successfully."
    });
  };

  const addTask = (projectId: string, task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };

    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? { ...project, tasks: [...project.tasks, newTask] }
          : project
      )
    );
    toast({
      title: "Task added",
      description: "Your task has been added to the project."
    });
  };

  const updateTask = (projectId: string, taskId: string, updatedFields: Partial<Task>) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updatedFields } : task
              )
            }
          : project
      )
    );
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully."
    });
  };

  const deleteTask = (projectId: string, taskId: string) => {
    setProjects(
      projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId)
            }
          : project
      )
    );
    toast({
      title: "Task deleted",
      description: "Your task has been deleted.",
      variant: "destructive"
    });
  };

  const getProject = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        getProject,
        togglePinProject,
        reorderProjects,
        darkMode,
        toggleDarkMode,
        updateProjectTheme
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
