import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown } from "lucide-react";

interface ExpenseData {
  petrolTesting: { price: string; quantity: string; total: number };
  powerPetrolTesting: { price: string; quantity: string; total: number };
  dieselTesting: { price: string; quantity: string; total: number };
  tankerDiesel: { price: string; quantity: string; total: number };
}

interface ExpenseSectionProps {
  data: ExpenseData;
  onUpdate: (item: keyof ExpenseData, field: 'price' | 'quantity', value: string) => void;
}

export const ExpenseSection = ({ data, onUpdate }: ExpenseSectionProps) => {
  const total = Object.values(data).reduce((sum, item) => sum + item.total, 0);

  const items = [
    { key: 'petrolTesting' as const, label: 'Petrol Testing' },
    { key: 'powerPetrolTesting' as const, label: 'Power Petrol Testing' },
    { key: 'dieselTesting' as const, label: 'Diesel Testing' },
    { key: 'tankerDiesel' as const, label: 'Tanker Diesel' },
  ];

  return (
    <Card className="border-l-4 border-l-[hsl(var(--card-expense))]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(({ key, label }) => (
          <div key={key} className="space-y-2 p-3 border rounded-md">
            <div className="font-semibold text-sm mb-2">{label}</div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Price</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={data[key].price}
                  onChange={(e) => onUpdate(key, 'price', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={data[key].quantity}
                  onChange={(e) => onUpdate(key, 'quantity', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total</Label>
                <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                  ₹{data[key].total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Section Total */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Total Expenses:</Label>
            <div className="text-lg font-bold text-destructive">₹{total.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
