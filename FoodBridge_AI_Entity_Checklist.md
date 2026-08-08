# FoodBridge AI — Entity Completion Checklist

> **Project:** FoodBridge AI — Food Surplus Prediction & Redistribution  
> **Stack:** MERN (MongoDB, Express.js, React, Node.js)  
> **Core Entities:** Donor, Receiver, AI  
>
> **Rule:** Do not move to the next entity until the current entity reaches 100% completion.  
> An entity is considered **READY** only when its complete end-to-end flow works.

---

# 🟠 ENTITY 1 — DONOR

## Goal

A donor should be able to:

**Register → Create surplus donation → Get AI analysis → See recommended receivers → Select receiver → Track donation → Complete pickup → See impact**

---

## D1 — Donor Registration

### Authentication

- [ ] Donor registration page created
- [ ] Name field
- [ ] Email field
- [ ] Password field
- [ ] Organization/business name
- [ ] Phone number
- [ ] Location
- [ ] Donor role stored as `DONOR`
- [ ] Password hashed using bcrypt
- [ ] JWT authentication implemented
- [ ] Login implemented
- [ ] Logout implemented
- [ ] Protected donor routes implemented
- [ ] Invalid login handled
- [ ] Duplicate email handled
- [ ] Form validation implemented

### Database

Minimum Donor structure:

```js
{
  name,
  email,
  password,
  organizationName,
  phone,
  location: {
    address,
    city,
    lat,
    lng
  },
  role: "DONOR",
  createdAt
}
```

- [ ] Donor model created
- [ ] MongoDB connection working
- [ ] Donor saved successfully
- [ ] Donor retrieved successfully
- [ ] Donor authentication tested

### D1 READY

- [ ] Register → Login → JWT → Donor Dashboard works completely

---

# D2 — Donor Dashboard

### UI

- [ ] Donor navbar
- [ ] Donor sidebar/navigation
- [ ] Welcome section
- [ ] Total food donated
- [ ] Total meals redistributed
- [ ] Active donations
- [ ] Completed donations
- [ ] Urgent donations
- [ ] Recent donations
- [ ] Profile section

### Dashboard Data

- [ ] Fetch donor-specific data
- [ ] No other donor's data visible
- [ ] Loading states
- [ ] Empty states
- [ ] Error states

### Theme

Use the selected food-platform visual style:

- [ ] Orange/white visual identity
- [ ] Food imagery
- [ ] Rounded cards
- [ ] Large headings
- [ ] Clean food cards
- [ ] Replace ordering actions with donation/redistribution actions

### D2 READY

- [ ] Donor immediately understands what they donated
- [ ] Donor can see active donations
- [ ] Donor can see what needs attention

---

# D3 — Create Donation

Required information:

- [ ] Food type
- [ ] Quantity
- [ ] Unit
- [ ] Preparation time
- [ ] Pickup window start
- [ ] Pickup window end
- [ ] Dietary information
- [ ] Location
- [ ] Description
- [ ] Optional image
- [ ] Submit button

Example:

```text
Food Type
[ Cooked Meals ]

Quantity
[ 120 ] [ Meals ]

Dietary
☑ Vegetarian
☐ Vegan
☐ Jain

Prepared At
[ 2:00 PM ]

Pickup Window
[ 4:30 PM ] — [ 6:00 PM ]

Location
[ Ahmedabad ]

Description
[........................]

[ ANALYZE WITH AI ]
```

### Validation

- [ ] Quantity > 0
- [ ] Food type required
- [ ] Pickup time required
- [ ] Pickup end > pickup start
- [ ] Location required
- [ ] Invalid values rejected
- [ ] Backend validation implemented

### Donation Data

```js
{
  donorId,

  foodType,
  quantity,
  unit,

  preparationTime,

  pickupWindow: {
    start,
    end
  },

  dietaryInfo,

  description,

  location,

  status: "AVAILABLE",

  createdAt
}
```

- [ ] Donation model/data structure implemented
- [ ] Donation stored in MongoDB
- [ ] Donation retrieved successfully
- [ ] Donor sees created donation

### D3 READY

- [ ] Donor can create a real donation
- [ ] Donation is successfully stored in MongoDB

---

# D4 — Donor Donation Management

### Donation Lifecycle

