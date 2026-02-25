import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Star } from 'lucide-react';

export const ProjectCard = ({ project, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-xl glass-effect card-hover shine-effect flex flex-col ${
        project.featured ? 'md:col-span-2 lg:col-span-2' : ''
      }`}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          src={project.imageSrc}
          alt={project.imageAlt}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {project.featured && (
          <div className="absolute top-4 right-4">
            <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </div>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center mb-3">
            <div className="text-primary mr-2">{project.icon}</div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
              {project.title}
            </h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">{project.description}</p>

          {project.impact && (
            <div className="mt-4 pt-4 border-t border-border/20">
              <h4 className="text-sm font-semibold text-primary mb-2">Key Impact</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{project.impact}</p>
            </div>
          )}
          {project.techStack && (
            <div className="mt-4 pt-4 border-t border-border/20">
              <h4 className="text-sm font-semibold text-primary mb-2">Tech Stack</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{project.techStack}</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          {project.demoUrl ? (
            <Button asChild variant="outline" size="sm" className="w-full group">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                View Demo
                <Play className="w-3 h-3 ml-2 group-hover:scale-110 transition-transform" />
              </a>
            </Button>
          ) : (
            <Button asChild variant="outline" size="sm" className="w-full group">
              <a href={`mailto:ashish@creativeforai.com?subject=Demo%20Request:%20${encodeURIComponent(project.title)}`} target="_blank" rel="noopener noreferrer">
                Request Demo
                <ArrowRight className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};