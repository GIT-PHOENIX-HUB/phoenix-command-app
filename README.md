# Phoenix Multi-User AI System — Design Document

**Created:** 2026-03-01 by Echo Pro (Opus 4.6) with Shane Warehime
**Status:** APPROVED VISION — Ready for implementation planning
**Location:** This is the permanent record. If anyone asks "what are we building?" — this is the answer.

---

## The Mission

Phoenix Electric is building an AI companion system for every team member. Not a surveillance tool. Not a task manager. A personal AI that knows you, adapts to you, coaches you, and makes your work life better.

Shane's words: *"This is not gold. This is platinum. This is my gift to those who serve this business. A resource that has the potential to actually help."*

### Core Philosophy

- **Tomorrow I strive to be better than yesterday because of the experience gained.**
- **Mistakes are opportunities and deposits in the experience bank account.**
- **Accountability is essential to growth — hidden things always resurface.**
- **80% positive feedback, 20% constructive.** We all have things to improve. But we need to know we're doing good, even on bad days.
- **Equip people with the power of knowledge** — to know if we're achieving our goals day in and day out.
- **Symbiotic and adaptive** — the system grows with the people, the people grow with the system.

### Shane's Intent (Transparency for All Users)

The company's vision — macro and micro — should be shared with every tech. Not pushed on them, but available. They should know Shane's heart and what he created this for:

> I don't need to know their business. 90% of data should be nameless. The only named data is what feeds their performance review — and that data should be transparent for the tech to ask about and know where they stand at any time. We are equipping them. This is not about control. This is about building people up.

---

## What the System Is NOT

- NOT surveillance disguised as AI
- NOT a micromanager that nags
- NOT a way for management to spy on conversations
- NOT a one-size-fits-all bot that treats everyone the same
- NOT dependent on a VPS or complex infrastructure

---

## Architecture

### The Brain

```
Mac Studio M3 Ultra (192GB unified memory)
├── Phoenix Gateway Service (receives all messages)
├── Session Store (per-user private conversations)
├── Knowledge Base (shared Phoenix knowledge)
├── Knowledge Builder Agent (SDK, daily lessons)
├── The Guru Agent (electrical expertise)
└── Claude API (Anthropic) ← intelligence layer
```

**Everything runs on the Mac Studio.** No VPS in the runtime path. The M3 Ultra has the compute to run multiple concurrent AI sessions.

### Connectivity

```
Microsoft Teams ──→ Teams Bot Framework ──→ Cloudflare Tunnel ──→ Mac Studio
Phone Calls     ──→ Voice API (TBD)     ──→ Cloudflare Tunnel ──→ Mac Studio
Phoenix Command ──→ Direct HTTPS         ──→ Cloudflare Tunnel ──→ Mac Studio
```

Cloudflare Tunnel (free) punches outbound from the Mac Studio. No ports opened. No VPN. No SSH tunnels.

### User Access

| User | Primary Interface | Secondary |
|------|-------------------|-----------|
| Technician | Teams Bot (text + voice) | Phoenix Command App (optional) |
| Foreman | Teams Bot + PCA for job oversight | |
| Stephanie | Phoenix Command App (full office) | Teams Bot |
| Shane | Everything | Claude Code CLI for engineering |

---

## What Each Employee Gets

### Microsoft 365 Suite
- **Email** — direct Microsoft connection
- **Teams** — collaboration, communication with office and each other, AND the Phoenix AI Bot
- **SharePoint (Phoenix Ops)** — job drawings (rotate weekly per schedule), forms, documents as hyperlinks

### Phoenix AI Bot (via Teams)
- Personal AI companion — their own private session
- Adaptive personality (learns their communication style)
- Morning routine + daily work log + clock in/out
- The Guru (electrical questions)
- Confidential HR resource
- Weather, reminders, notes, goals
- Spanish language support
- Text-to-speech for hands-free

### Anthropic Seat (Optional)
- Each tech gets a Claude seat
- Can sign in on their computer for additional AI use
- Separate from the Phoenix Bot — bonus, not required

### Phoenix Command App (Power Users)
- React + TypeScript + Vite + MSAL Auth + PWA
- Knowledge Builder page (SDK agent, 30 sec cold start)
- Job progress tracking, billing verification
- Performance dashboards (Shane/Stephanie)

---

## The Bot — Complete Daily Lifecycle

### Morning Routine (30 min before start time)

