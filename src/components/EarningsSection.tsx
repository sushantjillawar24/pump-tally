import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";

interface EarningsData {
  cash: string;
  phonePayNight: string;
  phonePayDay: string;
  cardSwipe: string;
  hpPaySwipe: string;
  opt: string;
  other: string;
}

interface EarningsSectionProps {
  data: EarningsData;
  onUpdate: (mode: keyof EarningsData, value: string) => void;
}

export const EarningsSection = ({ data, onUpdate }: EarningsSectionProps) => {
  const total = Object.values(data).reduce((sum, amount) => sum + parseFloat(amount || '0'), 0);

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
