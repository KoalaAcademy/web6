import React, { useState } from 'react';
import { 
  Users, 
  FolderOpen, 
  Settings, 
  BarChart3, 
  Upload, 
  Edit3, 
  Trash2, 
  Plus,
  Eye,
  EyeOff,
  Save,
  Palette,
  Layout,
  RefreshCw
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { toast } from 'sonner@2.0.3';
import { useAppContext } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function AdminDashboard() {
  const { 
    projects, 
    categories, 
    profile,
    theme, 
    updateTheme, 
    updateProfile,
    addProject, 
    updateProject, 
    deleteProject,
    addCategory,
    updateCategory,
    deleteCategory
  } = useAppContext();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-4">管理後台</h1>
          <p className="text-xl text-muted-foreground">
            管理您的作品集內容和網站設定
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center gap-1 text-xs lg:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">總覽</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-1 text-xs lg:text-sm">
              <FolderOpen className="w-4 h-4" />
              <span className="hidden sm:inline">作品</span>
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-1 text-xs lg:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">分類</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1 text-xs lg:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">資料</span>
            </TabsTrigger>            
            <TabsTrigger value="theme" className="flex items-center gap-1 text-xs lg:text-sm">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">主題</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-1 text-xs lg:text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">設定</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab projects={projects} categories={categories} />
          </TabsContent>

          <TabsContent value="projects">
            <ProjectsTab 
              projects={projects} 
              categories={categories}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesTab 
              categories={categories}
              onAdd={addCategory}
              onUpdate={updateCategory}
              onDelete={deleteCategory}
            />
          </TabsContent>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeTab theme={theme} onUpdate={updateTheme} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewTab({ projects, categories }) {
  const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = projects.reduce((sum, p) => sum + p.likes, 0);
  const activeProjects = projects.filter(p => p.isActive).length;

  const stats = [
    { label: '總作品數', value: projects.length, icon: FolderOpen, color: 'text-blue-500' },
    { label: '啟用作品', value: activeProjects, icon: Eye, color: 'text-green-500' },
    { label: '總觀看數', value: totalViews, icon: BarChart3, color: 'text-purple-500' },
    { label: '總喜歡數', value: totalLikes, icon: Users, color: 'text-red-500' },
  ];

  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Projects */}
      <Card>
        <CardHeader>
          <CardTitle>最近作品</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center space-x-4">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground">{project.category}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={project.isActive ? 'default' : 'secondary'}>
                    {project.isActive ? '啟用' : '停用'}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    {project.views} 觀看 • {project.likes} 喜歡
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProjectsTab({ projects, categories, onAdd, onUpdate, onDelete }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    image: '',
    tags: '',
    githubUrl: '',
    liveUrl: '',
    isActive: true
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const projectData = {
      ...formData,
      categoryId: parseInt(formData.categoryId),
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      category: categories.find(c => c.id === parseInt(formData.categoryId))?.name || ''
    };

    if (editingProject) {
      onUpdate(editingProject.id, projectData);
      toast.success('作品已更新');
      setEditingProject(null);
    } else {
      onAdd(projectData);
      toast.success('作品已新增');
      setShowAddDialog(false);
    }

    setFormData({
      title: '',
      description: '',
      categoryId: '',
      image: '',
      tags: '',
      githubUrl: '',
      liveUrl: '',
      isActive: true
    });
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      categoryId: project.categoryId.toString(),
      image: project.image,
      tags: project.tags.join(', '),
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      isActive: project.isActive
    });
  };

  const handleDelete = (id) => {
    if (confirm('確定要刪除此作品嗎？')) {
      onDelete(id);
      toast.success('作品已刪除');
    }
  };

  const toggleActive = (id, isActive) => {
    onUpdate(id, { isActive: !isActive });
    toast.success(isActive ? '作品已停用' : '作品已啟用');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">作品管理</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新增作品
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>新增作品</DialogTitle>
              <DialogDescription>
                填寫以下表單來新增一個新的作品項目
              </DialogDescription>
            </DialogHeader>
            <ProjectForm
              formData={formData}
              setFormData={setFormData}
              categories={categories}
              onSubmit={handleSubmit}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingProject} onOpenChange={() => setEditingProject(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>編輯作品</DialogTitle>
            <DialogDescription>
              編輯現有作品的詳細資訊
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            formData={formData}
            setFormData={setFormData}
            categories={categories}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-medium">{project.title}</h3>
                    <p className="text-muted-foreground">{project.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline">{project.category}</Badge>
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={project.isActive}
                      onCheckedChange={() => toggleActive(project.id, project.isActive)}
                    />
                    <span className="text-sm text-muted-foreground">
                      {project.isActive ? '啟用' : '停用'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ProjectForm({ formData, setFormData, categories, onSubmit, isEditing }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">專案標題</label>
          <Input
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="輸入專案標題"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">分類</label>
          <Select value={formData.categoryId} onValueChange={(value) => handleChange('categoryId', value)}>
            <SelectTrigger>
              <SelectValue placeholder="選擇分類" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">專案描述</label>
        <div className="space-y-2">
          <Textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="輸入專案描述，支援HTML標籤如 <a href='...'>連結</a>, <strong>粗體</strong>, <em>斜體</em> 等"
            rows={4}
            required
          />
          <div className="text-xs text-muted-foreground">
            💡 支援HTML標籤：&lt;a&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;, &lt;p&gt; 等
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">圖片URL</label>
        <Input
          value={formData.image}
          onChange={(e) => handleChange('image', e.target.value)}
          placeholder="輸入圖片URL"
          type="url"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">技術標籤</label>
        <Input
          value={formData.tags}
          onChange={(e) => handleChange('tags', e.target.value)}
          placeholder="React, Node.js, MongoDB (用逗號分隔)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">GitHub URL</label>
          <Input
            value={formData.githubUrl}
            onChange={(e) => handleChange('githubUrl', e.target.value)}
            placeholder="https://github.com/..."
            type="url"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">線上展示URL</label>
          <Input
            value={formData.liveUrl}
            onChange={(e) => handleChange('liveUrl', e.target.value)}
            placeholder="https://..."
            type="url"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) => handleChange('isActive', checked)}
        />
        <label className="text-sm font-medium">啟用此作品</label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? '更新' : '新增'}
        </Button>
      </div>
    </form>
  );
}

