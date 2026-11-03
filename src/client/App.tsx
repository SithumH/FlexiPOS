import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.js';
import { QuickItemTiles } from './components/QuickItemTiles.js';
import { ProductCatalog } from './components/ProductCatalog.js';
import { CartTable } from './components/CartTable.js';
import { CheckoutModal } from './components/CheckoutModal.js';
import { CreditBookModal } from './components/CreditBookModal.js';
import { ReceiptModal } from './components/ReceiptModal.js';
import { WeightModal } from './components/WeightModal.js';
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
  const [weighingProduct, setWeighingProduct] = useState<POSProduct | null>(null);

  // Live Clock
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
    const handleOffline = () => setIsOnline(false);
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
      if (e.key === 'F1') {
        e.preventDefault();
        setActivePanel('CASHIER');
      } else if (e.key === 'F2') {
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
        setWeighingProduct(null);
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

  // Item Selection (Triggers Weight Modal for loose items like rice, sugar, vegetables)
  const handleSelectItem = (product: POSProduct) => {
    if (product.unit === 'KG' || product.unit === 'G') {
      setWeighingProduct(product);
    } else {
      handleAddToCart(product, 1);
    }
  };

  // Add to Cart
  const handleAddToCart = (product: POSProduct, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        const newQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: newQty, totalPrice: Math.round(newQty * item.unitPrice) }
            : item
        );
      } else {
        return [
          ...prev,
          {
            product,
            quantity,
            unitPrice: product.sellingPrice,
            totalPrice: Math.round(quantity * product.sellingPrice)
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
              totalPrice: Math.round(newQty * item.unitPrice)
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

  // If user is not logged in, show traditional Login Screen
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
    <div className="h-screen w-screen flex flex-col bg-slate-300 overflow-hidden select-none font-sans">
      {/* 1. Traditional Application Header */}
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
        <div className="flex-1 grid grid-cols-12 gap-2 p-2 min-h-0 overflow-hidden">
          {/* Left Side (7 cols): Quick Touch Tiles & Searchable Product Catalog */}
          <div className="col-span-7 flex flex-col gap-2 min-h-0">
            {/* Quick Tiles for loose items (පාන්, බිත්තර, සීනි, පරිප්පු) */}
            <div className="h-[185px] shrink-0">
              <QuickItemTiles items={quickItems} onSelectItem={handleSelectItem} />
            </div>

            {/* Searchable Product Catalog */}
            <div className="flex-1 min-h-0">
              <ProductCatalog
                products={products}
                onSelectItem={handleSelectItem}
                searchInputRef={searchInputRef}
              />
            </div>
          </div>

          {/* Right Side (5 cols): Active Bill / POS Tabular Cart */}
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
              onSetDiscount={setDiscount}
              onQuickPayMethod={() => setIsCheckoutOpen(true)}
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

      {/* 5. Traditional Desktop Status Strip at Bottom */}
      <footer className="bg-slate-900 border-t-2 border-slate-700 px-3 py-1 flex items-center justify-between text-xs text-slate-300 font-mono select-none shrink-0">
        <div className="flex items-center space-x-3">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>SYSTEM READY</span>
          </span>
          <span>•</span>
          <span>TERMINAL: COUNTER-01</span>
          <span>•</span>
          <span>CASHIER: {currentUser.fullName}</span>
          <span>•</span>
          <span className="text-amber-400">SHORTCUTS: [F2] Search | [F4] ණය පොත | [F9] Pay | [ESC] Clear</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-slate-400">{new Date().toLocaleDateString()}</span>
          <span className="text-emerald-400 font-bold">{currentTime}</span>
        </div>
      </footer>

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

      <WeightModal
        isOpen={!!weighingProduct}
        onClose={() => setWeighingProduct(null)}
        product={weighingProduct}
        onConfirm={(prod, qty) => handleAddToCart(prod, qty)}
        lang={lang}
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
