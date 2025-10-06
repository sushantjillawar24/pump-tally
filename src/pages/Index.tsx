import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { SalesSection } from "@/components/SalesSection";
import { EarningsSection } from "@/components/EarningsSection";
import { ExpenseSection } from "@/components/ExpenseSection";
import { EmployeeCashSection } from "@/components/EmployeeCashSection";
import { cn } from "@/lib/utils";

interface SaleItem {
  price: string;
  quantity: string;
  total: number;
}

interface CashEntry {
  id: string;
  name: string;
  amount: string;
}

const Index = () => {
  const [date, setDate] = useState<Date>(new Date());

  // Sales state
  const [sales, setSales] = useState({
    petrol: { price: '', quantity: '', total: 0 },
    powerPetrol: { price: '', quantity: '', total: 0 },
    diesel: { price: '', quantity: '', total: 0 },
  });

  // Earnings state
  const [earnings, setEarnings] = useState({
    phonePayNight: '',
    phonePayDay: '',
    cardSwipe: '',
    hpPaySwipe: '',
    other: '',
  });

  // Expense state
  const [expenses, setExpenses] = useState({
    petrolTesting: { price: '', quantity: '', total: 0 },
    powerPetrolTesting: { price: '', quantity: '', total: 0 },
    dieselTesting: { price: '', quantity: '', total: 0 },
  });

  // Employee cash state
  const [cashIn, setCashIn] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);
  const [cashOut, setCashOut] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);

  const updateSale = (field: string, type: 'price' | 'quantity', value: string) => {
    setSales(prev => {
      const item = prev[field as keyof typeof prev] as SaleItem;
      const updated = { ...item, [type]: value };
      updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
      return { ...prev, [field]: updated };
    });
  };

  const updateEarning = (field: string, value: string) => {
    setEarnings(prev => ({ ...prev, [field]: value }));
  };

  const updateExpense = (field: string, type: 'price' | 'quantity', value: string) => {
    setExpenses(prev => {
      const item = prev[field as keyof typeof prev] as SaleItem;
      const updated = { ...item, [type]: value };
      updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
      return { ...prev, [field]: updated };
    });
  };

  const addCashEntry = (type: 'cashIn' | 'cashOut') => {
    const newEntry = { id: Date.now().toString(), name: '', amount: '' };
    if (type === 'cashIn') {
      setCashIn(prev => [...prev, newEntry]);
    } else {
      setCashOut(prev => [...prev, newEntry]);
    }
  };

  const removeCashEntry = (type: 'cashIn' | 'cashOut', id: string) => {
    if (type === 'cashIn') {
      setCashIn(prev => prev.filter(entry => entry.id !== id));
    } else {
      setCashOut(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const updateCashEntry = (
    type: 'cashIn' | 'cashOut',
    id: string,
    field: 'name' | 'amount',
    value: string
  ) => {
    const updateFn = (prev: CashEntry[]) =>
      prev.map(entry => (entry.id === id ? { ...entry, [field]: value } : entry));
    
    if (type === 'cashIn') {
      setCashIn(updateFn);
    } else {
      setCashOut(updateFn);
    }
  };

  // Calculate totals
  const totalSales = sales.petrol.total + sales.powerPetrol.total + sales.diesel.total;
  const totalEarnings = Object.values(earnings).reduce((sum, val) => sum + parseFloat(val || '0'), 0);
  const totalExpenses = expenses.petrolTesting.total + expenses.powerPetrolTesting.total + expenses.dieselTesting.total;
  const totalCashIn = cashIn.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalCashOut = cashOut.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const netTotal = totalSales + totalEarnings - totalExpenses + totalCashIn - totalCashOut;

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Petrol Pump Daily Expense</h1>
            <p className="text-muted-foreground mt-1">Track your daily transactions and expenses</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <SalesSection
              petrol={sales.petrol}
              powerPetrol={sales.powerPetrol}
              diesel={sales.diesel}
              onUpdate={updateSale}
            />
            <ExpenseSection
              petrolTesting={expenses.petrolTesting}
              powerPetrolTesting={expenses.powerPetrolTesting}
              dieselTesting={expenses.dieselTesting}
              onUpdate={updateExpense}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <EarningsSection
              phonePayNight={earnings.phonePayNight}
              phonePayDay={earnings.phonePayDay}
              cardSwipe={earnings.cardSwipe}
              hpPaySwipe={earnings.hpPaySwipe}
              other={earnings.other}
              onUpdate={updateEarning}
            />
            <EmployeeCashSection
              cashIn={cashIn}
              cashOut={cashOut}
              onAddEntry={addCashEntry}
              onRemoveEntry={removeCashEntry}
              onUpdateEntry={updateCashEntry}
            />
          </div>
        </div>

        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Sales</p>
                <p className="text-lg font-bold text-primary">₹{totalSales.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Earnings</p>
                <p className="text-lg font-bold text-success">₹{totalEarnings.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Expenses</p>
                <p className="text-lg font-bold text-destructive">₹{totalExpenses.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cash IN</p>
                <p className="text-lg font-bold text-success">₹{totalCashIn.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Cash OUT</p>
                <p className="text-lg font-bold text-destructive">₹{totalCashOut.toFixed(2)}</p>
              </div>
              <div className="space-y-1 col-span-2 md:col-span-3 lg:col-span-1">
                <p className="text-xs text-muted-foreground">Net Total</p>
                <p className={cn(
                  "text-xl font-bold",
                  netTotal >= 0 ? "text-success" : "text-destructive"
                )}>
                  ₹{netTotal.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