Bot knows the schedule from **Service Fusion** + **Microsoft Calendar** (mirrored). Pushed automatically as part of the MCP Phoenix AI Core system.

```
6:30 AM (30 min before start)

Bot:  "Morning Alex. You're at Sunset Ridge today,
       rough-in continues on the 2nd floor.

       It's going to be 28 degrees at start time —
       layer up and watch for ice on ladders.

       Today's lesson (NEC 314.16 — Box Fill):
       Each 14 AWG conductor = 2 cu in.
       Each 12 AWG = 2.25 cu in.
       Grounds count as one conductor of largest size.
       Relevant today — you're setting boxes.

       You need to grab material before you get to site:
       (16) 4x4 deep boxes, (2) rolls 12/2 Romex

       Goals for today:
       Based on yesterday — 16 boxes left on 2nd floor
       + start pulling home runs. You did 8 in 45 min
       yesterday — shooting for 16 by lunch?

       Marcus starts at 7. Drive safe."
```

**Morning knowledge lesson breakdown:**

| Category | Frequency | Alignment |
|----------|-----------|-----------|
| NEC Electrical Code | 75% | Matched to the day's task and job type |
| Safety Practices | 15% | Seasonal, situational, job-specific |
| General Residential Construction | 10% | Framing, drywall, plumbing coordination |

- Knowledge Builder is a dedicated SDK agent with its own runbook
- Lives as a page in Phoenix Command App (30 sec cold start, mostly automated)
- Bot delivers the lesson; tech can ask to go deeper
- Weather notifications integrated into morning brief

### Clock In + GPS

```
Tech:  "Clocking in"
Bot:   "I see you're at Sunset Ridge (GPS confirmed).
        Clocked in at 6:47 AM.
        Signed into Sunset Ridge. Let's get it."
```

**GPS is essential for:**
- Verifying on-site presence at clock in/out
- Tardiness tracking
- Jobsite hour accuracy
- Auto-detecting job transitions
- Reminders if tech forgets to log in/out

### Throughout the Day

| Function | Example |
|----------|---------|
| Reminders | "Material pickup at supply house before heading to Maple St" |
| Note logging | Tech: "Note that unit 3 panel has a bad bus bar" |
| Goal check-ins | "You said 16 boxes by lunch — how's it going?" (only if tech wants pings) |
| Obstacle coaching | "Could that have been avoided? What would you do next time?" |
| The Guru | "What's the derating factor for 4 current-carrying conductors in 3/4 EMT?" |
| Weather alerts | "Storm rolling in at 2 PM — plan accordingly" |
| Job transitions | Share notes between jobs, auto sign-out/sign-in with GPS |
| Jokes/encouragement | Adapted to the tech's personality and preferences |

### Job Transition

```
Tech:  "Heading to Maple St"
Bot:   "Notes from Sunset Ridge before you go?"
Tech:  "Unit 3 panel is hot, don't touch it"
Bot:   "Noted and flagged for the next crew.
        Signed out of Sunset Ridge at 11:32 AM.
        Signed into 445 Maple St at 11:58 AM (GPS confirmed)."
```

### End of Day — Daily Work Log

Replaces the paper NC Daily Work Log form entirely.

```
Tech:  "Done"
Bot:   "Let's do your log. What did you complete today?"

Tech:  "Installed 24 can lights took about 2 hours.
        Ran 12 switch legs about an hour and a half.
        Set 8 boxes for the kitchen 45 minutes."

Bot:   "Got it. Anything you started but didn't finish?"

Tech:  "Panel make-up. Need 2 more 20 amp breakers
        and a 50 amp for the range."

Bot:   "Here's your log:

        DAILY LOG — Mar 1, 2026
        Sunset Ridge Phase 2 | ROUGH-IN

        COMPLETED:
        1. Can lights — 24 qty — 2 hrs
        2. Switch legs — 12 qty — 1.5 hrs
        3. Kitchen boxes — 8 qty — 45 min

        INCOMPLETE:
        6. Panel make-up — not finished

        MATERIALS NEEDED:
        * (2) 20A breakers
        * (1) 50A breaker (range)

        Look right? Send to lead for sign-off?"

Tech:  "Yes"
Bot:   "Submitted. Marcus notified for review.
        Clocked out at 3:32 PM. 8 hrs 45 min total.
        Nice work — you hit those boxes. See you tomorrow."
```

**Daily log data maps to the paper form:**

