import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/sections/Navbar';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import StudioServicesSection from '@/components/sections/StudioServicesSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/sections/Footer';

const Home = () => {
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    toast({
      title: `Switched to ${!isDark ? 'dark' : 'light'} mode`,
      description: "Theme updated successfully!",
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const handleContactClick = () => {
    toast({ title: "Let's Connect!", description: "Ready to bring your creative vision to life?" });
    scrollToSection('contact');
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar isDark={isDark} toggleTheme={toggleTheme} scrollToSection={scrollToSection} activeSection={activeSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <AboutSection />
      <PortfolioSection />
      <StudioServicesSection scrollToSection={scrollToSection} />
      <ContactSection handleContactClick={handleContactClick} />
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

export default Home;