
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
import { Portfolio, fetchCurrentPriceData, copyPriceDataToClipboard, formatDate } from "@/utils/financialData";
import { Copy, CalendarDays } from "lucide-react";

interface StockPriceDataProps {
  portfolio: Portfolio[];
  setPortfolio: React.Dispatch<React.SetStateAction<Portfolio[]>>;
}

const StockPriceData: React.FC<StockPriceDataProps> = ({ portfolio, setPortfolio }) => {
  const [loading, setLoading] = useState(false);
  const currentDate = new Date();
  const formattedCurrentDate = formatDate(currentDate);
  
  // Get data date from the first portfolio item with a current price, or use null
  const dataDate = portfolio.find(item => item.dataDate)?.dataDate || null;

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
        <div>
          <h2 className="text-2xl font-bold">Stock Price Data</h2>
          <div className="flex items-center mt-1 text-sm text-gray-500">
            <CalendarDays className="mr-1 h-4 w-4" />
            <span>Current Date: {formattedCurrentDate}</span>
          </div>
          {dataDate && (
            <div className="text-sm text-gray-500 mt-1">
              <span>Data from Yahoo Finance as of: {dataDate}</span>
            </div>
          )}
        </div>
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
