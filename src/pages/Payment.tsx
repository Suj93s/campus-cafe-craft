import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import { QrCode, CheckCircle } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Payment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { cart, getTotalPrice, clearCart } = useCart();
  const orderDetails = location.state as { name: string; rollNumber: string; hostelBlock: string } | null;

  useEffect(() => {
    if (cart.length === 0 && !paymentComplete) {
      navigate("/");
    }
  }, [cart, navigate, paymentComplete]);

  const handlePaymentComplete = async () => {
    if (!orderDetails) {
      toast({
        title: "Error",
        description: "Order details missing",
        variant: "destructive",
      });
      navigate("/checkout");
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("Not authenticated");
      }

      const orderItems = cart.map(item => ({
        id: item.id,
        quantity: item.quantity,
      }));

      const { data, error } = await supabase.functions.invoke('place-order', {
        body: { items: orderItems },
      });

      if (error) throw error;

      setPaymentComplete(true);
      clearCart();

      toast({
        title: "Order Placed!",
        description: "Your order has been confirmed and will be ready soon.",
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      console.error("Order error:", error);
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">Your order has been placed successfully.</p>
              <p className="text-sm text-muted-foreground mt-2">Redirecting to home...</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 container mx-auto p-4 md:p-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/checkout")}
          className="mb-4"
        >
          ← Back to Checkout
        </Button>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code to Pay</CardTitle>
              <CardDescription>Total Amount: ₹{getTotalPrice()}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <QrCode className="w-48 h-48 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Scan this QR code with any UPI app to complete payment
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                UPI ID: cafe@saintgits
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {orderDetails && (
                <div className="space-y-2 pb-4 border-b">
                  <p><strong>Name:</strong> {orderDetails.name}</p>
                  <p><strong>Roll Number:</strong> {orderDetails.rollNumber}</p>
                  <p><strong>Hostel Block:</strong> {orderDetails.hostelBlock}</p>
                </div>
              )}
              
              <div className="space-y-2">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{getTotalPrice()}</span>
                </div>
              </div>

              <Button
                onClick={handlePaymentComplete}
                disabled={isProcessing}
                className="w-full mt-4"
              >
                {isProcessing ? "Processing..." : "I've Completed Payment"}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-2">
                Click the button above after completing the payment
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Payment;
