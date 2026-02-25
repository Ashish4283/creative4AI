import React from 'react';
import { motion } from 'framer-motion';
import { Video, BarChart3, Palette, Brain, Rocket } from 'lucide-react';
import WorkstationImg from '../../img/Portfolio/workstation.png';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: "AI Video Generation",
    description: "Create stunning videos with AI-powered generation, editing, and enhancement tools.",
    icon: <Video className="w-5 h-5" />
  },
  {
    title: "Data Visualization",
    description: "Transform complex datasets into beautiful, interactive visualizations and dashboards.",
    icon: <BarChart3 className="w-5 h-5" />
  },
  {
    title: "Creative Automation",
    description: "Automate repetitive creative tasks while maintaining artistic integrity and vision.",
    icon: <Palette className="w-5 h-5" />
  },
  {
    title: "Business Intelligence",
    description: "AI-powered insights and analytics to drive smarter business decisions.",
    icon: <Brain className="w-5 h-5" />
  }
];

const StudioServicesSection = ({ scrollToSection }) => {
  return (
    <section id="studio" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            AI Studio <span className="text-gradient">Solutions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover and launch new AI-powered solutions tailored to your creative and business needs.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <img
              className="w-full rounded-xl shadow-2xl"
              src={WorkstationImg}
              alt="AI Studio Workstation"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            className="space-y-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="text-primary">{service.icon}</div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm">{service.description}</p>
                </div>
              </motion.div>
            ))}

            <Button size="lg" className="w-full group" onClick={() => scrollToSection('contact')}>
              Start Your Project
              <Rocket className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StudioServicesSection;