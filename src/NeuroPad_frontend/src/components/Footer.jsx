import { motion } from "framer-motion";
import { Brain, Rocket, Users, ArrowUpRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <section className="py-24 dark:bg-black/20 relative overflow-hidden">
        <div className="absolute inset-0 "></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Launch{" "}
              <span className="text-gradient">Your AI Agent? </span>
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of innovators building the future of autonomous AI.
              Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/launch">
                <Button
                  size="lg"
                  className="group bg-white dark:bg-white/95 text-neuro-600 dark:text-neuro-700 hover:bg-white/90 dark:hover:bg-white/80 shadow-lg"
                >
                  <span className="flex items-center space-x-2">
                    <Rocket className="w-5 h-5" />
                    <span>Launch Now</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                </Button>
              </Link>
              <Link to="/explore">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/40 dark:border-white/30 text-white hover:bg-white/10 dark:hover:bg-white/5 backdrop-blur-sm"
                >
                  <span className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Join Community
                    </span>
                  </span>
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-muted/10 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-neuro-gradient flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">
                  NeuroPad
                </span>
              </Link>
              <p className="text-muted-foreground max-w-md">
                The premier platform for launching, funding, and scaling AI
                agents on the Internet Computer.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/explore"
                    className="hover:text-foreground transition-colors"
                  >
                    Explore Agents
                  </Link>
                </li>
                <li>
                  <Link
                    to="/launch"
                    className="hover:text-foreground transition-colors"
                  >
                    Launch Agent
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard"
                    className="hover:text-foreground transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wallet"
                    className="hover:text-foreground transition-colors"
                  >
                    Wallet
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    API Reference
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 NeuroPad. Built on Internet Computer Protocol.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
