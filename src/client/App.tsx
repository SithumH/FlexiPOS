import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.js';
import { QuickItemTiles } from './components/QuickItemTiles.js';
import { ProductCatalog } from './components/ProductCatalog.js';
import { CartTable } from './components/CartTable.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { CreditBookModal } from './components/CreditBookModal.js';
import { ReceiptModal } from './components/ReceiptModal.js';
import { ShopAdminPanel } from './components/admin/ShopAdminPanel.js';
import { SuperAdminPanel } from './components/superadmin/SuperAdminPanel.js';
import { LoginScreen } from './components/auth/LoginScreen.js';
import { POSProduct, POSCartItem, POSCustomer, OfflineOrderQueueItem } from './types/pos.js';
import { ShopSettings, DEFAULT_SHOP_SETTINGS } from './types/settings.js';
import { CurrentUserSession } from './types/auth.js';
import { INITIAL_PRODUCTS, INITIAL_CUSTOMERS } from './data/sampleData.js';
import { localDb } from './db/offlineDb.js';
import { Language, translations } from './i18n/translations.js';

export const App: React.FC = () => {
  // Bilingual Language State
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('flexipos_lang') as Language) || 'si';
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'si' ? 'en' : 'si';
      localStorage.setItem('flexipos_lang', next);
      return next;
    });
  };

  // Auth User Session State
  const [currentUser, setCurrentUser] = useState<CurrentUserSession | null>(() => {
    const saved = localStorage.getItem('flexipos_session');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Panel: Cashier POS vs Shop Admin vs Super Admin
  const [activePanel, setActivePanel] = useState<'CASHIER' | 'ADMIN' | 'SUPER_ADMIN'>('CASHIER');

  // Core Data
  const [products, setProducts] = useState<POSProduct[]>(INITIAL_PRODUCTS);
  const [customers, setCustomers] = useState<POSCustomer[]>(INITIAL_CUSTOMERS);
  const [orders, setOrders] = useState<OfflineOrderQueueItem[]>([]);
  const [cart, setCart] = useState<POSCartItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<POSCustomer | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  // Shop Settings
  const [settings, setSettings] = useState<ShopSettings>(() => {
    const saved = localStorage.getItem('flexipos_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SHOP_SETTINGS;
  });

  // Connectivity & Sync state
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [pendingOrders, setPendingOrders] = useState<OfflineOrderQueueItem[]>([]);

  // Modals
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCreditBookOpen, setIsCreditBookOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OfflineOrderQueueItem | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle Login Success
  const handleLoginSuccess = (session: CurrentUserSession) => {
    setCurrentUser(session);
    localStorage.setItem('flexipos_session', JSON.stringify(session));
    if (session.role === 'SUPER_ADMIN') {
      setActivePanel('SUPER_ADMIN');
    } else if (session.role === 'ADMIN') {
      setActivePanel('ADMIN');
    } else {
      setActivePanel('CASHIER');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('flexipos_session');
    handleClearCart();
  };

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

        const allOrders = await localDb.pendingOrders.toArray();
        setOrders(allOrders);

        const pending = allOrders.filter((o) => o.syncStatus === 'PENDING');
        setPendingOrders(pending);
      } catch (e) {
        console.error('Dexie IndexedDB initialization error:', e);
      }
    };

    initDb();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOffline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Keyboard Shortcuts for Cashier
  useEffect(() => {
    if (!currentUser || activePanel !== 'CASHIER') return;

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
        setCompletedOrder(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cart, activePanel, currentUser]);

  // Save Settings handler
  const handleSaveSettings = (newSettings: ShopSettings) => {
    setSettings(newSettings);
    localStorage.setItem('flexipos_settings', JSON.stringify(newSettings));
  };

  // Add Product from Shop Admin
  const handleAddProduct = async (prodData: Omit<POSProduct, 'id'>) => {
    const newProd: POSProduct = {
      id: `p-${Date.now()}`,
      ...prodData
    };
    setProducts((prev) => [newProd, ...prev]);
    await localDb.products.put(newProd);
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

    if (isCredit && selectedCustomer) {
      const updatedBalance = selectedCustomer.currentBalance + total;
      const updatedCust = { ...selectedCustomer, currentBalance: updatedBalance };

      setCustomers((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? updatedCust : c))
      );
      await localDb.customers.put(updatedCust);
    }

    await localDb.pendingOrders.put(newOrder);
    setOrders((prev) => [newOrder, ...prev]);

    if (!isOnline) {
      setPendingOrders((prev) => [newOrder, ...prev]);
    }

    setIsCheckoutOpen(false);
    handleClearCart();
    setCompletedOrder(newOrder);
  };

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

  const handleAddCustomer = async (custData: Omit<POSCustomer, 'id' | 'currentBalance'>) => {
    const newCust: POSCustomer = {
      id: `cust-${Date.now()}`,
      ...custData,
      currentBalance: 0
    };
    setCustomers((prev) => [newCust, ...prev]);
    await localDb.customers.put(newCust);
  };

  const handleSyncNow = async () => {
    if (!isOnline) {
      alert(lang === 'si' ? 'Sync කිරීමට පෙර Internet සක්‍රීය කරන්න' : 'Enable Internet before syncing');
      return;
    }

    await localDb.pendingOrders.where('syncStatus').equals('PENDING').modify({ syncStatus: 'SYNCED' });
    setPendingOrders([]);
    alert(translations[lang].syncSuccess);
  };

  // If user is not logged in, show clean Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        lang={lang}
        onToggleLang={toggleLanguage}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // Filter Quick items
  const quickItems = products.filter((p) => settings.quickItemProductIds.includes(p.id));
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartNetTotal = Math.max(0, cartSubtotal - discount);

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-100 overflow-hidden select-none">
      {/* 1. Master Header with 3 Panels Switcher & Language Switcher & Logout */}
      <Header
        lang={lang}
        onToggleLang={toggleLanguage}
        activePanel={activePanel}
        onChangePanel={setActivePanel}
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline((prev) => !prev)}
        pendingSyncCount={pendingOrders.length}
        onSyncNow={handleSyncNow}
        onOpenCreditBook={() => setIsCreditBookOpen(true)}
        storeName={settings.storeName}
        storeNameSi={settings.storeNameSi}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. PANEL 1: CASHIER BILLING SCREEN */}
      {activePanel === 'CASHIER' && (
        <div className="flex-1 grid grid-cols-12 gap-3 p-3 min-h-0 overflow-hidden">
          {/* Left Side: Catalog & Quick Tiles */}
          <div className="col-span-7 flex flex-col gap-3 min-h-0">
            {/* Quick Tiles for loose items (පාන්, බිත්තර, සීනි) */}
            <div className="h-[210px] shrink-0">
              <QuickItemTiles items={quickItems} onSelectItem={handleAddToCart} />
            </div>

            {/* Searchable Product Catalog */}
            <div className="flex-1 min-h-0">
              <ProductCatalog
                products={products}
                onSelectItem={handleAddToCart}
                searchInputRef={searchInputRef}
              />
            </div>
          </div>

          {/* Right Side: Active Bill / Cart */}
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
      )}

      {/* 3. PANEL 2: SHOP ADMIN PANEL */}
      {activePanel === 'ADMIN' && (
        <ShopAdminPanel
          lang={lang}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          products={products}
          onAddProduct={handleAddProduct}
          customers={customers}
          onAddCustomer={handleAddCustomer}
          onRecordCreditPayment={handleRecordCreditPayment}
          orders={orders}
        />
      )}

      {/* 4. PANEL 3: SUPER ADMIN PLATFORM MASTER */}
      {activePanel === 'SUPER_ADMIN' && (
        <SuperAdminPanel lang={lang} />
      )}

      {/* Shared Modals */}
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
    </div>
  );
};
