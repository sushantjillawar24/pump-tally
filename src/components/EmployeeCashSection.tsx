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
  shortEntries: CashEntry[];
  borrowEntries: CashEntry[];
  receivedEntries: CashEntry[];
  rewardEntries: CashEntry[];
  onAddEntry: (type: 'short' | 'borrow' | 'received' | 'reward') => void;
  onRemoveEntry: (type: 'short' | 'borrow' | 'received' | 'reward', id: string) => void;
  onUpdateEntry: (type: 'short' | 'borrow' | 'received' | 'reward', id: string, field: 'name' | 'amount', value: string) => void;
}

export const EmployeeCashSection = ({
  shortEntries,
  borrowEntries,
  receivedEntries,
  rewardEntries,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
}: EmployeeCashSectionProps) => {
  const shortTotal = shortEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const borrowTotal = borrowEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const receivedTotal = receivedEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const rewardTotal = rewardEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);

  const renderEntries = (entries: CashEntry[], type: 'short' | 'borrow' | 'received' | 'reward') => (
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
    <Card className="border-l-4 border-l-[hsl(var(--card-employee))]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-accent" />
          Employee Cash
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="short" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="short">Short</TabsTrigger>
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="reward">Reward</TabsTrigger>
          </TabsList>

          <TabsContent value="short" className="space-y-4 mt-4">
            {renderEntries(shortEntries, 'short')}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Total Short:</Label>
                <div className="text-lg font-bold text-destructive">₹{shortTotal.toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="borrow" className="space-y-4 mt-4">
            {renderEntries(borrowEntries, 'borrow')}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Total Borrow:</Label>
                <div className="text-lg font-bold text-destructive">₹{borrowTotal.toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="received" className="space-y-4 mt-4">
            {renderEntries(receivedEntries, 'received')}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Total Received:</Label>
                <div className="text-lg font-bold text-success">₹{receivedTotal.toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reward" className="space-y-4 mt-4">
            {renderEntries(rewardEntries, 'reward')}
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold">Total Reward:</Label>
                <div className="text-lg font-bold text-destructive">₹{rewardTotal.toFixed(2)}</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
