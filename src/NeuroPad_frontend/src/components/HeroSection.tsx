import { motion } from "framer-motion";
import { ArrowRight, Play, Sparkles, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";

const stats = [
  { label: "Active Agents", value: "1,247", icon: Sparkles },
  { label: "Total Funded", value: "$2.4M", icon: TrendingUp },
  { label: "Success Rate", value: "94%", icon: Zap },
];

const TypewriterText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.05 }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + index * 0.015,
            duration: 0.05,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-neuro-50/20 dark:to-neuro-950/20">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neuro-500/20 rounded-full blur-3xl animate-pulse-glow"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-electric-500/20 rounded-full blur-3xl animate-pulse-glow"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center space-x-2 glass dark:glass-dark px-4 py-2 rounded-full border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-neuro-500 animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">
              AI Agent Launchpad on ICP
            </span>
          </motion.div>

          {/* Main Heading */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
            >
              <TypewriterText text="Launch. " delay={0.2} />
              <TypewriterText text="Fund. " delay={0.3} />
              <br />
              <span className="text-gradient">
                <TypewriterText text="Automate " delay={0.4} />
              </span>
              <TypewriterText text="AI Agents" delay={0.6} />
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.3}}
              className="text-xl md:text-2xl text-muted-foreground font-light"
            >
              The future of autonomous AI is on-chain
            </motion.h2>
          </div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="max-w-2xl mx-auto text-lg text-muted-foreground leading-relaxed"
          >
            Discover, fund, and deploy intelligent AI agents on the Internet
            Computer. Join the revolution where artificial intelligence meets
            decentralized finance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/explore">
              <Button
                size="lg"
                className="group relative bg-neuro-gradient hover:bg-neuro-gradient-dark text-white shadow-electric hover:shadow-electric/50 transition-all duration-300"
              >
                <span className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>Explore Agents</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shimmer"></div>
              </Button>
            </Link>

            <Link to="/launch">
              <Button
                variant="outline"
                size="lg"
                className="group glass dark:glass-dark border-white/20 hover:bg-white/10"
              >
                <span className="flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>Launch Your Agent</span>
                </span>
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.3}}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-16"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1, duration: 0}}
                  className="glass dark:glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20  group"
                >
                  <motion.div
                    whileHover={{ scale: 1 }}
                    className="flex flex-col items-center space-y-2"
                  >
                    <div className="p-2 rounded-lg bg-neuro-500/10 group-hover:bg-neuro-500/20 transition-colors">
                      <Icon className="w-6 h-6 text-neuro-500" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.4  }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-6 h-10 border border-white/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
            className="w-1 h-2 bg-neuro-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
