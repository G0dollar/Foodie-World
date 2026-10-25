# Foodie World

A plain HTML, CSS and JavaScript WDL mini-project. No installation, build step, framework or database is needed.

## Run

1. Extract the complete Foodie-World folder.
2. Open index.html in a modern browser.
3. Alternatively, open the folder in VS Code and use Live Server. A local server provides more consistent localStorage behaviour across browsers than file URLs.

Keep the CSS, JS and images folders alongside the HTML pages.

## Pages and scope

25 real HTML documents: four activity pages plus index.html, credits.html, suggest.html, and 18 category pages (six regions × drinks/breakies/fullies).

Each category page has three entries, for 54 entries overall. Every entry includes regional association, a diet label, ingredients and a simplified preparation overview. Food regions are used rather than geographical continent boundaries. The Middle East is a region; the Americas are grouped together.

Implemented: responsive shared layout, category and region navigation, case-insensitive name search, vegetarian filtering, random selection among visible results, native HTML expandable recipe notes, labelled form inputs, JavaScript validation and browser-local suggestion storage.

Vegetarian means no eggs, meat or fish; dairy is allowed. Labels apply to the specified versions. Recipe notes are brief educational overviews, not exhaustive recipes with quantities or timing. Cultural associations are starting points, not exclusive origin claims.

All four stretch features are now implemented: comparison, quiz, gallery and ingredient-aware converter.

## Files

- `index.html`: main page and 18 category links.
- `*-drinks.html`, `*-breakies.html`, `*-fullies.html`: static food content.
- `suggest.html`: validated form and list of locally saved suggestions.
- `credits.html`: contribution record and acknowledgements.
- `css/style.css`: shared styling and responsive breakpoints.
- `js/script.js`: shared search, vegetarian filtering and random picker.
- `js/form.js`: field validation and localStorage handling.
- `images/food-table.svg`: original decorative homepage illustration.
- `images/favicon.svg`: site icon.
- `food-data.json`: supplementary reference data; the site displays the static HTML directly and does not fetch this file.

## Before submission

Replace the clearly marked teammate names in credits.html, remove unused rows and confirm actual contributions. The code does not invent teammate identities or completed presentation work. Edit the contribution description for Samarth to reflect actual work completed. AI assistance is acknowledged.

## Form behaviour

No data is sent anywhere. A successful save adds an entry to localStorage under `foodie-world-suggestions-v1`, retaining the latest 50 entries. Suggestions do not change the main food listings. Names and text are rendered with textContent, not HTML injection. If storage is blocked or full, the form reports that saving failed and preserves the entered values.

Your name, dish name and origin require at least two non-space characters. Ingredients require at least ten. Region and category must be chosen. Fields have maximum lengths. The vegetarian checkbox is optional.

## Manual demonstration / viva checklist

1. Open the homepage and use the 18 category links.
2. On Asia Fullies, turn on Vegetarian only: the chicken dish disappears.
3. Search CHANA: only Chana Masala remains, regardless of letter case.
4. Press Surprise Me: the remaining card is highlighted and expanded.
5. Search a nonexistent name: empty state appears and Surprise Me is disabled.
6. Clear search and filter: all cards return.
7. Open Suggest a Dish, submit empty fields and inspect inline errors.
8. Complete the form with valid data and save; reload to check persistence.
9. Clear form resets fields and errors; delete saved suggestions asks for confirmation.
10. Check the homepage, food page and form at a narrow browser width.

## Implementation notes for explaining the code

`data-name` and `data-veg` on each article hold filter values. `filterCards()` combines search and checkbox conditions and uses the hidden attribute. The random picker uses Math.random and Math.floor over visible cards. `<details>` and `<summary>` provide expansion without custom JavaScript. The form prevents the default submit, validates trimmed inputs, serializes data with JSON.stringify, and saves it using localStorage.setItem. CSS Grid handles card and form layouts; media queries change the column count on smaller screens.

Use your own words to explain these concepts during the presentation.

## Credits

The Credits page uses a simple four-member contribution table without portraits. Replace bracketed names and confirm actual responsibilities before submission. Photo source credits for the food imagery are listed separately on the same page.

## Extra activities

- `compare.html`: choose two distinct food regions; compare ingredients, flavours and linked menu examples. Selecting the same region automatically chooses a different region on the other side. Swap exchanges the selections.
- `quiz.html`: five questions, four choices each, feedback and one point per correct answer. Questions refer to the website’s menu. Retrying reshuffles the session. A best score is saved locally when storage is available.
- `gallery.html`: 72 locally stored food photographs, region filter and native-dialog lightbox. Escape closes it; Left/Right move among currently visible photos. Photos and per-file licences are recorded in `images/food/ATTRIBUTION.md` and `sources.json`, as well as on the gallery and Credits pages. Gallery images depict their own versions and do not imply the vegetarian status of our recipes.
- `converter.html`: US cups ↔ grams for five ingredients and °C ↔ °F. Zero mass and negative temperatures are valid; negative mass, empty/non-finite values and temperatures below absolute zero are rejected. Results update through the Convert buttons and reset when conversion settings or values change. Small values retain meaningful precision.

New shared files: `css/extras.css`, `js/extras-data.js`, `js/conversions.js`, and `js/extras.js`. The four activity links appear on every page. Each uses regular script tags; no fetch call or server is required.

### Checks for the extras

Compare two regions; select a duplicate and verify automatic replacement; swap them; follow dish links. Complete all five quiz questions, verify the score and review, then replay. Filter the gallery, open/close images with mouse and keyboard, and check photo credits. Confirm 1 cup flour = 120 g, 198 g sugar = 1 cup, 0 °C = 32 °F, 212 °F = 100 °C, -40 °C = -40 °F, and invalid/blank amounts show errors.

## Real photographs and region collages

All 54 food cards now use real photos; the Feijoa Smoothie card explicitly uses a photograph of its main ingredient, not an unrelated prepared drink. The other 53 cards show dish/drink servings or clearly identified serving variants. Each region profile and category banner contains 12 photos: nine menu entries and three bonus foods. Clicking a collage opens that region’s twelve-photo gallery. The homepage hero uses a selection from all six regions.

The collages are native HTML/CSS grids, not generated illustrations or flattened raster composites. `css/photos.css` controls their layouts. Photographs are local assets under `images/food/`, with full author/licence/source information in `images/food/ATTRIBUTION.md`, `sources.json`, the gallery, Credits and food cards. Retain the credit lines if you reuse these photos. Existing `images/gallery/` files are retained for backwards compatibility; the new gallery uses `images/food/`.

Each photo opens in the existing gallery lightbox. Links such as `gallery.html?region=asia` select a region on load; dish links also include a photo fragment. Downloaded thumbnails and lazy loading keep the site usable offline. There are still 25 HTML pages.
