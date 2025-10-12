import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowRight, BookOpen, Gift } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Since payment is now automatically confirmed, redirect to student courses
    const timer = setTimeout(() => {
      navigate("/student-courses");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50">
      <div className="max-w-md w-full mx-4">
        <Card className="border-0 shadow-2xl overflow-hidden">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-green-500 to-blue-500 text-white">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">
              Payment Successful! 🎉
            </CardTitle>
            <p className="text-green-100">
              Welcome to your new learning adventure
            </p>
          </CardHeader>
          
          <CardContent className="p-8 text-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <Gift className="w-5 h-5 text-blue-500" />
                  <span>Course successfully enrolled</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-slate-700">
                  <BookOpen className="w-5 h-5 text-green-500" />
                  <span>Lifetime access granted</span>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-600">
                  You'll be automatically redirected to your courses in{" "}
                  <span className="font-semibold text-blue-600">3 seconds</span>
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button
                  onClick={() => navigate("/student-courses")}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <BookOpen className="w-5 h-5" />
                  Go to My Courses
                  <ArrowRight className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => navigate("/courses")}
                  className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 py-3 rounded-xl font-medium transition-all duration-200"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaymentSuccessPage;
