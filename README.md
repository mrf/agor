# Agor: Agent Orchestrator

> **Tagline:** "Agor orchestrates agents—manage session trees, coordinate multiple AI coding tools, and unlock collaborative development workflows."

**Pronunciation:** "AY-gore"

**Status:** Design Document v1.0  
**Project:** Open Source (Apache 2.0)  
**Organization:** Tembo  
**Date:** October 2025

---

## Executive Summary

The Vision: Build the orchestration layer that sits above all agentic coding tools. One UI (and framework) to rule over all agents.

Five fundamental primitives:

1. **Session** - Everything is a session. Fork, spawn, navigate workflows as trees.
2. **Task** - User prompts are tasks. Checkpoint work, track git state.
3. **Report** - Post-task hooks generate structured learnings automatically.
4. **Worktree** - Git worktrees for session isolation (optional but powerful).
5. **Concept** - Modular context nuggets, compose into session-specific knowledge.

**The Core Insight:**
> Context engineering isn't about prompt templates—it's about managing sessions, tasks, and concepts as first-class composable primitives stored in a session tree.

**Why This Wins:**
- **Platform play** - Orchestrates all agents, doesn't compete with them
- **Developer-centric** - Git-aware, visual tools, report-driven
- **Open source** - Community-driven, vendor-neutral

---

## Picture The Experience

**The canvas:** A visual tree of all your coding sessions—past, present, and parallel.

```
┌─ Session A (Claude Code) ──────────────────────┐  RUNNING
│  "Build authentication system"                  │
│  📍 feature/auth @ b3e4d12                      │
│  📦 [auth, security, api-design]                │
│                                                  │
│  ✓ Task 1: Design JWT flow                     │
│  ⚡ Task 2: Implement endpoints (in progress)   │
│                                                  │
│  ├─ Session B (forked @ Task 1) ───────┐        │
│  │  "Try OAuth 2.0 instead"            │  IDLE  │
│  │  📍 feature/oauth @ c5f6e23          │        │
│  │  ✓ Task 3: Implement OAuth           │        │
│  │                                       │        │
│  └─ Session C (spawned @ Task 2) ──────┐        │
│     "Design user database schema"      │  DONE  │
│     Agent: Gemini                       │        │
│     📍 main @ d7g8h34                   │        │
│     📦 [database, security]             │        │
│     ✓ Task 4: Schema design             │        │
└─────────────────────────────────────────┘
```

**One click:** Jump into any session. Resume conversations. Fork at decision points. Spawn focused subtasks.

**One view:** See which sessions succeeded, which stalled. Understand your exploration tree at a glance.

**One library:** All reports, all learnings, searchable. "Show me all OAuth implementations." "What worked for database migrations?"

**One workspace:** Claude Code for backend, Cursor for frontend, Gemini for schemas—all orchestrated, all visible, all tracked.

**This is Agor: One UI to rule them all.**

---

## The Session Tree: Agor's Core Artifact

**The session tree is Agor's fundamental artifact** - a complete, versioned record of all agentic coding sessions in your project.

### What Is A Session Tree?

A session tree is a repository that stores:
- **All sessions** - Every conversation with every agent
- **Complete genealogy** - Fork and spawn relationships between sessions
- **Git integration** - Which sessions produced which code (git refs, SHAs, worktrees)
- **Task history** - Granular checkpoint of every user prompt and agent response
- **Reports** - Structured learnings extracted from each task
- **Concepts** - Modular context library used across sessions
- **Actor tracking** - Who initiated which sessions/tasks

### Why The Session Tree Matters

**It's observable:**
- Visualize the entire tree of explorations
- See which paths succeeded, which failed
- Understand decision points and branches
- Can explore others' session trees for learning
- For CI/remote tasks, can introspect what happened

**It's interactive:**
- Manage multiple sessions in parallel, from a single pane of glass
- Hop across multiple sessions easily
- Fork any session at any task
- Spawn new sessions from existing context
- Navigate between related sessions

**It's shareable:**
- Push/pull like git (federated)
- Collaborate on shared trees
- Learn from others' successful patterns

**It's versioned:**
- Track evolution over time
- Audit trail of AI-assisted development
- Replay historical sessions

