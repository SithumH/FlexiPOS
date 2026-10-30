import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.js';
import { QuickItemTiles } from './components/QuickItemTiles.js';
import { ProductCatalog } from './components/ProductCatalog.js';
import { CartTable } from './components/CartTable.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { CreditBookModal } from './components/CreditBookModal.js';
import { ReceiptModal } from './components/ReceiptModal.js';
import { SettingsModal } from './components/SettingsModal.js';
import { POSProduct, POSCartItem, POSCustomer, OfflineOrderQueueItem } from './types/pos.js';
import { ShopSettings, DEFAULT_SHOP_SETTINGS } from './types/settings.js';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from './data/sampleData.js';
import { localDb } from './db/offlineDb.js';

export const App: React.FC = () => {
  const [products, setProducts] = useState<POSProduct[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<POSCustomer[]>(INITIAL_CUSTOMERS);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<POSCustomer | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  // Shop Settings & User Roles
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('flexipos_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SHOP_SETTINGS;
  });
  const [userRole, setUserRole] = useState<'SUPER_ADMIN' | 'ADMIN' | 'CASHIER'>('ADMIN');

  // Connectivity & Sync state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingOrders, setPendingOrders] = useState<OfflineOrderQueueItem[]>([]);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreditBookOpen, setIsCreditBookOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OfflineOrderQueueItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize Local Database on startup
  useEffect(() => {
    const initDb = async () => {
      try {
        const prodCount = await localDb.products.count();
        if (prodCount === 0) {
          await localDb.products.bulkAdd(INITIAL_PRODUCTS);
        } else {
          const stored = await localDb.products.toArray();
          setProducts(stored);
        }

        const custCount = await localDb.customers.count();
        if (custCount === 0) {
          await localDb.customers.bulkAdd(INITIAL_CUSTOMERS);
        } else {
          const storedCust = await localDb.customers.toArray();
          setCustomers(storedCust);
        }

        const pending = await localDb.pendingOrders
          .where('syncStatus')
          .equals('PENDING')
          .toArray();
        setPendingOrders(pending);
      } catch (e) {
        console.error('Dexie IndexedDB initialization error:', e);
      }
    };

    initDb();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'F4') {
        e.preventDefault();
        setIsCreditBookOpen((prev) => !prev);
      } else if (e.key === 'F9' || (e.code === 'Space' && (e.ctrlKey || e.metaKey))) {
        e.preventDefault();
        if (cart.length > 0) setIsCheckoutOpen(true);
      } else if (e.key === 'Escape') {
        setIsCheckoutOpen(false);
        setIsCreditBookOpen(false);
        setIsSettingsOpen(false);
        setCompletedOrder(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart]);

  // Save Settings handler
  const handleSaveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    localStorage.setItem('flexipos_settings', JSON.stringify(newSettings));
  };

  // Cart operations
  const handleAddToCart = (product: POSProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + 1;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            unitPrice: product.sellingPrice,
            totalPrice: product.sellingPrice
          }
        ];
      }
    });
  };

  const handleUpdateQty = (productId: string, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice
            };
          }
          return item;
        })
        .filter(Boolean) as POSCartItem[];
    });
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscount(0);
  };

  // Confirm Sale & Checkout
  const handleConfirmPayment = async (
    paymentMethod: 'CASH' | 'CARD' | 'LANKAQR' | 'CREDIT',
    amountPaid: number,
    changeGiven: number
  ) => {
    const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
    const total = Math.max(0, subtotal - discount);
    const isCredit = paymentMethod === 'CREDIT';

    const newOrder: OfflineOrderQueueItem = {
      id: crypto.randomUUID ? crypto.randomUUID() : `local-${Date.now()}`,
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer?.name,
      paymentMethod,
      subtotal,
      discount,
      total,
      amountPaid,
      changeGiven,
      isCreditSale: isCredit,
      items: cart.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        totalPrice: i.totalPrice
      })),
      createdAt: new Date().toISOString(),
      syncStatus: isOnline ? 'SYNCED' : 'PENDING'
    };

    // Update customer debt if ණයට දුන්නා නම්
    if (isCredit && selectedCustomer) {
      const updatedBalance = selectedCustomer.currentBalance + total;
      const updatedCust = { ...selectedCustomer, currentBalance: updatedBalance };

      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? updatedCust : c))
      );
      await localDb.customers.put(updatedCust);
    }

    // Save order in local IndexedDB
    await localDb.pendingOrders.put(newOrder);

    if (!isOnline) {
      setPendingOrders((prev) => [newOrder, ...prev]);
    }

    // Reset current sale state & show receipt
    setIsCheckoutOpen(false);
    handleClearCart();
    setCompletedOrder(newOrder);
  };

  // Credit repayment from modal
  const handleRecordCreditPayment = async (customerId: string, amount: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newBal = Math.max(0, c.currentBalance - amount);
          const updated = { ...c, currentBalance: newBal };
          localDb.customers.put(updated);
          return updated;
        }
        return c;
      })
    );
  };

  // Add new customer to ණය පොත
  const handleAddCustomer = async (custData: Omit<POSCustomer, 'id' | 'currentBalance'>) => {
    const newCust: POSCustomer = {
      id: `cust-${Date.now()}`,
      ...custData,
      currentBalance: 0
    };
    setCustomers((prev) => [newCust, ...prev]);
    await localDb.customers.put(newCust);
  };

  // Trigger sync of pending offline orders
  const handleSyncNow = async () => {
    if (!isOnline) {
      alert('Sync කිරීමට පෙර කරුණාකර Internet සම්බන්ධතාවය සක්‍රීය කරන්න (Go Online)');
      return;
    }

    await localDb.pendingOrders.where('syncStatus').equals('PENDING').modify({ syncStatus: 'SYNCED' });
    setPendingOrders([]);
    alert('Offline බිල්පත් සියල්ල සාර්ථකව Cloud Server වෙත Sync විය!');
  };

  // Custom Quick Items from shop settings
  const quickItems = products.filter((p) =>
    settings.quickItemProductIds.includes(p.id)
  );

  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartNetTotal = Math.max(0, cartSubtotal - discount);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* 1. Header Navigation with Store Custom Name & Settings */}
      <Header
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline((prev) => !prev)}
        pendingSyncCount={pendingOrders.length}
        onSyncNow={handleSyncNow}
        onOpenCreditBook={() => setIsCreditBookOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        cashierName="බණ්ඩාර මුදලාලි"
        storeName={settings.storeName}
        storeNameSi={settings.storeNameSi}
        userRole={userRole}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden">
        {/* Left Side: Catalog & Quick Tiles (7 cols on lg) */}
        <div className="col-span-7 flex flex-col gap-3 min-h-0">
          {/* Quick Tiles configured by shop admin */}
          <div className="h-[210px] shrink-0">
            <QuickItemTiles items={quickItems} onSelectItem={handleAddToCart} />
          </div>

          {/* Full Searchable Product Catalog */}
          <div className="flex-1 min-h-0">
            <ProductCatalog
              products={products}
              onSelectItem={handleAddToCart}
              searchInputRef={searchInputRef}
            />
          </div>
        </div>

        {/* Right Side: Active Bill / Cart (5 cols on lg) */}
        <div className="col-span-5 flex flex-col min-h-0">
          <CartTable
            cart={cart}
            selectedCustomer={selectedCustomer}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onOpenCreditCustomerModal={() => setIsCreditBookOpen(true)}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
            discount={discount}
          />
        </div>
      </div>

      {/* 3. Modals */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={cartNetTotal}
        selectedCustomer={selectedCustomer}
        onConfirmPayment={handleConfirmPayment}
      />

      <CreditBookModal
        isOpen={isCreditBookOpen}
        onClose={() => setIsCreditBookOpen(false)}
        customers={customers}
        onSelectCustomer={(cust) => setSelectedCustomer(cust)}
        onRecordPayment={handleRecordCreditPayment}
        onAddCustomer={handleAddCustomer}
      />

      <ReceiptModal
        isOpen={!!completedOrder}
        onClose={() => setCompletedOrder(null)}
        order={completedOrder}
        settings={settings}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        allProducts={products}
        userRole={userRole}
        onSwitchRole={(newRole) => setUserRole(newRole)}
      />
    </div>
  );
};
