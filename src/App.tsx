import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner@2.0.3';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PortfolioPage } from './components/PortfolioPage';
import { AboutPage } from './components/AboutPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactForm } from './components/ContactForm';
import { ThemeProvider } from './components/ThemeProvider';
import { ScrollToTop } from './components/ScrollToTop';

// Mock API calls - 這些會被替換為真實的 API 調用
const mockApi = {
  projects: [
    {
      id: 1,
      title: "E-commerce Platform",
      description: "全端電商平台，包含購物車、支付系統、後台管理",
      category: "Web Development",
      categoryId: 1,
      image: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjB3b3Jrc3BhY2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzU3ODg0MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["React", "Node.js", "MongoDB", "Stripe"],
      likes: 45,
      views: 320,
      githubUrl: "https://github.com/example/ecommerce",
      liveUrl: "https://example-ecommerce.com",
      isActive: true,
      createdAt: "2024-01-15"
    },
    {
      id: 2,
      title: "Task Management App",
      description: "團隊協作任務管理系統，支援即時通知和檔案分享",
      category: "Mobile App",
      categoryId: 2,
      image: "https://images.unsplash.com/photo-1517309561013-16f6e4020305?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3ZWIlMjBkZXZlbG9wbWVudCUyMHBvcnRmb2xpb3xlbnwxfHx8fDE3NTc5MDI0OTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["React Native", "Firebase", "Redux"],
      likes: 32,
      views: 256,
      githubUrl: "https://github.com/example/taskapp",
      liveUrl: "https://example-taskapp.com",
      isActive: true,
      createdAt: "2024-02-10"
    },
    {
      id: 3,
      title: "Data Analytics Dashboard",
      description: "企業數據分析儀表板，包含圖表視覺化和報告生成",
      category: "Data Science",
      categoryId: 3,
      image: "https://images.unsplash.com/photo-1621036579842-9080c7119f67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2Z0d2FyZSUyMGVuZ2luZWVyaW5nJTIwcHJvamVjdHMlMjBzaG93Y2FzZXxlbnwxfHx8fDE3NTc5MzM1Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      tags: ["Python", "Django", "D3.js", "PostgreSQL"],
      likes: 28,
      views: 189,
      githubUrl: "https://github.com/example/analytics",
      liveUrl: "https://example-analytics.com",
      isActive: true,
      createdAt: "2024-03-05"
    }
  ],
  categories: [
    { id: 1, name: "Web Development", description: "網頁開發專案", projectCount: 8 },
    { id: 2, name: "Mobile App", description: "手機應用程式", projectCount: 5 },
    { id: 3, name: "Data Science", description: "數據科學專案", projectCount: 3 },
    { id: 4, name: "DevOps", description: "維運自動化", projectCount: 4 }
  ],
  profile: {
    name: "Wei",
    title: "Full Stack Developer",
    bio: "具有5年以上全端開發經驗，專精於React、Node.js、Python等技術棧。熱愛學習新技術，致力於創造優質的使用者體驗。",
    avatar: "https://images.unsplash.com/photo-1719400471588-575b23e27bd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkZXZlbG9wZXIlMjB3b3Jrc3BhY2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzU3ODg0MDEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    email: "developer@example.com",
    github: "https://github.com/example",
    linkedin: "https://linkedin.com/in/example",
    website: "https://example.com"
  },
  theme: {
    primaryColor: "#0B5FFF",
    backgroundColor: "#F7FAFF",
    buttonColor: "#0B5FFF",
    font: "Noto Sans TC, sans-serif",
    layoutTemplate: "grid",
    language: "zh"
  }
};

// App Context for global state management
const AppContext = React.createContext({
  projects: [],
  categories: [],
  profile: {},
  theme: {},
  isAdmin: false,
  setIsAdmin: () => {},
  updateTheme: () => {},
  updateProfile: () => {},
  addProject: () => {},
  updateProject: () => {},
  deleteProject: () => {},
  likeProject: () => {},
  addCategory: () => {},
  updateCategory: () => {},
  deleteCategory: () => {}
});

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

function App() {
  const [projects, setProjects] = useState(mockApi.projects);
  const [categories, setCategories] = useState(mockApi.categories);
  const [profile, setProfile] = useState(mockApi.profile);
  const [theme, setTheme] = useState(mockApi.theme);
  const [isAdmin, setIsAdmin] = useState(false);

  // Theme update function
  const updateTheme = (newTheme) => {
    setTheme(prev => ({ ...prev, ...newTheme }));
    // 這裡會調用 API 保存主題設定
    // await api.updateTheme(newTheme);
  };

  // Profile update function
  const updateProfile = (newProfile) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
    // await api.updateProfile(newProfile);
  };

  // Project management functions
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: Date.now(),
      likes: 0,
      views: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setProjects(prev => [newProject, ...prev]);
    // await api.createProject(newProject);
  };

  const updateProject = (id, updates) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    // await api.updateProject(id, updates);
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // await api.deleteProject(id);
  };

  const likeProject = (id) => {
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
    // await api.likeProject(id);
  };

  // Category management functions
  const addCategory = (category) => {
    const newCategory = {
      ...category,
      id: Date.now(),
      projectCount: 0
    };
    setCategories(prev => [...prev, newCategory]);
    // await api.createCategory(newCategory);
  };

  const updateCategory = (id, updates) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    // await api.updateCategory(id, updates);
  };

  const deleteCategory = (id) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    // await api.deleteCategory(id);
  };

  const contextValue = {
    projects,
    categories,
    profile,
    theme,
    isAdmin,
    setIsAdmin,
    updateTheme,
    updateProfile,
    addProject,
    updateProject,
    deleteProject,
    likeProject,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <AppContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/portfolio" element={<PortfolioPage />} />
                <Route path="/portfolio/:categoryId" element={<PortfolioPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/admin" element={
                  isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />
                } />
                {/* Catch-all route for unmatched paths */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <ContactForm />
            <ScrollToTop />
            <Toaster position="top-right" />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AppContext.Provider>
  );
}

export default App;