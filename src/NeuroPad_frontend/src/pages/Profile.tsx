import { motion } from "framer-motion";
import {
  Brain,
  Rocket,
  Shield,
  TrendingUp,
  Users,
  Zap,
  Globe,
  Target,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  ExternalLink,
  Twitter,
  Github,
  Wallet,
  Calendar,
  Building,
  Heart,
  Code,
  Lightbulb,
  Coins,
  Copy,
  Edit,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export default function Profile() {
  const mockUser = {
    name: "Alex Chen",
    bio: "AI researcher and blockchain enthusiast building the future of autonomous agents",
    walletAddress: "0x742d35Cc6532C02bb16E2a8E0B4E5a6E2C5C0C5E",
    balance: {
      npt: 15250,
      icp: 8.45,
      ckbtc: 0.0012,
    },
    website: "https://alexchen.dev",
    twitter: "@alexchen_ai",
    github: "alexchen",
    joinDate: "2024-01-15",
    totalProjects: 7,
    totalFunding: 125000,
    successRate: 94,
    avatar: "AC",
    badges: ["Early Adopter", "Top Creator", "Verified"],
    recentProjects: [
      { name: "DataMiner Pro", status: "active", funding: 32500 },
      { name: "ContentCraft AI", status: "completed", funding: 18750 },
      { name: "TradingBot Elite", status: "funding", funding: 8900 },
    ],
  };

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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
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
              User <span className="text-gradient">Profile Experience</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A glimpse into how creators and innovators showcase their work on
              NeuroPad
            </p>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="glass dark:glass-dark rounded-3xl border border-white/10 overflow-hidden">
              {/* Profile Header */}
              <div className="relative h-32 bg-neuro-gradient">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute -bottom-16 left-8">
                  <div className="w-32 h-32 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-3xl font-bold text-neuro-600 border-4 border-white dark:border-gray-800 shadow-xl">
                    {mockUser.avatar}
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-20 p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Main Profile Info */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Name and Bio */}
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold">{mockUser.name}</h3>
                        <div className="flex space-x-1">
                          {mockUser.badges.map((badge) => (
                            <Badge
                              key={badge}
                              className="bg-neuro-500/10 text-neuro-600 dark:text-neuro-400"
                            >
                              {badge}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {mockUser.bio}
                      </p>

                      {/* Social Links */}
                      <div className="flex items-center space-x-4">
                        {mockUser.website && (
                          <a
                            href={mockUser.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm text-neuro-500 hover:text-neuro-600 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            <span>Website</span>
                          </a>
                        )}
                        {mockUser.twitter && (
                          <a
                            href={`https://twitter.com/${mockUser.twitter.replace("@", "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm text-neuro-500 hover:text-neuro-600 transition-colors"
                          >
                            <Twitter className="w-4 h-4" />
                            <span>{mockUser.twitter}</span>
                          </a>
                        )}
                        {mockUser.github && (
                          <a
                            href={`https://github.com/${mockUser.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm text-neuro-500 hover:text-neuro-600 transition-colors"
                          >
                            <Github className="w-4 h-4" />
                            <span>{mockUser.github}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Wallet Address */}
                    <div className="bg-muted/20 dark:bg-black/20 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Wallet Address
                          </p>
                          <div className="flex items-center space-x-2">
                            <code className="text-sm font-mono">
                              {mockUser.walletAddress.slice(0, 10)}...
                              {mockUser.walletAddress.slice(-8)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                copyToClipboard(mockUser.walletAddress)
                              }
                              className="w-8 h-8 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Wallet className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Recent Projects */}
                    <div>
                      <h4 className="font-semibold mb-4">Recent Projects</h4>
                      <div className="space-y-3">
                        {mockUser.recentProjects.map((project, index) => (
                          <div
                            key={project.name}
                            className="flex items-center justify-between p-3 bg-muted/10 dark:bg-black/10 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-neuro-gradient flex items-center justify-center text-white text-xs font-bold">
                                {project.name
                                  .split(" ")
                                  .map((w) => w[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium">{project.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  ${project.funding.toLocaleString()} funded
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                project.status === "active"
                                  ? "default"
                                  : project.status === "completed"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {project.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Stats Sidebar */}
                  <div className="space-y-6">
                    {/* Wallet Balance */}
                    <div className="glass dark:glass-dark rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-neuro-500" />
                        <span>Wallet Balance</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            NPT
                          </span>
                          <span className="font-mono">
                            {mockUser.balance.npt.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            ICP
                          </span>
                          <span className="font-mono">
                            {mockUser.balance.icp}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">
                            ckBTC
                          </span>
                          <span className="font-mono">
                            {mockUser.balance.ckbtc}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="glass dark:glass-dark rounded-xl p-6 border border-white/10">
                      <h4 className="font-semibold mb-4 flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-neuro-500" />
                        <span>Creator Stats</span>
                      </h4>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-neuro-500">
                            {mockUser.totalProjects}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Projects
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-500">
                            ${mockUser.totalFunding.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Total Funding
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-500">
                            {mockUser.successRate}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Success Rate
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="glass dark:glass-dark rounded-xl p-6 border border-white/10">
                      <div className="flex items-center space-x-3">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Member since
                          </p>
                          <p className="font-medium">
                            {new Date(mockUser.joinDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
