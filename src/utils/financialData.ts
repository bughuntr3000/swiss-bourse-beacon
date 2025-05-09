
import { portfolioData, fxRates, generateMockMomentum, generateMockPriceData } from "./mockData";
import { toast } from "sonner";

export interface Portfolio {
  name: string;
  stockPrice: number;
  shares: number;
  totalValue: number;
  momentum?: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
  currency?: string;
  currentPrice?: number;
}

export interface FXRate {
  currencyCode: string;
  rate: number;
  description: string;
  momentum?: {
    shortTerm: number;
    mediumTerm: number;
    longTerm: number;
  };
  currentRate?: number;
}

// Function to get portfolio data with momentum
export const getPortfolioWithMomentum = (): Portfolio[] => {
  return portfolioData.map(item => {
    const momentum = generateMockMomentum();
    return {
      ...item,
      momentum,
      currency: "USD",
    };
  }).sort((a, b) => a.name.localeCompare(b.name)); // Sort by name alphabetically
};

// Function to get FX rates with momentum
export const getFXRatesWithMomentum = (): FXRate[] => {
  return fxRates.map(item => {
    const momentum = generateMockMomentum();
    return {
      ...item,
      momentum,
    };
  });
};

// Function to fetch current price data for stocks
export const fetchCurrentPriceData = (portfolio: Portfolio[]): Promise<Portfolio[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedPortfolio = portfolio.map(item => {
        return {
          ...item,
          currentPrice: generateMockPriceData(item.stockPrice)
        };
      });
      toast.success("Stock price data has been updated");
      resolve(updatedPortfolio);
    }, 1500); // Simulate API call delay
  });
};

// Function to fetch current FX rates
export const fetchCurrentFXRates = (fxRates: FXRate[]): Promise<FXRate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedFXRates = fxRates.map(item => {
        return {
          ...item,
          currentRate: generateMockPriceData(item.rate)
        };
      });
      toast.success("FX rate data has been updated");
      resolve(updatedFXRates);
    }, 1500); // Simulate API call delay
  });
};

// Function to copy price data to clipboard
export const copyPriceDataToClipboard = (portfolio: Portfolio[]): void => {
  try {
    const priceData = portfolio
      .filter(item => item.currentPrice !== undefined)
      .map(item => item.currentPrice!.toFixed(2))
      .join('\n');
    
    navigator.clipboard.writeText(priceData);
    toast.success("Price data copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy price data");
    console.error("Copy failed:", error);
  }
};

// Function to copy FX rate data to clipboard
export const copyFXRateDataToClipboard = (fxRates: FXRate[]): void => {
  try {
    const rateData = fxRates
      .filter(item => item.currentRate !== undefined)
      .map(item => item.currentRate!.toFixed(4))
      .join('\n');
    
    navigator.clipboard.writeText(rateData);
    toast.success("FX rate data copied to clipboard");
  } catch (error) {
    toast.error("Failed to copy FX rate data");
    console.error("Copy failed:", error);
  }
};
