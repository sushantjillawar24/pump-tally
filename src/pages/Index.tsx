import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { SalesSection } from "@/components/SalesSection";
import { EarningsSection } from "@/components/EarningsSection";
import { ExpenseSection } from "@/components/ExpenseSection";
import { EmployeeCashSection } from "@/components/EmployeeCashSection";
import { UnpaidAmountCard } from "@/components/UnpaidAmountCard";
import { ReadingsCard } from "../components/ReadingsCard";
import { cn } from "@/lib/utils";

interface SaleEntry {
  id: string;
  productName: string;
  price: string;
  quantity: string;
  total: number;
}

interface EarningEntry {
  id: string;
  modeName: string;
  amount: string;
}

interface ExpenseEntry {
  id: string;
  itemName: string;
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

  // Sales state - dynamic entries
  const [salesEntries, setSalesEntries] = useState<SaleEntry[]>([
    { id: '1', productName: '', price: '', quantity: '', total: 0 }
  ]);

  // Earnings state - dynamic entries
  const [earningsEntries, setEarningsEntries] = useState<EarningEntry[]>([
    { id: '1', modeName: '', amount: '' }
  ]);

  // Expense state - dynamic entries
  const [expenseEntries, setExpenseEntries] = useState<ExpenseEntry[]>([
    { id: '1', itemName: '', price: '', quantity: '', total: 0 }
  ]);