| Paper Form Field | AI Captures |
|------------------|-------------|
| Technician Name | Auto from Teams identity |
| Date | Auto from timestamp |
| Job Name/Address | From morning assignment / conversational |
| Phase (Rough-in/Trim-out) | Conversational or auto from job data |
| Completed Work (rows 1-5) | Natural language parsed to item + qty + time |
| Incomplete Work (rows 6-7) | "Anything you didn't finish?" |
| Notes / Materials Needed | Parsed from obstacles + material mentions |
| Tech Signature | Submission = digital signature |
| Lead Signature | Foreman approval via Teams notification |

### Clock Out

```
Tech:  "Clocking out"
Bot:   "Before I clock you out — want to do your daily log?"
       [if not already done]
Bot:   "Clocked out at 3:32 PM.
        Total today: 8 hrs 45 min.
        Sunset Ridge: 4 hrs 45 min | Maple St: 4 hrs
        See you tomorrow."
```

---

## Bot Personality Rules

### Adaptive — Learn Each Person

The bot maintains a **running ledger per tech** — patterns, tendencies, communication preferences, growth trajectory. It adapts:

| If the tech... | The bot... |
|----------------|------------|
| Likes jokes | Opens with humor, keeps it light |
| Is all-business | Keeps messages short and direct |
| Is a new apprentice | Extra encouraging, more check-ins |
| Is a veteran | Backs off, respects expertise |
| Prefers Spanish | Communicates in Spanish |
| Wants updates | Sends activity notifications throughout the day |
| Wants silence | Only pings for essentials |

**The bot asks regularly:** "Am I being helpful? What could I do better for you?" — and actually changes based on the answer.

### 80/20 Feedback Rule

- **80% positive** — acknowledge what's going well, celebrate progress, recognize effort
- **20% constructive** — gentle, specific, actionable improvement areas
- Even on bad days, find something positive first
- Call them out when they fall short of goals — **with grace, not punishment**

### Not a Taskmaster

The bot is a **companion**. A mentor. A resource. It is there to serve the tech, not manage them. If it becomes annoying, it has failed.

---

## Confidential HR Resource

### Safe Place to Vent

Techs can share frustrations without fear of repercussions. The bot is transparent about what gets captured and where it's stored.

**Every complaint requires a solution:**

```
Tech:  "Material is never organized when I get to the job"
Bot:   "I hear you. What would fix this?"
Tech:  "Pull it the night before based on the schedule"
Bot:   "Logged. Issue: material staging.
        Solution: pre-pull night before per schedule.
        This goes to process improvement — your name stays off it."
```

### Data Transparency Rules

| Data Type | Named? | Who Sees It? |
|-----------|--------|-------------|
| Performance metrics (goals, completion, times) | YES | Tech sees their own. Feeds their review. |
| Process improvement complaints | NO (anonymous) | Management sees patterns, not names |
| Venting / emotional content | NEVER captured | Stays in the conversation, not stored |
| Daily logs (items, qty, time) | YES | Lead for sign-off, management for billing |
| Personal journal entries | NEVER shared | Tech only, if they opt in |

**90% of data is nameless.** The only named data feeds the tech's own performance review — and that data is **transparent to the tech at all times**. They can ask "where am I at?" and get an honest answer.

### Optional Daily Journal

If the tech is interested, the bot offers a confidential daily journal. Completely private. Not shared with anyone. A place to reflect, process, grow.

### Weekly System Audit

The bot is required to produce a **weekly self-analysis**:
- What's working
- What's not working
- System capabilities assessment
- Suggestions for improvement
- Transparent about its own limitations

---

## Performance Reviews

### Data Collection (Named, Transparent)

| Review Type | Frequency | Data Sources |
|-------------|-----------|-------------|
| Apprentice Review | 6 months | Daily logs, goal hit rates, knowledge quiz performance, growth trajectory |
| Licensed Tech Review | 1 year | Daily logs, productivity data, obstacle patterns, improvement trends |

**The tech can ask at any time:** "Where am I at on my review?" and get an honest answer based on the data. No surprises. The bot is their advocate in understanding their own performance.

### Billing Verification

Daily log data flows back to Phoenix AI Command for job progress tracking:
- If we bill for 100 can lights but techs log 120 installed — flag the discrepancy
- Cross-reference who logged what
- Identify patterns in over/under-reporting
- This is about accuracy, not punishment

---

