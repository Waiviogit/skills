---
name: object-activity
description: >-
  Write a factual digest of a social post onto an ODL object Activity channel. Use when
  recording Instagram, Facebook, or similar source posts as object-channel messages, not
  Hive posts or listing updates.
---

# Object Activity from social posts

Factual digest on the given object — not a caption clone, not a Hive post, not listing/menu/price updates.

Transport: `message_create` on the object channel — [osl-messaging](../osl-messaging/SKILL.md). Pack ≤8192. Do not broadcast until the user approves.

## When to use

- User wants a social post recorded on an object’s Activity feed.
- Source is already associated with a specific business, place, product, or person.

## When not to use

- Hive companion post or Reviews → Posts — [companion-post-workflow](../companion-post-workflow/SKILL.md).
- Leo thread — [hive-thread-create](../hive-thread-create/SKILL.md).
- Listing, menu, hours, or price updates — [object-create](../object-create/SKILL.md).

## Fetch

Do not scrape the social site from the agent IP. Use a remote vendor API. Dedup on source URL already in the object channel.

Inspect all accessible media (every carousel still; Reels: spritesheet + frames + audio). Do not IPFS or rehost social media.

- Video: official CDN versions. ffmpeg 1fps + spritesheet.
- Audio: ffmpeg WAV → local transcription. Speech goes in the description. Music-only / empty VAD: omit — do not write a transcription-limitation clause. Limitation clauses only for genuine access/tool failure.

Stamp `original_created_at_unix` (int) on every `message_create` so Activity sorts with the source post. Instagram `taken_at`. Facebook `publishTime` integer — never `creation_time` ISO. Missing stamp → skip that post.

## Observer prompt (frozen)

```
You are given a social-media post already associated with a specific object such as a business, organization, place, product, or person.

Analyze the complete post: caption, images, carousels, video or Reel across scenes, spoken audio when available, on-screen text, and supplied metadata.

Inspect all media that is accessible through the provided tools. For carousels, inspect every available image. For video or Reels, inspect the video across scenes and use available audio or transcription. Do not rely only on the thumbnail or caption when the underlying media is accessible.

Only state that media could not be inspected when a genuine technical or access limitation prevented inspection. Never use a limitation statement merely because media was not analyzed. If some media could not be inspected, mention that briefly after describing everything that was available.

Write a concise original description of what the post contains and shows. Preserve concrete details useful for later analysis: people, products, places, activities, events, dates, prices, offers, changes, and other specific facts.

Describe meaningful visual or video content, not only the caption. If the caption is thin but the media shows an interior, a dish, a person, an event, or an activity, include that.

Do not judge importance or relevance. Downstream agents will decide that.

Distinguish fact from uncertain observation. Use “appears to” when something is not clear.

Create a new factual representation of the post rather than reproducing it. Do not copy the caption or transcript. Write in your own words. Short factual details such as names, dates, prices, locations, product names, and offer terms may be kept exactly.

When mentioning a social-media account or handle, preserve its platform identity. Link the handle to its profile on the source social platform when the profile URL can be determined reliably. Never convert an external social handle into a Waivio, Hive, blockchain, or other local account link. If the correct external profile URL cannot be determined reliably, write the account name without the @ symbol.

Do not record likes, replies, views, or other engagement counts.

Do not output SKIP unless the post itself could not be retrieved.

If the post is only decorative media and has no identifiable facts, describe what is shown in one sentence. Still record the Activity. Never mention that a caption is missing, empty, or absent — just describe the media.

Keep the result compact. Output only the description, then any embeddable video/Reel/Short URL on its own line, then the original source URL if it is different from that embed URL. No headings, no labels, no preamble.

When the post is a video, Reel, or Short, include the canonical public watch URL for that platform so the Activity client can render an official embed. Never use CDN media URLs, IPFS copies, iframe HTML, or markdown images of social stills. Photo-only posts: source URL only.
```

## Output

Body = description; then embeddable watch URL on its own line when video; then permalink if different. Instagram Reels → `/reel/<code>/`; other IG → `/p/<code>/`. Never CDN media URLs, IPFS, or `![]` of social stills. Never bare `@handle` — markdown-link the source profile. Never write Uncaptioned.

## Related

- [osl-messaging](../osl-messaging/SKILL.md) — object-channel `message_create`
- [hive-blockchain-broadcast](../hive-blockchain-broadcast/SKILL.md) — sign after user approval
