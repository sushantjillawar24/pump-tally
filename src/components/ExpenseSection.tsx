import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { TrendingDown, Plus, MinusCircle } from "lucide-react";

interface ExpenseEntry {
  id: string;
  itemName: string;
  price: string;
  quantity: string;
  total: number;
}

interface ExpenseSectionProps {
  entries: ExpenseEntry[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: 'itemName' | 'price' | 'quantity', value: string) => void;
}

export const ExpenseSection = ({ entries, onAdd, onRemove, onUpdate }: ExpenseSectionProps) => {
  const total = entries.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <Card className="border-l-4 border-l-[hsl(var(--card-expense))]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-2 p-3 border rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="Item name (e.g., Petrol Testing)"
                value={entry.itemName}
                onChange={(e) => onUpdate(entry.id, 'itemName', e.target.value)}
                className="h-9 flex-1 font-semibold"
              />
              <Button variant="ghost" size="icon" onClick={() => onRemove(entry.id)}>
                <MinusCircle className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Price</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={entry.price}
                  onChange={(e) => onUpdate(entry.id, 'price', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={entry.quantity}
                  onChange={(e) => onUpdate(entry.id, 'quantity', e.target.value)}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Total</Label>
                <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                  ₹{entry.total.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" size="sm" className="w-full" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense Entry
        </Button>

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
