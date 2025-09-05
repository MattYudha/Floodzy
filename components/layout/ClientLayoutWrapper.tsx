'use client';

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SplashScreen } from './SplashScreen';

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [showSplash, setShowSplash] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
      return;
    }

    // Increased timing to ensure proper 3D loading
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 6000); // Increased from 3000 to 6000

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 6500); // Increased from 3500 to 6500

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) {
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
      setIsCollapsed(true);
    }
  }, [isDesktop]);

  const toggleMobileSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapsedState = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (showSplash) {
    return <SplashScreen isFadingOut={isFadingOut} />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isCollapsed}
        setIsCollapsed={toggleCollapsedState}
      />

      <div
        className={`flex flex-col flex-1 transition-all duration-300
        ${
          isDesktop
            ? isCollapsed
              ? 'ml-16'
              : 'ml-64'
            : 'ml-0'
        }
      `}
      >
        <Header
          onMenuToggle={toggleMobileSidebar}
          isMenuOpen={isSidebarOpen}
        />
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
