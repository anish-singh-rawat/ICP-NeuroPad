import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Rocket,
  Crown,
  Zap,
  Calendar,
  Clock,
  DollarSign,
  Users,
  PieChart,
  Check,
  Info,
  Shield,
  TrendingUp,
  Target,
  Brain,
  Settings,
  Coins,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";
import { cn } from "../lib/utils";
import { Principal } from "@dfinity/principal";
import { useAuth } from "../auth/useAuthClient";

interface FormData {
  launchType: "genesis" | "standard" | "";
  agentName: string;
  agentOverview: string;
  tokenName: string;
  tokenSymbol: string;
  totalSupply: string;
  tokenomicsProposal: string;
  launchDate: string;
  category: string;
  website: string;
  twitter: string;
  discord: string;
  telegram: string;
  image_id: string;
  image_title: string;
  image_content: File | null;
  image_content_type: string;
}

const categories = [
  "DeFi & Trading",
  "NFT & Gaming",
  "AI & Machine Learning",
  "Social & Community",
  "Infrastructure & Tools",
  "Analytics & Data",
  "Content & Media",
  "Security & Privacy",
];

const CREATION_FEE = 100; // $ARMY
const GENESIS_MIN_FDV = 336000; // $ARMY
const GENESIS_MIN_FDV_USD = 67000; // USD
const COMMITMENT_THRESHOLD = 42425; // $ARMY
const MAX_ALLOCATION = 0.5; // percentage

