# Foodie World

**Explore the world through drinks, breakfasts, and full meals.**

Foodie World is a Web Development Laboratory mini-project built with HTML, CSS, and vanilla JavaScript. Visitors can browse regional food, explore real photographs, compare menu selections, play a short quiz, and use simple kitchen tools.

The complete project includes **25 HTML pages, 54 food entries, and 72 locally stored food photographs**. It runs without a framework, package installation, or build step.

## Quick start

### Run with VS Code Live Server

1. Extract the **complete project ZIP**. Do not run files from inside the archive.
2. In VS Code, use **File → Open Folder** and select the extracted `Foodie-World` folder.
3. Confirm that `index.html`, `css`, `js`, and `images` are directly inside that folder.
4. Right-click `index.html` and select **Open with Live Server**.
5. Explore the site in the browser tab that opens.

Use a recent browser with JavaScript enabled. Keep the server address and port consistent when checking saved suggestions and quiz scores: browser storage belongs to the current origin.

You can also open `index.html` directly. A local server is recommended because browsers can handle storage differently for `file://` pages.

**No npm commands, API keys, account, or database setup are required.** Images are bundled with the project, so displaying them does not require an internet connection. External photo-source and reference links do require internet access.

## Explore the website

Foodie World groups its content into six **food regions**: Asia, Europe, Africa, Americas, Middle East, and Oceania. These are browsing categories rather than a strict geographical continent classification.

Each region has three menu categories:

| Category | What it contains |
| --- | --- |
| Drinks | Hot and cold beverages |
| Breakies | Breakfast dishes |
| Fullies | Main meals and filling dishes |

Every category page contains three entries. Each entry includes a regional association, vegetarian label, photograph, ingredients, and expandable preparation notes.

### Main features

- **Name search:** filters food cards without distinguishing uppercase and lowercase letters.
- **Vegetarian filter:** works together with search. The project's definition excludes eggs, meat, and fish; dairy is allowed.
- **Surprise Me:** selects a currently visible card, highlights it, and opens its recipe notes.
- **Expandable recipes:** use native HTML `<details>` and `<summary>` elements.
- **Region collages:** twelve-photo previews link to the matching region in Gallery.
- **Responsive layouts:** shared styles adapt cards, forms, and navigation to smaller screens.

Food histories often cross borders. Regional labels are starting points for exploration, not exclusive claims about a dish's origin. Recipe notes are simplified educational overviews rather than complete recipes with quantities and cooking times.

### Activities and tools

| Page | What you can do |
| --- | --- |
| `compare.html` | Compare ingredients, flavour examples, and menu entries from two regions. Swap selections or follow links to their food pages. |
| `quiz.html` | Answer five questions with four choices each, receive feedback, review answers, and replay. Questions refer to where dishes appear on this website. |
| `gallery.html` | Browse 72 photographs, filter by region, and open an enlarged view. Use Previous/Next, arrow keys, or Escape in the viewer. |
| `converter.html` | Convert US cups ↔ grams for five ingredients and Celsius ↔ Fahrenheit. |
| `suggest.html` | Validate and save a food suggestion in the current browser. |

The converter uses ingredient-specific weight values: a cup of flour and a cup of sugar do not have the same weight. Cup conversions are approximate and use **US recipe cups**, not 250 mL metric cups. Temperature conversion changes units only; it does not adjust for fan ovens.

## Page structure

| Pages | Count | Filename pattern |
| --- | ---: | --- |
| Homepage | 1 | `index.html` |
| Regional menu pages | 18 | `[region]-drinks.html`, `[region]-breakies.html`, `[region]-fullies.html` |
| Suggestion form | 1 | `suggest.html` |
| Team contributions and acknowledgements | 1 | `credits.html` |
| Comparison, quiz, gallery, and converter | 4 | `compare.html`, `quiz.html`, `gallery.html`, `converter.html` |
| **Total** | **25** | |

Region filename prefixes are `asia`, `europe`, `africa`, `americas`, `middle-east`, and `oceania`.

## Files that matter

| File or folder | Purpose |
| --- | --- |
| `css/style.css` | Shared layout, typography, colours, forms, and food cards |
| `css/extras.css` | Activity navigation, comparison, quiz, gallery, and converter styles |
| `css/photos.css` | Photograph presentation and collage grids |
| `js/script.js` | Food search, vegetarian filtering, and random selection |
| `js/form.js` | Suggestion validation and browser storage |
| `js/extras-data.js` | Region and dish data used by comparison and quiz |
| `js/conversions.js` | Ingredient weights and conversion calculations |
| `js/extras.js` | Comparison, quiz, gallery, and converter interactions |
| `images/food/` | Local menu photos and collage extras |
| `images/food/ATTRIBUTION.md` | Photograph authors, licences, and source links |
| `images/food/sources.json` | Detailed image source metadata |
| `images/favicon.svg` | Browser-tab icon |
| `food-data.json` | Supplementary food-content reference |
| `design.md` | Project scope and design decisions |

The food cards are written directly in HTML. Editing `food-data.json` alone does **not** update the displayed food pages. Comparison and quiz data are maintained separately in `js/extras-data.js`.

