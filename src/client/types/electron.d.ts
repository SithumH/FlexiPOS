export interface ElectronPrinterInfo {
  name: string;
  displayName: string;
  description: string;
  status: number;
  isDefault: boolean;
}

export interface ElectronSystemInfo {
  platform: string;
  arch: string;
  version: string;
  electronVersion: string;
  nodeVersion: string;
}

export interface ElectronAPI {
  isDesktop: boolean;
  platform: string;
  getPrinters: () => Promise<ElectronPrinterInfo[]>;
  printReceipt: (options?: {
    silent?: boolean;
    printerName?: string;
    copies?: number;
    paperSize?: '58mm' | '80mm';
  }) => Promise<{ success: boolean; error?: string }>;
  getSystemInfo: () => Promise<ElectronSystemInfo>;
  minimizeWindow: () => void;
  maximizeWindow: () => void;
  closeWindow: () => void;
  toggleFullscreen: () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

