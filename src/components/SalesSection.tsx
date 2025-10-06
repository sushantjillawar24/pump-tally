import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";

interface SaleItem {
  price: string;
  quantity: string;
  total: number;
}

interface SalesSectionProps {
  petrol: SaleItem;
  powerPetrol: SaleItem;
  diesel: SaleItem;
  onUpdate: (field: string, type: 'price' | 'quantity', value: string) => void;
}

export const SalesSection = ({ petrol, powerPetrol, diesel, onUpdate }: SalesSectionProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Sales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Petrol Sale */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Petrol Sale</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={petrol.price}
                onChange={(e) => onUpdate('petrol', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={petrol.quantity}
                onChange={(e) => onUpdate('petrol', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{petrol.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Power Petrol Sale */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Power Petrol Sale</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={powerPetrol.price}
                onChange={(e) => onUpdate('powerPetrol', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={powerPetrol.quantity}
                onChange={(e) => onUpdate('powerPetrol', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{powerPetrol.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Diesel Sale */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Diesel Sale</Label>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs text-muted-foreground">Price</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={diesel.price}
                onChange={(e) => onUpdate('diesel', 'price', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={diesel.quantity}
                onChange={(e) => onUpdate('diesel', 'quantity', e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Total</Label>
              <div className="h-9 rounded-md border bg-muted px-3 py-2 text-sm font-semibold">
                ₹{diesel.total.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Section Total */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Total Sales:</Label>
            <div className="text-lg font-bold text-primary">
              ₹{(petrol.total + powerPetrol.total + diesel.total).toFixed(2)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
