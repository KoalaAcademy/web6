import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { useAppContext } from '../App';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const location = useLocation();
  const { isAdmin, setIsAdmin, profile } = useAppContext();

  const navigationItems = [
    { path: '/', label: '首頁', name: 'home' },
    { path: '/portfolio', label: '作品集', name: 'portfolio' },
    { path: '/about', label: '關於我', name: 'about' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const handleAdminLogin = () => {
    // 簡單的示例登入邏輯，實際應用中會有真實的認證
    const password = prompt('請輸入管理員密碼:');
    if (password === 'admin') {
      setIsAdmin(true);
      setShowAdminMenu(false);
    } else {
      alert('密碼錯誤');
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setShowAdminMenu(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">P</span>
            </div>
            <span className="font-medium text-foreground">Portfolio</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`relative px-3 py-2 transition-colors duration-200 ${
                  isActivePath(item.path)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Admin Menu & Mobile Toggle */}
          <div className="flex items-center space-x-4">
            {/* Admin Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdminMenu(!showAdminMenu)}
                className="hidden md:flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>{isAdmin ? '管理員' : '登入'}</span>
              </Button>

              {showAdminMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-2 z-50">
                  {!isAdmin ? (
                    <button
                      onClick={handleAdminLogin}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                    >
                      管理員登入
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        onClick={() => setShowAdminMenu(false)}
                      >
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4" />
                          <span>管理後台</span>
                        </div>
                      </Link>
                      <button
                        onClick={handleAdminLogout}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors"
                      >
                        <div className="flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>登出</span>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <nav className="py-4 space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Admin Options */}
              <div className="border-t border-border pt-2 mt-2">
                {!isAdmin ? (
                  <button
                    onClick={handleAdminLogin}
                    className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    管理員登入
                  </button>
                ) : (
                  <>
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      管理後台
                    </Link>
                    <button
                      onClick={handleAdminLogout}
                      className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                    >
                      登出
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}