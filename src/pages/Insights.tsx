import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { NavigationBar } from "@/components/NavigationBar";

const Insights = () => {
  const navigate = useNavigate();

  // Sample data for charts
  const salesDistribution = [
    { name: "Petrol", value: 45000, color: "hsl(var(--primary))" },
    { name: "Power Petrol", value: 25000, color: "hsl(var(--accent))" },
    { name: "Diesel", value: 35000, color: "hsl(var(--success))" },
    { name: "Other", value: 5000, color: "hsl(var(--muted))" },
  ];

  const weeklySales = [
    { day: "Mon", sales: 15000, expenses: 8000 },
    { day: "Tue", sales: 18000, expenses: 9500 },
    { day: "Wed", sales: 16000, expenses: 8200 },
    { day: "Thu", sales: 20000, expenses: 10000 },
    { day: "Fri", sales: 22000, expenses: 11000 },
    { day: "Sat", sales: 25000, expenses: 12500 },
    { day: "Sun", sales: 19000, expenses: 9800 },
  ];

  const monthlyTrend = [
    { month: "Jan", revenue: 350000 },
    { month: "Feb", revenue: 380000 },
    { month: "Mar", revenue: 420000 },
    { month: "Apr", revenue: 410000 },
    { month: "May", revenue: 450000 },
    { month: "Jun", revenue: 480000 },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
            <h1 className="text-3xl font-bold text-foreground">Business Insights</h1>
            <p className="text-muted-foreground mt-1">Analytics and performance overview</p>
          </div>
          </div>
          <NavigationBar />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-primary/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₹4,80,000</div>
              <p className="text-xs text-success mt-1">↑ 12% from last month</p>
            </CardContent>
          </Card>

          <Card className="border-success/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹1,10,000</div>
              <p className="text-xs text-success mt-1">↑ 8% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₹69,000</div>
              <p className="text-xs text-destructive mt-1">↑ 5% from last week</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">₹41,000</div>
              <p className="text-xs text-success mt-1">↑ 15% from last week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle>Sales Distribution by Fuel Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={salesDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {salesDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="border-success/20">
            <CardHeader>
              <CardTitle>Weekly Sales vs Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="hsl(var(--success))" name="Sales" />
                  <Bar dataKey="expenses" fill="hsl(var(--destructive))" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Line Chart */}
          <Card className="lg:col-span-2 border-accent/20">
            <CardHeader>
              <CardTitle>Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Insights;
