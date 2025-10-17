import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, MinusCircle } from "lucide-react";

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

interface EarningsSectionProps {
  data: EarningsData;
  onUpdate: (mode: keyof EarningsData, value: string) => void;
  additionalEntries: AdditionalEarningEntry[];
  onAddEntry: () => void;
  onRemoveEntry: (id: string) => void;
  onUpdateEntry: (id: string, field: 'modeName' | 'amount', value: string) => void;
}

export const EarningsSection = ({ data, onUpdate, additionalEntries, onAddEntry, onRemoveEntry, onUpdateEntry }: EarningsSectionProps) => {
  const fixedTotal = Object.values(data).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);
  const additionalTotal = additionalEntries.reduce((sum, entry) => sum + parseFloat(entry.amount || '0'), 0);
  const total = fixedTotal + additionalTotal;

  const modes = [
    { key: 'cash' as const, label: 'Cash' },
    { key: 'phonePayNight' as const, label: 'Phone Pay (Night)' },
    { key: 'phonePayDay' as const, label: 'Phone Pay (Day)' },
    { key: 'cardSwipe' as const, label: 'Card Swipe' },
    { key: 'hpPaySwipe' as const, label: 'HP Pay Swipe' },
    { key: 'opt' as const, label: 'OPT' },
    { key: 'other' as const, label: 'Other' },
  ];

  return (
    <Card className="border-l-4 border-l-[hsl(var(--card-earnings))]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-success" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {modes.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-2">
            <Label className="text-sm min-w-[150px]">{label}</Label>
            <Input
              type="number"
              placeholder="0.00"
              value={data[key]}
              onChange={(e) => onUpdate(key, e.target.value)}
              className="h-9 flex-1"
            />
          </div>
        ))}

        {/* Additional Entries */}
        {additionalEntries.map((entry) => (
          <div key={entry.id} className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
            <Input
              placeholder="Mode name"
              value={entry.modeName}
              onChange={(e) => onUpdateEntry(entry.id, 'modeName', e.target.value)}
              className="h-9 flex-1"
            />
            <Input
              type="number"
              placeholder="0.00"
              value={entry.amount}
              onChange={(e) => onUpdateEntry(entry.id, 'amount', e.target.value)}
              className="h-9 w-32"
            />
            <Button variant="ghost" size="icon" onClick={() => onRemoveEntry(entry.id)}>
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}

        <Button variant="outline" size="sm" className="w-full" onClick={onAddEntry}>
          <Plus className="h-4 w-4 mr-2" />
          Add Entry
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
