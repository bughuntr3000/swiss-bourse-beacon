
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Portfolio } from "@/utils/financialData";
import { TrendingUp, TrendingDown, Copy } from "lucide-react";

interface PortfolioTableProps {
  portfolio: Portfolio[];
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

const PortfolioTable: React.FC<PortfolioTableProps> = ({ portfolio }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Company</TableHead>
            <TableHead className="text-right">Price (USD)</TableHead>
            <TableHead className="text-right">Shares</TableHead>
            <TableHead className="text-right">Value (USD)</TableHead>
            <TableHead className="text-center">Short Term</TableHead>
            <TableHead className="text-center">Medium Term</TableHead>
            <TableHead className="text-center">Long Term</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {portfolio.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">
                {item.stockPrice.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">{item.shares.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.totalValue.toLocaleString()}</TableCell>
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
  );
};

export default PortfolioTable;
