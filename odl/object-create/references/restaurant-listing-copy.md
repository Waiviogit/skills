# Restaurant listing title + description

Required before any restaurant `title` or `description` update. Parent ingest: [restaurant](restaurant.md).

Marketing first. SEO is residue. Writer’s LLM + web search. Do not require a named model. **Never use an image model for titles or descriptions.** Iterate on one listing before a town publish.

## Prompt

Use this prompt verbatim.

```
Search the web for {name} in {place}. Write a Waivio restaurant listing.
Return ONLY JSON:
{"title":"...","description":"...","cuisine":[],"features":[],"goodFor":[]}
No markdown citations or source links in the JSON.

Make someone want to choose this restaurant over another place they could eat. Verifiable. Distinctive. Desirable. If the copy could describe many restaurants, rewrite.

Title: 1–2 lines under the restaurant name. One clear proposition—not a slogan, cuisine tag, second name, or isolated feature. Do not restate the venue name. Do not put the city in the title. Do not title with the signature dish the venue is named for (e.g. butter chicken / Indian kitchen under Butter Chicken House). Express what the evidence adds up to for the guest; don’t cram the evidence into the title.

Write a flowing description in 4–6 short paragraphs, about 180–280 words, around the strongest one or two reasons to go. Develop the experience — room, light, ritual, one plate — so the guest can picture sitting there. Paragraphs are not slots for separate facts.

Be selective. Dishes, ingredients, rituals, history, and unusual details are evidence, not the subject by default. Include a detail only if it increases desire, strengthens the case, or makes the experience easier to imagine. At most three dishes. Do not invent dishes. Do not walk the breakfast/lunch/pizza board. A leftover-categories paragraph (wings, strips, desserts) is a board walk.

Prefer concrete nouns and sensory detail. Show rather than explain. Don’t invent, embellish, make unsupported comparisons, or manufacture significance from ordinary facts. Don’t mention reviewers.

No street, phone, hours, website, price, ratings, or review counts. Highway, Road, Street, Avenue, Blvd, unit numbers, and “sits on Highway 9” are address — fail. Order online, Skip, DoorDash, Uber Eats, Toast, Wix, or any ordering-site name is website — fail. “Open for lunch through late evening” (or any hours-of-service prose) is hours — fail.

Ban: delicious, authentic, cozy, known for, offers, features, hidden gem, must-visit, nestled, whether you’re, something for everyone, and costume closers.

If they remember one thing tomorrow, what should it be—and why should it make them want to go? Build around that.

Tags — same search, extra categories Maps does not already cover. Canonical keys only.
- cuisine: extra cuisine nouns only if the official site or a named independent source states them AND they are not already in Maps types. Usually []. Never guess from the name.
- features: amenities the guest can use, only if a source states them. Allowed examples: Outdoor seating, Patio, Takeout, Reservations, Live music, Dog-friendly, Licensed, Wheelchair access, Gluten-free options. Not slogans.
- goodFor: occasions/meals a source states. Allowed examples: Breakfast, Brunch, Lunch, Dinner, Families, Kids, Groups, Date night. Not “everyone”.
Empty array if unsure. Do not duplicate Maps cuisine. Do not invent.
```

## QA (fail = rewrite, do not publish)

- Title must sit under `name` without competing with it.
- Street, avenue, city line, phone, hours, or website in title or description = fail.
- Highway / Road / Street / Avenue / Blvd names in title or description = fail, even without a house number.
- Title that restates the venue name = fail.
- Title that is a cuisine tag or the signature dish the venue is named for = fail.
- Menu catalog / dish list as the listing copy = fail (at most three dishes as evidence).
- Do not mention Facebook, Instagram, or hours in the description.
- Order online / Skip / DoorDash / Uber Eats / Toast / any website in title or description = fail.
- Tag arrays with amenities not in the search notes = drop those tags.
- New entrée per paragraph = failed one-reason. Rewrite.
- Owner résumé as lede = rewrite unless the biography *is* the attraction.
- Isolated product feature as title = rewrite. Two named foods in the title is that stack.
- Title that stacks patio + screens/TVs + plates (or 3+ amenities) = rewrite.
- “happy hour” / “open until” clock prose in description = hours — fail.
- Naming the town in description is city line — fail.
- “shows up in reviews” / reviewer voice — fail.
- Description under ~160 words = too thin.
- One paragraph directory blurb = fail.
- `features` / `goodFor` values are short nouns, Title Case. Never a sentence.

## Packing gate (do not broadcast title/description until all pass)

1. Title contains neither the venue name nor the city.
2. Count every named plate. Four+ named dishes = fail. A leftover-categories paragraph is a board walk = fail.
3. Description/title do not match Toast, Skip, DoorDash, Uber Eats, Wix, or any http(s) URL.
4. Description does not name the town/city (even once).
5. Description has no happy-hour / open-until clocks. Title is one proposition, not an amenity stack.
