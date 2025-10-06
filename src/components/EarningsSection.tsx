import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";

interface EarningsSectionProps {
<<<<<<< HEAD
  cash: string;
=======
>>>>>>> origin/main
  phonePayNight: string;
  phonePayDay: string;
  cardSwipe: string;
  hpPaySwipe: string;
<<<<<<< HEAD
  otp: string;
  other: string;
  onUpdate: (field: keyof any, value: string) => void;
}

export const EarningsSection = ({
  cash,
=======
  other: string;
  onUpdate: (field: string, value: string) => void;
}

export const EarningsSection = ({
>>>>>>> origin/main
  phonePayNight,
  phonePayDay,
  cardSwipe,
  hpPaySwipe,
<<<<<<< HEAD
  otp,
  other,
  onUpdate,
}: EarningsSectionProps) => {
  const total =
    parseFloat(cash || '0') +
=======
  other,
  onUpdate,
}: EarningsSectionProps) => {
  const total = 
>>>>>>> origin/main
    parseFloat(phonePayNight || '0') +
    parseFloat(phonePayDay || '0') +
    parseFloat(cardSwipe || '0') +
    parseFloat(hpPaySwipe || '0') +
<<<<<<< HEAD
    parseFloat(otp || '0') +
=======
>>>>>>> origin/main
    parseFloat(other || '0');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-success" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
<<<<<<< HEAD
        {/* Cash first */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Cash</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={cash}
            onChange={(e) => onUpdate('cash', e.target.value)}
            className="h-9"
          />
        </div>

=======
>>>>>>> origin/main
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Phone Pay (Night)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={phonePayNight}
            onChange={(e) => onUpdate('phonePayNight', e.target.value)}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Phone Pay (Day)</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={phonePayDay}
            onChange={(e) => onUpdate('phonePayDay', e.target.value)}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">Card Swipe</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={cardSwipe}
            onChange={(e) => onUpdate('cardSwipe', e.target.value)}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold">HP Pay Swipe</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={hpPaySwipe}
            onChange={(e) => onUpdate('hpPaySwipe', e.target.value)}
            className="h-9"
          />
        </div>

        <div className="space-y-2">
<<<<<<< HEAD
          <Label className="text-sm font-semibold">OTP</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={otp}
            onChange={(e) => onUpdate('otp', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Other last */}
        <div className="space-y-2">
=======
>>>>>>> origin/main
          <Label className="text-sm font-semibold">Other</Label>
          <Input
            type="number"
            placeholder="0.00"
            value={other}
            onChange={(e) => onUpdate('other', e.target.value)}
            className="h-9"
          />
        </div>

        {/* Section Total */}
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-semibold">Total Earnings:</Label>
<<<<<<< HEAD
            <div className="text-lg font-bold text-success">₹{total.toFixed(2)}</div>
=======
            <div className="text-lg font-bold text-success">
              ₹{total.toFixed(2)}
            </div>
>>>>>>> origin/main
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
