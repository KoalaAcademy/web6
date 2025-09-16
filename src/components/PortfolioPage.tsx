import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, Grid, List, Heart, Eye, ExternalLink, Github, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useAppContext } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function PortfolioPage() {
  const { categoryId } = useParams();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');
  
  const { projects, categories, likeProject } = useAppContext();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryId || 'all');
  const [selectedTag, setSelectedTag] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');

  // Get unique tags from all projects
  const allTags = useMemo(() => {
    const tags = new Set();
    projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => project.isActive);

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(project => 
        project.categoryId === parseInt(selectedCategory)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter(project =>
        project.tags.includes(selectedTag)
      );
    }

    // Sort projects
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.likes - a.likes);
        break;
      case 'views':
        filtered.sort((a, b) => b.views - a.views);
        break;
      default:
        break;
    }

    return filtered;
  }, [projects, selectedCategory, searchTerm, selectedTag, sortBy]);

  // If showing single project
  const singleProject = projectId ? projects.find(p => p.id === parseInt(projectId)) : null;

  if (singleProject) {
    return <ProjectDetail project={singleProject} onLike={likeProject} />;
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl mb-4">
            {selectedCategory !== 'all' 
              ? categories.find(c => c.id === parseInt(selectedCategory))?.name || '作品集'
              : '作品集'
            }
          </h1>
          <p className="text-xl text-muted-foreground">
            探索我的專案作品，了解我的技術能力和創作理念
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="搜尋專案、技術或關鍵字..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="選擇分類" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有分類</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tag Filter */}
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="選擇技術" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">所有技術</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue placeholder="排序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新</SelectItem>
                <SelectItem value="oldest">最舊</SelectItem>
                <SelectItem value="popular">最受歡迎</SelectItem>
                <SelectItem value="views">最多觀看</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              找到 {filteredProjects.length} 個專案
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Projects Grid/List */}
        {filteredProjects.length > 0 ? (
          <div className={`
            ${viewMode === 'grid' 
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }
          `}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                viewMode={viewMode}
                onLike={likeProject}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl mb-2">沒有找到相關專案</h3>
            <p className="text-muted-foreground mb-4">
              請嘗試調整搜尋條件或瀏覽其他分類
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedTag('all');
            }}>
              清除篩選條件
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, viewMode, onLike }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      onLike(project.id);
      setIsLiked(true);
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>
          <CardContent className="md:w-2/3 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl mb-2">{project.title}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {project.category}
                  </Badge>
                </div>
              </div>
              
              <div 
                className="text-muted-foreground prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: project.description }}
              />
              
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <button
                  onClick={handleLike}
                  className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                    isLiked ? 'text-red-500' : ''
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{project.likes}</span>
                </button>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{project.views}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Link to={`/portfolio?project=${project.id}`}>
                  <Button variant="ghost" size="sm">
                    查看詳情
                  </Button>
                </Link>
                {project.githubUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4" />
                    </a>
                  </Button>
                )}
                {project.liveUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative overflow-hidden">
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <Badge variant="secondary">
            {project.category}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl mb-2">{project.title}</h3>
          <div 
            className="text-muted-foreground text-sm line-clamp-2 prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {project.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.tags.length - 3}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <button
              onClick={handleLike}
              className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                isLiked ? 'text-red-500' : ''
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{project.likes}</span>
            </button>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{project.views}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link to={`/portfolio?project=${project.id}`}>
              <Button variant="ghost" size="sm">
                查看詳情
              </Button>
            </Link>
            {project.githubUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProjectDetail({ project, onLike }) {
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      onLike(project.id);
      setIsLiked(true);
    }
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-6 max-w-4xl">
        <div className="mb-6">
          <Link to="/portfolio">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回作品集
            </Button>
          </Link>
        </div>
        <div className="space-y-8">
          {/* Project Header */}
          <div className="space-y-4">
            <Badge variant="secondary" className="w-fit">
              {project.category}
            </Badge>
            <h1 className="text-3xl lg:text-4xl">{project.title}</h1>
            <div 
              className="text-xl text-muted-foreground prose max-w-none"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>

          {/* Project Image */}
          <div className="relative overflow-hidden rounded-lg">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Project Info */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-xl mb-4">專案介紹</h3>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.description }}
                />
                {/* 這裡可以添加更詳細的專案描述 */}
              </div>
            </div>

            <div className="space-y-6">
              {/* Tech Stack */}
              <div>
                <h4 className="mb-4">使用技術</h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div>
                <h4 className="mb-4">相關連結</h4>
                <div className="space-y-2">
                  {project.githubUrl && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        GitHub Repository
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div>
                <h4 className="mb-4">專案統計</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">觀看次數</span>
                    <span>{project.views}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">喜歡數量</span>
                    <span>{project.likes}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">建立日期</span>
                    <span>{project.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Like Button */}
              <Button
                onClick={handleLike}
                variant={isLiked ? 'default' : 'outline'}
                className="w-full"
                disabled={isLiked}
              >
                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? '已喜歡' : '喜歡這個專案'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}