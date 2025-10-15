import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, MinusCircle } from "lucide-react";

interface EarningEntry {
  id: string;
  modeName: string;
  amount: string;
}

interface EarningsSectionProps {
  entries: EarningEntry[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: 'modeName' | 'amount', value: string) => void;
}

export const EarningsSection = ({ entries, onAdd, onRemove, onUpdate }: EarningsSectionProps) => {
  const total = entries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);

  return (
    <Card className="border-l-4 border-l-[hsl(var(--card-earnings))]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-success" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2">
            <Input
              placeholder="Mode (e.g., Cash, PhonePay)"
              value={entry.modeName}
              onChange={(e) => onUpdate(entry.id, 'modeName', e.target.value)}
              className="h-9 flex-1"
            />
            <div className="w-40">
              <Input
                type="number"
                placeholder="Amount"
                value={entry.amount}
                onChange={(e) => onUpdate(entry.id, 'amount', e.target.value)}
                className="h-9"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onRemove(entry.id)}>
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
        
        <Button variant="outline" size="sm" className="w-full" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Earning Entry
        </Button>

        {/* Section Total */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Total Earnings:</Label>
            <div className="text-lg font-bold text-success">₹{total.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
