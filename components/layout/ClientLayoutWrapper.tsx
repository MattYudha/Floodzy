'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { SplashScreen } from './SplashScreen';
import { Button } from '@/components/ui/Button'; // Import Button
import { WeatherPopupContent } from '@/components/weather-shortcut'; // Import WeatherPopupContent

interface SidebarContextType {
  isCollapsed: boolean;
  isDesktop: boolean;
}

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};


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
  const [isWeatherPopupOpen, setIsWeatherPopupOpen] = useState(false); // State for weather popup

  useEffect(() => {
    if (sessionStorage.getItem('splashShown')) {
      setShowSplash(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 6000);

    const hideTimer = setTimeout(() => {
      setShowSplash(false);
      sessionStorage.setItem('splashShown', 'true');
    }, 6000);

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
        onOpenWeatherPopup={() => setIsWeatherPopupOpen(true)}
      />

      <SidebarContext.Provider value={{ isCollapsed, isDesktop }}>
        <div
          className={`flex flex-col flex-1 transition-all duration-300
          ${isDesktop ? (isCollapsed ? 'ml-16' : 'ml-64') : 'ml-0'}
        `}
        >
          <Header onMenuToggle={toggleMobileSidebar} isMenuOpen={isSidebarOpen} />
          <main className="flex-1 p-4">{children}</main>

          

          {/* Popup Cuaca */}
          {isWeatherPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
              <div className="bg-transparent p-0 rounded-none shadow-none max-w-md w-full relative">
                {/* Close button, positioned relative to the card */}
                <button
                  onClick={() => setIsWeatherPopupOpen(false)}
                  className="absolute top-2 right-2 h-10 w-10 rounded-full bg-blue-800/50 border border-blue-700/60 text-blue-100 hover:bg-blue-700/60 flex items-center justify-center text-2xl font-bold shadow-lg z-10"
                >
                  &times;
                </button>
                <WeatherPopupContent />
              </div>
            </div>
          )}
        </div>
      </SidebarContext.Provider>
    </div>
  );
}