  // Employee cash state
  const [shortEntries, setShortEntries] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);
  const [borrowEntries, setBorrowEntries] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);
  const [receivedEntries, setReceivedEntries] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);
  const [rewardEntries, setRewardEntries] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);

  const [unpaid, setUnpaid] = useState<CashEntry[]>([{ id: '1', name: '', amount: '' }]);

  const [readings, setReadings] = useState({
    petrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' }, A2: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, N2: { r1: '', r2: '' } },
    powerPetrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' } },
    diesel: { A1: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, A3: { r1: '', r2: '' }, B3: { r1: '', r2: '' }, N1: { r1: '', r2: '' } },
  });
  const updateReading = (fuel: 'petrol' | 'powerPetrol' | 'diesel', nozzle: string, which: 'r1' | 'r2', value: string) => {
    setReadings(prev => ({
      ...prev,
      [fuel]: {
        ...prev[fuel],
        [nozzle]: {
          ...(prev as any)[fuel][nozzle],
          [which]: value,
        },
      },
    }));
  };

  // Notes
  const [notes, setNotes] = useState("");

  // Sales handlers
  const handleAddSale = () => {
    setSalesEntries(prev => [...prev, { id: Date.now().toString(), productName: '', price: '', quantity: '', total: 0 }]);
  };

  const handleRemoveSale = (id: string) => {
    setSalesEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateSale = (id: string, field: 'productName' | 'price' | 'quantity', value: string) => {
    setSalesEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        if (field === 'price' || field === 'quantity') {
          updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
        }
        return updated;
      }
      return entry;
    }));
  };

  // Earnings handlers
  const handleAddEarning = () => {
    setEarningsEntries(prev => [...prev, { id: Date.now().toString(), modeName: '', amount: '' }]);
  };

  const handleRemoveEarning = (id: string) => {
    setEarningsEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateEarning = (id: string, field: 'modeName' | 'amount', value: string) => {
    setEarningsEntries(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  // Expense handlers
  const handleAddExpense = () => {
    setExpenseEntries(prev => [...prev, { id: Date.now().toString(), itemName: '', price: '', quantity: '', total: 0 }]);
  };

  const handleRemoveExpense = (id: string) => {
    setExpenseEntries(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateExpense = (id: string, field: 'itemName' | 'price' | 'quantity', value: string) => {
    setExpenseEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        if (field === 'price' || field === 'quantity') {
          updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
        }
        return updated;
      }
      return entry;
    }));
  };

  // Calculate totals
  const totalSales = salesEntries.reduce((sum, entry) => sum + entry.total, 0);
  const totalEarnings = earningsEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalExpenses = expenseEntries.reduce((sum, entry) => sum + entry.total, 0);
  const totalShort = shortEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalBorrow = borrowEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalReceived = receivedEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalReward = rewardEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const netTotal = totalSales + totalEarnings - totalExpenses + totalReceived + totalReward - totalShort - totalBorrow;
  const totalUnpaid = unpaid.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);

  // Reset all values when date changes (temporary logic while no DB)
  useEffect(() => {
    setSalesEntries([{ id: '1', productName: '', price: '', quantity: '', total: 0 }]);
    setEarningsEntries([{ id: '1', modeName: '', amount: '' }]);
    setExpenseEntries([{ id: '1', itemName: '', price: '', quantity: '', total: 0 }]);
    setShortEntries([{ id: '1', name: '', amount: '' }]);
    setBorrowEntries([{ id: '1', name: '', amount: '' }]);
    setReceivedEntries([{ id: '1', name: '', amount: '' }]);
    setRewardEntries([{ id: '1', name: '', amount: '' }]);
    setUnpaid([{ id: '1', name: '', amount: '' }]);
    setReadings({
      petrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' }, A2: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, N2: { r1: '', r2: '' } },
      powerPetrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' } },
      diesel: { A1: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, A3: { r1: '', r2: '' }, B3: { r1: '', r2: '' }, N1: { r1: '', r2: '' } },
    });
    setNotes("");
  }, [date]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <NavigationBar />
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
            <h1 className="text-3xl font-bold text-foreground">Gandhewar Petroleum Management</h1>
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
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <SalesSection
              entries={salesEntries}
              onAdd={handleAddSale}
              onRemove={handleRemoveSale}
              onUpdate={handleUpdateSale}
            />
            <ExpenseSection
              entries={expenseEntries}
              onAdd={handleAddExpense}
              onRemove={handleRemoveExpense}
              onUpdate={handleUpdateExpense}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <EarningsSection
              entries={earningsEntries}
              onAdd={handleAddEarning}
              onRemove={handleRemoveEarning}
              onUpdate={handleUpdateEarning}
            />
            <EmployeeCashSection
              shortEntries={shortEntries}
              borrowEntries={borrowEntries}
              receivedEntries={receivedEntries}
              rewardEntries={rewardEntries}
              onAddEntry={(type) => {
                const newEntry = { id: Date.now().toString(), name: '', amount: '' };
                if (type === 'short') setShortEntries(prev => [...prev, newEntry]);
                if (type === 'borrow') setBorrowEntries(prev => [...prev, newEntry]);
                if (type === 'received') setReceivedEntries(prev => [...prev, newEntry]);
                if (type === 'reward') setRewardEntries(prev => [...prev, newEntry]);
              }}
              onRemoveEntry={(type, id) => {
                if (type === 'short') setShortEntries(prev => prev.filter(e => e.id !== id));
                if (type === 'borrow') setBorrowEntries(prev => prev.filter(e => e.id !== id));
                if (type === 'received') setReceivedEntries(prev => prev.filter(e => e.id !== id));
                if (type === 'reward') setRewardEntries(prev => prev.filter(e => e.id !== id));
              }}
              onUpdateEntry={(type, id, field, value) => {
                const updater = (prev: CashEntry[]) => prev.map(e => e.id === id ? { ...e, [field]: value } : e);
                if (type === 'short') setShortEntries(updater);
                if (type === 'borrow') setBorrowEntries(updater);
                if (type === 'received') setReceivedEntries(updater);
                if (type === 'reward') setRewardEntries(updater);
              }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <UnpaidAmountCard
            entries={unpaid}
            onAdd={() => setUnpaid(prev => [...prev, { id: Date.now().toString(), name: '', amount: '' }])}
            onRemove={(id) => setUnpaid(prev => prev.filter(e => e.id !== id))}
            onUpdate={(id, field, value) => setUnpaid(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e))}
          />
          <ReadingsCard readings={readings} onUpdate={updateReading} />
        </div>
        {/* Summary Card */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border border-border">
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
                <p className="text-xs text-muted-foreground">Short</p>
                <p className="text-lg font-bold text-destructive">₹{totalShort.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Borrow</p>
                <p className="text-lg font-bold text-destructive">₹{totalBorrow.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Received</p>
                <p className="text-lg font-bold text-success">₹{totalReceived.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Reward</p>
                <p className="text-lg font-bold text-success">₹{totalReward.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Unpaid</p>
                <p className="text-lg font-bold">₹{totalUnpaid.toFixed(2)}</p>
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

        {/* Note Box */}
        <div className="mt-4">
          <textarea
            placeholder="Notes..."
            className="w-full h-32 rounded-md border border-border px-3 py-2 text-sm"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
