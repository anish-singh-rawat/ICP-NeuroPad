import { motion } from "framer-motion";
import {
  Brain,
  Rocket,
  Shield,
  TrendingUp,
  Users,
  Globe,
  Target,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "AI Agent Marketplace",
    description:
      "Discover and deploy cutting-edge AI agents across finance, marketing, healthcare, and more. Our curated marketplace ensures quality and innovation.",
  },
  {
    icon: Rocket,
    title: "Token-Powered Launches",
    description:
      "Launch your AI agent with DIP-20 tokens on ICP. Secure funding through our transparent, decentralized launchpad with built-in success metrics.",
  },
  {
    icon: Shield,
    title: "Decentralized & Secure",
    description:
      "Built on Internet Computer Protocol for maximum security, transparency, and censorship resistance. Your agents run autonomously on-chain.",
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    description:
      "Real-time analytics and performance monitoring. Track earnings, user engagement, and optimize your AI agents for maximum profitability.",
  },
];

const stats = [
  { value: "1,247", label: "Active AI Agents", icon: Brain },
  { value: "$2.4M", label: "Total Funding Raised", icon: TrendingUp },
  { value: "15,600", label: "Community Members", icon: Users },
  { value: "94%", label: "Success Rate", icon: Target },
];

const team = [
  {
    name: "Sarah Rodriguez",
    role: "Co-Founder & CEO",
    bio: "Former AI researcher at Google, passionate about democratizing AI through blockchain technology.",
    image: "SR",
  },
  {
    name: "Michael Chen",
    role: "Co-Founder & CTO",
    bio: "Blockchain architect with 8+ years in DeFi. Previously led engineering at Chainlink.",
    image: "MC",
  },
  {
    name: "Dr. Emma Thompson",
    role: "Head of AI Research",
    bio: "PhD in Machine Learning from MIT. Published researcher in autonomous systems and multi-agent networks.",
    image: "ET",
  },
  {
    name: "David Kim",
    role: "Head of Product",
    bio: "Product strategist with expertise in Web3 UX. Former PM at Coinbase and Polygon.",
    image: "DK",
  },
];

const values = [
  {
    icon: Globe,
    title: "Open Innovation",
    description:
      "We believe AI should be accessible to everyone. Our platform democratizes AI development and deployment.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description:
      "Blockchain-based transparency ensures fair funding, clear metrics, and trustworthy AI agent performance.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "Our community drives innovation. Every decision is made with our creators and users in mind.",
  },
  {
    icon: Lightbulb,
    title: "Continuous Learning",
    description:
      "We're constantly evolving, learning from our community to build better tools and experiences.",
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-background via-background to-neuro-50/10 dark:to-neuro-950/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 glass dark:glass-dark px-4 py-2 rounded-full border border-white/20 mb-8">
              <Brain className="w-4 h-4 text-neuro-500" />
              <span className="text-sm font-medium">About NeuroPad</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Building the Future of{" "}
              <span className="text-gradient">Autonomous AI</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              NeuroPad is the premier platform for launching, funding, and
              scaling AI agents on the Internet Computer. We're democratizing AI
              innovation through blockchain technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/explore">
                <Button
                  size="lg"
                  className="bg-neuro-gradient hover:bg-neuro-gradient-dark text-white"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Explore Agents
                </Button>
              </Link>
              <Link to="/launch">
                <Button variant="outline" size="lg">
                  <Brain className="w-5 h-5 mr-2" />
                  Launch Your AI
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/10 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-neuro-gradient rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What <span className="text-gradient">We Do</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              NeuroPad bridges the gap between AI innovation and blockchain
              technology, creating a sustainable ecosystem for autonomous
              agents.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="glass dark:glass-dark rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-neuro-500/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-neuro-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient">Values</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we build and every decision
              we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="w-16 h-16 bg-neuro-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Icon className="w-8 h-8 text-neuro-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/10 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-gradient">Team</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Passionate innovators with decades of experience in AI,
              blockchain, and product development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="glass dark:glass-dark rounded-2xl p-6 border border-white/10 text-center"
              >
                <div className="w-20 h-20 rounded-2xl bg-neuro-gradient flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                  {member.image}
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-neuro-500 mb-3">{member.role}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
