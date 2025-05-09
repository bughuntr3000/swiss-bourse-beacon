
import { useState, useEffect } from "react";
import PortfolioTable from "@/components/PortfolioTable";
import StockPriceData from "@/components/StockPriceData";
import FXRateData from "@/components/FXRateData";
import { 
  getPortfolioWithMomentum, 
  getFXRatesWithMomentum,
  formatDate,
  Portfolio,
  FXRate
} from "@/utils/financialData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays } from "lucide-react";

const Index = () => {
  const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
  const [fxRates, setFXRates] = useState<FXRate[]>([]);
  const [activeTab, setActiveTab] = useState("portfolio");
  const currentDate = new Date();
  const formattedCurrentDate = formatDate(currentDate);

  useEffect(() => {
    // Load initial data
    setPortfolio(getPortfolioWithMomentum());
    setFXRates(getFXRatesWithMomentum());
  }, []);

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">EBS Financial Data Dashboard</h1>
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded-md text-gray-700">
            <CalendarDays className="mr-2 h-5 w-5" />
            <span>{formattedCurrentDate}</span>
          </div>
        </div>
        <p className="text-gray-500">
          Track stock prices from Yahoo Finance and FX rates from Oanda with real-time data from the Swiss Electronic Bourse (EBS)
        </p>
      </header>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Main content area */}
        <div className="flex-grow">
          <Tabs defaultValue="prices" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="prices">Stock Prices</TabsTrigger>
              <TabsTrigger value="fx">FX Rates</TabsTrigger>
            </TabsList>
            <TabsContent value="prices" className="pt-4">
              <StockPriceData portfolio={portfolio} setPortfolio={setPortfolio} />
            </TabsContent>
            <TabsContent value="fx" className="pt-4">
              <FXRateData fxRates={fxRates} setFXRates={setFXRates} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel for portfolio */}
        <div className="w-full md:w-1/3 lg:w-1/4 space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Portfolio Overview</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items:</span>
                <span className="font-medium">{portfolio.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Value:</span>
                <span className="font-medium">
                  ${portfolio.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div className="h-[400px] overflow-y-auto rounded-lg border">
            <h2 className="text-xl font-bold p-4 bg-gray-50 border-b sticky top-0">
              Portfolio Momentum
            </h2>
            <div className="p-2">
              <PortfolioTable portfolio={portfolio} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
