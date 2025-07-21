import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  Search,
  Rocket,
  BarChart3,
  User,
  Wallet,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import ConnectModal from "./ConnectModal";
import { useAuth } from "../auth/useAuthClient";


const navigation = [
  { name: "Home", href: "/", icon: Sparkles },
  { name: "Explore", href: "/explore", icon: Search },
  { name: "Launch", href: "/launch", icon: Rocket },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
  { name: "About", href: "/about", icon: User },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Navbar() {
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const location = useLocation();
    const { principal, backendActor, isAuthenticated, login } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);

    setIsDark(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const isActive = (href: string) => location.pathname === href;

    return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass dark:glass-dark border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-8 h-8 rounded-lg bg-neuro-gradient flex items-center justify-center shadow-electric">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -inset-1 bg-neuro-gradient rounded-lg opacity-20 blur-sm group-hover:opacity-40 transition-opacity"></div>
            </motion.div>
            <span className="text-xl font-bold text-gradient">NeuroPad</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} to={item.href}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    <div
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                        isActive(item.href)
                          ? "bg-neuro-500/10 text-neuro-600 dark:text-neuro-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-neuro-500 rounded-full"
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          
          <div className="flex items-center space-x-2">
            {/* Wallet Button */}
            {
              isAuthenticated ? 
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConnectModalOpen(true)}
              className="hidden sm:flex items-center space-x-2 glass dark:glass-dark border-white/20 hover:bg-white/10"
            >
              <Wallet className="w-4 h-4" />
              <span>Connected</span>
            </Button>
            : 
             <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConnectModalOpen(true)}
              className="hidden sm:flex items-center space-x-2 glass dark:glass-dark border-white/20 hover:bg-white/10"
            >
              <Wallet className="w-4 h-4" />
              <span>Connect</span>
            </Button>
            }

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg glass dark:glass-dark border border-white/20 hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="w-4 h-4 text-yellow-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="w-4 h-4 text-neuro-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg glass dark:glass-dark border border-white/20"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>


        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/10 glass dark:glass-dark"
          >
            <div className="px-4 py-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={cn(
                        "flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-neuro-500/10 text-neuro-600 dark:text-neuro-400"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </motion.div>
                  </Link>
                );
              })}

              {/* Mobile Wallet Button */}
              <motion.div whileHover={{ x: 4 }} className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsConnectModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start glass dark:glass-dark border-white/20"
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect Modal */}
      <ConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
      />
    </motion.nav>
  );
}