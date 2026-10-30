# FlexiPOS 🛒🇱🇰
### *A Customizable, Offline-First POS Platform for Sri Lankan Small Businesses (Grocery First)*

[![License](https://img.shields.io/badge/License-Proprietary-blue.svg)](#)
[![Architecture](https://img.shields.io/badge/Architecture-Modular%20Monolith-orange.svg)](#)
[![Offline](https://img.shields.io/badge/Offline--First-IndexedDB%20%2B%20Sync-green.svg)](#)
[![Target Market](https://img.shields.io/badge/Market-Sri%20Lanka%20Retail-red.svg)](#)

---

## 📌 Executive Summary

**FlexiPOS** is an enterprise-ready, customizable Point-of-Sale (POS) and retail management platform built specifically for small-to-medium retail businesses in Sri Lanka, starting with **grocery stores, boutique shops, and mini-marts**.

Unlike rigid, generic legacy POS systems, FlexiPOS operates on a core philosophy:
> **"A POS that adapts to the way each shop operates, instead of forcing every shop to work the same way."**

---

## 💼 Business & Commercial Model

FlexiPOS follows a **Core Subscription + Paid Customization** SaaS model. Every customer shares a single, secure multi-tenant codebase with feature flags and dynamic configuration.

```mermaid
flowchart TD
    CorePlatform["FlexiPOS Core Platform\n(Single Codebase / Multi-Tenant)"]
    
    SubBasic["Basic Plan\n(LKR 1,500 - 2,500 / mo)\nSingle counter, billing, inventory, basic reports"]
    SubStandard["Standard Plan\n(LKR 3,000 - 5,000 / mo)\nSuppliers, ණය පොත, advanced reports, staff roles"]
    SubCustom["Custom Enterprise\n(Custom Quotation)\nSpecial formats, custom integrations, dedicated support"]
    
    CorePlatform --> SubBasic
    CorePlatform --> SubStandard
    CorePlatform --> SubCustom
    
    Addons["Paid Add-on Modules & Configurations\n• Custom Invoice Layouts\n• External Hardware Integrations\n• Specialized Stock/Wholesale Logic"]
    SubStandard -.-> Addons
    SubCustom -.-> Addons
```

### Proposed Pricing Tiers

| Tier | Monthly Fee (LKR) | Target Segment | Key Modules Included |
| :--- | :--- | :--- | :--- |
| **Basic** | **Rs. 1,500 – 2,500** | Small village grocery, single counter, 100–500 items | Fast billing, inventory tracking, basic daily sales, thermal receipts |
| **Standard** | **Rs. 3,000 – 5,000** | Busy mini-mart, multiple staff, 1,000+ items | All Basic + **ණය පොත (Credit Ledger)**, Supplier management, Cashier shifts, Low stock alerts |
| **Custom Business** | **Quotation Basis** | Multi-branch, wholesale + retail, custom workflows | Multi-branch sync, wholesale pricing tiers, custom reports, priority setup |

---

## 🔍 Sri Lankan Market Validation & Competitive Edge

A comparative evaluation of existing solutions in the Sri Lankan market reveals clear opportunities:

| Competitor | Public Features / Pricing | FlexiPOS Competitive Edge |
| :--- | :--- | :--- |
| **Invenova** | Stock, credit, supplier; Starter from Rs. 3,500/mo | Simpler UI, instant non-barcode touch items, zero setup friction |
| **Vexel POS** | Offline, barcode, credit; Rs. 1,500/mo + Rs. 50,000 setup fee | **No heavy upfront setup fee**; runs on existing hardware/tablets |
| **Sri Bill** | Billing, inventory, weighted items; Rs. 4,990/mo | Tailored specifically for Sri Lankan grocery workflows at half the entry price |
| **Goko POS** | Sinhala/Tamil support, free plan advertised | Robust offline synchronization with strict multi-tenant security & audit logs |
| **PosEx** | Offline-first, multi-device, inventory | Deep focus on digital **ණය පොත** + loose grocery weighing (සහල්/එළවළු) |

### Key Differentiators:
1. **Digital ණය පොත (Customer Credit Ledger):** Built directly into the checkout flow. No separate accounting software required.
2. **Lightning Fast Loose/Weighted Item Entry:** Barcodes are not universal in Sri Lanka. One-touch hotkeys for un-barcoded goods (bread, eggs, bulk rice, sugar).
3. **True Offline-First Architecture:** Uninterrupted sales during fiber/4G drops or power cuts. Data queues locally and synchronizes automatically with conflict prevention.
4. **Low Hardware Barrier:** Runs cleanly on budget hardware (refurbished Core i3 laptops, Android tablets, 58mm/80mm USB/Bluetooth thermal printers).

---

## 👥 Target Customer Segments

```mermaid
journey
    title Customer Expansion Journey
    section Tier A: Small Grocery Shops
      1 Cashier / Owner operated: 5: Small Grocery
      100 - 1,000 items (Rice, Spices, Loose goods): 5: Small Grocery
      Paper ණය පොත replacement: 5: Small Grocery
    section Tier B: Mini Marts & Self-Service
      Barcode scanning & 2 Cashiers: 4: Mini Mart
      Expiry date & supplier purchase orders: 4: Mini Mart
      Cashier shift management (Z-Reports): 4: Mini Mart
    section Tier C: Multi-Branch Chains
      Central stock warehouse: 3: Multi-Branch
      Inter-branch transfers: 3: Multi-Branch
      Consolidated owner financial dashboard: 3: Multi-Branch
```

* **Tier A (Primary Launch Target):** Single-counter family grocers. Priority: Extreme simplicity, speed, credit book.
* **Tier B (Scale Target):** Semi-modern mini-marts with barcode readers, multiple staff, and high inventory volume.
* **Tier C (Future Horizon):** 2–5 branch local chains requiring consolidated stock and reporting.

---

## 🚀 Product Scope & Feature Matrix

### V1 — Essential Launch Scope
* **POS Checkout:**
  * Ultra-fast item search and barcode scanning.
  * Quick-touch tiles for loose / non-barcoded items (පාන්, බිත්තර, සීනි, සහල්).
  * Weighted item entry (price-per-kg with instant gram/kilogram calculation).
  * Item-level and bill-level discounts.
  * Split payments: Cash, Card, LankaQR, and **ණයට (Credit)**.
  * Thermal receipt printing (58mm and 80mm ESC/POS format).
* **Inventory & Stock Management:**
  * Product catalogue (Barcode, Name, Category, Cost Price, Selling Price, Minimum Reorder Level).
  * Stock-in (GRN) and manual stock adjustments (spoilage/damage).
  * Low-stock warnings.
* **Customer Management & ණය පොත (Credit Ledger):**
  * Customer profile with credit limit and phone number.
  * 1-click credit checkout with existing balance display.
  * Partial credit repayment recording with instant updated balance.
* **User Management & Security:**
  * Role-Based Access Control (Admin / Owner, Cashier).
  * Cashier shift closing (X/Z Report) with physical cash tally.
* **Offline Billing Engine:**
  * Uninterrupted sales when offline using IndexedDB.
  * Auto-syncing background engine when internet returns.

### V1.5 — Advanced Features
* Expiry date tracking and near-expiry alerts.
* Excel / CSV bulk product import & export.
* Expense tracking (electricity, shop rent, tea/staff expenses).
* Owner Mobile Dashboard (real-time sales from outside the shop).

### V2 — Enterprise & Custom Modules
* Multi-branch stock transfers.
* Wholesale dual-pricing (Retail price vs. Wholesale / Box price).
* SMS / WhatsApp payment reminders for credit customers.
* IRD RAMIS compliance (Electronic VAT invoice integration).

---

## 🏛️ System Architecture

FlexiPOS is designed as a **Modular Monolith** with an **Offline-First Client Layer**.

```mermaid
graph TB
    subgraph ClientLayer ["Client Layer (Cashier POS / Owner Device)"]
        UI["React + TypeScript + Tailwind CSS UI"]
        State["Application State Manager"]
        SyncClient["Offline Sync Engine (RxDB / Dexie.js)"]
        LocalDB[("Local Storage\nIndexedDB")]
        
        UI <--> State
        State <--> SyncClient
        SyncClient <--> LocalDB
    end

    subgraph Transport ["Network Transport"]
        HTTPS["Secure HTTPS / REST & WebSocket"]
    end

    subgraph BackendLayer ["Backend API (Node.js + Express + TypeScript)"]
        Gateway["API Gateway & Auth / RBAC Middleware"]
        TenantGuard["Multi-Tenant Boundary Guard\n(business_id isolation)"]
        
        subgraph Modules ["Modular Monolith Domain Services"]
            BillingSvc["Billing & Orders Service"]
            InventorySvc["Inventory & Stock Service"]
            CreditSvc["Credit Ledger (ණය පොත) Service"]
            SyncSvc["Sync & Conflict Resolution Engine"]
            AuditSvc["Audit & Security Logging"]
        end
        
        Gateway --> TenantGuard
        TenantGuard --> Modules
    end

    subgraph DatabaseLayer ["Database Layer"]
        PG[("PostgreSQL Database\nRow-Level Partitioning via business_id")]
    end

    SyncClient <==> HTTPS
    HTTPS <==> Gateway
    Modules <--> PG
```

### Technology Stack

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **Frontend UI** | **React (Vite) + TypeScript** | High performance, rapid rendering for fast typing cashiers |
| **Styling** | **Tailwind CSS** | Clean, responsive UI tailored for both touchscreens & keyboards |
| **Local Client DB** | **IndexedDB (via Dexie.js)** | Robust client-side database capable of holding 10,000+ cached items and pending sales |
| **Backend Runtime** | **Node.js + Express (TypeScript)** | Lightweight, scalable, modular, and fast I/O |
| **Database** | **PostgreSQL** | ACID-compliant transactional guarantees for financial ledgers and stock counts |
| **Data Validation** | **Zod** | End-to-end type safety shared between client and server |
| **Receipt Printing** | **Web Print API / ESC-POS** | Direct raw thermal printer integration (USB/Bluetooth/Network) |

---

## 🗄️ Database Architecture & Entity Relationship Diagram (ERD)

All tables strictly enforce multi-tenancy via a foreign key `business_id`. 

```mermaid
erDiagram
    BUSINESSES ||--o{ USERS : employs
    BUSINESSES ||--o{ PRODUCTS : owns
    BUSINESSES ||--o{ CATEGORIES : owns
    BUSINESSES ||--o{ CUSTOMERS : serves
    BUSINESSES ||--o{ ORDERS : records
    BUSINESSES ||--o{ SUPPLIERS : purchases_from
    
    CATEGORIES ||--o{ PRODUCTS : categorizes
    
    CUSTOMERS ||--o{ CREDIT_TRANSACTIONS : has
    CUSTOMERS ||--o{ ORDERS : places
    
    ORDERS ||--o{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : ordered_in
    
    PRODUCTS ||--o{ STOCK_MOVEMENTS : tracks
    USERS ||--o{ ORDERS : creates
    USERS ||--o{ SHIFTS : opens_closes
    
    BUSINESSES {
        uuid id PK
        string name
        string trade_name
        string phone
        string address
        string currency
        string tax_number
        jsonb settings
        timestamp created_at
    }

    USERS {
        uuid id PK
        uuid business_id FK
        string full_name
        string username
        string password_hash
        string role "ADMIN | MANAGER | CASHIER"
        boolean is_active
        timestamp created_at
    }

    CATEGORIES {
        uuid id PK
        uuid business_id FK
        string name
        string color_code
        integer sort_order
    }

    PRODUCTS {
        uuid id PK
        uuid business_id FK
        uuid category_id FK
        string barcode
        string name
        string name_si
        string unit "UNIT | KG | G | L"
        decimal cost_price
        decimal selling_price
        decimal current_stock
        decimal min_stock_alert
        boolean is_quick_item
        boolean is_active
    }

    CUSTOMERS {
        uuid id PK
        uuid business_id FK
        string name
        string phone
        decimal credit_limit
        decimal current_balance
        timestamp created_at
    }

    CREDIT_TRANSACTIONS {
        uuid id PK
        uuid business_id FK
        uuid customer_id FK
        uuid order_id FK "nullable"
        string type "DEBIT | CREDIT"
        decimal amount
        decimal balance_after
        string notes
        timestamp created_at
    }

    ORDERS {
        uuid id PK
        uuid business_id FK
        uuid cashier_id FK
        uuid customer_id FK "nullable"
        string invoice_number
        string payment_method "CASH | CARD | LANKAQR | CREDIT | SPLIT"
        decimal subtotal
        decimal discount
        decimal total
        decimal amount_paid
        decimal change_given
        string sync_status "PENDING | SYNCED"
        uuid local_client_id
        timestamp created_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        string product_name
        decimal quantity
        decimal unit_price
        decimal total_price
    }

    STOCK_MOVEMENTS {
        uuid id PK
        uuid business_id FK
        uuid product_id FK
        string movement_type "SALE | PURCHASE | ADJUSTMENT | RETURN"
        decimal quantity_changed
        decimal new_stock_level
        string reason
        timestamp created_at
    }
```

---

## 🔄 Offline Synchronization Protocol

To ensure sales never halt during network failures, FlexiPOS employs an **Append-Only Idempotent Sync Protocol**:

```mermaid
sequenceDiagram
    autonumber
    actor Cashier
    participant UI as POS Terminal (Browser)
    participant LocalDB as IndexedDB (Client)
    participant SyncEng as Sync Engine
    participant Server as Backend API
    participant PG as PostgreSQL

    Cashier->>UI: Completes Sale (Cash / ණය)
    UI->>LocalDB: Generate UUIDv4 Order ID
    UI->>LocalDB: Save Order & Deduct Local Stock (Instant)
    UI->>Cashier: Print Thermal Receipt (0s latency)
    
    alt Internet is Online
        SyncEng->>LocalDB: Read Unsynced Orders Queue
        SyncEng->>Server: POST /api/v1/sync/orders (Batch payload)
        Server->>PG: Insert Order (ON CONFLICT id DO NOTHING)
        Server->>PG: Record Stock Movement & Credit Update
        Server-->>SyncEng: 200 OK (Acknowledged IDs)
        SyncEng->>LocalDB: Mark Orders as SYNCED
    else Internet is Down
        SyncEng->>SyncEng: Backoff retry with exponential jitter
        Note over UI,LocalDB: Cashier continues billing offline seamlessly
    end
```

### Key Sync Guarantees:
1. **Client-Side UUIDs:** Every transaction is tagged with a UUIDv4 on the terminal. Even if network packets retransmit, the server ignores duplicates using `ON CONFLICT (id) DO NOTHING`.
2. **Immutable Ledgers:** Sales and credit repayments are append-only rows. They never overwrite past entries.
3. **Optimistic Stock Deduction:** Local terminal inventory drops immediately for cashier awareness; reconciliation occurs when connected.

---

## 🇱🇰 Sri Lankan Localizations & Regulatory Standards

1. **Currency & Fractions:** Strict Sri Lankan Rupee formatting (`LKR` / `රු.`), rounding rules to 2 decimal places.
2. **Sinhala & Tamil Script Ready:** Database fields support Unicode UTF-8 (`name_si`, `name_ta`) allowing receipt printing in native languages.
3. **LankaQR Support:** Dynamic QR display on terminal or receipt allowing instant settlement via any Sri Lankan bank app (Commercial Bank, BOC, Sampath, Frimi, Genie, iPay).
4. **Thermal Receipt Printing:** Tailored for low-cost 58mm (2-inch) and 80mm (3-inch) ESC/POS thermal printers.
5. **IRD RAMIS Preparation:** Architecture leaves clean hook points for VAT-registered stores to interface with Inland Revenue Department (IRD) electronic VAT invoicing requirements.

---

## 📅 Development Roadmap & Milestones

```mermaid
timeline
    title FlexiPOS Execution Roadmap
    Phase 1 : Market Validation & Persona Synthesis : Ground Research Complete
    Phase 2 : Architecture & DB Schema : README & Design Specs Freezing
    Phase 3 : Core POS Development : Authentication, Multi-tenant DB, Fast Billing Screen
    Phase 4 : ණය පොත & Stock Module : Credit Ledger, Low-stock alerts, Receipts
    Phase 5 : Offline Sync Engine : IndexedDB Queue, Conflict Resolution
    Phase 6 : Pilot Store Deployment : 1-on-1 testing in a real grocery shop
    Phase 7 : Commercial SaaS Release : Subscription billing, Onboarding, Packaging
```

---

## 🛠️ Project Structure

```text
FlexiPOS/
├── docs/                     # Specifications, architectural diagrams, API contracts
├── src/
│   ├── client/               # React + TypeScript + Tailwind POS UI
│   │   ├── components/       # POS Billing, Numpad, Quick Tiles, Modals
│   │   ├── hooks/            # useOfflineSync, useBarcodeScanner, useCart
│   │   ├── db/               # Dexie.js IndexedDB schema & sync queues
│   │   └── utils/            # ESC-POS receipt generator, LKR formatters
│   ├── server/               # Node.js + Express + TypeScript Backend
│   │   ├── modules/          # Business logic (billing, credit, stock, auth)
│   │   ├── middleware/       # Tenant isolation, JWT auth, audit logging
│   │   └── db/               # PostgreSQL connection & Prisma / DDL migrations
│   └── shared/               # Shared TypeScript types, Zod schemas, constants
├── README.md                 # Primary Master Documentation
└── package.json              # Monorepo dependencies and scripts
```

---

## 📄 License & Commercial Distribution

FlexiPOS is developed as a proprietary commercial software platform. All rights reserved. Custom configurations and core subscription licenses are governed under FlexiPOS commercial agreements.

