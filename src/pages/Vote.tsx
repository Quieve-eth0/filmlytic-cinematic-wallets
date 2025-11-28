import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Film, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Vote = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState<"verify" | "vote" | "success">("verify");
  const [voterId, setVoterId] = useState("");
  const [selectedFilm, setSelectedFilm] = useState("");
  const [loading, setLoading] = useState(false);
  const [films, setFilms] = useState([
    { id: "1", title: "The Shawshank Redemption", year: "1994" },
    { id: "2", title: "The Godfather", year: "1972" },
    { id: "3", title: "The Dark Knight", year: "2008" },
    { id: "4", title: "Pulp Fiction", year: "1994" },
    { id: "5", title: "Inception", year: "2010" },
  ]);

  const handleVerifyId = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!voterId.trim()) {
      toast({
        title: "ID Required",
        description: "Please enter your voter ID to continue",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate ID verification - in production, check against database
    setTimeout(() => {
      setLoading(false);
      setStep("vote");
      toast({
        title: "Verified",
        description: "Your ID has been verified. You may now vote.",
      });
    }, 1000);
  };

  const handleSubmitVote = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFilm) {
      toast({
        title: "Selection Required",
        description: "Please select a film to vote for",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Simulate vote submission
    setTimeout(() => {
      setLoading(false);
      setStep("success");
      toast({
        title: "Vote Recorded",
        description: "Your vote has been securely recorded on the blockchain",
      });
    }, 1500);
  };

  if (step === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-md text-center border-2">
          <CardContent className="pt-6">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Vote Recorded!</h2>
            <p className="text-muted-foreground mb-6">
              Your vote has been securely recorded. Thank you for participating!
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "vote") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
        <Card className="w-full max-w-2xl border-2">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Film className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Cast Your Vote</CardTitle>
                <CardDescription>Select your favorite film</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitVote} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Choose a Film:</Label>
                <RadioGroup value={selectedFilm} onValueChange={setSelectedFilm}>
                  {films.map((film) => (
                    <div
                      key={film.id}
                      className="flex items-center space-x-3 p-4 rounded-lg border-2 hover:border-primary/50 transition-all cursor-pointer"
                      onClick={() => setSelectedFilm(film.id)}
                    >
                      <RadioGroupItem value={film.id} id={film.id} />
                      <Label
                        htmlFor={film.id}
                        className="flex-1 cursor-pointer text-base"
                      >
                        <div className="font-semibold">{film.title}</div>
                        <div className="text-sm text-muted-foreground">{film.year}</div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("verify")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Submitting..." : "Submit Vote"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-primary/5">
      <Card className="w-full max-w-md border-2">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Film className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
              <CardDescription>Enter your voter ID to continue</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerifyId} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="voterId">Voter ID</Label>
              <Input
                id="voterId"
                type="text"
                placeholder="Enter your voter ID"
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="text-base"
              />
              <p className="text-sm text-muted-foreground">
                This ID was provided to you by the event organizer
              </p>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Vote;
