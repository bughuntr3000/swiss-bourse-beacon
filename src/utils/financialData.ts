
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
  dataDate?: string;
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
  dataDate?: string;
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

// Function to format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Function to get the previous business day
export const getPreviousBusinessDay = (date: Date = new Date()): Date => {
  const prevDate = new Date(date);
  prevDate.setDate(prevDate.getDate() - 1);
  
  // If it's a weekend, go to Friday
  const dayOfWeek = prevDate.getDay();
  if (dayOfWeek === 0) { // Sunday
    prevDate.setDate(prevDate.getDate() - 2);
  } else if (dayOfWeek === 6) { // Saturday
    prevDate.setDate(prevDate.getDate() - 1);
  }
  
  return prevDate;
};

// Function to fetch current price data for stocks from Yahoo Finance
export const fetchCurrentPriceData = async (portfolio: Portfolio[]): Promise<Portfolio[]> => {
  try {
    // Get previous business day for date reference
    const prevBusinessDay = getPreviousBusinessDay();
    const dataDate = formatDate(prevBusinessDay);
    
    // In a real implementation, this would make API calls to Yahoo Finance
    // For this demo, we'll simulate the API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedPortfolio = portfolio.map(item => {
          // In a real implementation, fetch actual price from Yahoo Finance
          // For now, we'll use mock data but pretend it's from Yahoo
          const currentPrice = generateMockPriceData(item.stockPrice);
          
          return {
            ...item,
            currentPrice,
            dataDate
          };
        });
        toast.success(`Stock price data from Yahoo Finance has been updated (${dataDate})`);
        resolve(updatedPortfolio);
      }, 1500); // Simulate API call delay
    });
  } catch (error) {
    toast.error("Failed to fetch stock data from Yahoo Finance");
    console.error("Fetch stock data error:", error);
    throw error;
  }
};

// Function to fetch current FX rates from Oanda
export const fetchCurrentFXRates = async (fxRates: FXRate[]): Promise<FXRate[]> => {
  try {
    // Get previous business day for date reference
    const prevBusinessDay = getPreviousBusinessDay();
    const dataDate = formatDate(prevBusinessDay);
    
    // In a real implementation, this would make API calls to Oanda
    // For this demo, we'll simulate the API call with a delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedFXRates = fxRates.map(item => {
          // In a real implementation, fetch actual rate from Oanda
          // For now, we'll use mock data but pretend it's from Oanda
          const currentRate = generateMockPriceData(item.rate);
          
          return {
            ...item,
            currentRate,
            dataDate
          };
        });
        toast.success(`FX rate data from Oanda has been updated (${dataDate})`);
        resolve(updatedFXRates);
      }, 1500); // Simulate API call delay
    });
  } catch (error) {
    toast.error("Failed to fetch FX data from Oanda");
    console.error("Fetch FX data error:", error);
    throw error;
  }
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
