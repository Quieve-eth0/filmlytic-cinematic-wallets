import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Film, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Admin = () => {
  const { toast } = useToast();
  const [eventName, setEventName] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [showQr, setShowQr] = useState(false);

  const generateQrCode = () => {
    if (!eventName.trim()) {
      toast({
        title: "Event Name Required",
        description: "Please enter an event name to generate QR code",
        variant: "destructive",
      });
      return;
    }

    const eventId = `event-${Date.now()}`;
    const voteUrl = `${window.location.origin}/vote/${eventId}`;
    setQrValue(voteUrl);
    setShowQr(true);
    
    toast({
      title: "QR Code Generated",
      description: "Share this QR code with voters",
    });
  };

  const downloadQrCode = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `${eventName}-qr-code.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Filmlytic Admin</h1>
          <p className="text-muted-foreground">Generate QR codes for voting events</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="w-5 h-5" />
                Create Voting Event
              </CardTitle>
              <CardDescription>
                Generate a QR code for voters to scan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="eventName">Event Name</Label>
                <Input
                  id="eventName"
                  placeholder="e.g., Best Picture 2024"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <Button onClick={generateQrCode} className="w-full">
                Generate QR Code
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>QR Code</CardTitle>
              <CardDescription>
                {showQr ? "Share this code with voters" : "Generate a QR code to display"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showQr ? (
                <div className="space-y-4">
                  <div className="bg-white p-6 rounded-lg flex items-center justify-center">
                    <QRCodeSVG
                      id="qr-code"
                      value={qrValue}
                      size={256}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground break-all">
                      URL: {qrValue}
                    </p>
                    <Button onClick={downloadQrCode} variant="outline" className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">QR code will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
