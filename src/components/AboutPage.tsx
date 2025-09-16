import React from "react";
import {
  Mail,
  Github,
  Linkedin,
  Globe,
  Download,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { useAppContext } from "../App";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function AboutPage() {
  const { profile, projects, categories } = useAppContext();

  const handleDownloadResume = () => {
    // 創建一個簡單的 HTML 履歷
    const resumeContent = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${profile.name} - 履歷</title>
    <style>
        body { font-family: 'Microsoft JhengHei', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 2px solid #0B5FFF; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #0B5FFF; margin: 0; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #0B5FFF; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
        .experience-item { margin-bottom: 20px; }
        .experience-item h3 { margin: 0; color: #333; }
        .experience-item .company { color: #0B5FFF; font-weight: bold; }
        .experience-item .period { color: #666; font-size: 0.9em; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill-tag { background: #f0f8ff; color: #0B5FFF; padding: 5px 10px; border-radius: 15px; font-size: 0.9em; }
        ul { padding-left: 20px; }
        li { margin-bottom: 5px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${profile.name}</h1>
        <p>${profile.title}</p>
        <p>Email: ${profile.email} | GitHub: ${profile.github} | LinkedIn: ${profile.linkedin}</p>
    </div>
    
    <div class="section">
        <h2>關於我</h2>
        <p>${profile.bio}</p>
    </div>
    
    <div class="section">
        <h2>技能專長</h2>
        <div class="skills">
            ${skills.map((skill) => `<span class="skill-tag">${skill.name}</span>`).join("")}
        </div>
    </div>
    
    <div class="section">
        <h2>工作經歷</h2>
        ${experience
          .map(
            (exp) => `
            <div class="experience-item">
                <h3>${exp.title}</h3>
                <div class="company">${exp.company}</div>
                <div class="period">${exp.period} | ${exp.location}</div>
                <ul>
                    ${exp.description.map((desc) => `<li>${desc}</li>`).join("")}
                </ul>
                <div class="skills">
                    ${exp.technologies.map((tech) => `<span class="skill-tag">${tech}</span>`).join("")}
                </div>
            </div>
        `,
          )
          .join("")}
    </div>
    
    <div class="section">
        <h2>學歷背景</h2>
        ${education
          .map(
            (edu) => `
            <div class="experience-item">
                <h3>${edu.degree}</h3>
                <div class="company">${edu.school}</div>
                <div class="period">${edu.period}</div>
                <p>${edu.description}</p>
            </div>
        `,
          )
          .join("")}
    </div>
    
    <div class="section">
        <h2>專業認證</h2>
        <ul>
            ${certifications.map((cert) => `<li>${cert}</li>`).join("")}
        </ul>
    </div>
</body>
</html>
    `;

    const blob = new Blob([resumeContent], {
      type: "text/html;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${profile.name}_履歷.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const skills = [
    {
      name: "JavaScript/TypeScript",
      level: 95,
      category: "Frontend",
    },
    { name: "React/Next.js", level: 90, category: "Frontend" },
    { name: "Node.js/Express", level: 85, category: "Backend" },
    { name: "Python/Django", level: 80, category: "Backend" },
    {
      name: "Database (SQL/NoSQL)",
      level: 85,
      category: "Backend",
    },
    { name: "AWS/Azure", level: 75, category: "DevOps" },
    {
      name: "Docker/Kubernetes",
      level: 70,
      category: "DevOps",
    },
    { name: "Git/GitHub", level: 95, category: "Tools" },
  ];

  const experience = [
    {
      title: "Senior Full Stack Developer",
      company: "科技公司 A",
      period: "2022 - 現在",
      location: "台北市",
      description: [
        "負責前後端架構設計與開發",
        "領導團隊開發大型電商平台",
        "實施CI/CD流程，提升部署效率50%",
        "指導初級開發者，提升團隊技術水平",
      ],
      technologies: ["React", "Node.js", "AWS", "MongoDB"],
    },
    {
      title: "Full Stack Developer",
      company: "新創公司 B",
      period: "2020 - 2022",
      location: "台北市",
      description: [
        "從零開始建構公司核心產品",
        "開發響應式網頁應用程式",
        "建立RESTful API與資料庫設計",
        "負責產品的用戶體驗優化",
      ],
      technologies: [
        "Vue.js",
        "Python",
        "PostgreSQL",
        "Docker",
      ],
    },
    {
      title: "Junior Developer",
      company: "軟體公司 C",
      period: "2018 - 2020",
      location: "新北市",
      description: [
        "參與多個網頁開發專案",
        "學習現代前端框架與工具",
        "協助維護既有系統與功能開發",
        "參與代碼審查與測試工作",
      ],
      technologies: ["HTML/CSS", "JavaScript", "PHP", "MySQL"],
    },
  ];

  const education = [
    {
      degree: "資訊工程學士",
      school: "國立大學",
      period: "2014 - 2018",
      description: "主修軟體工程、資料結構與演算法、資料庫系統",
    },
  ];

  const certifications = [
    "AWS Certified Solutions Architect",
    "Google Cloud Professional Developer",
    "MongoDB Certified Developer",
    "Certified Kubernetes Administrator",
  ];

  const stats = [
    { label: "工作經驗", value: "5+ 年" },
    { label: "完成專案", value: `${projects.length}+` },
    { label: "技術領域", value: `${categories.length}+` },
    { label: "程式語言", value: "8+" },
  ];

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 lg:px-6">
        {/* Profile Section */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <ImageWithFallback
                      src={profile.avatar}
                      alt={profile.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h1 className="text-2xl mb-2">
                        {profile.name}
                      </h1>
                      <p className="text-lg opacity-90">
                        {profile.title}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>台北市, 台灣</span>
                    </div>

                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>5+ 年工作經驗</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      {stats.map((stat, index) => (
                        <div
                          key={index}
                          className="text-center"
                        >
                          <div className="text-2xl text-primary">
                            {stat.value}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {stat.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a href={`mailto:${profile.email}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="w-4 h-4 mr-2" />
                          GitHub
                        </a>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                      >
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      </Button>
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleDownloadResume}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下載履歷
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <div>
                <h2 className="text-2xl mb-4">關於我</h2>
                <div className="prose max-w-none text-muted-foreground leading-relaxed">
                  <p className="mb-4">{profile.bio}</p>
                  <p className="mb-4">
                    我熱愛探索新技術，持續學習業界最新的開發框架和工具。在過去的工作經驗中，
                    我參與了多個大型專案的開發，從前端用戶界面到後端API設計，
                    都有豐富的實戰經驗。
                  </p>
                  <p>
                    除了技術開發，我也重視團隊合作與知識分享。我經常在公司內部進行技術分享，
                    幫助團隊成員提升技能。我相信優秀的軟體不僅需要紮實的技術基礎，
                    更需要良好的溝通與協作能力。
                  </p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <h2 className="text-2xl mb-6">技能專長</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {skill.name}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {skill.category}
                        </Badge>
                      </div>
                      <Progress
                        value={skill.level}
                        className="h-2"
                      />
                      <div className="text-xs text-muted-foreground text-right">
                        {skill.level}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-2xl mb-8">工作經歷</h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          {exp.title}
                        </h3>
                        <p className="text-primary">
                          {exp.company}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {exp.period}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-3 h-3 mr-1" />
                          {exp.location}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-3">
                      <ul className="space-y-2 mb-4">
                        {exp.description.map((item, i) => (
                          <li
                            key={i}
                            className="text-muted-foreground"
                          >
                            • {item}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Education & Certifications */}
        <section className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education */}
            <div>
              <h2 className="text-2xl mb-6">學歷背景</h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="font-medium mb-1">
                        {edu.degree}
                      </h3>
                      <p className="text-primary mb-1">
                        {edu.school}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {edu.period}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {edu.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h2 className="text-2xl mb-6">專業認證</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    {certifications.map((cert, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3"
                      >
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span>{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center py-12 bg-muted/30 rounded-2xl">
          <h2 className="text-2xl mb-4">讓我們一起合作</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            如果您有有趣的專案想要討論，或者對我的經驗有任何疑問，
            歡迎隨時與我聯繫。我很樂意與您分享我的想法和經驗。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild></Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn聯絡
              </a>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}