```text
AVAILABLE
    ↓
MATCHED
    ↓
ACCEPTED
    ↓
PICKUP_SCHEDULED
    ↓
PICKED_UP
    ↓
COMPLETED
```

Expired flow:

```text
AVAILABLE → EXPIRED
```

### Checklist

- [ ] Donation list
- [ ] Donation detail page
- [ ] Status badge
- [ ] Status timeline
- [ ] Donation edit where appropriate
- [ ] Donation cancellation where appropriate
- [ ] Expiry handling
- [ ] Pickup tracking
- [ ] Completion handling

### D4 READY

- [ ] Donor can follow a donation from creation to completion
- [ ] Status changes are reflected correctly

---

# D5 — Donor + AI Integration

After creating a donation:

```text
Create Donation
       ↓
AI Analysis
       ↓
Risk + Priority
       ↓
Recommended Receivers
       ↓
Select Receiver
```

### Checklist

- [ ] AI analysis button
- [ ] Loading state/animation
- [ ] AI result screen
- [ ] Surplus risk score
- [ ] Risk level
- [ ] Priority score
- [ ] Explanation
- [ ] Recommended receivers
- [ ] Match score
- [ ] Match factors
- [ ] Select/accept receiver
- [ ] AI response stored with donation

### DONOR ENTITY READY

The Donor entity is READY only when this complete flow works:

```text
DONOR
  ↓
Register/Login
  ↓
Dashboard
  ↓
Create Donation
  ↓
AI Analysis
  ↓
See Recommended Receivers
  ↓
Select Receiver
  ↓
Track Donation
  ↓
Pickup
  ↓
Completed
```

- [ ] **DONOR = READY**

---

# 🟢 ENTITY 2 — RECEIVER

> Use the term **Receiver** consistently throughout the product.

## Goal

A receiver should be able to:

**Register → Create profile → Set capacity/dietary needs → View AI recommendations → Accept donation → Pickup → Complete → See impact**

---

# R1 — Receiver Registration

### Registration

- [ ] Receiver registration page
- [ ] Organization name
- [ ] Contact person
- [ ] Email
- [ ] Password
- [ ] Phone
- [ ] Location
- [ ] Role = `RECEIVER`
- [ ] Password hashing
- [ ] JWT
- [ ] Login
- [ ] Logout
- [ ] Protected receiver routes

### Receiver Profile Structure

```js
{
  organizationName,
  contactPerson,
  email,
  phone,

  capacity,

  dietaryNeeds: [],

  location: {
    address,
    city,
    lat,
    lng
  },

  verificationStatus: "PENDING",

  role: "RECEIVER"
}
```

### Checklist

- [ ] Receiver model created
- [ ] MongoDB collection/data structure
- [ ] Registration API
- [ ] Login API
- [ ] Profile API
- [ ] Update profile API
- [ ] Validation

### R1 READY

- [ ] Receiver can register
- [ ] Receiver can login
- [ ] Receiver can access protected dashboard

---

# R2 — Receiver Profile

Receiver should specify:

- [ ] Maximum capacity
- [ ] Dietary requirements
- [ ] Location
- [ ] Operating hours
- [ ] Organization information
- [ ] Availability
- [ ] Verification status
- [ ] Profile editing
- [ ] Profile completion indicator

Example:

```text
COMMUNITY KITCHEN

Capacity
150 meals

Dietary Requirements
✓ Vegetarian
✓ Vegan
✓ Jain

Location
Ahmedabad

Status
✓ VERIFIED
```

### R2 READY

- [ ] Receiver profile contains enough information for AI matching
- [ ] Capacity is available
- [ ] Dietary requirements are available
- [ ] Location is available

---

# R3 — Receiver Dashboard

### Main Flow

```text
AVAILABLE FOOD
      ↓
AI RECOMMENDATIONS
      ↓
ACCEPTED
      ↓
PICKUP
      ↓
COMPLETED
```

### Dashboard Cards

- [ ] Available donations
- [ ] AI recommended donations
- [ ] Accepted donations
- [ ] Active pickups
- [ ] Completed donations
- [ ] Food received
- [ ] Meals received

### R3 READY

- [ ] Receiver can understand available food
- [ ] Receiver can see recommendations
- [ ] Receiver can track accepted donations

