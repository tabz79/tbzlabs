# SynOS Product Experience Architecture

This document defines the layout, interaction model, and asset requirements for the dedicated SynOS product page (`/synos`). It structures SynOS not as a linear tutorial or a simple overlay, but as a dedicated flagship product experience page presenting the **Diagnostic Operating System** ecosystem.

---

## 🗺️ Page Structure & Flow

The `/synos` page is structured around a cinematic introduction, a narrative positioning, and an interactive simulation engine, followed by five core interactive experiences:

```
┌────────────────────────────────────────────────────────┐
│ 0. Cinematic Hero Section (The Awakening)              │
├────────────────────────────────────────────────────────┤
│ *. Why SynOS Exists (Breaking Operational Silence)     │
├────────────────────────────────────────────────────────┤
│ ⏩ Interactive Clinic Simulation (Propagation Engine)  │
├────────────────────────────────────────────────────────┤
│ 1. The Operating System (Connected Orchestration Grid) │
├────────────────────────────────────────────────────────┤
│ 2. The Patient Journey (Event-Driven Flow)             │
├────────────────────────────────────────────────────────┤
│ 3. Radiology Command Center (PACS/DICOM Pipeline)      │
├────────────────────────────────────────────────────────┤
│ 4. Business Operations (Linked Exception Ledger Loop)  │
├────────────────────────────────────────────────────────┤
│ 5. Director Command Center (KPI Control Panel)         │
└────────────────────────────────────────────────────────┘
```

---

## ⚙️ Interactive Clinic Simulation (Propagation Engine)

The simulation acts as a live demonstration of SynOS's event-driven loop. A control panel allows the visitor to step through or auto-run a patient check-in, visualizing how SignalR events propagate across the clinic topology in real-time.

```
       [ Reception ] ──(VisitStarted)──► [ Billing ] ──(PaymentVerified)──► [ Phlebotomy ]
                                                                                   │
       [ Director ] ◄──(TAT & KPIs)◄── [ Pathologist ] ◄──(Signed)◄── [ Laboratory ] ◄┘
            │                                 │
     [Inventory consumed]              [Commission ledger]
```

### Event Propagation Steps & UI State Mutations:

#### 1. Registration Created
* **Action**: PatientMRN is registered.
* **Active Node**: **Reception** lights up in yellow/amber glow.
* **SignalR Pulse Direction**: Pulsing line flows from `Reception` ➔ `Billing`.
* **State Updates**:
  * *Billing Node*: Status changes to "Pending Test Selection".
  * *Activity Ticker*: Pushes `[Event: VisitStarted] MRN-4829 registered. Unlocking billing catalog.`
  * *Screen Highlight*: Displays `patient-registration.png`.

#### 2. Billing & Payment Completed
* **Action**: Tests selected, invoice verified, payment approved.
* **Active Node**: **Billing** lights up in emerald green.
* **SignalR Pulse Direction**: Split pulsing lines flow from `Billing` ➔ `Phlebotomy` AND `Billing` ➔ `Finance`.
* **State Updates**:
  * *Phlebotomy Node*: Active queue counter increments (`+1 Patient Waiting`).
  * *Finance Node*: Registers revenue posting (`+ $45.00 cash sales`).
  * *Activity Ticker*: Pushes `[Event: PaymentReceived] Visit finalized. Phlebotomy queue unlocked.`
  * *Screen Highlight*: Displays `test-selector.png`.

#### 3. Sample Collected
* **Action**: Blood tube drawn and barcode scanned.
* **Active Node**: **Phlebotomy** lights up in blue-emerald.
* **SignalR Pulse Direction**: Pulsing line flows from `Phlebotomy` ➔ `Laboratory`.
* **State Updates**:
  * *Phlebotomy Node*: Queue counter decrements (`-1 Patient Waiting`).
  * *Laboratory Node*: Pathology bench queue adds active item (`Token #1024 status: Processing`).
  * *Activity Ticker*: Pushes `[Event: SampleCollected] Barcode scanned for MRN-4829. Specimen routed to Biochemistry.`
  * *Screen Highlight*: Displays `phlebo-queue.png`.

#### 4. Laboratory Results Logged
* **Action**: Analytical parameters entered on the laboratory counter.
* **Active Node**: **Laboratory** lights up in cyan.
* **SignalR Pulse Direction**: Pulsing line flows from `Laboratory` ➔ `Pathologist` (Clinical Signing Authority).
* **State Updates**:
  * *Laboratory Node*: Workbench row highlights as complete.
  * *Pathologist Node*: Report list adds pending item (`MRN-4829 biochemistry panel needs signature`).
  * *Activity Ticker*: Pushes `[Event: ResultsEntered] Analyzer parameters logged. abnormal flags checked.`
  * *Screen Highlight*: Displays `department-workbench.png`.

