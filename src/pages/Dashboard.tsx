import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Wallet, Copy, LogOut, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  username: string | null;
  full_name: string | null;
}

interface WalletData {
  wallet_address: string;
  chain: string;
  balance: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [creatingWallet, setCreatingWallet] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("username, full_name")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch wallet
      const { data: walletData } = await supabase
        .from("wallets")
        .select("wallet_address, chain, balance")
        .eq("user_id", user.id)
        .single();

      if (walletData) {
        setWallet(walletData);
      }
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async () => {
    setCreatingWallet(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to create a wallet");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.functions.invoke("create-wallet", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      toast.success("Wallet created successfully!");
      setWallet(data);
    } catch (error: any) {
      console.error("Error creating wallet:", error);
      toast.error(error.message || "Failed to create wallet");
    } finally {
      setCreatingWallet(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const copyAddress = () => {
    if (wallet?.wallet_address) {
      navigator.clipboard.writeText(wallet.wallet_address);
      setCopied(true);
      toast.success("Address copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero">
      <nav className="border-b border-border/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 gradient-gold rounded-2xl flex items-center justify-center shadow-gold">
              <Film className="w-7 h-7 text-deep-black" />
            </div>
            <h1 className="text-3xl font-bold text-gold">Filmlytic</h1>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-gold"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Welcome Section */}
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gold mb-4">
              Welcome, {profile?.username || "User"}
            </h2>
            <p className="text-xl text-muted-foreground">
              Your cinematic blockchain experience awaits
            </p>
          </div>

          {/* Wallet Section */}
          <Card className="gradient-card border-border/50 shadow-cinematic">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl text-gold flex items-center gap-2">
                    <Wallet className="w-8 h-8" />
                    Your Custodial Wallet
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Securely managed blockchain wallet for your film voting and transactions
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {wallet ? (
                <>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                      <p className="text-sm text-muted-foreground mb-2">Wallet Address</p>
                      <div className="flex items-center gap-2">
                        <code className="text-gold font-mono text-sm break-all">
                          {wallet.wallet_address}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyAddress}
                          className="shrink-0"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                        <p className="text-sm text-muted-foreground mb-1">Chain</p>
                        <p className="text-xl font-semibold text-gold capitalize">
                          {wallet.chain}
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-background/30 border border-border/30">
                        <p className="text-sm text-muted-foreground mb-1">Balance</p>
                        <p className="text-xl font-semibold text-gold">
                          {wallet.balance} ETH
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/30">
                    <p className="text-sm text-muted-foreground">
                      🔒 Your wallet is securely managed and encrypted. Use it for film voting,
                      analytics participation, and blockchain transactions within the Filmlytic
                      ecosystem.
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-semibold text-gold mb-2">
                    Create Your Wallet
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Get started by creating your custodial wallet. It's secure, encrypted, and
                    ready for all your blockchain film activities.
                  </p>
                  <Button
                    onClick={createWallet}
                    disabled={creatingWallet}
                    className="gradient-gold text-deep-black hover:scale-105 shadow-gold"
                    size="lg"
                  >
                    {creatingWallet ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Wallet...
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        Create Wallet
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="gradient-card border-border/50 shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-gold">Film Voting</CardTitle>
                <CardDescription>
                  Participate in blockchain-verified film ratings and decisions
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-border/50 shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-gold">Analytics</CardTitle>
                <CardDescription>
                  Track your voting history and influence on the platform
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="gradient-card border-border/50 shadow-lg hover:shadow-gold transition-all duration-300 hover:scale-105">
              <CardHeader>
                <CardTitle className="text-gold">Rewards</CardTitle>
                <CardDescription>
                  Earn rewards for active participation in the community
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