### The Session Tree As Git's Companion

```
Your Project:
├── .git/              # Code repository (git)
│   └── Your code's version history
│
└── .agor/             # Session tree (agor)
    ├── sessions/      # Conversation history
    ├── concepts/      # Context library
    └── Metadata linking sessions ↔ code
```

**Git tracks code. Agor tracks the conversations that produced the code.**

Together, they provide complete provenance:
- "This commit came from Session A, Task 3"
- "Session B forked from Session A at this decision point"
- "These 5 sessions explored alternatives, Session C won"

### Session Tree Operations

Just like git has core operations (clone, commit, push, pull), Agor has session tree operations:

- **Create** - Start new sessions
- **Fork** - Branch sessions at decision points
- **Spawn** - Delegate subtasks to child sessions
- **Merge** - Combine learnings from parallel sessions (v2)
- **Push** - Share session tree with team
- **Pull** - Sync others' sessions into your tree
- **Prune** - Remove failed/abandoned sessions
- **Visualize** - Render tree structure graphically

### Example Session Tree

```
my-auth-project/
  Session A: "Build auth system" (Claude Code)
  ├─ Task 1: Design @ a4f2e91
  ├─ Task 2: Implement JWT @ b3e4d12
  │
  ├─ Session B (fork from Task 1): "Try OAuth instead"
  │   └─ Task 3: Implement OAuth @ c5f6e23
  │
  └─ Session C (spawn from Task 2): "Design user table"
      └─ Task 4: DB schema @ d7g8h34
```

This tree tells the story:
- Started with JWT approach (Session A)
- Forked to explore OAuth (Session B)
- Spawned DB work as subtask (Session C)
- All sessions linked to git commits
- Complete provenance

---

## Core Information Architecture

### Current State: Agentic Coding Tools Are Islands

**Developers face:**
1. **Tool fragmentation** - Claude Code, Cursor, Codex, Gemini all have separate CLIs
2. **Session blindness** - No visibility into session genealogy (forks, lineage)
3. **Context chaos** - Monolithic CLAUDE.md files, unclear what to load when
4. **Git disconnect** - Session state and code state drift apart
5. **Lost knowledge** - No capture of what works, what doesn't, why decisions were made
6. **Single-threaded** - Can't easily run multiple sessions in parallel

**What developers need:**
> "I want to explore two architectural approaches in parallel, track which git commits came from which session, capture learnings automatically, and share successful patterns with my team—without juggling terminal windows and losing context."

---

## Core Information Architecture

Agor is built on five primitives that compose into powerful workflows:

### 1. Session: The Universal Container

**Everything is a session.** Sessions are nodes in a tree, each representing an active conversation with an agentic coding tool.

#### Key Properties

```python
Session:
  session_id: str              # From agent SDK
  agent: str                   # "claude-code", "codex", "gemini"
  git_ref: str                 # Git SHA at session start
  worktree_path: str | None    # Optional isolated workspace
  concepts: list[str]          # Loaded context modules
  tasks: list[str]             # Ordered task IDs
  
  # Genealogy
  forked_from_session_id: str | None   # Divergent path
  parent_session_id: str | None        # Spawned subtask
```

#### Two Relationship Types

**Fork** - Divergent exploration, inherits full history:
```
Session A: "Try REST API"
└─ Session B (fork): "Try GraphQL instead"
   └─ Inherits full context up to fork point
```

**Spawn** - New context window, delegated subtask:
```
Session A: "Build auth system"
└─ Session C (spawn): "Design DB schema"
   └─ Fresh context, focused concepts
```

#### Why Sessions Are The Foundation

- Universal abstraction across all agents
- Enables fork/spawn semantics
- Tracks lineage and decision points
- Git-aware by default
- Composable (sessions contain sessions)

---

### 2. Task: User Prompts as Checkpoints

**Every user prompt creates a task.** Tasks are contiguous message ranges within a session, providing checkpoint granularity.

#### Key Properties

```python
Task:
  task_id: str
  session_id: str
  description: str               # User's prompt/goal
  message_range: [int, int]      # [start, end] indices
  
  # Git state tracking
  git_sha: str                   # Clean: "a4f2e91"
                                 # Dirty: "a4f2e91-dirty"
  
  model: str                     # Can change mid-session
  report_template: str | None    # Post-task report type
  status: "created" | "running" | "completed" | "failed"
```