#### 5. Report Validation & Signature
* **Action**: Pathologist approves findings and digitally signs the report.
* **Active Node**: **Pathologist** lights up in glowing violet.
* **SignalR Pulse Direction**: Triple split pulses flow from `Pathologist` ➔ `Inventory` AND `Pathologist` ➔ `Finance` AND `Pathologist` ➔ `Director`.
* **State Updates**:
  * *Inventory Node*: Stocks auto-decrement reagents (`Reagent kit count -1`).
  * *Finance Node*: Doctor commission ledger posts B2B commission logs (`Referred Dr. Ravi: +$5.00 credit`).
  * *Director Node*: Turnaround Time KPI chart updates averageTAT gauge (`Average TAT: 34 mins`).
  * *Activity Ticker*: Pushes `[Event: ReportFinalized] Pathologist signed PDF release. Broadcasted to print queues.`
  * *Screen Highlight*: Displays `director-dashboard.png`.

---

## 🎨 The Page Chapters & Wireframe Layouts

### Chapter 0: Cinematic Hero Section (The Awakening)
* **Objective**: Create a dramatic, premium opening to establish the scale of the Diagnostic Operating System.
* **Typography**:
  * Title: **SynOS**
  * Subtitle: **The Diagnostic Operating System**
  * Supporting: *Designed around how diagnostic centers actually operate.*
* **Visual Interface**:
  * A darkened grid layout depicting the core business units: **Reception**, **Laboratory**, **Radiology**, **Finance**, and **Director**.
  * **The Awakening Animation**: Upon entering the page, these departments slowly fade in and light up one by one with glowing ambient backdrops (violet, emerald, cyan, indigo), symbolizing a clinic waking up and connecting.
* **Target Value**: Builds immediate visual intrigue and introduces the key actors of the ecosystem.

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                                  SynOS                                    │
│                     The Diagnostic Operating System                       │
│                                                                           │
│            [ Designed around how diagnostic centers actually operate ]    │
│                                                                           │
│   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   │
│   │  Reception  │   │ Laboratory  │   │  Radiology  │   │   Finance   │   │
│   │  [Fades In] │   │  [Fades In] │   │  [Fades In] │   │  [Fades In] │   │
│   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   │
│                               ┌─────────────┐                             │
│                               │  Director   │                             │
│                               │  [Fades In] │                             │
│                               └─────────────┘                             │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Chapter 1: Why SynOS Exists (Breaking Operational Silence)
* **Objective**: Establish the core problem legacy software fails to solve: **Operational Silence**.
* **Contrast Narrative**:
  * **Before SynOS**:
    * *Reception* doesn't know what's happening in the lab.
    * *Radiology* doesn't know report status.
    * *Finance* doesn't know operational impact.
    * *Management* sees everything too late.
  * **SynOS changes that.**
* **Visual Interface**:
  * A split visual layout. On the left, a representation of disjointed, grayed-out silos under "Operational Silence". On the right, a vibrant, glowing event pulse showing them linked.
* **Target Value**: Instantly resonates with clinic owners by addressing the emotional and financial pain of fragmented processes.

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│                       Why SynOS Exists (Operational Silence)              │
│                                                                           │
│       BEFORE SYNOS [Fragmented Silos]    │  SYNOS WAY [Unified Operations] │
│                                         │                                 │
│       ┌──────────┐      ┌──────────┐    │        ┌─────────────────┐      │
│       │Reception │      │Laboratory│    │        │  Reception      │      │
│       └────X─────┘      └────X─────┘    │        └────────┬────────┘      │
│            No Connection                │                 │ [SignalR]     │
│       ┌──────────┐      ┌──────────┐    │        ┌────────v────────┐      │
│       │Radiology │      │ Finance  │    │        │  Laboratory     │      │
│       └────X─────┘      └────X─────┘    │        └────────┬────────┘      │
│                                         │                 │ [Real-Time]   │
│       "Receptionists don't know if a   │        ┌────────v────────┐      │
│       patient is waiting at phlebotomy."│        │  Radiology      │      │
│                                         │        └─────────────────┘      │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Chapter 2: Experience 1 - The Operating System (Orchestration Grid)
* **Objective**: Establish the connected, push-based nature of SynOS where every department's terminal updates in real-time.
* **Visual Interface**: 
  * A bird's-eye topology map of the diagnostic clinic (Reception, Billing, Phlebotomy, Labs, Imaging, Sign-off, Admin).
  * Lines connect the departments, indicating SignalR event bridges.
