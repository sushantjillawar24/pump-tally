import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingDown } from "lucide-react";

interface ExpenseItem {
  price: string;
  quantity: string;
  total: number;
}

interface ExpenseSectionProps {
  petrolTesting: ExpenseItem;
  powerPetrolTesting: ExpenseItem;
  dieselTesting: ExpenseItem;
  tankerDiesel: ExpenseItem;
  onUpdate: (field: string, type: 'price' | 'quantity', value: string) => void;
}

export const ExpenseSection = ({ 
  petrolTesting, 
  powerPetrolTesting, 
  dieselTesting, 
  tankerDiesel,
  onUpdate 
}: ExpenseSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-destructive" />
          Expense
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Petrol Testing */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Petrol Testing</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={petrolTesting.price}
                onChange={(e) => onUpdate('petrolTesting', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={petrolTesting.quantity}
                onChange={(e) => onUpdate('petrolTesting', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{petrolTesting.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Power Petrol Testing */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Power Petrol Testing</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={powerPetrolTesting.price}
                onChange={(e) => onUpdate('powerPetrolTesting', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={powerPetrolTesting.quantity}
                onChange={(e) => onUpdate('powerPetrolTesting', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{powerPetrolTesting.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Diesel Testing */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Diesel Testing</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={dieselTesting.price}
                onChange={(e) => onUpdate('dieselTesting', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={dieselTesting.quantity}
                onChange={(e) => onUpdate('dieselTesting', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{dieselTesting.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Tanker Diesel */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Tanker Diesel</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={tankerDiesel.price}
                onChange={(e) => onUpdate('tankerDiesel', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={tankerDiesel.quantity}
                onChange={(e) => onUpdate('tankerDiesel', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{tankerDiesel.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
        {/* Section Total */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Total Expenses:</Label>
            <div className="text-lg font-bold text-destructive">
              ₹{(petrolTesting.total + powerPetrolTesting.total + dieselTesting.total + tankerDiesel.total).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
