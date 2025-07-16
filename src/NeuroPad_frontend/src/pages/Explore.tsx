import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Brain,
  Zap,
  DollarSign,
  Clock,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";

// Mock agent data
const agents = [
  {
    id: 1,
    name: "DataMiner Pro",
    description:
      "Advanced AI agent for cryptocurrency market analysis and prediction",
    category: "Finance",
    creator: "CryptoLabs",
    logo: "🤖",
    fundingGoal: 50000,
    currentFunding: 32500,
    backers: 156,
    rating: 4.8,
    tags: ["Trading", "Analytics", "DeFi"],
    status: "active",
    apy: "24.5%",
    featured: true,
  },
  {
    id: 2,
    name: "ContentCraft AI",
    description:
      "Creative AI that generates marketing content and social media posts",
    category: "Marketing",
    creator: "DigitalGenius",
    logo: "✨",
    fundingGoal: 25000,
    currentFunding: 18750,
    backers: 89,
    rating: 4.6,
    tags: ["Content", "Social Media", "Marketing"],
    status: "active",
    apy: "18.2%",
    featured: false,
  },
  {
    id: 3,
    name: "HealthCheck Bot",
    description: "Medical diagnosis assistant powered by machine learning",
    category: "Healthcare",
    creator: "MedTech Innovations",
    logo: "🏥",
    fundingGoal: 75000,
    currentFunding: 67500,
    backers: 203,
    rating: 4.9,
    tags: ["Healthcare", "Diagnosis", "ML"],
    status: "active",
    apy: "21.8%",
    featured: true,
  },
  {
    id: 4,
    name: "GameMaster AI",
    description: "Intelligent NPCs and procedural content generation for games",
    category: "Gaming",
    creator: "GameDev Studios",
    logo: "🎮",
    fundingGoal: 40000,
    currentFunding: 15600,
    backers: 78,
    rating: 4.4,
    tags: ["Gaming", "NPC", "Procedural"],
    status: "active",
    apy: "16.7%",
    featured: false,
  },
  {
    id: 5,
    name: "EcoTracker",
    description:
      "Environmental monitoring and sustainability optimization agent",
    category: "Environment",
    creator: "GreenTech",
    logo: "🌱",
    fundingGoal: 60000,
    currentFunding: 43200,
    backers: 134,
    rating: 4.7,
    tags: ["Environment", "Sustainability", "IoT"],
    status: "active",
    apy: "19.3%",
    featured: false,
  },
  {
    id: 6,
    name: "LegalBot Pro",
    description: "Legal document analysis and contract review automation",
    category: "Legal",
    creator: "LawTech Solutions",
    logo: "⚖️",
    fundingGoal: 55000,
    currentFunding: 49500,
    backers: 167,
    rating: 4.8,
    tags: ["Legal", "Documents", "Automation"],
    status: "active",
    apy: "22.1%",
    featured: true,
  },
];

const categories = [
  "All",
  "Finance",
  "Marketing",
  "Healthcare",
  "Gaming",
  "Environment",
  "Legal",
];
const sortOptions = ["Featured", "Funding Progress", "Rating", "APY"];

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");

  const filteredAgents = agents
    .filter((agent) => {
      const matchesSearch =
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "All" || agent.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "Featured":
          return b.featured ? 1 : -1;
        case "Funding Progress":
          return (
            b.currentFunding / b.fundingGoal - a.currentFunding / a.fundingGoal
          );
        case "Rating":
          return b.rating - a.rating;
        case "APY":
          return parseFloat(b.apy) - parseFloat(a.apy);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-background via-background to-neuro-50/10 dark:to-neuro-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore <span className="text-gradient">AI Agents</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover and invest in the most innovative AI agents across
              various industries
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents, categories, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass dark:glass-dark border-white/20"
                />
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={cn(
                      "glass dark:glass-dark border-white/20",
                      selectedCategory === category &&
                        "bg-neuro-gradient text-white",
                    )}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neuro-500"
                >
                  {sortOptions.map((option) => (
                    <option
                      key={option}
                      value={option}
                      className="bg-background"
                    >
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Agents Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mb-6 flex items-center justify-between"
          >
            <p className="text-muted-foreground">
              Showing {filteredAgents.length} agents
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchTerm}-${selectedCategory}-${sortBy}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAgents.map((agent, index) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link to={`/agent/${agent.id}`}>
                    <div className="glass dark:glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-full relative overflow-hidden">
                      {agent.featured && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-neuro-gradient text-white border-0">
                            Featured
                          </Badge>
                        </div>
                      )}

                      {/* Agent Logo and Info */}
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="text-3xl">{agent.logo}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold truncate group-hover:text-neuro-500 transition-colors">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {agent.creator}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {agent.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {agent.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Funding Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Funding Progress
                          </span>
                          <span className="font-medium">
                            {Math.round(
                              (agent.currentFunding / agent.fundingGoal) * 100,
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            (agent.currentFunding / agent.fundingGoal) * 100
                          }
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>${agent.currentFunding.toLocaleString()}</span>
                          <span>${agent.fundingGoal.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center text-sm border-t border-white/10 pt-4">
                        <div>
                          <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                            <Users className="w-3 h-3" />
                            <span>{agent.backers}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Backers
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center space-x-1 text-muted-foreground">
                            <Star className="w-3 h-3 fill-current text-yellow-500" />
                            <span>{agent.rating}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Rating
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-center space-x-1 text-green-500 font-medium">
                            <TrendingUp className="w-3 h-3" />
                            <span>{agent.apy}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            APY
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className="absolute inset-0 bg-neuro-gradient opacity-0 group-hover:opacity-5 transition-opacity rounded-2xl"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredAgents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more agents.
              </p>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