#### Git State Tracking

Tasks automatically capture git state as they start:

```
Task 1: "Implement auth"
├─ Start: a4f2e91 (clean)
├─ Agent makes changes → a4f2e91-dirty
├─ User commits → b3e4d12 (clean)
└─ Complete: b3e4d12

Task 2: "Add OAuth"
├─ Start: b3e4d12 (clean)
└─ Agent working → b3e4d12-dirty
```

#### Why Tasks Matter

- Provide checkpoint granularity (fork from any task)
- Track git evolution alongside conversation
- Enable structured reporting per work unit
- Make sessions scannable (task descriptions > raw messages)
- Create audit trail (who did what when)

---

### 3. Report: Structured Learning Capture

**Post-task hooks generate reports.** After each task completes, Agor can automatically extract learnings using customizable templates.

#### Report Templates

Defined in user-land as Markdown, JSON, or YAML:

**Generic fallback:** `task-summary.md`
```markdown
# Task Summary

## Goal
[What was the objective?]

## Approach
[How was it tackled?]

## Outcome
[What was the result?]

## Learnings
[What would you do differently?]
```

**Domain-specific examples:**

`bug-fix.md`:
```markdown
# Bug Fix Report

## Problem
[What was broken?]

## Root Cause
[Why did it happen?]

## Solution
[How was it fixed?]

## Prevention
[How to avoid in future?]
```

`feature.yaml`:
```yaml
feature_name: string
user_story: string
implementation_approach: string
edge_cases_handled: list[string]
tests_added: boolean
documentation_updated: boolean
```

`research.md`:
```markdown
# Research Report

## Question
[What were we investigating?]

## Findings
[What did we learn?]

## Recommendations
[What should we do?]

## References
[Sources consulted]
```

#### Generation Process

1. Task completes
2. Agor forks session **ephemerally**
3. Adds report generation prompt:
   ```
   "Summarize this task using the following template:
   [template content]
   
   Review the conversation history and produce a structured report."
   ```
4. Agent produces report
5. Report saved to `task_metadata.report`
6. Ephemeral session discarded

#### Why Reports Matter

- **Capture tacit knowledge** automatically (no manual documentation burden)
- **Build searchable task library** (find similar past work)
- **Enable pattern recognition** (what approaches work?)
- **Feed team learning** (onboarding, best practices)
- **Audit trail** (understand decisions made)

---

### 4. Worktree: Isolated Git Workspaces

**Agor can manage git worktrees** for session isolation. This is optional but unlocks parallel workflows.

#### What Is A Worktree?

Git's built-in feature for multiple working directories from one repo:

```bash
# Traditional: one working directory
~/my-project (main branch)

# Worktrees: multiple working directories
~/my-project (main branch)               # Primary worktree
~/my-project-auth (feature/auth branch)  # Additional worktree
~/my-project-ui (feature/ui branch)      # Additional worktree
```

Each worktree:
- Has its own checkout of the repo
- Can be on different branches
- Shares .git database (efficient)
- Works independently (no conflicts)

#### Agor's Worktree Management

**Automatic creation:**
```bash
agor session start \
  --agent claude-code \
  --worktree feature-auth
```
→ Creates worktree at `../my-project-auth`
→ Checks out new branch `feature-auth`
→ Session runs in isolated environment

**Session-worktree binding:**
```python
Session:
  worktree_path: "../my-project-auth"
  git_ref: "feature/auth @ a4f2e91"
```

**Automatic cleanup:**
When session completes or is pruned, worktree can be automatically removed.

#### Parallel Workflows

```
Main worktree: ~/my-project (main branch)

Session A → ~/my-project-auth (feature/auth)
Session B → ~/my-project-graphql (feature/graphql)
Session C → ~/my-project-tests (main)
```

All sessions work independently, no git conflicts.

#### Why Worktree Awareness Matters

- **Parallel sessions** don't interfere with each other
- **Clean separation** of experimental work
- **Agents work in isolation** (each has own file state)
- **Easy cleanup** (delete worktree = delete experiment)
- **Branch-per-session** workflows become natural

