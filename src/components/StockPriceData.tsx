
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
import { Portfolio, fetchCurrentPriceData, copyPriceDataToClipboard } from "@/utils/financialData";
import { Copy } from "lucide-react";

interface StockPriceDataProps {
  portfolio: Portfolio[];
  setPortfolio: React.Dispatch<React.SetStateAction<Portfolio[]>>;
}

const StockPriceData: React.FC<StockPriceDataProps> = ({ portfolio, setPortfolio }) => {
  const [loading, setLoading] = useState(false);

  const handleGetPriceData = async () => {
    setLoading(true);
    try {
      const updatedPortfolio = await fetchCurrentPriceData(portfolio);
      setPortfolio(updatedPortfolio);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPriceData = () => {
    copyPriceDataToClipboard(portfolio);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Stock Price Data</h2>
        <div className="flex gap-2">
          <Button onClick={handleGetPriceData} disabled={loading}>
            {loading ? "Loading..." : "Get Price Data"}
          </Button>
          <Button 
            onClick={handleCopyPriceData} 
            variant="outline" 
            disabled={!portfolio.some(item => item.currentPrice !== undefined)}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Price Data
          </Button>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead className="text-right">Price (USD)</TableHead>
              <TableHead>Currency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.map((item) => (
              <TableRow key={item.name}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell className="text-right">
                  {item.currentPrice 
                    ? item.currentPrice.toFixed(2) 
                    : "N/A"}
                </TableCell>
                <TableCell>{item.currency || "USD"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StockPriceData;
