import React from 'react';
import { motion } from 'framer-motion';
import { Users, Rocket, Award } from 'lucide-react';

const aboutItems = [
  {
    icon: <Users className="w-8 h-8" />,
    title: "Human-Centered Design",
    description: "Every solution starts with understanding human creativity and amplifying it through intelligent automation."
  },
  {
    icon: <Rocket className="w-8 h-8" />,
    title: "Innovation First",
    description: "Pushing boundaries with cutting-edge AI tools that transform how businesses operate and create."
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Proven Results",
    description: "Delivering measurable improvements through data visualization, automation, and creative AI solutions."
  }
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            The Future of <span className="text-gradient">Creative Technology</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            I build innovative AI-powered tools and dashboards for business improvement and automation. 
            My philosophy: In the new era, human creativity is our true superpower, while AI brings creative ideas to life.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {aboutItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.2 }}
              className="text-center p-6 rounded-xl glass-effect card-hover"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-primary">{item.icon}</div>
              </div>
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;