* **Interaction Model**:
  * Hovering over any department card highlights its connection lines, dims the rest of the clinic, and opens a sidebar panel detailing:
    * **Active Queues**: What list the staff is currently looking at.
    * **Signal Inputs**: Events that unlock this department's work.
    * **Signal Outputs**: Events this department fires to notify others.
* **Target Value**: Demonstrates how SynOS eliminates manual verbal hand-offs between rooms.
* **Screenshot Assets Used**:
  * `patient-registration.png` (Reception Node)
  * `test-selector.png` (Billing Node)
  * `phlebo-queue.png` (Phlebotomy Node)

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Experience 1: The Operating System (Connected Orchestration Grid)          │
│                                                                           │
│   [ DEPARTMENT MAP - CLICK NODE TO ACTIVATE ]  │   [ SPECIFIC SCREEN ]     │
│                                               │                           │
│     ┌───────────┐      ┌───────────┐          │   ┌───────────────────┐   │
│     │ Reception ├─────►│  Billing  │          │   │ patient-          │   │
│     └─────┬─────┘      └─────┬─────┘          │   │ registration.png  │   │
│           │                  │                │   │                   │   │
│     ┌─────v─────┐      ┌─────v─────┐          │   │ [Real Screenshot] │   │
│     │Phlebotomy ├─────►│Laboratory │          │   │                   │   │
│     └───────────┘      └───────────┘          │   │                   │   │
│                                               │   └───────────────────┘   │
│   ─────────────────────────────────────────── │                           │
│   Active Node: Reception                      │   * Active Queue: Registr │
│   Signal Output: VisitStarted event sent      │   * Prevents doubleMRNs   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Chapter 3: Experience 2 - The Patient Journey (Event-Driven Flow)
* **Objective**: Show how a single patient check-in triggers automated, rules-based tasks downstream.
* **Visual Interface**:
  * A horizontal timeline illustrating the event lifecycle (Arrival ➔ Billing ➔ Payment ➔ Sample Collection ➔ Lab Testing ➔ Sign-off ➔ Dispatch).
* **Interaction Model**:
  * **Interactive Scroll-Trigger**: As the user scrolls vertically, the timeline moves horizontally.
  * Active nodes light up. An adjacent "System Event log" display shows the clean backend trigger:
    * *Example*: Selecting **Payment Verified** changes the Phlebotomy queue status indicator from "Fasting Verification Pending" to "Actionable (Draw Tube)".
* **Target Value**: Proves that billing gates phlebotomy and sign-off gates delivery automatically, eliminating revenue leakage and clinical errors.
* **Screenshot Assets Used**:
  * `patient-registration.png` (Arrival Screen)
  * `test-selector.png` (Billing Screen)
  * `phlebo-queue.png` (Collection Screen)
  * `department-workbench.png` (Testing Screen)
  * `pathologist.png` (Validation Screen)

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Experience 2: The Patient Journey (Event-Driven Flow)                      │
│                                                                           │
│   [Arrival] ──► [Billing] ──► (*Payment*) ──► [Collection] ──► [Testing]   │
│                                                                           │
│   ┌────────────────────────────────────────┐  │  [ SYSTEM TRIGGER LOG ]   │
│   │                                        │  │                           │
│   │  test-selector.png                     │  │  * Event: PaymentReceived │
│   │                                        │  │                           │
│   │  [Real Screenshot - Billing Selection] │  │  * Trigger Action:        │
│   │                                        │  │    Unlocks Phlebotomy     │
│   │                                        │  │    Queue for Mr. John Doe │
│   │                                        │  │                           │
│   └────────────────────────────────────────┘  │  * Revenue Ledger Posted  │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Chapter 4: Experience 3 - Radiology Command Center (PACS/DICOM Pipeline)
* **Objective**: Detail the high-resolution imaging and communication loop between scanners and radiologists.
* **Visual Interface**:
  * A split-screen environment: Left (CT/MRI Scan list), Center (PACS DICOM repository node), Right (Radiologist viewer workspace).
* **Interaction Model**:
  * **Trigger Scan**: Clicking a CT scan row triggers a data-transfer animation showing DICOM slices flowing into the PACS storage node.
  * **Active Load**: The Radiologist workspace instantly populates with the patient study, displaying a voice-dictation transcription panel alongside the PACS viewer link.
