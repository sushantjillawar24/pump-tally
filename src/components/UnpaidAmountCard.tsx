import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MinusCircle, Plus } from "lucide-react";

interface Entry {
  id: string;
  name: string;
  amount: string;
}

interface UnpaidAmountCardProps {
  entries: Entry[];
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: 'name' | 'amount', value: string) => void;
}

export const UnpaidAmountCard = ({ entries, onAdd, onRemove, onUpdate }: UnpaidAmountCardProps) => {
  return (
    <Card className="border-l-4" style={{ borderLeftColor: 'hsl(var(--card-unpaid))' }}>
      <CardHeader>
        <CardTitle>Unpaid Amount</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {entries.map((e) => (
          <div key={e.id} className="flex items-center gap-2">
            <Input
              placeholder="Person name"
              value={e.name}
              onChange={(ev) => onUpdate(e.id, 'name', ev.target.value)}
              className="h-9 flex-1"
            />
            <div className="w-40">
              <Input
                type="number"
                placeholder="Amount"
                value={e.amount}
                onChange={(ev) => onUpdate(e.id, 'amount', ev.target.value)}
                className="h-9"
              />
            </div>
            <Button variant="ghost" size="icon" onClick={() => onRemove(e.id)}>
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Unpaid Entry
        </Button>
      </CardContent>
    </Card>
  );
};


