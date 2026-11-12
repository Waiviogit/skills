---
name: activity-comment-drafts
description: >-
  Hands comment or reply drafts for a third-party social post to a human through an
  activity note import link (agent-wallet activity_note_import_link). The human previews
  the note on the object's Activity item and saves it under their own account. Use when
  the agent prepared comment or reply variants for an Instagram, Facebook, or similar post
  on an object Activity feed that a human must review and submit, or when asked to put
  drafts into activity notes.
---

# Activity comment drafts

The agent drafts; the human reviews and posts. Human in the loop by design (platform terms, reputation). **Never auto-post** a comment or reply, and never send drafts as `osl_build_message_create` on the object channel.

The agent works only under its **own** account (e.g. `neo.agent`). Never ask for, accept, or use the human's token or login. The handoff is the import link.

## Inputs

- `objectId` — ODL object that owns the activity item.
- `messageId` — activity permalink id (`<trxId>-<txIndex>-<opIndex>-<eventIndex>`): `message_id` from query-api `get_object_channel_messages`, or the last segment of `/object/<objectId>/social/activity/<messageId>`. Confirm with `get_object_activity_message` when unsure.

## Handoff

1. Write the note (shape below).
2. agent-wallet `activity_note_import_link({ objectId, messageId, body })` → `{ url, urlLength, bodyLength }`. No auth, no network.
3. Reply in chat with a 2–3 line summary plus the `url`. Do not paste the whole note into chat.

The human opens the link signed in as themselves, previews the note, and clicks **Save to my notes**, which stores a private copy under the human's account. Nothing is saved until they click.

The note text travels inside the link: anyone with the link can read it. Never put secrets, keys, or private contact data in it.

## Note shape

````markdown
**Context** · opportunity: <why reply> · first touch: <yes/no> · confidence: <low/med/high> · risk: <what could go wrong>

<one or two lines of reasoning, outside any fence>

**A**
```
<variant A exactly as it should be posted>
```

**B**
```
<variant B>
```
````

- Each variant goes in its own triple-backtick fenced block. The web shows a Copy button on every code block, so the fence holds only the text to post.
- Reasoning, context and labels stay outside the fences.
- One note per opportunity (post or reply thread); one note per variant only when the user asks.
- Max 20 000 characters of markdown. When `urlLength` is very large (over ~8000), some chat apps cut links — split into several notes.

## Agent's own copy (optional)

Only for the agent's records, e.g. to remember it already drafted for this item:

- `activity_notes_create({ messageId, body })` — stored under the agent's account, invisible to humans; 10 notes per activity item per account.
- `activity_notes_list` / `activity_notes_update` / `activity_notes_delete` / `activity_notes_delete_all` manage those copies.
- Needs Waivio auth for the agent's account (`waivio_auth_start`). These tools never hand anything to a human.

## Related

- [object-activity](../object-activity/SKILL.md) — recording social posts on the object Activity feed
- [hive-has-agent-wallet](../hive-has-agent-wallet/SKILL.md) — agent-wallet setup and Waivio auth
- [query-api-mcp-routing](../query-api-mcp-routing/SKILL.md) — activity reads (`get_object_channel_messages`)
