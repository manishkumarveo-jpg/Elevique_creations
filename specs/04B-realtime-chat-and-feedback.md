# 04B — Realtime Chat & Feedback
> Elevique Client Portal · Realtime Chat Channels, Live Notifications, and Message Streams

This specification defines the realtime communications dashboard that replaces external threads (Slack/WhatsApp/Email) with client-team chat logs attached to each project.

---

## 1. Thread-Based Message Schema

The `messages` table tracks individual chat lines per project. Key details:
- **Constraints**: Enforces `char_length(trim(body)) > 0` on inserts to prevent blank messages.
- **Indexes**: Includes `idx_messages_project_id` on `(project_id, created_at DESC)` for high-performance timeline loading.
- **Auditing**: Records uploader profiles (`sender_id`) and timestamps (`created_at`) automatically.

---

## 2. Supabase Realtime Channel Sync

The portal utilizes Supabase Websockets (`@supabase/supabase-js` channel client) to keep active screens synchronized in real-time.

### Connection Lifecycle

```
Client Component loads → useProjectRealtime Hook
     │
     ▼
Create Channel: `project_chat:{projectId}`
     │
     ├─► Listen for Postgres Changes (INSERT on table `messages`)
     │         │
     │         ▼
     │   Append message state → Recalculate Scroll Position
     │
     └─► Listen for Postgres Changes (UPDATE on table `milestones`)
               │
               ▼
         Trigger UI indicator status updates
```

1. **State Injection**: When a Postgres insert occurs, the hook appends the new message to the client-side component state without querying the API again.
2. **Scroll Anchors**: Auto-scroll handlers trigger upon message insertion, sliding the view frame down if the client is already near the bottom of the log.

---

## 3. UI Component Structure

- **Chat Pane Layout**: Displays uploader profile tags, message text bubbles, formatting helpers, and relative timestamps (e.g. "2 minutes ago").
- **Bubble Color Rules**:
  - Sent by Current User: Purple gradient bubble aligned to the right.
  - Received from Others: Glassmorphic dark bubble aligned to the left.
- **Offline States**: Shows visual reconnecting alerts if the WebSocket drops due to network connectivity issues.
