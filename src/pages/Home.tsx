import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-8 pt-8">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
        <div className="text-center space-y-3">
          <img
            src="/images/petrol-logo.png"
            alt="HP Petroleum Logo"
            className="mx-auto h-14 md:h-16"
          />
          <h1
            className="text-3xl md:text-4xl font-medium text-foreground tracking-normal"
            style={{ fontFamily: 'Poppins, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica Neue, Arial, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"' }}
          >
            Gandhewar Petroleum Management
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-primary/30 hover:border-primary"
            onClick={() => navigate("/dashboard")}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Dashboard</h2>
              <p className="text-muted-foreground">
                Track daily sales, expenses, and manage transactions
              </p>
              <Button
                size="lg"
                className="mt-4 w-full md:w-auto rounded-lg text-base px-6 py-5 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-accent/30 hover:border-accent"
            onClick={() => navigate("/insights")}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-10 w-10 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold">Insights</h2>
              <p className="text-muted-foreground">
                View analytics, charts, and business insights
              </p>
              <Button
                size="lg"
                className="mt-4 w-full md:w-auto rounded-lg text-base px-6 py-5 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                View Insights
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;
