import { motion } from "framer-motion";
import HeroSection from "../components/HeroSection";
import {
  Brain,
  Rocket,
  TrendingUp,
  Shield,
  ChevronRight,
  Star,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Agent Discovery",
    description:
      "Explore a curated marketplace of intelligent AI agents ready to work for you.",
    color: "neuro",
  },
  {
    icon: Rocket,
    title: "Token Launch",
    description:
      "Launch your AI agent with DIP-20 tokens and start your funding journey.",
    color: "electric",
  },
  {
    icon: TrendingUp,
    title: "Revenue Tracking",
    description:
      "Monitor performance and earnings with real-time analytics and insights.",
    color: "neuro",
  },
  {
    icon: Shield,
    title: "Secure & Decentralized",
    description:
      "Built on Internet Computer Protocol for maximum security and transparency.",
    color: "electric",
  },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "AI Researcher",
    avatar: "SC",
    content:
      "NeuroPad revolutionized how I monetize my AI models. The platform is intuitive and the community is amazing.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Crypto Investor",
    avatar: "MR",
    content:
      "Finally, a platform where I can invest in AI agents with real utility. The returns have been incredible.",
    rating: 5,
  },
  {
    name: "Emma Thompson",
    role: "Tech Entrepreneur",
    avatar: "ET",
    content:
      "The future of AI is here. NeuroPad makes it accessible to everyone, from builders to investors.",
    rating: 5,
  },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Features Section */}
      <section className="relative py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful Features for{" "}
              <span className="text-gradient">AI Innovation</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to launch, fund, and scale AI agents in the
              decentralized economy
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="glass dark:glass-dark rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 h-full">
                    <div
                      className={`w-12 h-12 rounded-xl bg-${feature.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <Icon className={`w-6 h-6 text-${feature.color}-500`} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How <span className="text-gradient">NeuroPad</span> Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to launch your AI agent and start earning
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Agent",
                description:
                  "Define your AI agent's capabilities and upload your model",
              },
              {
                step: "02",
                title: "Launch & Fund",
                description:
                  "Mint DIP-20 tokens and open funding to the community",
              },
              {
                step: "03",
                title: "Earn & Scale",
                description:
                  "Monitor performance and earn revenue as your agent works",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neuro-gradient text-white font-bold text-xl mb-6 shadow-electric">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-6 h-6 text-muted-foreground" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
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
              Loved by <span className="text-gradient">Innovators</span>
            </h2>
            <p className="text-xl text-muted-foreground">
              See what our community has to say about NeuroPad
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
                className="glass dark:glass-dark rounded-2xl p-6 border border-white/10"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-yellow-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-neuro-gradient flex items-center justify-center text-white font-semibold text-sm mr-3">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
