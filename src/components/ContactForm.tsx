import React, { useState } from 'react';
import { Send, Mail, Phone, MapPin, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

export function ContactForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 模擬API調用 - 實際應用中會發送到後端
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 這裡會調用實際的API
      // const response = await api.submitContact(formData);
      
      toast.success('訊息已成功發送！我會盡快回覆您。');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsOpen(false);
    } catch (error) {
      toast.error('發送失敗，請稍後再試。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <>
      {/* Floating Contact Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Mail className="w-5 h-5 mr-2" />
          聯絡我
        </Button>
      </div>

      {/* Contact Form Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">聯絡我</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-muted-foreground">
                有任何問題或合作機會，歡迎與我聯絡
              </p>
            </CardHeader>

            <CardContent className="p-6 overflow-y-auto">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Contact Info */}
                <div className="space-y-6">
                  <h3 className="font-medium mb-4">聯絡資訊</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">Email</p>
                        <p className="text-sm text-muted-foreground">
                          developer@example.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">電話</p>
                        <p className="text-sm text-muted-foreground">
                          +886 912-345-678
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium mb-1">地址</p>
                        <p className="text-sm text-muted-foreground">
                          台北市, 台灣
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      通常在24小時內回覆
                    </p>
                  </div>
                </div>

                {/* Contact Form */}
                <div className="lg:col-span-2">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          姓名 *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="您的姓名"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        主旨
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="訊息主旨"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        訊息內容 *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="請描述您的需求或問題..."
                        rows={6}
                        required
                      />
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <p className="text-xs text-muted-foreground">
                        * 為必填欄位
                      </p>
                      <div className="flex space-x-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsOpen(false)}
                        >
                          取消
                        </Button>
                        <Button
                          type="submit"
                          disabled={!isFormValid || isSubmitting}
                          className="min-w-[100px]"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center">
                              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                              發送中...
                            </div>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              發送訊息
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer Contact Section - Always visible at bottom */}
      <footer className="bg-muted/30 border-t border-border mt-20">
        <div className="container mx-auto px-4 lg:px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">聯絡方式</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>developer@example.com</p>
                <p>+886 912-345-678</p>
                <p>台北市, 台灣</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">社群媒體</h3>
              <div className="space-y-2">
                <a
                  href="https://github.com/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  個人網站
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">服務項目</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>網頁開發</p>
                <p>行動應用</p>
                <p>系統整合</p>
                <p>技術諮詢</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-4">快速聯絡</h3>
              <Button
                onClick={() => setIsOpen(true)}
                className="w-full"
                variant="outline"
              >
                <Mail className="w-4 h-4 mr-2" />
                發送訊息
              </Button>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 {formData.name || '張軟體工程師'}. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}