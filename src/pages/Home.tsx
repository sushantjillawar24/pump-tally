import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator, TrendingUp } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Petrol Pump Management
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose an option to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card 
            className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-primary/30 hover:border-primary"
            onClick={() => navigate("/tally")}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Calculator className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Tally</h2>
              <p className="text-muted-foreground">
                Track daily sales, expenses, and manage transactions
              </p>
              <Button size="lg" className="mt-4">
                Open Tally
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
              <Button size="lg" variant="secondary" className="mt-4">
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