---

# R4 — Receiver Food Discovery

Example:

```text
AVAILABLE NEAR YOU

┌───────────────────────┐
│ 120 Vegetarian Meals  │
│ 2.1 km                │
│ 38 min remaining      │
│                       │
│ AI MATCH: 96%         │
│                       │
│ [ View ] [ Accept ]   │
└───────────────────────┘
```

### Checklist

- [ ] Available donation API
- [ ] Nearby filtering
- [ ] Food category
- [ ] Quantity
- [ ] Dietary information
- [ ] Pickup window
- [ ] Distance
- [ ] AI score
- [ ] Priority indicator
- [ ] Donation details

### R4 READY

- [ ] Receiver can discover suitable donations
- [ ] Receiver can see relevant AI information
- [ ] Receiver can open donation details

---

# R5 — Receiver Accept Flow

When receiver clicks `ACCEPT`:

```text
Donation:
MATCHED → ACCEPTED

Match:
RECOMMENDED → ACCEPTED
```

### Checklist

- [ ] Accept button
- [ ] Confirmation modal
- [ ] Backend update
- [ ] Donor sees acceptance
- [ ] Receiver sees accepted donation
- [ ] Donor sees receiver information
- [ ] Pickup information visible

### R5 READY

- [ ] Receiver can successfully accept a donation
- [ ] Donor and receiver see synchronized status

---

# R6 — Receiver Pickup

```text
ACCEPTED
   ↓
PICKUP_SCHEDULED
   ↓
PICKED_UP
   ↓
COMPLETED
```

### Checklist

- [ ] Pickup details
- [ ] Pickup window
- [ ] Countdown
- [ ] Status update
- [ ] Completion confirmation
- [ ] Donor status synchronized
- [ ] Receiver status synchronized

### RECEIVER ENTITY READY

The Receiver entity is READY only when:

```text
RECEIVER
   ↓
Register
   ↓
Create Profile
   ↓
Set Capacity + Dietary Needs
   ↓
View Available Food
   ↓
AI Recommendations
   ↓
Accept Donation
   ↓
Pickup
   ↓
Complete
```

- [ ] **RECEIVER = READY**

---

# 🤖 ENTITY 3 — AI

## Goal

The AI entity must:

1. Analyze surplus/waste risk
2. Match donors and receivers using constraints
3. Prioritize time-sensitive donations
4. Explain recommendations

---

# AI1 — AI Input Engine

### Donor Inputs

- [ ] Food type
- [ ] Quantity
- [ ] Preparation time
- [ ] Pickup window
- [ ] Dietary information
- [ ] Location

### Receiver Inputs

- [ ] Capacity
- [ ] Dietary needs
- [ ] Location
- [ ] Availability
- [ ] Verification

### System Inputs

- [ ] Current time
- [ ] Distance
- [ ] Existing donations
- [ ] Existing matches

### AI Service

- [ ] AI service created
- [ ] Input schema defined
- [ ] Donor data passed correctly
- [ ] Receiver data passed correctly
- [ ] Current time included
- [ ] Invalid input rejected
- [ ] Unnecessary sensitive data excluded
- [ ] AI API key stored in `.env`
- [ ] API key never exposed to frontend

### AI1 READY

- [ ] AI receives clean, structured data from the system
- [ ] AI service can return structured output

---

# AI2 — Surplus/Waste Risk Engine

Example input:

```text
120 meals
Prepared: 2 PM
Pickup closes: 5 PM
Current time: 4:20 PM
```

Example output:

```text
Risk: CRITICAL
Score: 91

Reasons:
• Large quantity
• Limited time
• Pickup window closing
```

### Checklist

- [ ] Quantity considered
- [ ] Preparation time considered
- [ ] Pickup window considered
- [ ] Current time considered
- [ ] Risk score generated
- [ ] Risk level generated
- [ ] Reasons generated
- [ ] Recommended action generated
- [ ] Structured JSON response
- [ ] Result stored with donation

### Risk Levels

```text
0–35    LOW
36–65   MEDIUM
66–80   HIGH
81–100  CRITICAL
```

### AI2 READY

- [ ] Donation can receive a meaningful surplus-risk assessment
- [ ] Risk result is understandable to users

---

# AI3 — Matching Engine

## Step 1 — Capacity

