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
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface SalesData {
  petrol: { price: string; quantity: string; total: number };
  powerPetrol: { price: string; quantity: string; total: number };
  diesel: { price: string; quantity: string; total: number };
  other: { price: string; quantity: string; total: number };
}

interface AdditionalSaleEntry {
  id: string;
  productName: string;
  price: string;
  quantity: string;
  total: number;
}

interface ExpenseData {
  petrolTesting: { price: string; quantity: string; total: number };
  powerPetrolTesting: { price: string; quantity: string; total: number };
  dieselTesting: { price: string; quantity: string; total: number };
  tankerDiesel: { price: string; quantity: string; total: number };
}

interface AdditionalExpenseEntry {
  id: string;
  itemName: string;
  price: string;
  quantity: string;
  total: number;
}

interface EarningsData {
  cash: string;
  phonePayNight: string;
  phonePayDay: string;
  cardSwipe: string;
  hpPaySwipe: string;
  opt: string;
  other: string;
}

interface AdditionalEarningEntry {
  id: string;
  modeName: string;
  amount: string;
}

interface CashEntry {
  id: string;
  name: string;
  amount: string;
}

const Index = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Sales state - fixed fields
  const [salesData, setSalesData] = useState<SalesData>({
    petrol: { price: '', quantity: '', total: 0 },
    powerPetrol: { price: '', quantity: '', total: 0 },
    diesel: { price: '', quantity: '', total: 0 },
    other: { price: '', quantity: '', total: 0 },
  });
  const [additionalSales, setAdditionalSales] = useState<AdditionalSaleEntry[]>([]);

  // Earnings state - fixed fields
  const [earningsData, setEarningsData] = useState<EarningsData>({
    cash: '',
    phonePayNight: '',
    phonePayDay: '',
    cardSwipe: '',
    hpPaySwipe: '',
    opt: '',
    other: '',
  });
  const [additionalEarnings, setAdditionalEarnings] = useState<AdditionalEarningEntry[]>([]);

  // Expense state - fixed fields
  const [expenseData, setExpenseData] = useState<ExpenseData>({
    petrolTesting: { price: '', quantity: '', total: 0 },
    powerPetrolTesting: { price: '', quantity: '', total: 0 },
    dieselTesting: { price: '', quantity: '', total: 0 },
    tankerDiesel: { price: '', quantity: '', total: 0 },
  });
  const [additionalExpenses, setAdditionalExpenses] = useState<AdditionalExpenseEntry[]>([]);

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
  const handleUpdateSale = (product: keyof SalesData, field: 'price' | 'quantity', value: string) => {
    setSalesData(prev => {
      const updated = { ...prev[product], [field]: value };
      updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
      return { ...prev, [product]: updated };
    });
  };

  const handleAddSale = () => {
    setAdditionalSales(prev => [...prev, { id: Date.now().toString(), productName: '', price: '', quantity: '', total: 0 }]);
  };

  const handleRemoveSale = (id: string) => {
    setAdditionalSales(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateSaleEntry = (id: string, field: 'productName' | 'price' | 'quantity', value: string) => {
    setAdditionalSales(prev => prev.map(entry => {
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
  const handleUpdateEarning = (mode: keyof EarningsData, value: string) => {
    setEarningsData(prev => ({ ...prev, [mode]: value }));
  };

  const handleAddEarning = () => {
    setAdditionalEarnings(prev => [...prev, { id: Date.now().toString(), modeName: '', amount: '' }]);
  };

  const handleRemoveEarning = (id: string) => {
    setAdditionalEarnings(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateEarningEntry = (id: string, field: 'modeName' | 'amount', value: string) => {
    setAdditionalEarnings(prev => prev.map(entry => entry.id === id ? { ...entry, [field]: value } : entry));
  };

  // Expense handlers
  const handleUpdateExpense = (item: keyof ExpenseData, field: 'price' | 'quantity', value: string) => {
    setExpenseData(prev => {
      const updated = { ...prev[item], [field]: value };
      updated.total = parseFloat(updated.price || '0') * parseFloat(updated.quantity || '0');
      return { ...prev, [item]: updated };
    });
  };

  const handleAddExpense = () => {
    setAdditionalExpenses(prev => [...prev, { id: Date.now().toString(), itemName: '', price: '', quantity: '', total: 0 }]);
  };

  const handleRemoveExpense = (id: string) => {
    setAdditionalExpenses(prev => prev.filter(e => e.id !== id));
  };

  const handleUpdateExpenseEntry = (id: string, field: 'itemName' | 'price' | 'quantity', value: string) => {
    setAdditionalExpenses(prev => prev.map(entry => {
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
  const totalSales = Object.values(salesData).reduce((sum, item) => sum + item.total, 0) + additionalSales.reduce((sum, entry) => sum + entry.total, 0);
  const totalEarnings = Object.values(earningsData).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0) + additionalEarnings.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalExpenses = Object.values(expenseData).reduce((sum, item) => sum + item.total, 0) + additionalExpenses.reduce((sum, entry) => sum + entry.total, 0);
  const totalShort = shortEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalBorrow = borrowEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalReceived = receivedEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const totalReward = rewardEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const netTotal = totalSales + totalEarnings - totalExpenses + totalReceived + totalReward - totalShort - totalBorrow;
  const totalUnpaid = unpaid.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);

  // Load data from database when date changes
  useEffect(() => {
    if (!user) return;
    
    const loadData = async () => {
      setIsLoading(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      try {
        // Load sales
        const { data: salesDbData } = await supabase
          .from('sales')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        
        const newSalesData: SalesData = {
          petrol: { price: '', quantity: '', total: 0 },
          powerPetrol: { price: '', quantity: '', total: 0 },
          diesel: { price: '', quantity: '', total: 0 },
          other: { price: '', quantity: '', total: 0 },
        };
        
        const newAdditionalSales: AdditionalSaleEntry[] = [];
        
        if (salesDbData && salesDbData.length > 0) {
          salesDbData.forEach(s => {
            const key = s.product_name.replace(/\s/g, '') as keyof SalesData;
            if (key === 'petrol' || key === 'powerPetrol' || key === 'diesel' || key === 'other') {
              newSalesData[key] = {
                price: s.price.toString(),
                quantity: s.quantity.toString(),
                total: s.total
              };
            } else {
              newAdditionalSales.push({
                id: s.id,
                productName: s.product_name,
                price: s.price.toString(),
                quantity: s.quantity.toString(),
                total: s.total
              });
            }
          });
        }
        setSalesData(newSalesData);
        setAdditionalSales(newAdditionalSales);

        // Load earnings
        const { data: earningsDbData } = await supabase
          .from('earnings')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        
        const newEarningsData: EarningsData = {
          cash: '',
          phonePayNight: '',
          phonePayDay: '',
          cardSwipe: '',
          hpPaySwipe: '',
          opt: '',
          other: '',
        };
        
        const newAdditionalEarnings: AdditionalEarningEntry[] = [];
        
        if (earningsDbData && earningsDbData.length > 0) {
          earningsDbData.forEach(e => {
            const key = e.mode_name.replace(/\s/g, '').replace(/[()]/g, '') as keyof EarningsData;
            const mapping: Record<string, keyof EarningsData> = {
              'cash': 'cash',
              'phonePayNight': 'phonePayNight',
              'phonePayDay': 'phonePayDay',
              'cardSwipe': 'cardSwipe',
              'hpPaySwipe': 'hpPaySwipe',
              'opt': 'opt',
              'other': 'other',
            };
            if (mapping[key]) {
              newEarningsData[mapping[key]] = e.amount.toString();
            } else {
              newAdditionalEarnings.push({
                id: e.id,
                modeName: e.mode_name,
                amount: e.amount.toString()
              });
            }
          });
        }
        setEarningsData(newEarningsData);
        setAdditionalEarnings(newAdditionalEarnings);

        // Load expenses
        const { data: expensesDbData } = await supabase
          .from('expenses')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        
        const newExpenseData: ExpenseData = {
          petrolTesting: { price: '', quantity: '', total: 0 },
          powerPetrolTesting: { price: '', quantity: '', total: 0 },
          dieselTesting: { price: '', quantity: '', total: 0 },
          tankerDiesel: { price: '', quantity: '', total: 0 },
        };
        
        const newAdditionalExpenses: AdditionalExpenseEntry[] = [];
        
        if (expensesDbData && expensesDbData.length > 0) {
          expensesDbData.forEach(e => {
            const key = e.item_name.replace(/\s/g, '') as keyof ExpenseData;
            if (key === 'petrolTesting' || key === 'powerPetrolTesting' || key === 'dieselTesting' || key === 'tankerDiesel') {
              newExpenseData[key] = {
                price: e.price.toString(),
                quantity: e.quantity.toString(),
                total: e.total
              };
            } else {
              newAdditionalExpenses.push({
                id: e.id,
                itemName: e.item_name,
                price: e.price.toString(),
                quantity: e.quantity.toString(),
                total: e.total
              });
            }
          });
        }
        setExpenseData(newExpenseData);
        setAdditionalExpenses(newAdditionalExpenses);

        // Load employee cash
        const { data: employeeCashData } = await supabase
          .from('employee_cash')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        
        const shorts = employeeCashData?.filter(e => e.type === 'short').map(e => ({ id: e.id, name: e.person_name, amount: e.amount.toString() })) || [];
        const borrows = employeeCashData?.filter(e => e.type === 'borrow').map(e => ({ id: e.id, name: e.person_name, amount: e.amount.toString() })) || [];
        const received = employeeCashData?.filter(e => e.type === 'received').map(e => ({ id: e.id, name: e.person_name, amount: e.amount.toString() })) || [];
        const rewards = employeeCashData?.filter(e => e.type === 'reward').map(e => ({ id: e.id, name: e.person_name, amount: e.amount.toString() })) || [];
        
        setShortEntries(shorts.length > 0 ? shorts : [{ id: '1', name: '', amount: '' }]);
        setBorrowEntries(borrows.length > 0 ? borrows : [{ id: '1', name: '', amount: '' }]);
        setReceivedEntries(received.length > 0 ? received : [{ id: '1', name: '', amount: '' }]);
        setRewardEntries(rewards.length > 0 ? rewards : [{ id: '1', name: '', amount: '' }]);

        // Load unpaid amounts
        const { data: unpaidData } = await supabase
          .from('unpaid_amounts')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        
        if (unpaidData && unpaidData.length > 0) {
          setUnpaid(unpaidData.map(u => ({ id: u.id, name: u.person_name, amount: u.amount.toString() })));
        } else {
          setUnpaid([{ id: '1', name: '', amount: '' }]);
        }

        // Load readings
        const { data: readingsData } = await supabase
          .from('readings')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr);
        
        if (readingsData && readingsData.length > 0) {
          const newReadings: any = {
            petrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' }, A2: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, N2: { r1: '', r2: '' } },
            powerPetrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' } },
            diesel: { A1: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, A3: { r1: '', r2: '' }, B3: { r1: '', r2: '' }, N1: { r1: '', r2: '' } },
          };
          
          readingsData.forEach(r => {
            if (newReadings[r.fuel_type] && newReadings[r.fuel_type][r.nozzle]) {
              newReadings[r.fuel_type][r.nozzle] = {
                r1: r.reading1.toString(),
                r2: r.reading2.toString()
              };
            }
          });
          setReadings(newReadings);
        } else {
          setReadings({
            petrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' }, A2: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, N2: { r1: '', r2: '' } },
            powerPetrol: { A1: { r1: '', r2: '' }, B1: { r1: '', r2: '' } },
            diesel: { A1: { r1: '', r2: '' }, B2: { r1: '', r2: '' }, A3: { r1: '', r2: '' }, B3: { r1: '', r2: '' }, N1: { r1: '', r2: '' } },
          });
        }

        // Load notes
        const { data: notesData } = await supabase
          .from('notes')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', dateStr)
          .maybeSingle();
        
        setNotes(notesData?.content || '');
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [date, user]);

  // Auto-save function
  const saveData = async () => {
    if (!user) return;
    
    const dateStr = format(date, 'yyyy-MM-dd');
    
    try {
      // Delete existing data for this date
      await supabase.from('sales').delete().eq('user_id', user.id).eq('date', dateStr);
      await supabase.from('earnings').delete().eq('user_id', user.id).eq('date', dateStr);
      await supabase.from('expenses').delete().eq('user_id', user.id).eq('date', dateStr);
      await supabase.from('employee_cash').delete().eq('user_id', user.id).eq('date', dateStr);
      await supabase.from('unpaid_amounts').delete().eq('user_id', user.id).eq('date', dateStr);
      await supabase.from('readings').delete().eq('user_id', user.id).eq('date', dateStr);
      await supabase.from('notes').delete().eq('user_id', user.id).eq('date', dateStr);

      // Insert sales (fixed fields + additional entries)
      const salesToInsert = [
        ...Object.entries(salesData)
          .filter(([_, data]) => data.price && data.quantity)
          .map(([product, data]) => ({
            user_id: user.id,
            date: dateStr,
            product_name: product,
            price: parseFloat(data.price),
            quantity: parseFloat(data.quantity),
            total: data.total
          })),
        ...additionalSales
          .filter(s => s.productName && s.price && s.quantity)
          .map(s => ({
            user_id: user.id,
            date: dateStr,
            product_name: s.productName,
            price: parseFloat(s.price),
            quantity: parseFloat(s.quantity),
            total: s.total
          }))
      ];
      
      if (salesToInsert.length > 0) {
        await supabase.from('sales').insert(salesToInsert);
      }

      // Insert earnings (fixed fields + additional entries)
      const earningsToInsert = [
        ...Object.entries(earningsData)
          .filter(([_, amount]) => amount)
          .map(([mode, amount]) => ({
            user_id: user.id,
            date: dateStr,
            mode_name: mode,
            amount: parseFloat(amount)
          })),
        ...additionalEarnings
          .filter(e => e.modeName && e.amount)
          .map(e => ({
            user_id: user.id,
            date: dateStr,
            mode_name: e.modeName,
            amount: parseFloat(e.amount)
          }))
      ];
      
      if (earningsToInsert.length > 0) {
        await supabase.from('earnings').insert(earningsToInsert);
      }

      // Insert expenses (fixed fields + additional entries)
      const expensesToInsert = [
        ...Object.entries(expenseData)
          .filter(([_, data]) => data.price && data.quantity)
          .map(([item, data]) => ({
            user_id: user.id,
            date: dateStr,
            item_name: item,
            price: parseFloat(data.price),
            quantity: parseFloat(data.quantity),
            total: data.total
          })),
        ...additionalExpenses
          .filter(e => e.itemName && e.price && e.quantity)
          .map(e => ({
            user_id: user.id,
            date: dateStr,
            item_name: e.itemName,
            price: parseFloat(e.price),
            quantity: parseFloat(e.quantity),
            total: e.total
          }))
      ];
      
      if (expensesToInsert.length > 0) {
        await supabase.from('expenses').insert(expensesToInsert);
      }

      // Insert employee cash
      const allEmployeeCash = [
        ...shortEntries.filter(e => e.name && e.amount).map(e => ({ ...e, type: 'short' as const })),
        ...borrowEntries.filter(e => e.name && e.amount).map(e => ({ ...e, type: 'borrow' as const })),
        ...receivedEntries.filter(e => e.name && e.amount).map(e => ({ ...e, type: 'received' as const })),
        ...rewardEntries.filter(e => e.name && e.amount).map(e => ({ ...e, type: 'reward' as const }))
      ];
      
      if (allEmployeeCash.length > 0) {
        await supabase.from('employee_cash').insert(
          allEmployeeCash.map(e => ({
            user_id: user.id,
            date: dateStr,
            type: e.type,
            person_name: e.name,
            amount: parseFloat(e.amount)
          }))
        );
      }

      // Insert unpaid amounts
      const validUnpaid = unpaid.filter(u => u.name && u.amount);
      if (validUnpaid.length > 0) {
        await supabase.from('unpaid_amounts').insert(
          validUnpaid.map(u => ({
            user_id: user.id,
            date: dateStr,
            person_name: u.name,
            amount: parseFloat(u.amount)
          }))
        );
      }

      // Insert readings
      const readingsList: any[] = [];
      Object.entries(readings).forEach(([fuelType, nozzles]) => {
        Object.entries(nozzles as any).forEach(([nozzle, values]: [string, any]) => {
          if (values.r1 && values.r2) {
            readingsList.push({
              user_id: user.id,
              date: dateStr,
              fuel_type: fuelType,
              nozzle: nozzle,
              reading1: parseFloat(values.r1),
              reading2: parseFloat(values.r2)
            });
          }
        });
      });
      
      if (readingsList.length > 0) {
        await supabase.from('readings').insert(readingsList);
      }

      // Insert notes
      if (notes.trim()) {
        await supabase.from('notes').insert({
          user_id: user.id,
          date: dateStr,
          content: notes
        });
      }

      toast.success('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    }
  };

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
              data={salesData}
              onUpdate={handleUpdateSale}
              additionalEntries={additionalSales}
              onAddEntry={handleAddSale}
              onRemoveEntry={handleRemoveSale}
              onUpdateEntry={handleUpdateSaleEntry}
            />
            <ExpenseSection
              data={expenseData}
              onUpdate={handleUpdateExpense}
              additionalEntries={additionalExpenses}
              onAddEntry={handleAddExpense}
              onRemoveEntry={handleRemoveExpense}
              onUpdateEntry={handleUpdateExpenseEntry}
            />
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <EarningsSection
              data={earningsData}
              onUpdate={handleUpdateEarning}
              additionalEntries={additionalEarnings}
              onAddEntry={handleAddEarning}
              onRemoveEntry={handleRemoveEarning}
              onUpdateEntry={handleUpdateEarningEntry}
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

        {/* Save Button */}
        <div className="flex justify-end mt-4">
          <Button onClick={saveData} disabled={isLoading} size="lg">
            {isLoading ? 'Saving...' : 'Save All Data'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
