import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  Users,
  DollarSign,
  Activity,
  Search,
  Filter,
  ExternalLink,
  TrendingUp,
  Calendar,
  Coins,
  Eye,
  MoreHorizontal,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";

// Mock data for dashboard
const agents = [
  {
    id: 1,
    name: "DataMiner Pro",
    description:
      "Advanced AI agent for cryptocurrency market analysis and prediction with real-time data processing",
    stakedUsers: [
      { address: "0x123...abc", amount: 5000 },
      { address: "0x456...def", amount: 3200 },
      { address: "0x789...ghi", amount: 7800 },
    ],
    totalParticipants: 156,
    totalSupply: 1000000,
    launchDate: "2024-01-15",
    website: "https://dataminer-pro.ai",
    status: "active",
    fundingProgress: 65,
    apy: "24.5%",
    category: "Finance",
    creator: "CryptoLabs",
  },
  {
    id: 2,
    name: "ContentCraft AI",
    description:
      "Creative AI assistant for marketing content generation and social media automation",
    stakedUsers: [
      { address: "0xabc...123", amount: 2500 },
      { address: "0xdef...456", amount: 4100 },
    ],
    totalParticipants: 89,
    totalSupply: 750000,
    launchDate: "2024-01-22",
    website: "https://contentcraft.io",
    status: "active",
    fundingProgress: 45,
    apy: "18.2%",
    category: "Marketing",
    creator: "DigitalGenius",
  },
  {
    id: 3,
    name: "HealthCheck Bot",
    description:
      "Medical diagnosis assistant powered by machine learning for preliminary health screening",
    stakedUsers: [
      { address: "0x111...222", amount: 8900 },
      { address: "0x333...444", amount: 5600 },
      { address: "0x555...666", amount: 3400 },
    ],
    totalParticipants: 203,
    totalSupply: 1200000,
    launchDate: "2024-01-10",
    website: "https://healthcheck-ai.com",
    status: "completed",
    fundingProgress: 100,
    apy: "21.8%",
    category: "Healthcare",
    creator: "MedTech Innovations",
  },
  {
    id: 4,
    name: "GameMaster AI",
    description:
      "Intelligent NPCs and procedural content generation for immersive gaming experiences",
    stakedUsers: [{ address: "0x777...888", amount: 1200 }],
    totalParticipants: 34,
    totalSupply: 500000,
    launchDate: "2024-02-01",
    website: "https://gamemaster-ai.dev",
    status: "funding",
    fundingProgress: 15,
    apy: "16.7%",
    category: "Gaming",
    creator: "GameDev Studios",
  },
  {
    id: 5,
    name: "LegalBot Pro",
    description:
      "Legal document analysis and contract review automation for law firms and businesses",
    stakedUsers: [],
    totalParticipants: 0,
    totalSupply: 800000,
    launchDate: "2024-02-05",
    website: "https://legalbot-pro.law",
    status: "failed",
    fundingProgress: 8,
    apy: "0%",
    category: "Legal",
    creator: "LawTech Solutions",
  },
];

const statusConfig : any = {
  active: {
    label: "Active",
    color: "bg-green-500",
    textColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    icon: CheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-blue-500",
    textColor: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    icon: CheckCircle,
  },
  funding: {
    label: "Funding",
    color: "bg-yellow-500",
    textColor: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
    icon: Clock,
  },
  failed: {
    label: "Failed",
    color: "bg-red-500",
    textColor: "text-red-700 dark:text-red-400",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    icon: XCircle,
  },
};

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = [
    {
      title: "Total Agents",
      value: agents.length.toString(),
      icon: BarChart3,
      color: "neuro",
    },
    {
      title: "Active Agents",
      value: agents.filter((a) => a.status === "active").length.toString(),
      icon: Activity,
      color: "green",
    },
    {
      title: "Total Participants",
      value: agents
        .reduce((sum, agent) => sum + agent.totalParticipants, 0)
        .toLocaleString(),
      icon: Users,
      color: "blue",
    },
    {
      title: "Avg. APY",
      value: "20.8%",
      icon: TrendingUp,
      color: "electric",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Agent Dashboard</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Monitor and manage AI agents across the NeuroPad ecosystem
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.title}
                  className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl p-6 border border-white/10 mb-8"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 glass dark:glass-dark border-white/20"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent border border-white/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neuro-500"
                >
                  <option value="all" className="bg-background">
                    All Status
                  </option>
                  <option value="active" className="bg-background">
                    Active
                  </option>
                  <option value="completed" className="bg-background">
                    Completed
                  </option>
                  <option value="funding" className="bg-background">
                    Funding
                  </option>
                  <option value="failed" className="bg-background">
                    Failed
                  </option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Agents Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="glass dark:glass-dark rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-6 border-b border-white/10 bg-muted/20 text-sm font-medium text-muted-foreground">
              <div className="col-span-3">Agent</div>
              <div className="col-span-2 hidden md:block">Participants</div>
              <div className="col-span-2 hidden lg:block">Token Supply</div>
              <div className="col-span-2 hidden lg:block">Launch Date</div>
              <div className="col-span-2 hidden md:block">Status</div>
              <div className="col-span-1">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/10">
              {filteredAgents.map((agent, index) => {
                const status = statusConfig[agent.status];
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="grid grid-cols-12 gap-4 p-6 hover:bg-muted/10 transition-colors group"
                  >
                    {/* Agent Info */}
                    <div className="col-span-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-neuro-gradient flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {agent.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground group-hover:text-neuro-500 transition-colors truncate">
                            {agent.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {agent.description}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {agent.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              by {agent.creator}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="col-span-2 hidden md:flex flex-col justify-center">
                      <div className="flex items-center space-x-2 mb-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {agent.totalParticipants}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {agent.stakedUsers.length} stakers
                      </div>
                      {agent.stakedUsers.length > 0 && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Top:{" "}
                          {Math.max(...agent.stakedUsers.map((u) => u.amount))}{" "}
                          NPT
                        </div>
                      )}
                    </div>

                    {/* Token Supply */}
                    <div className="col-span-2 hidden lg:flex flex-col justify-center">
                      <div className="flex items-center space-x-2 mb-1">
                        <Coins className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {agent.totalSupply.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Supply
                      </div>
                      {agent.apy !== "0%" && (
                        <div className="text-xs text-green-500 mt-1">
                          {agent.apy} APY
                        </div>
                      )}
                    </div>

                    {/* Launch Date */}
                    <div className="col-span-2 hidden lg:flex flex-col justify-center">
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">
                          {new Date(agent.launchDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Launch Date
                      </div>
                      {agent.status === "funding" && (
                        <div className="mt-2">
                          <Progress
                            value={agent.fundingProgress}
                            className="h-1.5"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            {agent.fundingProgress}% funded
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Status */}
                    <div className="col-span-2 hidden md:flex flex-col justify-center">
                      <div className="flex items-center space-x-2">
                        <Badge
                          className={cn(
                            "flex items-center space-x-1",
                            status.bgColor,
                            status.textColor,
                          )}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{status.label}</span>
                        </Badge>
                      </div>
                      {agent.website && (
                        <a
                          href={agent.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs text-neuro-500 hover:text-neuro-600 transition-colors mt-1"
                        >
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {filteredAgents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No agents found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filters to find more agents.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