function CategoryForm({ formData, setFormData, onSubmit, isEditing }) {
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">分類名稱</label>
        <Input
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="輸入分類名稱"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">分類描述</label>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="輸入分類描述"
          rows={3}
          required
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {isEditing ? '更新' : '新增'}
        </Button>
      </div>
    </form>
  );
}

function CategoriesTab({ categories, onAdd, onUpdate, onDelete }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdate(editingCategory.id, formData);
      toast.success('分類已更新');
      setEditingCategory(null);
    } else {
      onAdd(formData);
      toast.success('分類已新增');
      setShowAddDialog(false);
    }
    setFormData({ name: '', description: '' });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description
    });
  };

  const handleDelete = (id) => {
    if (confirm('確定要刪除此分類嗎？相關作品將不會被刪除。')) {
      onDelete(id);
      toast.success('分類已刪除');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">分類管理</h2>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新增分類
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增分類</DialogTitle>
              <DialogDescription>
                建立一個新的作品分類
              </DialogDescription>
            </DialogHeader>
            <CategoryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              isEditing={false}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>編輯分類</DialogTitle>
            <DialogDescription>
              修改分類的詳細資訊
            </DialogDescription>
          </DialogHeader>
          <CategoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        </DialogContent>
      </Dialog>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-medium">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                </div>
                <Badge variant="secondary">
                  {category.projectCount} 個專案
                </Badge>
                <div className="flex justify-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ThemeTab({ theme, onUpdate }) {
  const [themeSettings, setThemeSettings] = useState({
    ...theme,
    accentColor: theme.accentColor || '#FF6B6B',
    textColor: theme.textColor || '#333333',
    borderRadius: theme.borderRadius || '8',
    shadowIntensity: theme.shadowIntensity || 'medium',
    animations: theme.animations !== false,
    darkMode: theme.darkMode || false
  });

  const handleColorChange = (key, value) => {
    const newTheme = { ...themeSettings, [key]: value };
    setThemeSettings(newTheme);
    onUpdate(newTheme);
  };

  const colorPresets = [
    { name: '科技藍', primary: '#0B5FFF', accent: '#64B5F6', bg: '#F7FAFF' },
    { name: '商務灰', primary: '#2C3E50', accent: '#95A5A6', bg: '#FFFFFF' },
    { name: '創意紫', primary: '#9C27B0', accent: '#E1BEE7', bg: '#F3E5F5' },
    { name: '自然綠', primary: '#4CAF50', accent: '#A5D6A7', bg: '#F1F8E9' },
    { name: '熱情橙', primary: '#FF6B35', accent: '#FFB74D', bg: '#FFF3E0' },
    { name: '優雅粉', primary: '#E91E63', accent: '#F8BBD9', bg: '#FCE4EC' }
  ];

  const applyPreset = (preset) => {
    const newTheme = {
      ...themeSettings,
      primaryColor: preset.primary,
      accentColor: preset.accent,
      backgroundColor: preset.bg,
      buttonColor: preset.primary
    };
    setThemeSettings(newTheme);
    onUpdate(newTheme);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">主題設定</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* 顏色預設 */}
          <Card>
            <CardHeader>
              <CardTitle>顏色預設方案</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {colorPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => applyPreset(preset)}
                    className="p-3 border border-border rounded-lg hover:shadow-md transition-all"
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.primary }}
                      />
                      <div 
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: preset.accent }}
                      />
                      <span className="text-sm font-medium">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 自訂顏色 */}
          <Card>
            <CardHeader>
              <CardTitle>自訂顏色</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: 'primaryColor', label: '主要顏色' },
                { key: 'accentColor', label: '輔助顏色' },
                { key: 'backgroundColor', label: '背景顏色' },
                { key: 'buttonColor', label: '按鈕顏色' },
                { key: 'textColor', label: '文字顏色' }
              ].map((option) => (
                <div key={option.key} className="flex items-center justify-between">
                  <label className="text-sm font-medium">{option.label}</label>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: themeSettings[option.key] }}
                    />
                    <Input
                      type="color"
                      value={themeSettings[option.key]}
                      onChange={(e) => handleColorChange(option.key, e.target.value)}
                      className="w-16 h-8 p-0 border-0"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* 即時預覽 */}
          <Card>
            <CardHeader>
              <CardTitle>即時預覽</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="p-6 rounded-lg border space-y-4"
                style={{
                  backgroundColor: themeSettings.backgroundColor,
                  color: themeSettings.textColor
                }}
              >
                <h3
                  className="text-xl mb-2"
                  style={{ color: themeSettings.primaryColor }}
                >
                  作品標題範例
                </h3>
                <p className="text-sm mb-4" style={{ color: themeSettings.textColor + '90' }}>
                  這是一個專案描述的範例文字，展示當前主題的視覺效果和字體設定。
                </p>
                <button
                  className="px-4 py-2 rounded text-white transition-all hover:opacity-90"
                  style={{ 
                    backgroundColor: themeSettings.buttonColor
                  }}
                >
                  查看專案
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ProfileTab() {
  const { profile, updateProfile } = useAppContext();
  const [profileData, setProfileData] = useState(profile);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileData);
    toast.success('個人資料已更新');
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">個人資料管理</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>基本資料</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">姓名</label>
                <Input
                  value={profileData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="輸入您的姓名"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">職稱</label>
                <Input
                  value={profileData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="例：Full Stack Developer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">個人簡介</label>
                <Textarea
                  value={profileData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  placeholder="描述您的專業背景和經驗"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">頭像URL</label>
                <Input
                  value={profileData.avatar}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">頭像URL</label>
                <Input
                  value={profileData.avatar}
                  onChange={(e) => handleChange('avatar', e.target.value)}
                  placeholder="https://..."
                  type="url"
                />
              </div>
              
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>聯絡資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  value={profileData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your@email.com"
                  type="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">GitHub</label>
                <Input
                  value={profileData.github}
                  onChange={(e) => handleChange('github', e.target.value)}
                  placeholder="https://github.com/username"
                  type="url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn</label>
                <Input
                  value={profileData.linkedin}
                  onChange={(e) => handleChange('linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  type="url"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">個人網站</label>
                <Input
                  value={profileData.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  type="url"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            <Save className="w-4 h-4 mr-2" />
            儲存變更
          </Button>
        </div>
      </form>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState({
    siteTitle: "作品集網站",
    language: "zh",
    maintenanceMode: false,
    autoBackup: true,
    enableComments: true,
    enableAnalytics: false,
    seoEnabled: true
  });

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    toast.success(`設定已更新`);
  };

  const downloadResume = () => {
    const resumeHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>履歷</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>張軟體工程師</h1>
            <p>Full Stack Developer</p>
            <p>Email: developer@example.com</p>
          </div>
          <div class="section">
            <h2>專業技能</h2>
            <p>React, Node.js, Python, AWS, Docker</p>
          </div>
        </body>
      </html>
    `;
    
    const blob = new Blob([resumeHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resume.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('履歷已下載');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl">系統設定</h2>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>網站設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">網站標題</label>
                <Input
                  value={settings.siteTitle}
                  onChange={(e) => handleSettingChange('siteTitle', e.target.value)}
                  placeholder="輸入網站標題"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">語言設定</label>
                <Select
                  value={settings.language}
                  onValueChange={(value) => handleSettingChange('language', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">繁體中文</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">維護模式</p>
                  <p className="text-sm text-muted-foreground">啟用後前台將顯示維護頁面</p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">自動備份</p>
                  <p className="text-sm text-muted-foreground">每日自動備份網站資料</p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能設定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">評論功能</p>
                  <p className="text-sm text-muted-foreground">允許訪客對作品留言</p>
                </div>
                <Switch
                  checked={settings.enableComments}
                  onCheckedChange={(checked) => handleSettingChange('enableComments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">網站分析</p>
                  <p className="text-sm text-muted-foreground">啟用 Google Analytics</p>
                </div>
                <Switch
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => handleSettingChange('enableAnalytics', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SEO 優化</p>
                  <p className="text-sm text-muted-foreground">自動生成 meta 標籤</p>
                </div>
                <Switch
                  checked={settings.seoEnabled}
                  onCheckedChange={(checked) => handleSettingChange('seoEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>資料管理</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={downloadResume}
                className="w-full"
                variant="outline"
              >
                <Upload className="w-4 h-4 mr-2" />
                下載履歷 (HTML)
              </Button>

              <Button
                onClick={() => {
                  const data = JSON.stringify({ message: "備份資料" }, null, 2);
                  const blob = new Blob([data], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'portfolio-backup.json';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                  toast.success('資料已備份');
                }}
                className="w-full"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                匯出資料備份
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>系統資訊</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>版本</span>
                <span>v1.0.0</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>最後更新</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>資料庫狀態</span>
                <span className="text-green-500">正常</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}