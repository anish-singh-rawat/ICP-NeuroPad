import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Mail,
  Globe,
  Twitter,
  Github,
  Wallet,
  Shield,
  Zap,
  CheckCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useAuth } from "../auth/useAuthClient.jsx";

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface UserFormData {
  name: string;
  website: string;
  twitter: string;
}

export default function ConnectModal({ isOpen, onClose }: ConnectModalProps) {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    website: "",
    twitter: "",
  });
  const { principal, backendActor, isAuthenticated, login } = useAuth();

  const updateFormData = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWalletConnect = async () => {
    try {
      setIsConnecting(true);
      await login("ii");
      window.location.reload();
      setStep(2);
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsConnecting(true);
      console.log("formData : ", formData);
      const payload = {
        username: formData.name,
        twitter_id: formData.twitter,
        website: formData.website,
      };
      const result = await backendActor.create_user_profile(payload);
      console.log("result : ", result);
    } catch (error) {
      console.log("error : ", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const isStep2Valid = formData.name && formData.website;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="flex items-center justify-center h-screen bg-black/50 fixed inset-0 z-50">
        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{
            duration: 0.3,
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
          className="relative w-full max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6  border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Connect to NeuroPad
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {step === 1
                  ? "Connect your wallet to get started"
                  : "Complete your profile"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="w-8 h-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 bg-white dark:bg-gray-900">
            <AnimatePresence mode="wait">
              {
                !isAuthenticated ? (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-neuro-500 to-electric-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Wallet className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Connect Your Wallet
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Connect your Internet Identity or compatible wallet to
                        access NeuroPad
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Button
                        onClick={handleWalletConnect}
                        disabled={isConnecting}
                        className="w-full bg-gradient-to-r from-neuro-500 to-electric-500 hover:from-neuro-600 hover:to-electric-600 text-white h-12 shadow-lg"
                      >
                        {isConnecting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Connecting...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Shield className="w-5 h-5" />
                            <span>Internet Identity</span>
                          </div>
                        )}
                      </Button>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">
                            Or connect with
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        disabled
                      >
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4" />
                          <span>Other Wallets</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            (Coming Soon)
                          </span>
                        </div>
                      </Button>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800 dark:text-blue-300 text-sm">
                            Secure & Decentralized
                          </h4>
                          <p className="text-xs text-blue-700 dark:text-blue-400">
                            Your wallet connection is secured by Internet
                            Computer Protocol. We never store your private keys.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                        Complete Your Profile
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Help us personalize your NeuroPad experience
                      </p>
                    </div>

                    {/* Connected Wallet Display */}
                    <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-green-800 dark:text-green-300">
                            Wallet Connected
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400 font-mono truncate">
                            {principal.toString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {/* Required Fields */}
                      <div className="space-y-4">
                        <div>
                          <Label
                            htmlFor="name"
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-4 h-4" />
                            <span>Full Name *</span>
                          </Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) =>
                              updateFormData("name", e.target.value)
                            }
                            className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      {/* Optional Fields */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
                          <span>Optional</span>
                          <div className="h-px bg-gray-300 dark:bg-gray-600 flex-1" />
                        </div>

                        <div>
                          <Label
                            htmlFor="website"
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                          >
                            <Globe className="w-4 h-4" />
                            <span>Website</span>
                          </Label>
                          <Input
                            id="website"
                            placeholder="https://yoursite.com"
                            value={formData.website}
                            onChange={(e) =>
                              updateFormData("website", e.target.value)
                            }
                            className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                          />
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label
                              htmlFor="twitter"
                              className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
                            >
                              <Twitter className="w-4 h-4" />
                              <span>Twitter</span>
                            </Label>
                            <Input
                              id="twitter"
                              placeholder="@username"
                              value={formData.twitter}
                              onChange={(e) =>
                                updateFormData("twitter", e.target.value)
                              }
                              className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleSubmit}
                        disabled={!isStep2Valid || isConnecting}
                        className="w-full bg-gradient-to-r from-neuro-500 to-electric-500 hover:from-neuro-600 hover:to-electric-600 text-white h-12 shadow-lg"
                      >
                        {isConnecting ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Creating Profile...</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Complete Setup</span>
                          </div>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )

                // {isConnected && (
                //   <motion.div
                //     key="success"
                //     initial={{ opacity: 0, scale: 0.95 }}
                //     animate={{ opacity: 1, scale: 1 }}
                //     transition={{ duration: 0.3 }}
                //     className="text-center py-8"
                //   >
                //     <motion.div
                //       initial={{ scale: 0 }}
                //       animate={{ scale: 1 }}
                //       transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                //       className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                //     >
                //       <CheckCircle className="w-8 h-8 text-white" />
                //     </motion.div>
                //     <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-2">
                //       Welcome to NeuroPad!
                //     </h3>
                //     <p className="text-gray-600 dark:text-gray-300">
                //       Your profile has been created successfully.
                //     </p>
                //   </motion.div>
                // )}
              }
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