```text
Donation = 120 meals
Receiver capacity = 80

→ Not suitable
```

- [ ] Capacity checked

## Step 2 — Dietary Compatibility

```text
Donation = Jain
Receiver supports Jain

→ Suitable
```

- [ ] Dietary compatibility checked

## Step 3 — Location

Suggested scoring:

```text
2 km       Excellent
5 km       Good
10 km      Moderate
20+ km     Low
```

- [ ] Distance calculated
- [ ] Distance included in score

## Step 4 — Pickup Compatibility

- [ ] Donation pickup window checked
- [ ] Receiver availability checked
- [ ] Overlapping time window verified

## Step 5 — Verification

- [ ] Receiver verification considered
- [ ] Verified receiver receives higher confidence

## Step 6 — Match Score

Example weighting:

```text
Capacity              30%
Distance              25%
Dietary compatibility 20%
Pickup timing         15%
Verification          10%
```

### Checklist

- [ ] Candidate receivers fetched
- [ ] Capacity filtering
- [ ] Dietary filtering
- [ ] Location calculation
- [ ] Pickup compatibility
- [ ] Verification considered
- [ ] Match score calculated
- [ ] Top matches ranked
- [ ] AI explanation generated
- [ ] Match saved in MongoDB

### AI3 READY

- [ ] Donation produces ranked suitable receivers
- [ ] Match score is explainable
- [ ] Impossible matches are filtered out

---

# AI4 — Priority Engine

The AI/system should answer:

> **Which donation needs attention first?**

Example:

```text
Donation A
120 meals
30 minutes remaining

Priority = 95
```

versus:

```text
Donation B
40 meals
5 hours remaining

Priority = 38
```

### Checklist

- [ ] Remaining pickup time calculated
- [ ] Quantity considered
- [ ] Food time sensitivity considered
- [ ] Receiver availability considered
- [ ] Priority score generated
- [ ] Priority level generated
- [ ] Donations sorted by priority
- [ ] Dashboard reflects priority

### Priority Levels

```text
🔴 CRITICAL
🟠 HIGH
🟡 MEDIUM
🟢 LOW
```

### AI4 READY

- [ ] Time-sensitive donations receive higher priority
- [ ] Priority is visible in the UI
- [ ] Priority changes as time changes

---

# AI5 — Explainability

Every AI decision should answer:

```text
WHAT?
WHY?
FACTORS?
RECOMMENDED ACTION?
```

Example:

```text
WHY 96% MATCH?

Capacity              100%
Dietary compatibility 100%
Distance               94%
Pickup timing          92%
Verification          100%
```

### Checklist

- [ ] Match explanation
- [ ] Risk explanation
- [ ] Priority explanation
- [ ] Factors displayed
- [ ] Human-readable reasoning
- [ ] No unsupported certainty claims
- [ ] AI outputs are reviewable

### AI5 READY

- [ ] User can understand why AI made a recommendation
- [ ] AI is not just producing an unexplained number

---

# AI6 — AI Safety + Fallback

### Checklist

- [ ] API key stored in environment variables
- [ ] No API key in GitHub
- [ ] `.env` in `.gitignore`
- [ ] `.env.example` created
- [ ] AI API error handled
- [ ] Timeout handled
- [ ] Invalid AI response handled
- [ ] Fallback response available
- [ ] Synthetic demo data prepared
- [ ] AI outputs reviewable
- [ ] AI does not independently declare food safe
- [ ] Donor remains responsible for food condition/safety confirmation

### AI ENTITY READY

The AI entity is READY only when:

```text
DONATION
   ↓
AI ANALYSIS
   ↓
SURPLUS RISK
   ↓
PRIORITY
   ↓
RECEIVER FILTERING
   ↓
MATCH SCORE
   ↓
RANKING
   ↓
EXPLANATION
   ↓
RECOMMENDATION
```

- [ ] **AI = READY**

---

# 🔥 FINAL INTEGRATION CHECKLIST

Only start this after:

```text
DONOR   = READY
RECEIVER = READY
AI      = READY
```

---

## I1 — Donor ↔ AI

- [ ] Donor creates donation
- [ ] AI receives donation
- [ ] AI analyzes donation
- [ ] Risk appears on donor screen
- [ ] Priority appears
- [ ] Recommended receivers appear

