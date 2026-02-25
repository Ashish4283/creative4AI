import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles, Brain, Palette, Zap, ChevronDown, Hammer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection = ({ scrollToSection }) => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden hero-pattern pt-20 md:pt-0">
      <div className="absolute inset-0 gradient-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-primary/10 rounded-full px-4 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.8,
              type: 'spring',
              stiffness: 100,
              damping: 15,
              mass: 1,
            }}
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Where human creativity meets AI power</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Empowering Human{' '}
            <span className="text-gradient">Creativity</span>{' '}
            with AI Solutions
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            In the coming era, humans will have creativity—AI will bring it to life. 
            Discover innovative tools and dashboards that transform your vision into reality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="group interactive-button bg-purple-600 hover:bg-purple-700 text-white border-none">
              <Link to="/builder">
                <Hammer className="w-4 h-4 mr-2" />
                Launch Builder
              </Link>
            </Button>

            <Button 
              size="lg" 
              className="group interactive-button"
              onClick={() => scrollToSection('studio')}
            >
              See My Studio
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => scrollToSection('portfolio')}
            >
              <Play className="w-4 h-4 mr-2" />
              Explore AI Tools
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="absolute top-20 left-10 hidden md:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Brain className="w-8 h-8 text-primary" />
          </div>
        </motion.div>
        
        <motion.div
          className="absolute top-40 right-20 hidden md:block"
          animate={{
            y: [0, 12, 0],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
            <Palette className="w-6 h-6 text-accent" />
          </div>
        </motion.div>

        <motion.div className="absolute bottom-20 left-20 hidden md:block" animate={{ y: [0, -10, 0], x: [0, 10, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
          <div className="w-14 h-14 bg-secondary/20 rounded-full flex items-center justify-center">
            <Zap className="w-7 h-7 text-secondary-foreground" />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={() => scrollToSection('about')}
        role="button"
        aria-label="Scroll to about section"
      >
        <ChevronDown className="w-6 h-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
};

export default HeroSection;