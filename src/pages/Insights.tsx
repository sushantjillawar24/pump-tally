import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";
import { NavigationBar } from "@/components/NavigationBar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

interface PersonCashSummary {
  person: string;
  short: number;
  borrow: number;
  received: number;
  reward: number;
  net: number;
}

const Insights = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [salesDistribution, setSalesDistribution] = useState<any[]>([]);
  const [weeklySales, setWeeklySales] = useState<any[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [employeeCashData, setEmployeeCashData] = useState<PersonCashSummary[]>([]);

  useEffect(() => {
    if (!user) return;

    const fetchInsights = async () => {
      const today = new Date();
      const last7Days = subDays(today, 6);
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);

      // Fetch current month data for revenue
      const { data: salesData } = await supabase
        .from('sales')
        .select('product_name, total')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      const { data: earningsData } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      const { data: expensesData } = await supabase
        .from('expenses')
        .select('total')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      // Calculate totals
      const salesTotal = salesData?.reduce((sum, s) => sum + Number(s.total), 0) || 0;
      const earningsTotal = earningsData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
      const expensesTotal = expensesData?.reduce((sum, e) => sum + Number(e.total), 0) || 0;
      const revenue = salesTotal + earningsTotal;

      setTotalRevenue(revenue);
      setTotalSales(salesTotal);
      setTotalExpenses(expensesTotal);
      setNetProfit(revenue - expensesTotal);

      // Sales distribution by product
      const productMap = new Map<string, number>();
      salesData?.forEach(s => {
        const current = productMap.get(s.product_name) || 0;
        productMap.set(s.product_name, current + Number(s.total));
      });

      const colors = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--destructive))", "hsl(var(--muted))"];
      setSalesDistribution(
        Array.from(productMap.entries()).map(([name, value], idx) => ({
          name,
          value,
          color: colors[idx % colors.length]
        }))
      );

      // Weekly sales vs expenses
      const weeklyData = [];
      for (let i = 6; i >= 0; i--) {
        const day = subDays(today, i);
        const dateStr = format(day, 'yyyy-MM-dd');

        const { data: daySales } = await supabase
          .from('sales')
          .select('total')
          .eq('user_id', user.id)
          .eq('date', dateStr);

        const { data: dayExpenses } = await supabase
          .from('expenses')
          .select('total')
          .eq('user_id', user.id)
          .eq('date', dateStr);

        weeklyData.push({
          day: format(day, 'EEE'),
          sales: daySales?.reduce((sum, s) => sum + Number(s.total), 0) || 0,
          expenses: dayExpenses?.reduce((sum, e) => sum + Number(e.total), 0) || 0
        });
      }
      setWeeklySales(weeklyData);

      // Monthly trend (last 6 months)
      const monthlyData = [];
      for (let i = 5; i >= 0; i--) {
        const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const start = startOfMonth(monthDate);
        const end = endOfMonth(monthDate);

        const { data: monthSales } = await supabase
          .from('sales')
          .select('total')
          .eq('user_id', user.id)
          .gte('date', format(start, 'yyyy-MM-dd'))
          .lte('date', format(end, 'yyyy-MM-dd'));

        const { data: monthEarnings } = await supabase
          .from('earnings')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', format(start, 'yyyy-MM-dd'))
          .lte('date', format(end, 'yyyy-MM-dd'));

        const revenue = (monthSales?.reduce((sum, s) => sum + Number(s.total), 0) || 0) +
                       (monthEarnings?.reduce((sum, e) => sum + Number(e.amount), 0) || 0);

        monthlyData.push({
          month: format(monthDate, 'MMM'),
          revenue
        });
      }
      setMonthlyTrend(monthlyData);

      // Employee Cash Person-wise Analysis
      const { data: employeeCash } = await supabase
        .from('employee_cash')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', format(monthStart, 'yyyy-MM-dd'))
        .lte('date', format(monthEnd, 'yyyy-MM-dd'));

      const personMap = new Map<string, PersonCashSummary>();
      employeeCash?.forEach(e => {
        const current = personMap.get(e.person_name) || {
          person: e.person_name,
          short: 0,
          borrow: 0,
          received: 0,
          reward: 0,
          net: 0
        };

        if (e.type === 'short') current.short += Number(e.amount);
        if (e.type === 'borrow') current.borrow += Number(e.amount);
        if (e.type === 'received') current.received += Number(e.amount);
        if (e.type === 'reward') current.reward += Number(e.amount);

        current.net = current.received + current.reward - current.short - current.borrow;
        personMap.set(e.person_name, current);
      });

      setEmployeeCashData(Array.from(personMap.values()));
    };

    fetchInsights();
  }, [user]);

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
              <div className="text-2xl font-bold text-primary">₹{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>

          <Card className="border-success/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">₹{totalSales.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₹{totalExpenses.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
            </CardContent>
          </Card>

          <Card className="border-accent/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">₹{netProfit.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Current month</p>
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

        {/* Employee Cash Person-wise Analysis */}
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle>Employee Cash Analysis (Person-wise)</CardTitle>
          </CardHeader>
          <CardContent>
            {employeeCashData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No employee cash data available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2 font-semibold">Person</th>
                      <th className="text-right p-2 font-semibold text-destructive">Short</th>
                      <th className="text-right p-2 font-semibold text-destructive">Borrow</th>
                      <th className="text-right p-2 font-semibold text-success">Received</th>
                      <th className="text-right p-2 font-semibold text-success">Reward</th>
                      <th className="text-right p-2 font-semibold">Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeCashData.map((person, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">{person.person}</td>
                        <td className="text-right p-2 text-destructive">₹{person.short.toFixed(2)}</td>
                        <td className="text-right p-2 text-destructive">₹{person.borrow.toFixed(2)}</td>
                        <td className="text-right p-2 text-success">₹{person.received.toFixed(2)}</td>
                        <td className="text-right p-2 text-success">₹{person.reward.toFixed(2)}</td>
                        <td className={`text-right p-2 font-bold ${person.net >= 0 ? 'text-success' : 'text-destructive'}`}>
                          ₹{person.net.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 font-bold">
                      <td className="p-2">Total</td>
                      <td className="text-right p-2 text-destructive">
                        ₹{employeeCashData.reduce((sum, p) => sum + p.short, 0).toFixed(2)}
                      </td>
                      <td className="text-right p-2 text-destructive">
                        ₹{employeeCashData.reduce((sum, p) => sum + p.borrow, 0).toFixed(2)}
                      </td>
                      <td className="text-right p-2 text-success">
                        ₹{employeeCashData.reduce((sum, p) => sum + p.received, 0).toFixed(2)}
                      </td>
                      <td className="text-right p-2 text-success">
                        ₹{employeeCashData.reduce((sum, p) => sum + p.reward, 0).toFixed(2)}
                      </td>
                      <td className={`text-right p-2 ${
                        employeeCashData.reduce((sum, p) => sum + p.net, 0) >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        ₹{employeeCashData.reduce((sum, p) => sum + p.net, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Insights;