---

### 5. Concept: Modular Context Nuggets

**Concepts are self-referencing knowledge modules** stored as Markdown files in `context/`.

#### Structure

```
context/
├── auth.md           # Authentication patterns
├── security.md       # Security best practices
├── database.md       # DB design patterns
├── api-design.md     # REST/GraphQL patterns
├── testing.md        # Test strategies
├── performance.md    # Optimization techniques
└── deployment.md     # DevOps patterns
```

#### Concept Files

Concepts can reference other concepts using wiki-style links:

**`auth.md`:**
```markdown
# Authentication

Related: [[security]], [[api-design]], [[database]]

## Overview
Authentication is the process of verifying user identity.

## Common Patterns

### JWT Tokens
See [[api-design]] for token handling in REST APIs.
See [[security]] for token expiration and refresh strategies.

### OAuth 2.0
See [[security]] for OAuth security considerations.

### Database Considerations
See [[database]] for secure password storage patterns.

## Best Practices
1. Always use HTTPS (see [[security]])
2. Implement rate limiting (see [[api-design]])
3. Use prepared statements (see [[database]])
```

**`security.md`:**
```markdown
# Security

Related: [[auth]], [[api-design]], [[database]]

## Threat Models
- OWASP Top 10
- Authentication bypass
- SQL injection (see [[database]])
- XSS attacks

## Best Practices
1. Principle of least privilege
2. Defense in depth
3. Security by default
...
```

#### Loading Concepts Into Sessions

**Explicit loading:**
```bash
agor session start \
  --concepts auth,security,api-design
```
→ Loads 3 concept files into session context

**Recursive loading (follow references):**
```bash
agor session start \
  --concepts auth \
  --recursive
```
→ Loads `auth.md`
→ Follows `[[security]]`, `[[api-design]]`, `[[database]]`
→ Loads entire concept subgraph

**Dynamic loading (task-level):**
```bash
# Session starts with auth concepts
agor session start --concepts auth

# Task 2 needs database work, add concept
agor task start --add-concepts database
```

#### Why Concepts Matter

**De-structured CLAUDE.md:**
- Break monolithic context file into composable pieces
- Each concept is focused, maintainable
- Version control shows concept evolution

**Session-specific context:**
- Load only what's needed (avoid context bloat)
- Auth task: load `auth`, `security`, `api-design`
- DB task: load `database`, `security`, `performance`

**Self-documenting codebase:**
- Concepts evolve with code
- New patterns captured as concepts
- Team knowledge base grows organically

**Team-shared knowledge:**
- Concepts are version-controlled
- Everyone contributes to concept library
- Onboarding: "Read these 5 concepts first"

#### Concept Evolution Strategy

**Start small (5-10 core concepts):**
- `core.md` - Project overview
- `architecture.md` - System design
- `api-design.md` - API patterns
- `database.md` - Data patterns
- `testing.md` - Test strategies

**Grow organically:**
- Add concepts as patterns emerge
- Extract from successful tasks ("this worked well, make it a concept")
- Team proposes new concepts via PR

**Refactor concepts:**
- Split when too large (>500 lines)
- Merge when redundant (two concepts doing same thing)
- Rename for clarity (evolve terminology)

**Build concept graph:**
- Rich references between concepts
- Concept dependency visualization
- Find isolated concepts (need more links)

---

## How The Primitives Compose

### Example: Building Authentication Feature

#### Phase 1: Main Session

```bash
agor session start \
  --agent claude-code \
  --concepts auth,security,api-design \
  --worktree feature-auth
```

**Result:**
- Session A created
- Concepts loaded into context
- Worktree `../my-project-auth` created
- Git ref: `feature/auth @ a4f2e91`

**Task 1: Design**
```
User: "Design JWT authentication flow"
```
- Task 1 starts, captures SHA: `a4f2e91`
- Agent designs auth flow
- Task 1 completes
- Report generated using `design.md` template

**Task 2: Implementation**
```
User: "Implement the JWT auth endpoints"
```
- Task 2 starts, captures SHA: `a4f2e91-dirty`
- Agent writes code
- User commits changes
- SHA updates to `b3e4d12`
- Task 2 completes
- Report generated using `feature.md` template

