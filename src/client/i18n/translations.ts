export type Language = 'si' | 'en';

export const translations = {
  si: {
    // Top Bar & Navigation
    appTitle: 'FlexiPOS ශ්‍රී ලංකා',
    terminal: 'කවුන්ටරය අංක 01',
    cashierPanel: 'කවුන්ටරය (Cashier)',
    adminPanel: 'කඩේ Admin',
    superAdminPanel: 'Super Admin (Dev)',
    online: 'Online',
    offline: 'Offline',
    syncPending: 'Sync කිරීමට ඇත',
    syncSuccess: 'Offline බිල්පත් සාර්ථකව Server වෙත යවන ලදී',

    // Cashier View
    quickTiles: 'නිතර විකිණෙන භාණ්ඩ (Quick Tiles)',
    searchPlaceholder: 'භාණ්ඩයේ නම හෝ Barcode ගසන්න... [F2]',
    allCategories: 'සියල්ල',
    currentBill: 'දැනට බිල',
    itemsCount: 'භාණ්ඩ ගණන',
    clearBill: 'හිස් කරන්න',
    emptyCartTitle: 'බිල හිස්ව පවතී',
    emptyCartSubtitle: 'භාණ්ඩ තෝරන්න හෝ Barcode scan කරන්න',
    selectCustomerCredit: 'ණය පොතෙන් තෝරන්න (Select Customer)',
    subtotal: 'එකතුව',
    discount: 'වට්ටම',
    netTotal: 'අවසාන එකතුව',
    payButton: 'ගෙවීම් බේරුම්කරණය (Pay / F9)',

    // Checkout Modal
    checkoutTitle: 'මුදල් ලබාගැනීම',
    cash: 'මුදල් (Cash)',
    card: 'කාඩ්පත් (Card)',
    lankaQR: 'LankaQR',
    credit: 'ණයට (Credit)',
    cashReceived: 'ලැබුණු මුදල',
    changeGiven: 'ඉතිරි මුදල',
    exactAmount: 'නියම ගාණ',
    completeSale: 'බිල අවසන් කරන්න',
    cancel: 'අවලංගු කරන්න',

    // Credit Book (ණය පොත)
    creditBookTitle: 'ඩිජිටල් ණය පොත',
    totalShopDebt: 'කඩේ මුළු ණය එකතුව',
    searchCustomer: 'නම හෝ දුරකථන අංකයෙන් සොයන්න...',
    newCustomer: '+ අලුත් කස්ටමර්',
    currentBalance: 'දැනට ණය',
    creditLimit: 'ණය සීමාව',
    repayCredit: 'ණය පියවීම',
    selectForBill: 'බිලට එක්කරන්න',
    repayAmount: 'පියවන මුදල',
    saveCustomer: 'පොතට ඇතුළත් කරන්න',

    // Shop Admin Dashboard
    shopDashboard: 'සාප්පු කළමනාකරණ පුවරුව (Shop Admin)',
    todaySales: 'අද දවසේ විකුණුම්',
    cashInHand: 'ලාච්චුවේ ඇති මුදල්',
    totalCreditOut: 'ණයට දී ඇති මුදල්',
    lowStockItems: 'ඉවරවේගෙන එන බඩු',
    tabDashboard: 'දළ විශ්ලේෂණය',
    tabProducts: 'භාණ්ඩ සහ තොග (Stock)',
    tabCredit: 'ණය පොත',
    tabSalesHistory: 'විකුණුම් ඉතිහාසය',
    tabStaff: 'සේවකයින් (Cashiers)',
    tabSettings: 'කඩේ සැකසුම්',

    // Products Management
    addProduct: '+ අලුත් භාණ්ඩයක්',
    productName: 'භාණ්ඩයේ නම',
    sellingPrice: 'විකුණුම් මිල',
    costPrice: 'ගැණුම් මිල',
    currentStock: 'දැනට තොගය',
    quickItemCheck: 'Quick Tile එකක් ලෙස පෙන්වන්න',
    saveProduct: 'භාණ්ඩය සුරකින්න',

    // Super Admin Panel
    superAdminTitle: 'FlexiPOS Platform Master (Super Admin)',
    superAdminSubtitle: 'ලියාපදිංචි සියලුම සාප්පු සහ පද්ධති සැකසුම්',
    totalShops: 'ලියාපදිංචි කඩවල්',
    totalMonthlyRevenue: 'මාසික Software ආදායම',
    activeSubscriptions: 'සක්‍රීය Subscriptions',
    shopNameCol: 'සාප්පුවේ නම',
    ownerCol: 'අයිතිකරු / දුරකථනය',
    planCol: 'Subscription Plan',
    statusCol: 'තත්ත්වය',
    actionsCol: 'ක්‍රියාකාරකම්',
    addNewShop: '+ අලුත් කඩයක් ලියාපදිංචි කරන්න',
    managePlan: 'Plan කළමනාකරණය'
  },
  en: {
    // Top Bar & Navigation
    appTitle: 'FlexiPOS Sri Lanka',
    terminal: 'Terminal #01',
    cashierPanel: 'Cashier POS',
    adminPanel: 'Shop Admin',
    superAdminPanel: 'Super Admin (Dev)',
    online: 'Online',
    offline: 'Offline',
    syncPending: 'Sync Pending',
    syncSuccess: 'Offline orders synchronized to server',

    // Cashier View
    quickTiles: 'Quick Touch Items',
    searchPlaceholder: 'Scan barcode or search item name... [F2]',
    allCategories: 'All',
    currentBill: 'Current Bill',
    itemsCount: 'items',
    clearBill: 'Clear',
    emptyCartTitle: 'Bill is Empty',
    emptyCartSubtitle: 'Select items or scan barcode to begin',
    selectCustomerCredit: 'Select Customer (Credit Book)',
    subtotal: 'Subtotal',
    discount: 'Discount',
    netTotal: 'Net Total',
    payButton: 'Complete Payment (Pay / F9)',

    // Checkout Modal
    checkoutTitle: 'Payment Settlement',
    cash: 'Cash',
    card: 'Card',
    lankaQR: 'LankaQR',
    credit: 'Credit (ණයට)',
    cashReceived: 'Cash Received',
    changeGiven: 'Change',
    exactAmount: 'Exact',
    completeSale: 'Complete Sale',
    cancel: 'Cancel',

    // Credit Book (ණය පොත)
    creditBookTitle: 'Customer Credit Ledger',
    totalShopDebt: 'Total Shop Credit',
    searchCustomer: 'Search customer name or phone...',
    newCustomer: '+ New Customer',
    currentBalance: 'Outstanding Debt',
    creditLimit: 'Credit Limit',
    repayCredit: 'Pay Credit',
    selectForBill: 'Select for Bill',
    repayAmount: 'Repayment Amount',
    saveCustomer: 'Save Customer',

    // Shop Admin Dashboard
    shopDashboard: 'Store Management (Shop Admin)',
    todaySales: "Today's Sales",
    cashInHand: 'Cash in Drawer',
    totalCreditOut: 'Total Customer Credit',
    lowStockItems: 'Low Stock Alerts',
    tabDashboard: 'Overview',
    tabProducts: 'Products & Stock',
    tabCredit: 'Credit Book',
    tabSalesHistory: 'Sales History',
    tabStaff: 'Staff / Cashiers',
    tabSettings: 'Store Settings',

    // Products Management
    addProduct: '+ Add Product',
    productName: 'Product Name',
    sellingPrice: 'Selling Price',
    costPrice: 'Cost Price',
    currentStock: 'Current Stock',
    quickItemCheck: 'Show on Quick Tiles',
    saveProduct: 'Save Product',

    // Super Admin Panel
    superAdminTitle: 'FlexiPOS Platform Master (Super Admin)',
    superAdminSubtitle: 'Registered stores & multi-tenant SaaS control',
    totalShops: 'Registered Shops',
    totalMonthlyRevenue: 'Monthly Platform MRR',
    activeSubscriptions: 'Active Subscriptions',
    shopNameCol: 'Shop Name',
    ownerCol: 'Owner / Contact',
    planCol: 'Subscription Plan',
    statusCol: 'Status',
    actionsCol: 'Actions',
    addNewShop: '+ Register New Shop',
    managePlan: 'Manage Plan'
  }
};

