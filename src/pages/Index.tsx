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

interface SaleItem {
  price: string;
  quantity: string;
  total: number;
}

// Earnings are single-amount entries per mode
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
    other: '',
  });

  // Earnings state (single amount per mode)
  const [earnings, setEarnings] = useState({
    cash: '',
    phonePayNight: '',
    phonePayDay: '',
    cardSwipe: '',
    hpPaySwipe: '',
    otp: '',
    other: '',
  });

  // Expense state
  const [expenses, setExpenses] = useState({
    petrolTesting: { price: '', quantity: '', total: 0 },
    powerPetrolTesting: { price: '', quantity: '', total: 0 },
    dieselTesting: { price: '', quantity: '', total: 0 },
    tankerDiesel: { price: '', quantity: '', total: 0 },
  });

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

  // sanitize number-like strings (allows only digits and a single dot)
  const sanitizeNumericString = (raw: string) => {
    if (raw === "") return "";
    const cleaned = raw.replace(/[^0-9.]/g, "");
    const parts = cleaned.split(".");
    return parts.length > 1 ? parts[0] + "." + parts.slice(1).join("").replace(/\./g, "") : cleaned;
  };

  const updateSale = (field: string, type: 'price' | 'quantity', value: string) => {
    setSales(prev => {
      if (field === 'other') {
        return { ...prev, other: sanitizeNumericString(value) };
      }
      const item = prev[field as keyof typeof prev] as SaleItem;
      const updated = { ...item, [type]: value };
      updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
      return { ...prev, [field]: updated };
    });
  };

  const updateEarning = (field: keyof typeof earnings, value: string) => {
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

  // Employee cash handlers are provided inline where used

  // Calculate totals
  const totalPetrolSale = sales.petrol.total;
  const totalPowerPetrolSale = sales.powerPetrol.total;
  const totalDieselSale = sales.diesel.total;
  const totalSales = totalPetrolSale + totalPowerPetrolSale + totalDieselSale + parseFloat(sales.other || '0');
  const totalEarnings = Object.values(earnings).reduce((sum, val) => sum + parseFloat(val || '0'), 0);
  const totalExpenses = expenses.petrolTesting.total + expenses.powerPetrolTesting.total + expenses.dieselTesting.total + expenses.tankerDiesel.total;
  const totalShort = shortEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalBorrow = borrowEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalReceived = receivedEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalReward = rewardEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const netTotal = totalSales + totalEarnings - totalExpenses + totalReceived + totalReward - totalShort - totalBorrow;
  const totalUnpaid = unpaid.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);

  // Reset all values when date changes (temporary logic while no DB)
  useEffect(() => {
    setSales({ petrol: { price: '', quantity: '', total: 0 }, powerPetrol: { price: '', quantity: '', total: 0 }, diesel: { price: '', quantity: '', total: 0 }, other: '' });
    setEarnings({ cash: '', phonePayNight: '', phonePayDay: '', cardSwipe: '', hpPaySwipe: '', otp: '', other: '' });
    setExpenses({ petrolTesting: { price: '', quantity: '', total: 0 }, powerPetrolTesting: { price: '', quantity: '', total: 0 }, dieselTesting: { price: '', quantity: '', total: 0 }, tankerDiesel: { price: '', quantity: '', total: 0 } });
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
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            <SalesSection
              petrol={sales.petrol}
              powerPetrol={sales.powerPetrol}
              diesel={sales.diesel}
              otherAmount={sales.other}
              onUpdate={updateSale}
            />
            <ExpenseSection
              petrolTesting={expenses.petrolTesting}
              powerPetrolTesting={expenses.powerPetrolTesting}
              dieselTesting={expenses.dieselTesting}
              tankerDiesel={expenses.tankerDiesel}
              onUpdate={updateExpense}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <EarningsSection
              cash={earnings.cash}
              phonePayNight={earnings.phonePayNight}
              phonePayDay={earnings.phonePayDay}
              cardSwipe={earnings.cardSwipe}
              hpPaySwipe={earnings.hpPaySwipe}
              otp={earnings.otp}
              other={earnings.other}
              onUpdate={updateEarning}
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
                <p className="text-xs text-muted-foreground">Total Petrol Sale</p>
                <p className="text-lg font-bold">₹{totalPetrolSale.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Power Petrol Sale</p>
                <p className="text-lg font-bold">₹{totalPowerPetrolSale.toFixed(2)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Diesel Sale</p>
                <p className="text-lg font-bold">₹{totalDieselSale.toFixed(2)}</p>
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