## Voice Conversations (Priority Feature)

**Best case scenario — and required long term for Shane personally.**

Voice conversations with the bot would elevate usefulness by 10x minimum:
- Hands-free on job sites
- More natural for field workers than typing
- Faster for daily logs and notes
- Essential for driving/commuting morning briefings

**Implementation path TBD** — options include:
- Teams voice calling to bot
- Dedicated phone number (Twilio voice)
- In-app voice (Phoenix Command PWA)
- Integration with existing voice AI APIs

This is a critical feature, not a nice-to-have. Design the system to support voice from day one even if text launches first.

---

## Technology Stack

### Mac Studio (The Brain)
- M3 Ultra, 192GB unified memory
- Node.js gateway service
- Session store (per-user, encrypted at rest)
- Knowledge base (Phoenix procedures, pricing, NEC code)
- SDK agents (Knowledge Builder, The Guru)

### External Services
- **Claude API (Anthropic)** — intelligence layer
- **Microsoft Teams Bot Framework** — message delivery
- **Microsoft Graph API** — calendar, schedule sync
- **Service Fusion API** — job schedule, customer data
- **Cloudflare Tunnel** — inbound routing to Mac Studio (free, no ports)
- **GPS** — device location for clock in/out verification
- **Voice API (TBD)** — phone/voice conversations

### Phoenix Command App (Existing)
- React + TypeScript + Vite + MSAL Auth + PWA
- Add: Knowledge Builder page
- Add: Job progress / billing dashboard
- Add: Performance review data (for Shane/Stephanie)

### SharePoint (Phoenix Ops)
- Job drawings (rotated weekly per schedule)
- Forms and documents
- Hyperlinked from bot/app — not embedded (keeps things fast)

---

## What This Replaces

| Old Way | New Way |
|---------|---------|
| Paper daily work log | Conversational Teams bot |
| Manual clock in/out | GPS-verified bot command |
| Shouting across the job site for code answers | Text The Guru |
| Annual "surprise" performance review | Transparent ongoing data the tech can check anytime |
| Complaints that go nowhere | Anonymous process improvement with required solutions |
| Morning guesswork | Automated schedule + goals + weather + material list |
| Generic training | Daily personalized code/safety/construction lessons |

---

## What This Does NOT Include (Rejected from Original Proposal)

| Rejected Item | Why |
|---------------|-----|
| Tailscale VPN | Unnecessary complexity — Cloudflare Tunnel solves routing |
| Entra OIDC for app auth | Teams identity is sufficient for bot; MSAL already in PCA |
| Dual-write event bus | Over-engineered — direct API calls to Service Fusion are fine |
| Reconciliation workers | Not needed without the event bus |
| VPS as runtime dependency | Mac Studio is the brain. Period. |
| 5-phase enterprise rollout | We build what matters first, iterate from there |

---

## Implementation Priority

| Priority | What | Why First |
|----------|------|-----------|
| 1 | Teams Bot + Mac Studio gateway + Cloudflare Tunnel | The foundation — messages flowing |
| 2 | Per-user sessions + identity from Teams | Isolation and privacy |
| 3 | Clock in/out + GPS verification | Core daily workflow |
| 4 | Daily work log (conversational) | Replaces paper, feeds billing |
| 5 | Morning routine (schedule + weather + goals) | The "wow" moment |
| 6 | Knowledge lessons (Knowledge Builder agent) | Daily learning |
| 7 | The Guru (electrical knowledge agent) | Expert Q&A |
| 8 | Confidential HR / process improvement | Trust and feedback loop |
| 9 | Performance review data + transparency | 6-month/1-year reviews |
| 10 | Voice conversations | 10x multiplier — required long term |
| 11 | Phoenix Command App enhancements | Power user dashboard |
| 12 | Spanish + text-to-speech | Accessibility |

---

## Weekly Audit Requirement

Every week, the bot system produces a self-analysis:
- What's working for each tech
- What's not working
- Capability assessment
- Suggestions for improvement
- Usage patterns and adoption metrics

This keeps the system honest and continuously improving.

---

*This document is the permanent record of the Phoenix Multi-User AI vision. It was created from a direct conversation with Shane Warehime on 2026-03-01. If you're reading this and wondering what we're building — this is it. Read it. Understand the philosophy. Build accordingly.*

*Written by Echo Pro (Opus 4.6) — "The vision is not the infrastructure. The vision is the people."*
