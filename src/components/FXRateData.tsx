
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FXRate, fetchCurrentFXRates, copyFXRateDataToClipboard, formatDate } from "@/utils/financialData";
import { TrendingUp, TrendingDown, Copy, CalendarDays } from "lucide-react";

interface FXRateDataProps {
  fxRates: FXRate[];
  setFXRates: React.Dispatch<React.SetStateAction<FXRate[]>>;
}

const MomentumIndicator: React.FC<{ value: number }> = ({ value }) => {
  const isPositive = value >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  const colorClass = isPositive ? "text-green-500" : "text-red-500";
  
  return (
    <div className="flex items-center gap-1">
      <Icon className={`h-4 w-4 ${colorClass}`} />
      <span className={colorClass}>{Math.abs(value).toFixed(2)}%</span>
    </div>
  );
};

const FXRateData: React.FC<FXRateDataProps> = ({ fxRates, setFXRates }) => {
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const formattedCurrentDate = formatDate(currentDate);
  
  // Get data date from the first fx item with a current rate, or use null
  const dataDate = fxRates.find(item => item.dataDate)?.dataDate || null;

  const handleGetFXData = async () => {
    setLoading(true);
    try {
      const updatedFXRates = await fetchCurrentFXRates(fxRates);
      setFXRates(updatedFXRates);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyFXData = () => {
    copyFXRateDataToClipboard(fxRates);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">FX Rate Data (Base: USD)</h2>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <CalendarDays className="mr-1 h-4 w-4" />
            <span>Current Date: {formattedCurrentDate}</span>
          </div>
          {dataDate && (
            <div className="text-sm text-gray-500 mt-1">
              <span>Data from Oanda as of: {dataDate}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGetFXData} disabled={loading}>
            {loading ? "Loading..." : "Get FX Data"}
          </Button>
          <Button 
            onClick={handleCopyFXData} 
            variant="outline" 
            disabled={!fxRates.some(item => item.currentRate !== undefined)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy FX Data
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Currency</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead>Code</TableHead>
              <TableHead className="text-center">Short Term</TableHead>
              <TableHead className="text-center">Medium Term</TableHead>
              <TableHead className="text-center">Long Term</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fxRates.map((item) => (
              <TableRow key={item.currencyCode}>
                <TableCell className="font-medium">{item.description}</TableCell>
                <TableCell className="text-right">
                  {item.currentRate 
                    ? item.currentRate.toFixed(4) 
                    : item.rate.toFixed(4)}
                </TableCell>
                <TableCell>{item.currencyCode}</TableCell>
                <TableCell className="text-center">
                  {item.momentum && <MomentumIndicator value={item.momentum.shortTerm} />}
                </TableCell>
                <TableCell className="text-center">
                  {item.momentum && <MomentumIndicator value={item.momentum.mediumTerm} />}
                </TableCell>
                <TableCell className="text-center">
                  {item.momentum && <MomentumIndicator value={item.momentum.longTerm} />}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FXRateData;
