import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { Brain, TrendingUp, Users, Star } from "lucide-react";

export default function AgentDetail() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <section className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-neuro-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Agent Details <span className="text-gradient">#{id}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Detailed view of AI agent performance and funding
            </p>

            <div className="glass dark:glass-dark rounded-2xl p-12 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {[
                  {
                    icon: TrendingUp,
                    title: "Performance",
                    desc: "Real-time analytics and metrics",
                  },
                  {
                    icon: Users,
                    title: "Backers",
                    desc: "Community support and funding",
                  },
                  {
                    icon: Star,
                    title: "Rating",
                    desc: "User reviews and ratings",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="text-center">
                      <div className="w-12 h-12 bg-neuro-500/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                        <Icon className="w-6 h-6 text-neuro-500" />
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <div className="text-6xl mb-4">🚧</div>
                <h2 className="text-2xl font-bold mb-2">Coming Soon</h2>
                <p className="text-muted-foreground">
                  Agent detail page is being built. Check back soon!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