---

#### Phase 2: Fork for Alternative

```bash
agor session fork <session-a> --from-task 1
```

**Result:**
- Session B created (forked from Task 1)
- Inherits context up to design phase
- New worktree `../my-project-oauth`

**Task 3: Alternative Implementation**
```
User: "Implement OAuth 2.0 instead of JWT"
```
- Different implementation path
- Same design context
- Parallel exploration

---

#### Phase 3: Spawn for Subtask

```bash
agor session spawn <session-a> \
  --agent gemini \
  --concepts database,security
```

**Result:**
- Session C created (child of A)
- Fresh context window
- Different agent (Gemini)
- Focused concepts (database only)

**Task 4: Database Work**
```
User: "Design user table schema with secure password storage"
```
- Focused DB work
- Agent doesn't see API design context (not needed)
- Completes efficiently
- Returns to Session A with results

---

#### Phase 4: Review Tree

**Visual representation:**
```
Session A (Claude Code, feature-auth worktree)
│ Concepts: [auth, security, api-design]
│
├─ Task 1: "Design JWT auth" @ a4f2e91 ✓
│   └─ Report: design-task1.md
│
├─ Task 2: "Implement JWT" @ b3e4d12 ✓
│   └─ Report: feature-task2.md
│
├─ Session B (fork from Task 1)
│   │ Concepts: [auth, security, api-design]
│   │
│   └─ Task 3: "Implement OAuth" @ b3e4d12 ✓
│       └─ Report: feature-task3.md
│
└─ Session C (spawn from Task 2)
    │ Concepts: [database, security]
    │ Agent: Gemini
    │
    └─ Task 4: "Design user table" @ c5f6e23 ✓
        └─ Report: design-task4.md
```

---

#### Phase 5: Extract Learnings

**Reports generated:**
1. Design report (Task 1) - Architectural decisions
2. Feature report (Task 2) - JWT implementation details
3. Feature report (Task 3) - OAuth implementation comparison
4. Design report (Task 4) - Database schema rationale

**Team insights:**
- Spawning DB tasks to Gemini worked well (consider pattern)
- Fork before implementation enables architecture exploration
- Loading focused concepts (database only) sped up Task 4

**Knowledge capture:**
- Create new concept: `oauth.md` (from Task 3 learnings)
- Update `auth.md` to reference both JWT and OAuth patterns
- Add to team playbook: "Fork at design phase for alternatives"

---

## Product Vision

### V1: Local Orchestration (Months 0-9)

**Core Features:**
- Desktop GUI (Electron/Tauri)
- Multi-agent session management
- Visual session tree canvas
- Concept management UI
- Git/worktree integration
- Report generation
- Local-only (no cloud)

**Philosophy:** "Local-first, visual, Git-aware"

**Target:** Individual developers and small teams

---

### V2: Collaborative Orchestration (Months 9-18)

**Additional Features:**
- Cloud-hosted sessions
- Real-time multi-player
- Shared environments (Codespaces-style)
- Team concept libraries
- Pattern recommendations
- Session analytics

**Philosophy:** "Collaborative vibe coding"

**Target:** Teams building complex systems together

---

## Information Architecture: Storage

### Directory Structure

```
my-project/
├── .git/                    # Git repository
├── .agor/                   # Agor metadata
│   ├── config.json          # Agor configuration
│   │
│   ├── sessions/            # Session metadata
│   │   ├── session-abc123/
│   │   │   ├── metadata.json
│   │   │   ├── tasks/
│   │   │   │   ├── task-001.json
│   │   │   │   └── task-002.json
│   │   │   └── reports/
│   │   │       ├── task-001-report.md
│   │   │       └── task-002-report.yaml
│   │   └── session-def456/
│   │       └── ...
│   │
│   └── concepts/            # Concept library
│       ├── auth.md
│       ├── security.md
│       ├── database.md
│       └── ...
│
└── src/                     # Your code
```

---

### Session Metadata

