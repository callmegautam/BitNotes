import React, { useState } from "react";
import { Plus, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";
import ThemeColorPicker from "@/components/ThemeColorPicker";
import EmptyState from "@/components/EmptyState";
import { Project, ThemeColor } from "@/types";
import { useProjects } from "@/context/ProjectContext";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Index: React.FC = () => {
  const { 
    projects, 
    addProject, 
    updateProject, 
    deleteProject, 
    togglePinProject, 
    reorderProjects,
    darkMode,
    toggleDarkMode,
    updateProjectTheme
  } = useProjects();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeColor>("default");

  const handleOpenForm = () => {
    setEditingProject(undefined);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProject(undefined);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteProject(id);
  };

  const handleSubmit = (project: Omit<Project, "id" | "createdAt" | "tasks" | "pinned">) => {
    if (editingProject) {
      updateProject(editingProject.id, project);
    } else {
      addProject(project);
    }
    handleCloseForm();
  };

  const handleTogglePin = (id: string) => {
    togglePinProject(id);
  };

  const handleOpenThemePicker = (id: string) => {
    const project = projects.find(p => p.id === id);
    setCurrentProjectId(id);
    setCurrentTheme((project?.theme as ThemeColor) || "default");
    setThemePickerOpen(true);
  };

  const handleThemeSelect = (theme: ThemeColor) => {
    if (currentProjectId) {
      updateProjectTheme(currentProjectId, theme);
      setThemePickerOpen(false);
    }
  };

  const onDragEnd = (result: any) => {
    // Dropped outside the list
    if (!result.destination) {
      return;
    }

    const sourceDroppableId = result.source.droppableId;
    const destinationDroppableId = result.destination.droppableId;
    
    let startIndex = result.source.index;
    let endIndex = result.destination.index;
    
    // Adjust indices for completed section
    if (sourceDroppableId === "completed") {
      startIndex += inProgressProjects.length;
    }
    
    if (destinationDroppableId === "completed") {
      endIndex += inProgressProjects.length;
    }
    
    reorderProjects(startIndex, endIndex);
  };

  // Sort projects: pinned first, then incomplete, then by creation date (newest first)
  const sortedProjects = [...projects].sort((a, b) => {
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

  // Split projects into in-progress and completed
  const inProgressProjects = sortedProjects.filter(project => !project.completed);
  const completedProjects = sortedProjects.filter(project => project.completed);

  return (
    <div className={`min-h-screen bg-background ${darkMode ? "dark" : ""}`}>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Projects</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleDarkMode} 
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={handleOpenForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>

        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet"
            description="Create your first project to get started"
            action={handleOpenForm}
            actionLabel="Create Project"
          />
        ) : (
          <div className="space-y-10">
            {/* In Progress Projects */}
            <div>
              <h2 className="text-xl font-semibold mb-4">In Progress</h2>
              {inProgressProjects.length === 0 ? (
                <p className="text-muted-foreground">No in-progress projects</p>
              ) : (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="in-progress">
                    {(provided) => (
                      <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {inProgressProjects.map((project, index) => (
                          <Draggable 
                            key={project.id} 
                            draggableId={project.id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ProjectCard
                                  project={project}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onTogglePin={handleTogglePin}
                                  onChangeTheme={handleOpenThemePicker}
                                  index={index}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
            
            {/* Completed Projects */}
            {completedProjects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Completed</h2>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="completed">
                    {(provided) => (
                      <div 
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {completedProjects.map((project, index) => (
                          <Draggable 
                            key={project.id} 
                            draggableId={project.id} 
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <ProjectCard
                                  project={project}
                                  onEdit={handleEdit}
                                  onDelete={handleDelete}
                                  onTogglePin={handleTogglePin}
                                  onChangeTheme={handleOpenThemePicker}
                                  index={index}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            )}
          </div>
        )}
      </main>

      <ProjectForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingProject}
      />

      <ThemeColorPicker 
        open={themePickerOpen}
        onClose={() => setThemePickerOpen(false)}
        onSelect={handleThemeSelect}
        selectedTheme={currentTheme}
      />
    </div>
  );
};

export default Index;
