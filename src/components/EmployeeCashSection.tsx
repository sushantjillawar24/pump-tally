import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CashEntry {
  id: string;
  name: string;
  amount: string;
}

interface EmployeeCashSectionProps {
  cashIn: CashEntry[];
  cashOut: CashEntry[];
  onAddEntry: (type: 'cashIn' | 'cashOut') => void;
  onRemoveEntry: (type: 'cashIn' | 'cashOut', id: string) => void;
  onUpdateEntry: (type: 'cashIn' | 'cashOut', id: string, field: 'name' | 'amount', value: string) => void;
}

export const EmployeeCashSection = ({
  cashIn,
  cashOut,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
}: EmployeeCashSectionProps) => {
  const cashInTotal = cashIn.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const cashOutTotal = cashOut.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);

  const renderEntries = (entries: CashEntry[], type: 'cashIn' | 'cashOut') => (
    <div className="space-y-3">
      {entries.map((entry) => (
        <div key={entry.id} className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Employee name"
              value={entry.name}
              onChange={(e) => onUpdateEntry(type, entry.id, 'name', e.target.value)}
              className="h-9"
            />
          </div>
          <div className="w-32">
            <Input
              type="number"
              placeholder="Amount"
              value={entry.amount}
              onChange={(e) => onUpdateEntry(type, entry.id, 'amount', e.target.value)}
              className="h-9"
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="h-9 w-9"
            onClick={() => onRemoveEntry(type, entry.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onAddEntry(type)}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Entry
      </Button>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Employee Cash IN/OUT
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cashIn" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cashIn">Cash IN</TabsTrigger>
            <TabsTrigger value="cashOut">Cash OUT</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cashIn" className="space-y-4 mt-4">
            {renderEntries(cashIn, 'cashIn')}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Total Cash IN:</Label>
                <div className="text-lg font-bold text-success">
                  ₹{cashInTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cashOut" className="space-y-4 mt-4">
            {renderEntries(cashOut, 'cashOut')}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Total Cash OUT:</Label>
                <div className="text-lg font-bold text-destructive">
                  ₹{cashOutTotal.toFixed(2)}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
