import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Vote, Shield, BarChart3, Lock, Zap, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: "Blockchain Verified",
      description: "Every vote is recorded on the blockchain for complete transparency",
    },
    {
      icon: Lock,
      title: "Secure Voting",
      description: "ID verification ensures each voter can only vote once",
    },
    {
      icon: BarChart3,
      title: "Live Results",
      description: "Watch results update in real-time as votes come in",
    },
    {
      icon: Zap,
      title: "Fast Setup",
      description: "Create and launch a film voting event in minutes",
    },
    {
      icon: Users,
      title: "Any Scale",
      description: "From small screenings to large film festivals",
    },
    {
      icon: Vote,
      title: "QR Code Voting",
      description: "Simple QR code scanning for quick and easy voting",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background via-background to-primary/10">
        <div className="container mx-auto text-center">
          <div className="mx-auto w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-lg">
            <Vote className="w-12 h-12 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Filmlytic
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Cinematic voting platform powered by blockchain technology
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              onClick={() => navigate("/admin")}
              className="text-lg px-8 shadow-lg"
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/admin")}
              className="text-lg px-8"
            >
              Admin Portal
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need for film voting
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete platform for creating, managing, and analyzing film voting events
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to create your first film voting event?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join film organizations worldwide using Filmlytic for secure, transparent voting
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => navigate("/admin")}
            className="text-lg px-8"
          >
            Start Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t bg-card">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Filmlytic. Built with security and transparency.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