## Suggestions and saved scores

This is a frontend project. **The suggestion form does not send data to a server or add dishes to the public menu.**

A valid suggestion is stored using `localStorage`, retaining the latest 50 entries in that browser. The quiz also saves a best score when storage is available.

| Storage key | Contents |
| --- | --- |
| `foodie-world-suggestions-v1` | Locally saved suggestions |
| `foodie-world-quiz-best` | Best quiz score |

Suggestions require a name, dish name, region, category, origin, and ingredient description. Text fields reject empty or whitespace-only values and enforce minimum lengths. The vegetarian checkbox is optional.

Clearing browser site data removes saved entries and scores. A different browser, device, server port, or website address may have separate storage. If storage is unavailable or full, the form reports the problem instead of claiming that the suggestion was saved.

## Photographs and collages

The collection contains **54 images associated with menu entries and 18 bonus food images**, with twelve photographs per region.

- Most menu images show prepared dishes or drinks. Captions identify serving variations where appropriate.
- **Feijoa Smoothie uses a clearly labelled photograph of feijoa fruit**, its main ingredient, because a suitable reusable photograph of the prepared drink was unavailable.
- Photographs may include different garnishes or toppings from the simplified recipe notes. Vegetarian labels apply to the listed recipe version.
- Collages are HTML/CSS grids of individual images. They are not flattened image files.
- A link such as `gallery.html?region=asia` opens the relevant region's collection.

Photo credits appear on food cards, in Gallery, on Credits, and in `images/food/ATTRIBUTION.md`. The viewer preserves the photograph's full proportions; preview tiles use CSS cropping.

**Retain the photograph credits, source links, and applicable licence information when sharing or modifying the project.** Individual photographs retain their stated licences; this README does not grant a blanket licence for all project content.

## Customising the project

| Change | Where to edit |
| --- | --- |
| Team names and contributions | Four-member table in `credits.html` |
| Food descriptions and recipe notes | The corresponding regional HTML page |
| Food search labels | Keep each card's `data-name` consistent with its displayed name |
| Vegetarian status | The card's `data-veg` value and visible diet label |
| Quiz or comparison content | `js/extras-data.js` |
| Ingredient conversion values | `js/conversions.js`; also update the reference table in `converter.html` |
| Colours and common spacing | `css/style.css` |
| Collage layout | `css/photos.css` |
| Photo replacements | Image path, alt text, visible credits, and source records |

Keep filenames lowercase, use hyphens instead of spaces, and preserve relative paths. When changing shared data, update related visible labels and descriptions too.

If you customise the homepage, keep navigation links to the four activities so every feature remains easy to find.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Collages are missing or unstyled | Confirm the page links to `css/photos.css` and that the file exists. Ensure you opened the newest extracted `index.html`, then try **Ctrl + Shift + R**. |
| Images show broken-image icons | Check that the full `images/food/` directory was extracted. Match each `src` to the exact filename, extension, and letter case. |
| Only part of a collage appears | Match the image count to the grid in `photos.css`. The default hero layout has 3 columns and 4 rows for 12 photos; adding more images requires adjusting the layout. |
| Activity pages look unstyled | Confirm `css/extras.css` is present and linked. |
| Search, quiz, or buttons do nothing | Enable JavaScript and check the browser console for missing scripts or errors. Activity pages need their shared data and interaction scripts. |
| Saved suggestions disappear | Use the same browser and server address/port. Check whether site data was cleared or browser storage is blocked. |
| An update seems to have no effect | Save the edited file, confirm Live Server is serving that project folder, and refresh without cache. |

For a missing asset, open browser developer tools, select **Network**, reload, and look for failed requests such as `404`. The failed URL identifies which file path needs correction.

## Demonstration checklist

A short presentation can follow this sequence:

1. Open Home and explain the six regions and three menu categories.
2. Open Asia Fullies, turn on Vegetarian only, and search for `CHANA`.
3. Use Surprise Me and expand the selected dish's preparation notes.
4. Open a region collage, filter the gallery, and demonstrate the photo viewer.
5. Compare two regions and use Swap.
6. Complete the quiz and show its score and answer review.
7. Convert 1 US cup of flour to 120 g and 212 °F to 100 °C.
8. Submit an empty suggestion form to demonstrate validation, then save a valid suggestion and reload.
9. Show the four-member contribution table and photograph acknowledgements.

These steps demonstrate multi-page navigation, semantic HTML, CSS Grid, responsive styling, DOM updates, events, form validation, and browser storage.

## Team and acknowledgements

Before submission, replace the bracketed names in `credits.html` and record each member's **actual** contribution. The Credits page uses a four-member table without member portraits.

The project uses HTML5, CSS3, and vanilla JavaScript. AI assistance was used for code and content preparation; the project author reported that AI use is permitted for this assignment.

Photographs are credited individually to their creators. Ingredient weight references come from the [King Arthur Baking Ingredient Weight Chart](https://www.kingarthurbaking.com/learn/ingredient-weight-chart).