---

## I2 — Receiver ↔ AI

- [ ] Receiver profile exists
- [ ] Capacity available
- [ ] Dietary needs available
- [ ] Location available
- [ ] AI uses these constraints
- [ ] Receiver sees suitable donations
- [ ] Match score visible

---

## I3 — Donor ↔ Receiver

- [ ] Donor selects receiver
- [ ] Receiver sees request/recommendation
- [ ] Receiver accepts
- [ ] Donor sees acceptance
- [ ] Pickup scheduled
- [ ] Both see status
- [ ] Donation completed

---

# 🏆 FINAL END-TO-END TEST

Use this as the final acceptance test.

## Test Data — Donor

```text
Restaurant ABC

120 vegetarian meals

Pickup:
4:30–5:30 PM
```

## Test Data — Receiver

```text
Community Kitchen

Capacity:
150 meals

Vegetarian:
YES

Distance:
2.1 km

Verified:
YES
```

## Expected Flow

```text
DONOR
  ↓
Create Donation
  ↓
AI
  ↓
Risk = 91%
Priority = CRITICAL
  ↓
AI
  ↓
Community Kitchen = 96%
  ↓
DONOR
  ↓
Select Receiver
  ↓
RECEIVER
  ↓
Accept
  ↓
PICKUP
  ↓
COMPLETED
  ↓
IMPACT
  ↓
+120 meals
+1 donation
+food saved
```

### Final Test Checklist

- [ ] Donor registration works
- [ ] Receiver registration works
- [ ] Donor can create donation
- [ ] AI risk analysis works
- [ ] AI priority works
- [ ] AI matching works
- [ ] AI explanation works
- [ ] Receiver sees recommendation
- [ ] Receiver accepts donation
- [ ] Donor sees acceptance
- [ ] Pickup status works
- [ ] Completion works
- [ ] Impact numbers update
- [ ] No broken routes
- [ ] No console errors
- [ ] No exposed API keys
- [ ] Demo works with prepared data
- [ ] Fallback proof is available

---

# 📋 FINAL ENTITY BOARD

```text
══════════════════════════════════════════════
              FOODBRIDGE AI
          ENTITY COMPLETION BOARD
══════════════════════════════════════════════

🟠 DONOR
[ ] D1 Registration
[ ] D2 Dashboard
[ ] D3 Create Donation
[ ] D4 Donation Management
[ ] D5 AI Integration
[ ] End-to-End Donor Flow

STATUS: ⬜ NOT READY


🟢 RECEIVER
[ ] R1 Registration
[ ] R2 Profile
[ ] R3 Dashboard
[ ] R4 Food Discovery
[ ] R5 Accept Donation
[ ] R6 Pickup
[ ] End-to-End Receiver Flow

STATUS: ⬜ NOT READY


🤖 AI
[ ] AI1 Input Engine
[ ] AI2 Surplus Risk
[ ] AI3 Matching
[ ] AI4 Priority
[ ] AI5 Explainability
[ ] AI6 Safety/Fallback
[ ] End-to-End AI Flow

STATUS: ⬜ NOT READY


🔥 INTEGRATION
[ ] Donor → AI
[ ] AI → Receiver
[ ] Receiver → Donor
[ ] Donation Lifecycle
[ ] Impact Update
[ ] Full Demo Scenario

STATUS: ⬜ NOT READY


══════════════════════════════════════════════
FINAL STATUS: ⬜ FOODBRIDGE NOT READY
══════════════════════════════════════════════
```

---

# Definition of Done

FoodBridge AI is **READY FOR DEMO** only when:

```text
🟠 DONOR      = READY
🟢 RECEIVER   = READY
🤖 AI         = READY
🔥 INTEGRATION = READY
```

Final product flow:

```text
DONOR
  │
  │ Surplus Food
  ▼
 AI ENGINE
  │
  ├── Risk Prediction
  ├── Priority
  ├── Matching
  └── Explanation
  │
  ▼
RECEIVER
  │
  │ Accept
  ▼
PICKUP
  │
  ▼
COMPLETED
  │
  ▼
IMPACT
```

**Do not add another core entity unless the problem statement or implementation genuinely requires it. Keep Donor, Receiver, and AI as the three core entities.**
