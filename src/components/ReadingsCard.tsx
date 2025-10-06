import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ReadingPair = { r1: string; r2: string };

interface ReadingsState {
  petrol: Record<string, ReadingPair>;
  powerPetrol: Record<string, ReadingPair>;
  diesel: Record<string, ReadingPair>;
}

interface ReadingsCardProps {
  readings: ReadingsState;
  onUpdate: (fuel: 'petrol' | 'powerPetrol' | 'diesel', nozzle: string, which: 'r1' | 'r2', value: string) => void;
}

const Row = ({ label, value1, value2, total }: { label: string; value1: string; value2: string; total: number }) => (
  <div className="grid grid-cols-4 gap-2 text-sm">
    <div className="font-medium">{label}</div>
    <div className="text-muted-foreground">{value1 || '-'}</div>
    <div className="text-muted-foreground">{value2 || '-'}</div>
    <div className="font-semibold">{Number.isFinite(total) ? total.toFixed(2) : '0.00'}</div>
  </div>
);

export const ReadingsCard = ({ readings, onUpdate }: ReadingsCardProps) => {
  const calc = (p: ReadingPair) => (parseFloat(p.r2 || '0') - parseFloat(p.r1 || '0')) || 0;

  const renderFuel = (title: string, fuel: 'petrol' | 'powerPetrol' | 'diesel', order: string[]) => (
    <div className="space-y-2">
      <Label className="text-sm font-semibold">{title}</Label>
      <div className="space-y-1">
        {order.map((nozzle) => (
          <div className="grid grid-cols-4 gap-2 items-center" key={nozzle}>
            <div className="font-medium">{nozzle}</div>
            <Input
              placeholder="reading1"
              value={readings[fuel][nozzle]?.r1 || ''}
              onChange={(e) => onUpdate(fuel, nozzle, 'r1', e.target.value)}
              className="h-8"
            />
            <Input
              placeholder="reading2"
              value={readings[fuel][nozzle]?.r2 || ''}
              onChange={(e) => onUpdate(fuel, nozzle, 'r2', e.target.value)}
              className="h-8"
            />
            <div className="font-semibold">
              {calc(readings[fuel][nozzle] || { r1: '0', r2: '0' }).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Readings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderFuel('Petrol', 'petrol', ['A1','B1','A2','B2','N2'])}
        {renderFuel('Power Petrol', 'powerPetrol', ['A1','B1'])}
        {renderFuel('Diesel', 'diesel', ['A1','B2','A3','B3','N1'])}
      </CardContent>
    </Card>
  );
};


