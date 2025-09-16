import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Smartphone, Database, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useAppContext } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HomePage() {
  const { projects, categories, profile } = useAppContext();
  
  // Get featured projects (top 3 by likes)
  const featuredProjects = projects
    .filter(p => p.isActive)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  const stats = [
    { label: '完成專案', value: projects.filter(p => p.isActive).length, icon: Code },
    { label: '技術分類', value: categories.length, icon: Settings },
    { label: '總觀看數', value: projects.reduce((sum, p) => sum + p.views, 0), icon: Database },
    { label: '獲得喜歡', value: projects.reduce((sum, p) => sum + p.likes, 0), icon: Smartphone },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  軟體工程師作品集
                </Badge>
                <h1 className="text-4xl lg:text-6xl tracking-tight">
                  <span className="text-primary block">{profile.name}</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  {profile.bio}
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/portfolio">
                  <Button size="lg" className="group">
                    查看作品集
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">
                    關於我
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative z-10">
                <ImageWithFallback
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl transform rotate-3 scale-105 -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl">精選作品</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              以下是我最受歡迎的專案作品，展示了我在不同技術領域的能力
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <Card key={project.id} className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
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
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>❤️ {project.likes}</span>
                      <span>👁 {project.views}</span>
                    </div>
                    <Link to={`/portfolio?project=${project.id}`}>
                      <Button variant="ghost" size="sm" className="group">
                        查看詳情
                        <ArrowRight className="ml-1 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/portfolio">
              <Button variant="outline" size="lg">
                查看所有作品
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Overview */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl">技術領域</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              我專精於多個技術領域，為不同類型的專案提供全方位解決方案
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/portfolio/${category.id}`}
                className="group"
              >
                <Card className="h-full group-hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl">{category.icon}</div>
                    <div>
                      <h3 className="text-lg mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <Badge variant="secondary">
                        {category.projectCount} 個專案
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl">準備開始合作了嗎？</h2>
            <p className="text-xl text-muted-foreground">
              我很樂意討論您的專案需求，為您提供最佳的技術解決方案
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group">
                立即聯絡
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  了解更多
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}