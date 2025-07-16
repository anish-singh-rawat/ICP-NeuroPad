import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Rocket,
  Upload,
  Settings,
  Coins,
  Brain,
  DollarSign,
  Clock,
  Target,
  Users,
  Info,
  ArrowRight,
  Check,
  AlertTriangle,
  FileText,
  Image,
  Zap,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { cn } from "../lib/utils";

interface FormData {
  agentName: string;
  description: string;
  category: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  fundingGoal: string;
  depositAmount: string;
  agentLogo: File | null;
  agentModel: File | null;
  website: string;
  twitter: string;
  github: string;
  discord: string;
}

const categories = [
  "Finance & Trading",
  "Marketing & Content",
  "Healthcare & Medical",
  "Gaming & Entertainment",
  "Environment & Sustainability",
  "Legal & Compliance",
  "Education & Research",
  "Security & Privacy",
];

const MINIMUM_DEPOSIT = 1000; // NeuroPad tokens
const MINIMUM_CAP_HOURS = 24;

export default function Launch() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    agentName: "",
    description: "",
    category: "",
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
    fundingGoal: "",
    depositAmount: "",
    agentLogo: null,
    agentModel: null,
    website: "",
    twitter: "",
    github: "",
    discord: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [depositConfirmed, setDepositConfirmed] = useState(false);

  const updateFormData = (
    field: keyof FormData,
    value: string | File | null,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    {
      id: 1,
      title: "Agent Details",
      description: "Define your AI agent's core information",
      icon: Brain,
    },
    {
      id: 2,
      title: "Tokenomics",
      description: "Configure your agent's token economics",
      icon: Coins,
    },
    {
      id: 3,
      title: "Assets & Links",
      description: "Upload files and social media links",
      icon: Upload,
    },
    {
      id: 4,
      title: "Deposit & Launch",
      description: "Make deposit and launch your agent",
      icon: Rocket,
    },
  ];

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // Handle successful submission
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.agentName && formData.description && formData.category;
      case 2:
        return (
          formData.tokenName &&
          formData.tokenSymbol &&
          formData.totalSupply &&
          formData.fundingGoal
        );
      case 3:
        return formData.agentLogo && formData.agentModel;
      case 4:
        return (
          parseFloat(formData.depositAmount) >= MINIMUM_DEPOSIT &&
          depositConfirmed
        );
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Launch Your <span className="text-gradient">AI Agent</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Create and deploy your AI agent to the NeuroPad marketplace
            </p>
            <Link
              to="/tokenomics"
              className="inline-flex items-center space-x-2 text-neuro-500 hover:text-neuro-600 transition-colors"
            >
              <Info className="w-4 h-4" />
              <span>Learn about tokenomics</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const isValid = isStepValid(step.id);

                return (
                  <div key={step.id} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300",
                          isCompleted
                            ? "bg-neuro-500 border-neuro-500 text-white"
                            : isActive
                              ? "border-neuro-500 bg-neuro-50 dark:bg-neuro-950 text-neuro-500"
                              : "border-muted-foreground/30 bg-muted text-muted-foreground",
                        )}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-center">
                        <div
                          className={cn(
                            "font-medium text-sm",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "absolute top-6 left-1/2 w-full h-0.5 -translate-y-1/2 transition-colors duration-300",
                          isCompleted
                            ? "bg-neuro-500"
                            : "bg-muted-foreground/30",
                        )}
                        style={{ left: "50%", width: "calc(100% - 3rem)" }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Form Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass dark:glass-dark rounded-2xl p-8 border border-white/10"
                >
                  {/* Step 1: Agent Details */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Agent Details
                        </h2>
                        <p className="text-muted-foreground">
                          Provide basic information about your AI agent
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="agentName">Agent Name *</Label>
                          <Input
                            id="agentName"
                            placeholder="e.g., DataMiner Pro"
                            value={formData.agentName}
                            onChange={(e) =>
                              updateFormData("agentName", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="description">Description *</Label>
                          <Textarea
                            id="description"
                            placeholder="Describe what your AI agent does and its unique capabilities..."
                            value={formData.description}
                            onChange={(e) =>
                              updateFormData("description", e.target.value)
                            }
                            rows={4}
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Category *</Label>
                          <select
                            id="category"
                            value={formData.category}
                            onChange={(e) =>
                              updateFormData("category", e.target.value)
                            }
                            className="w-full mt-1 p-3 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-neuro-500"
                          >
                            <option value="">Select a category</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Tokenomics */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Tokenomics</h2>
                        <p className="text-muted-foreground">
                          Configure your agent's token economics and funding
                          goals
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tokenName">Token Name *</Label>
                          <Input
                            id="tokenName"
                            placeholder="e.g., DataMiner Token"
                            value={formData.tokenName}
                            onChange={(e) =>
                              updateFormData("tokenName", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="tokenSymbol">Token Symbol *</Label>
                          <Input
                            id="tokenSymbol"
                            placeholder="e.g., DMT"
                            value={formData.tokenSymbol}
                            onChange={(e) =>
                              updateFormData(
                                "tokenSymbol",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className="mt-1"
                            maxLength={5}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="totalSupply">Total Supply *</Label>
                          <Input
                            id="totalSupply"
                            type="number"
                            placeholder="1000000"
                            value={formData.totalSupply}
                            onChange={(e) =>
                              updateFormData("totalSupply", e.target.value)
                            }
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fundingGoal">
                            Minimum Cap (NeuroPad) *
                          </Label>
                          <Input
                            id="fundingGoal"
                            type="number"
                            placeholder="50000"
                            value={formData.fundingGoal}
                            onChange={(e) =>
                              updateFormData("fundingGoal", e.target.value)
                            }
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Must be reached within 24 hours of launch
                          </p>
                        </div>
                      </div>

                      <div className="bg-neuro-50/50 dark:bg-neuro-950/50 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-neuro-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-neuro-700 dark:text-neuro-300">
                              24-Hour Launch Window
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              Your agent token will only be created if the
                              minimum cap is reached within 24 hours. If not
                              met, all deposits will be refunded.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Assets & Links */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Assets & Links
                        </h2>
                        <p className="text-muted-foreground">
                          Upload your agent files and provide social links
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="agentLogo">Agent Logo *</Label>
                            <div className="mt-1 border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-neuro-500 transition-colors cursor-pointer">
                              <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload logo
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG up to 2MB
                              </p>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="agentModel">AI Model File *</Label>
                            <div className="mt-1 border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-neuro-500 transition-colors cursor-pointer">
                              <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">
                                Click to upload model
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ZIP, TAR up to 100MB
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-medium">
                            Social Links (Optional)
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="website">Website</Label>
                              <Input
                                id="website"
                                placeholder="https://example.com"
                                value={formData.website}
                                onChange={(e) =>
                                  updateFormData("website", e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="twitter">Twitter</Label>
                              <Input
                                id="twitter"
                                placeholder="@username"
                                value={formData.twitter}
                                onChange={(e) =>
                                  updateFormData("twitter", e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="github">GitHub</Label>
                              <Input
                                id="github"
                                placeholder="github.com/username"
                                value={formData.github}
                                onChange={(e) =>
                                  updateFormData("github", e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label htmlFor="discord">Discord</Label>
                              <Input
                                id="discord"
                                placeholder="discord.gg/invite"
                                value={formData.discord}
                                onChange={(e) =>
                                  updateFormData("discord", e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Deposit & Launch */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Deposit & Launch
                        </h2>
                        <p className="text-muted-foreground">
                          Make your deposit and launch your agent
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-amber-800 dark:text-amber-300">
                                Deposit Requirement
                              </h4>
                              <p className="text-sm text-amber-700 dark:text-amber-400">
                                You must deposit a minimum of{" "}
                                {MINIMUM_DEPOSIT.toLocaleString()} NeuroPad
                                tokens to launch your agent.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="depositAmount">
                            Deposit Amount (NeuroPad) *
                          </Label>
                          <Input
                            id="depositAmount"
                            type="number"
                            placeholder={MINIMUM_DEPOSIT.toString()}
                            value={formData.depositAmount}
                            onChange={(e) =>
                              updateFormData("depositAmount", e.target.value)
                            }
                            className="mt-1"
                            min={MINIMUM_DEPOSIT}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Minimum: {MINIMUM_DEPOSIT.toLocaleString()} NeuroPad
                            tokens
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                            <input
                              type="checkbox"
                              id="confirmDeposit"
                              checked={depositConfirmed}
                              onChange={(e) =>
                                setDepositConfirmed(e.target.checked)
                              }
                              className="w-4 h-4 text-neuro-600 bg-gray-100 border-gray-300 rounded focus:ring-neuro-500"
                            />
                            <label
                              htmlFor="confirmDeposit"
                              className="text-sm font-medium cursor-pointer"
                            >
                              I understand that my deposit will be held until
                              the minimum cap is reached within 24 hours, and I
                              agree to the terms and conditions.
                            </label>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmit}
                          disabled={!isStepValid(4) || isSubmitting}
                          className="w-full bg-neuro-gradient hover:bg-neuro-gradient-dark text-white h-12"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Rocket className="w-5 h-5" />
                              <span>Launch Agent</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="glass dark:glass-dark border-white/20"
                    >
                      Previous
                    </Button>
                    {currentStep < 4 && (
                      <Button
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className="bg-neuro-gradient hover:bg-neuro-gradient-dark text-white"
                      >
                        Next
                      </Button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
              >
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-neuro-500" />
                  <span>Launch Summary</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Agent Name</span>
                    <span>{formData.agentName || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Token Symbol</span>
                    <span>{formData.tokenSymbol || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Supply</span>
                    <span>
                      {formData.totalSupply
                        ? `${parseInt(formData.totalSupply).toLocaleString()}`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum Cap</span>
                    <span>
                      {formData.fundingGoal
                        ? `${parseInt(formData.fundingGoal).toLocaleString()} NPT`
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Your Deposit</span>
                    <span>
                      {formData.depositAmount
                        ? `${parseInt(formData.depositAmount).toLocaleString()} NPT`
                        : "—"}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Key Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
              >
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-electric-500" />
                  <span>Key Features</span>
                </h3>
                <div className="space-y-3">
                  {[
                    "24-hour launch window",
                    "Automatic token creation",
                    "Community funding",
                    "Revenue sharing",
                    "Decentralized governance",
                  ].map((feature, index) => (
                    <div
                      key={feature}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className="w-2 h-2 bg-electric-500 rounded-full" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Help */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
              >
                <h3 className="font-bold mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <Link
                    to="/tokenomics"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    → Understanding Tokenomics
                  </Link>
                  <a
                    href="#"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    → Launch Guide
                  </a>
                  <a
                    href="#"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    → Community Support
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