export default function Launch() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    launchType: "",
    agentName: "",
    agentOverview: "",
    tokenName: "",
    tokenSymbol: "",
    totalSupply: "",
    tokenomicsProposal: "",
    launchDate: "",
    category: "",
    website: "",
    twitter: "",
    discord: "",
    telegram: "",
    image_id: "",
    image_title: "",
    image_content: null,
    image_content_type: "image/png",
  });
  const { backendActor } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUploadImage = (data : any)=>{
    console.log("data : ",data);
    setFormData((prev : any) => ({ ...prev, image_id : data?.lastModified, image_title : data?.name, image_content : data, image_content_type : data?.type }));
  }

  const steps = [
    {
      id: 1,
      title: "Launch Type",
      description: "Choose your agent launch option",
      icon: Rocket,
    },
    {
      id: 2,
      title: "Agent Details",
      description: "Provide core information about your agent",
      icon: Brain,
    },
    {
      id: 3,
      title: "Tokenomics Configuration",
      description: "Configure token economics and funding",
      icon: Settings,
    },
    {
      id: 4,
      title: "Tokenomics Design",
      description: "Customize your token distribution plan",
      icon: PieChart,
    },
    {
      id: 5,
      title: "Schedule & Launch",
      description: "Set launch date and confirm submission",
      icon: Calendar,
    },
  ];

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
const fileToUint8Array = async (file: File): Promise<Uint8Array> => {
  const arrayBuffer = await file.arrayBuffer();
  return new Uint8Array(arrayBuffer);
};
  const handleSubmit = async () => {
    // if (!formData.image_content) {
    //   alert("Please select an image first.");
    //   return;
    // }

    setIsSubmitting(true);
    try {
      const BACKEND_CANISTER_ID: any = process.env.CANISTER_ID_IC_ASSET_HANDLER;

      console.log("Backend canister ID:", BACKEND_CANISTER_ID);

      const imageContent = await fileToUint8Array(formData.image_content as File);

      const payload = {
        image_canister: Principal.fromText(BACKEND_CANISTER_ID),
        members: [Principal.fromText(BACKEND_CANISTER_ID)],
        token_symbol: formData.tokenSymbol,
        agent_category: formData.category,
        agent_twitter: formData.twitter,
        agent_telegram: formData.telegram,
        agent_name: formData.agentName,
        agent_type: formData.launchType === "genesis"? { GenesisLaunch: null }: { StandardLaunch: null },
        agent_description: formData.tokenomicsProposal,
        agent_lunch_time: BigInt(new Date(formData.launchDate).getTime() * 1_000_000),
        agent_website: formData.website,
        image_content_type: formData.image_content_type,
        image_content: imageContent,
        image_id: formData.image_id.toString(),
        image_title: formData.image_title as string,
        members_count: 1,
        agent_overview: formData.agentOverview,
        agent_discord: formData.discord,
        token_name: formData.tokenName,
        token_supply: Number(formData.totalSupply),
      };

      console.log("Payload → ", payload);
      const result: any = await backendActor.make_payment_and_create_agent(payload);
      console.log("Canister response:", result);

      if (result.Ok) {
        alert("✅ " + result.Ok);
      }
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit: " + (err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.launchType !== "";
      case 2:
        return (
          formData.agentName && formData.agentOverview && formData.category
        );
      case 3:
        return (
          formData.tokenName &&
          formData.tokenSymbol &&
          formData.totalSupply &&
          formData.image_content
        );
      case 4:
        return formData.tokenomicsProposal;
      case 5:
        return formData.launchDate && termsAccepted;
      default:
        return false;
    }
  };

  const getTokenomicsBreakdown = () => {
    if (formData.launchType === "genesis") {
      return [
        { label: "Public Sale", percentage: 37.5, color: "bg-neuro-500" },
        { label: "Liquidity Pool", percentage: 12.5, color: "bg-electric-500" },
        {
          label: "Developer's Allocation",
          percentage: 50,
          color: "bg-green-500",
        },
      ];
    } else if (formData.launchType === "standard") {
      return [
        { label: "Public Sale", percentage: 87.5, color: "bg-neuro-500" },
        { label: "Liquidity Pool", percentage: 12.5, color: "bg-electric-500" },
      ];
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Launch Your <span className="text-gradient">AI Agent</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
              Create and deploy your AI agent powered by DIP-20 token economics
              on the decentralized ICP blockchain. Build, monetize, and grow
              your community.
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Decentralized</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-neuro-500" />
                <span>Revenue Sharing</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-electric-500" />
                <span>Community Driven</span>
              </div>
            </div>
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
                              : "border-muted-foreground/30 bg-muted text-muted-foreground"
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
                              : "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block ">
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
                            : "bg-muted-foreground/30"
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
                  {/* Step 1: Launch Type Selection */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Choose Launch Type
                        </h2>
                        <p className="text-muted-foreground">
                          Select how you want to launch your AI agent
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Genesis Launch */}
                        <div
                          onClick={() =>
                            updateFormData("launchType", "genesis")
                          }
                          className={cn(
                            "p-6 border-2 rounded-xl cursor-pointer transition-all duration-300",
                            formData.launchType === "genesis"
                              ? "border-neuro-500 bg-neuro-50/50"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <Crown className="w-8 h-8 text-yellow-500" />
                            <div>
                              <h3 className="text-lg font-bold">
                                Genesis Launch
                              </h3>
                              <Badge variant="secondary" className="text-xs">
                                Premium Option
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Min FDV at Launch:
                              </span>
                              <span className="font-medium">
                                {GENESIS_MIN_FDV.toLocaleString()} $ARMY
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Approx USD Value:
                              </span>
                              <span className="font-medium">
                                ${GENESIS_MIN_FDV_USD.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Creation Fee:
                              </span>
                              <span className="font-medium">
                                {CREATION_FEE} $ARMY
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <h4 className="font-medium text-sm">Tokenomics:</h4>
                            <div className="text-xs space-y-1">
                              <div>• 37.5% Public Sale</div>
                              <div>• 12.5% Liquidity Pool</div>
                              <div>• 50% Developer's Allocation</div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                              <div className="text-xs text-amber-700 dark:text-amber-400">
                                <strong>24-hour commitment window:</strong>{" "}
                                Launch succeeds if{" "}
                                {COMMITMENT_THRESHOLD.toLocaleString()} $ARMY is
                                committed. Max {MAX_ALLOCATION}% allocation per
                                user.
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Standard Launch */}
                        <div
                          onClick={() =>
                            updateFormData("launchType", "standard")
                          }
                          className={cn(
                            "p-6 border-2 rounded-xl cursor-pointer transition-all duration-300",
                            formData.launchType === "standard"
                              ? "border-neuro-500 bg-neuro-50/50"
                              : "border-border"
                          )}
                        >
                          <div className="flex items-center space-x-3 mb-4">
                            <Zap className="w-8 h-8 text-electric-500" />
                            <div>
                              <h3 className="text-lg font-bold">
                                Standard Launch
                              </h3>
                              <Badge variant="outline" className="text-xs">
                                Instant Launch
                              </Badge>
                            </div>
                          </div>

                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Launch Type:
                              </span>
                              <span className="font-medium">Instant</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Sentient Threshold:
                              </span>
                              <span className="font-medium">
                                {COMMITMENT_THRESHOLD.toLocaleString()} $ARMY
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Creation Fee:
                              </span>
                              <span className="font-medium">
                                {CREATION_FEE} $ARMY
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <h4 className="font-medium text-sm">Tokenomics:</h4>
                            <div className="text-xs space-y-1">
                              <div>• 87.5% Public Sale</div>
                              <div>• 12.5% Liquidity Pool</div>
                            </div>
                          </div>

                          <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Target className="w-4 h-4 text-green-600 mt-0.5" />
                              <div className="text-xs text-green-700 dark:text-green-400">
                                <strong>Instant launch:</strong> New token
                                created immediately. Agent becomes Sentient once{" "}
                                {COMMITMENT_THRESHOLD.toLocaleString()} $ARMY is
                                bought.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Agent Details */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Agent Overview
                        </h2>
                        <p className="text-muted-foreground">
                          Provide core information about your AI agent
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="agentName">Agent Name *</Label>
                          <Input
                            id="agentName"
                            placeholder="e.g., TradingBot Alpha"
                            value={formData.agentName}
                            onChange={(e) =>
                              updateFormData("agentName", e.target.value)
                            }
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

                        <div>
                          <Label htmlFor="agentOverview">
                            Project Pitch - Agent Overview *
                          </Label>
                          <Textarea
                            id="agentOverview"
                            placeholder="Describe the purpose and vision of your AI agent. What problem does it solve? What makes it unique? How will it benefit the community?"
                            value={formData.agentOverview}
                            onChange={(e) =>
                              updateFormData("agentOverview", e.target.value)
                            }
                            rows={6}
                            className="mt-1"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            This will be displayed to potential investors and
                            users
                          </p>
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
                            <div>
                              <Label htmlFor="telegram">Telegram</Label>
                              <Input
                                id="telegram"
                                placeholder="t.me/channel"
                                value={formData.telegram}
                                onChange={(e) =>
                                  updateFormData("telegram", e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Tokenomics Configuration */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Tokenomics Configuration
                        </h2>
                        <p className="text-muted-foreground">
                          Configure your agent's token economics and funding
                          goals
                        </p>
                      </div>

                      <div className="space-y-4">
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
                                  e.target.value.toUpperCase()
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
                              placeholder="e.g., 1,000,000"
                              value={formData.totalSupply}
                              onChange={(e) =>
                                updateFormData("totalSupply", e.target.value)
                              }
                              className="mt-1"
                            />
                          </div>

                          <Label htmlFor="tokenImage">Token Image *</Label>
                          <div className="mt-1 border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-neuro-500 transition-colors cursor-pointer">
                            <input
                              type="file"
                              id="tokenImage"
                              accept="image/*"
                              onChange={(e) => {
                                const file: any = e.target.files?.[0] || null;
                               handleUploadImage(file)
                              }}
                              className="hidden"
                            />
                            <label
                              htmlFor="tokenImage"
                              className="cursor-pointer"
                            >
                              {formData.image_content ? (
                                <div className="flex items-center justify-center space-x-2">
                                  <Coins className="w-6 h-6 text-neuro-500" />
                                  <span className="text-sm font-medium">
                                    {formData.image_content.name}
                                  </span>
                                </div>
                              ) : (
                                <>
                                  <Coins className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    Click to upload token image
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    PNG, JPG up to 2MB
                                  </p>
                                </>
                              )}
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                              💡 Note:
                            </h4>
                            <p className="text-sm text-blue-700 dark:text-blue-400">
                              The minimum cap must be reached within 24 hours of
                              launch. If it's not met, all deposits will be
                              refunded automatically.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
                              🕒 24-Hour Launch Window Rule
                            </h4>
                            <p className="text-sm text-amber-700 dark:text-amber-400 mb-2">
                              Your agent token will only be created if the
                              minimum cap is reached within 24 hours of launch.
                            </p>
                            <p className="text-sm text-amber-700 dark:text-amber-400">
                              Otherwise, no token gets minted and users get
                              their funds back.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Tokenomics Design */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Tokenomics Design Proposal
                        </h2>
                        <p className="text-muted-foreground">
                          Customize your token distribution plan and economic
                          model
                        </p>
                      </div>

                      {formData.launchType && (
                        <div className="bg-muted/30 rounded-lg p-6">
                          <h3 className="font-bold mb-4 flex items-center space-x-2">
                            <PieChart className="w-5 h-5 text-neuro-500" />
                            <span>
                              {formData.launchType === "genesis"
                                ? "Genesis"
                                : "Standard"}{" "}
                              Launch Tokenomics
                            </span>
                          </h3>

                          <div className="space-y-3">
                            {getTokenomicsBreakdown().map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center space-x-3"
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded-full",
                                    item.color
                                  )}
                                />
                                <span className="text-sm font-medium flex-1">
                                  {item.label}
                                </span>
                                <span className="text-sm font-bold">
                                  {item.percentage}%
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 p-4 bg-background rounded-lg">
                            <div className="flex items-start space-x-2">
                              <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                              <div className="text-xs text-muted-foreground">
                                {formData.launchType === "genesis"
                                  ? "Genesis launch provides higher developer allocation for long-term project development and community building."
                                  : "Standard launch maximizes public sale allocation for broader community participation and liquidity."}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="tokenomicsProposal">
                          Custom Tokenomics Proposal *
                        </Label>
                        <Textarea
                          id="tokenomicsProposal"
                          placeholder="Describe your detailed tokenomics strategy including:&#10;• Token utility and use cases&#10;• Vesting schedules (if applicable)&#10;• Staking/governance mechanisms&#10;• Revenue sharing model&#10;• Long-term sustainability plan&#10;• Community incentives"
                          value={formData.tokenomicsProposal}
                          onChange={(e) =>
                           updateFormData("tokenomicsProposal", e.target.value)
                          }
                          rows={8}
                          className="mt-1"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Provide a comprehensive tokenomics design that aligns
                          with your agent's goals
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Schedule & Launch */}
                  {currentStep === 5 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          Schedule & Launch
                        </h2>
                        <p className="text-muted-foreground">
                          Set your launch date and confirm submission
                        </p>
                      </div>

                      <div className="space-y-6">
                        {formData.launchType === "genesis" && (
                          <div>
                            <Label htmlFor="launchDate">Launch Date *</Label>
                            <Input
                              id="launchDate"
                              type="datetime-local"
                              value={formData.launchDate}
                              onChange={(e) =>
                                updateFormData("launchDate", e.target.value)
                              }
                              className="mt-1"
                              min={new Date(Date.now() + 24 * 60 * 60 * 1000)
                                .toISOString()
                                .slice(0, 16)}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                              Schedule your agent launch (minimum 24 hours from
                              now)
                            </p>
                          </div>
                        )}

                        {formData.launchType === "standard" && (
                          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                              <Zap className="w-5 h-5 text-green-600 mt-0.5" />
                              <div>
                                <h4 className="font-medium text-green-800 dark:text-green-300">
                                  Instant Launch Ready
                                </h4>
                                <p className="text-sm text-green-700 dark:text-green-400">
                                  Your agent will be launched immediately upon
                                  submission and fee payment.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Summary */}
                        <div className="bg-muted/30 rounded-lg p-6">
                          <h3 className="font-bold mb-4">Launch Summary</h3>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Launch Type:
                              </span>
                              <Badge
                                variant={
                                  formData.launchType === "genesis"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {formData.launchType === "genesis"
                                  ? "Genesis"
                                  : "Standard"}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Agent Name:
                              </span>
                              <span className="font-medium">
                                {formData.agentName || "—"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Category:
                              </span>
                              <span>{formData.category || "—"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Token Symbol:
                              </span>
                              <span className="font-medium">
                                {formData.tokenSymbol || "—"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Total Supply:
                              </span>
                              <span>
                                {formData.totalSupply
                                  ? `${parseInt(formData.totalSupply).toLocaleString()}`
                                  : "—"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                Token Image
                              </span>
                              <span>
                                {formData.image_content?.name ? "✓ Uploaded" : "—"}
                              </span>
                            </div>
                            {formData.launchType === "genesis" && (
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                  Launch Date:
                                </span>
                                <span>
                                  {formData.launchDate
                                    ? new Date(
                                        formData.launchDate
                                      ).toLocaleString()
                                    : "—"}
                                </span>
                              </div>
                            )}
                            <div className="flex justify-between border-t pt-3">
                              <span className="text-muted-foreground">
                                Creation Fee:
                              </span>
                              <span className="font-bold text-neuro-600">
                                {CREATION_FEE} $ARMY
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Terms and Conditions */}
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 p-4 border border-border rounded-lg">
                            <input
                              type="checkbox"
                              id="terms"
                              checked={termsAccepted}
                              onChange={(e) =>
                                setTermsAccepted(e.target.checked)
                              }
                              className="w-4 h-4 text-neuro-600 bg-gray-100 border-gray-300 rounded focus:ring-neuro-500 mt-0.5"
                            />
                            <label
                              htmlFor="terms"
                              className="text-sm cursor-pointer"
                            >
                              I understand and agree to the{" "}
                              <Link
                                to="/terms"
                                className="text-neuro-500 hover:text-neuro-600"
                              >
                                Terms of Service
                              </Link>
                              , including the non-refundable creation fee of{" "}
                              {CREATION_FEE} $ARMY, launch requirements, and
                              tokenomics distribution.
                            </label>
                          </div>
                        </div>

                        <Button
                          onClick={handleSubmit}
                          // disabled={!isStepValid(5) || isSubmitting}
                          className="w-full bg-neuro-gradient hover:bg-neuro-gradient-dark text-white h-12 text-lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              <span>Processing Launch...</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <Rocket className="w-6 h-6" />
                              <span>
                                {formData.launchType === "genesis"
                                  ? "Schedule Genesis Launch"
                                  : "Launch Agent Now"}
                              </span>
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
                    {currentStep < 5 && (
                      <Button
                        onClick={nextStep}
                        // disabled={!isStepValid(currentStep)}
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
              {/* Launch Type Info */}
              {formData.launchType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="font-bold mb-4 flex items-center space-x-2">
                    {formData.launchType === "genesis" ? (
                      <Crown className="w-5 h-5 text-yellow-500" />
                    ) : (
                      <Zap className="w-5 h-5 text-electric-500" />
                    )}
                    <span>
                      {formData.launchType === "genesis"
                        ? "Genesis"
                        : "Standard"}{" "}
                      Launch
                    </span>
                  </h3>

                  <div className="space-y-3 text-sm">
                    {formData.launchType === "genesis" ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-amber-500" />
                          <span>24-hour commitment window</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-green-500" />
                          <span>
                            {COMMITMENT_THRESHOLD.toLocaleString()} $ARMY
                            threshold
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>Max {MAX_ALLOCATION}% per user</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4 text-neuro-500" />
                          <span>50% developer allocation</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-electric-500" />
                          <span>Instant token creation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-purple-500" />
                          <span>
                            Sentient at {COMMITMENT_THRESHOLD.toLocaleString()}{" "}
                            $ARMY
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-500" />
                          <span>87.5% public allocation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span>Maximum liquidity</span>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Tokenomics Breakdown */}
              {formData.launchType && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
                >
                  <h3 className="font-bold mb-4 flex items-center space-x-2">
                    <PieChart className="w-5 h-5 text-neuro-500" />
                    <span>Token Distribution</span>
                  </h3>

                  <div className="space-y-3">
                    {getTokenomicsBreakdown().map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{item.label}</span>
                          <span className="font-bold">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={cn("h-2 rounded-full", item.color)}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Help & Resources */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
              >
                <h3 className="font-bold mb-4 flex items-center space-x-2">
                  <Info className="w-5 h-5 text-blue-500" />
                  <span>Resources</span>
                </h3>
                <div className="space-y-3 text-sm">
                  <Link
                    to="/docs/launch-guide"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    → Complete Launch Guide
                  </Link>
                  <Link
                    to="/docs/tokenomics"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    → Understanding Tokenomics
                  </Link>
                  <Link
                    to="/docs/dip20"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    → DIP-20 Token Standard
                  </Link>
                  <Link
                    to="/community"
                    className="block text-neuro-500 hover:text-neuro-600 transition-colors"
                  >
                    �� Community Support
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