* **Target Value**: Demonstrates how hardware integrations remove manual file uploads, accelerating scan turnaround times.
* **Screenshot Assets Used**:
  * `mri-technician-sample-collection-screen.png` (Imaging Modality Worklist)
  * `radiologist.png` (Radiologist Workspace / PACS study view)
  * `typist-screen.png` (Transcriptionist Console)

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Experience 3: Radiology Command Center (PACS/DICOM Pipeline)              │
│                                                                           │
│   [1. MODALITY WORKLIST]  │ [2. PACS REPOSITORY]  │ [3. RADIOLOGIST VIEW] │
│                           │                       │                       │
│   ┌───────────────────┐   │   ┌───────────────┐   │   ┌─────────────────┐ │
│   │ mri-technician-   │   │   │   [PACS Server]│   │   │ radiologist.png │ │
│   │ sample-collection-│═══╬══►│   DICOM Node  │═══╬══►│                 │ │
│   │ screen.png        │   │   │               │   │   │ [Screenshot]    │ │
│   └───────────────────┘   │   └───────────────┘   │   │                 │ │
│   CT/MRI scan finishes.   │   Associates scan with│   │ Opens viewer +  │ │
│   Sends DICOM file.       │   Visit ID.           │   │ voice dictation.│ │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Chapter 5: Experience 4 - Business Operations (Linked Exception Ledger Loop)
* **Objective**: Explain the administrative model (Revenue ledger, stock auto-deduction, and exception-based attendance).
* **Visual Interface**:
  * A dual-card layout split into **Stock & Finance** on the left and **HR & Payroll** on the right.
* **Interaction Model**:
  * **Test Count Slider**: A slider control allows visitors to adjust the number of processed panels (e.g., 100 ➔ 10,000).
  * **Dynamic Calculations**: The page updates to show:
    * Reagent bottle stock levels decrementing automatically based on Test Master definitions.
    * Postings automatically appearing in the Finance expense ledger.
    * B2B referral commissions recalculating and updating the supplier P&L sheet.
* **Target Value**: Shows how administrative work is automated as exceptions (payroll matches attendance exceptions, finance matches clinical logs), preventing financial leakages.
* **Screenshot Assets Used**:
  * `inventory.png` (Inventory Stock levels)
  * `finance.png` / `finance-expense-ledger.png` (Revenue & Expense posting sheets)
  * `finance-payroll.png` / `finance-payroll-2.png` / `finance-payroll-payslip.png` (Payroll exception lists)

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Experience 4: Business Operations (Linked Exception Ledger Loop)          │
│                                                                           │
│   Adjust Test Count: [========O=======] 1,500 tests processed             │
│                                                                           │
│   [STOCK & INVENTORY]                     │   [FINANCIAL GENERAL LEDGER]  │
│   ┌───────────────────────────────────┐   │   ┌───────────────────────┐   │
│   │ inventory.png [Real Screenshot]   │   │   │ finance.png           │   │
│   │                                   │   │   │                       │   │
│   │ * Reagent consumed: -1,500 units  │   │   │ * B2B payout calc: OK │   │
│   │ * Status: Low Stock Alert triggered│  │   │ * Net profit updated  │   │
│   └───────────────────────────────────┘   │   └───────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### Chapter 6: Experience 5 - Director Command Center (KPI Control Panel)
* **Objective**: Display the high-level dashboard where owners monitor financial health, employee performance, and patient bottlenecks.
* **Visual Interface**:
  * A premium analytics control panel displaying operational gauges: cash flow cards, department delay flags, and average turnaround time (TAT) charts.
* **Interaction Model**:
  * **Filter Toggles**: Visitors click filter buttons (e.g., "Sort by Turnaround Time" or "Sort by B2B Partner Volume").
  * The charts dynamically redraw to show clinic bottlenecks (e.g., pathology signature queue backup), showing how a director can detect operational issues immediately.
* **Target Value**: Proves that management has absolute real-time visibility into the health of the entire business.
* **Screenshot Assets Used**:
  * `director-dashboard.png` (Director Dashboard KPIs)

#### Wireframe Layout:
```
┌───────────────────────────────────────────────────────────────────────────┐
│ Experience 5: Director Command Center (KPI Control Panel)                 │
│                                                                           │
│   ┌───────────────────────────────────────────┐   │  [ MANAGEMENT AUDIT ] │
│   │ director-dashboard.png                    │   │                       │
│   │                                           │   │  * Filter: Outsource  │
│   │ [Real Production Dashboard Screenshot]    │   │                       │
│   │                                           │   │  * Status: High TAT   │
│   │                                           │   │    alerts in Haematology│
│   │                                           │   │                       │
│   └───────────────────────────────────────────┘   │  * Net Billing: $14.2k│
└───────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Interaction & Routing Model

1. **URL Route**: Accessible via a dedicated route `/synos` in the Vite application.
2. **Navigation Transition**: Clicking the SynOS showcase card on the homepage performs a smooth layout transition (Framer Motion `layoutId`) that morphs the card into the dedicated `/synos` product view.
3. **Menu Access**: Added as a permanent item on the main header navigation once SynOS is active.
4. **Scroll-Sync**: A floating sidebar index highlights the active Experience (1 to 5) as the user scrolls down the page, providing easy jumping controls.