**`.agor/sessions/session-abc123/metadata.json`:**
```json
{
  "session_id": "abc123",
  "agent": "claude-code",
  "agent_version": "1.2.3",
  "created_at": "2025-10-01T10:00:00Z",
  "status": "completed",
  
  "git_state": {
    "ref": "feature/auth",
    "base_sha": "a4f2e91",
    "current_sha": "b3e4d12"
  },
  
  "worktree": {
    "path": "../my-project-auth",
    "managed_by_agor": true
  },
  
  "concepts": ["auth", "security", "api-design"],
  
  "genealogy": {
    "forked_from_session_id": null,
    "fork_point_task_id": null,
    "parent_session_id": null,
    "spawn_point_task_id": null,
    "children": ["def456"]
  },
  
  "tasks": ["task-001", "task-002"],
  "message_count": 37,
  "last_updated": "2025-10-01T10:30:00Z",
  
  "native_session_path": "~/.claude/projects/my-project/abc123.jsonl"
}
```

---

### Task Metadata

**`.agor/sessions/session-abc123/tasks/task-001.json`:**
```json
{
  "task_id": "task-001",
  "session_id": "abc123",
  "description": "Implement JWT authentication",
  "status": "completed",
  
  "message_range": {
    "start_index": 0,
    "end_index": 15,
    "start_timestamp": "2025-10-01T10:00:00Z",
    "end_timestamp": "2025-10-01T10:15:00Z"
  },
  
  "git_state": {
    "sha_at_start": "a4f2e91",
    "sha_at_end": "b3e4d12",
    "commit_message": "feat: implement JWT auth"
  },
  
  "model": "claude-sonnet-4",
  
  "report": {
    "template": "feature.md",
    "path": ".agor/sessions/abc123/reports/task-001-report.md",
    "generated_at": "2025-10-01T10:15:30Z"
  },
  
  "created_at": "2025-10-01T10:00:00Z",
  "completed_at": "2025-10-01T10:15:00Z"
}
```

---

## Key Design Decisions

### 1. Everything Is A Session
- Universal abstraction
- Composable (sessions contain sessions)
- Fork and spawn semantics
- Git-aware by default

### 2. Tasks Are Checkpoints
- One per user prompt
- Git state tracking
- Report generation hooks
- Forkable at task level

### 3. Reports Are First-Class
- Automatic generation
- Customizable templates
- Structured learning capture
- Searchable task library

### 4. Worktrees Enable Parallelism
- Optional but powerful
- Session isolation
- No git conflicts
- Easy cleanup

### 5. Concepts Are Modular
- De-structured CLAUDE.md
- Self-referencing graph
- Session-specific loading
- Team knowledge base

---

## Success Criteria

### V1 Success (Month 9)
- ✅ 5,000 GitHub stars
- ✅ 1,000 weekly active users
- ✅ 3 supported agents (Claude Code, Codex, Gemini)
- ✅ 50 community concept templates
- ✅ 100+ task reports generated daily

### V2 Success (Month 18)
- ✅ 100 paying teams
- ✅ 10,000 cloud sessions/month
- ✅ Real-time collaboration working
- ✅ Team concept libraries thriving
- ✅ Pattern recommendations valuable

---

## Why "Agor"?

**Pronunciation:** "AY-gore" (like "Hodor")

**Why it works:**
- Short, memorable, personal
- Natural acronym: **Ag**ent **Or**chestrator
- Playful (Hodor holds the door, Agor orchestrates agents)
- Brandable (agor.dev, agor.sh)
- Unique (no conflicts)

**Tagline:** "Agor orchestrates agents"

---

## Next Steps

### Immediate (Weeks 1-2)
1. Set up GitHub repo (apache 2.0)
2. Design core data models (Session, Task, Report, Concept)
3. Create initial README + roadmap
4. Spike: Wrap Claude Code CLI

### Months 1-3 (MVP)
5. Build desktop GUI (Electron + React)
6. Implement session canvas
7. Build CLI (Python)
8. Session + Task storage
9. Basic fork/spawn
10. Git integration (track SHAs)

### Months 3-6 (Feature Complete)
11. Concept management UI
12. Report generation system
13. Worktree management
14. Multi-agent support
15. Community templates
16. Launch v1.0

### Months 9-12 (V2)
17. Cloud infrastructure
18. Real-time collaboration
19. Shared environments
20. Pattern intelligence
21. Freemium launch

---

*Agor - Agent Orchestrator. Built by developers, for developers.*
