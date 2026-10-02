# Blog image prompts (for ChatGPT image generation)

Every article already has an original, code-generated hero
(`scripts/blog-art/`). The astrology heroes are diagrams (charts, wheels,
dashas), and those suit the subject. The Vastu and Puja articles would gain
the most from warmer, photographic imagery. This file lists one prompt per
article for those 20 posts, plus 3 category covers.

## How to use

1. Open ChatGPT (image generation) and paste the **style block** once, then
   one article prompt at a time.
2. Ask for **landscape 16:9** (1536×864 or larger). If ChatGPT only
   offers 1536×1024, that works too; it's cropped to 16:9 when added.
3. Reject any image with: text or lettering, logos, watermarks, a recognisable
   real person, a deity's face in close-up, or anything that looks like a real
   brand's product.
4. Save each as `<slug>.png`, exactly as the filename below, and send the
   files back (or put them in `Aroha-Promo/blog/`). They'll be converted to
   WebP and wired in, and the code-generated art is kept as the fallback.

Images you generate with ChatGPT are yours to use commercially under
OpenAI's terms. They're recorded in `public/assets/LICENSES.md` as
"AI-generated for Aroha" when added.

## Style block (paste first)

> I'm going to ask you for a series of blog header images for an Indian
> Vastu and Puja knowledge site. Keep one consistent style across all of
> them: warm, natural, editorial photography with the look of a quiet
> lifestyle magazine. Soft window light or diya light, shallow depth of
> field, a calm composition with empty space on the left third for layout.
> Palette: sandstone, terracotta clay, brass, marigold saffron, deep
> maroon, off-white plaster. Real, lived-in contemporary Indian homes, not
> palaces or temples. No text, no lettering, no logos, no watermarks. No
> identifiable faces: show hands, backs or figures out of focus only. No
> close-ups of deities' faces. Landscape 16:9.

## Vastu (10)

| File | Prompt |
| --- | --- |
| `what-is-vastu-shastra.png` | An architect's desk by a window: a hand-drawn floor plan on cream paper with a faint 9×9 grid over it, a brass compass, a pencil and a small clay diya, morning light across the paper. |
| `vastu-directions-explained.png` | A brass magnetic compass on a sandstone floor inside a bright home, sunlight entering from a window on the right, long soft shadows on the floor. |
| `main-entrance-vastu.png` | A carved wooden main door of a modern Indian flat, slightly open, a marigold and mango-leaf toran above it, a rangoli at the threshold, morning light spilling out. |
| `bedroom-vastu.png` | A calm bedroom with a wooden bed, headboard against a solid plaster wall, white and terracotta linen, soft light from a side window, no clutter. |
| `kitchen-vastu.png` | A clean Indian home kitchen with a gas stove on a stone counter, brass and steel utensils, a window above the sink, warm morning light. |
| `living-room-vastu.png` | A bright, uncluttered living room: low sofa along the back wall, handwoven rug, a plant in the corner, sheer curtains glowing with daylight. |
| `pooja-room-vastu.png` | A small wooden pooja mandir in a corner of a home, a lit diya and fresh marigolds on its shelf, soft light, the mandir's interior out of focus. |
| `vastu-for-flats-apartments.png` | A modern apartment building in an Indian city at golden hour, balconies with plants, seen from a low angle, sky clear. |
| `how-to-read-floor-plan-vastu.png` | Hands holding a printed apartment floor plan over a wooden table, a pencil marking a grid on it, a phone and a compass beside it. |
| `common-vastu-mistakes.png` | A cluttered corner of a home entrance (shoes, bags, a dead plant) in soft light, shot so it reads as "worth tidying", not as squalor. |

## Puja (10)

| File | Prompt |
| --- | --- |
| `what-is-puja.png` | A lit clay diya on a brass plate with marigold petals, incense smoke curling upward, a dark warm background. |
| `how-to-do-puja-at-home.png` | A brass puja thali seen from above on a red cloth: kumkum, turmeric, rice, a small diya, betel leaf and flowers, one hand placing a flower. |
| `griha-pravesh-puja.png` | The doorway of a new home with a brass kalash, mango leaves and a coconut on the threshold, a marigold toran above, a family out of focus inside. |
| `vastu-shanti-puja.png` | A small havan kund with a bright fire, ghee being offered from a wooden spoon by a hand, a coloured-powder mandala on the floor beside it. |
| `vahan-puja-new-vehicle.png` | The front of a new, unbranded car garlanded with marigolds, a small kumkum mark on the bonnet, lemons at the front wheels, a quiet street. |
| `samskaras-life-milestone-pujas.png` | A baby's small hand resting on a brass plate of rice during a naming ceremony, marigolds and a diya around it, faces out of frame. |
| `mantra-shloka-stotra-aarti-difference.png` | A five-wick brass aarti lamp held in motion, trails of warm light in a dark room, a bell in soft focus. |
| `puja-samagri-list.png` | A flat lay on red cloth of puja samagri: coconut, kalava thread, camphor, incense sticks, bowls of kumkum, turmeric and sandalwood, rice, betel leaves, flowers. |
| `how-to-book-pandit-for-puja-at-home.png` | A pandit seen from behind, in a white dhoti and saffron shawl, arranging items for a puja on the floor of a family's living room, family members out of focus. |
| `business-opening-puja.png` | A small shop's rolling shutter half-raised in the morning, a marigold toran above, two diyas and a small Ganesh idol (seen from the side, not the face) on the step. |

## Category covers (3)

| File | Prompt |
| --- | --- |
| `cover-astrology.png` | A clear night sky over rooftops of an Indian town, the Milky Way visible, one warm window lit below. |
| `cover-vastu.png` | Morning light crossing a sandstone courtyard of a contemporary Indian home, an open centre, plants at the edges. |
| `cover-puja.png` | Rows of lit diyas on steps at dusk, marigold garlands, warm bokeh. |

## Astrology illustrations still needed (2)

In October 2026 the team supplied 94 illustrated drafts for the astrology
articles, then 10 more made from the prompts that used to be listed here.
35 are in use (`public/assets/blog/illustrations/`). These two articles keep
their code-generated art: the second attempts still had errors (a misspelt
and repeated sign name; an app screenshot with invented Devanagari).

Set the image shape to **landscape 16:9** in the tool itself before
generating. The second batch came out portrait (9:16) and had to be centred
on a blurred backdrop to fit the hero frame.

### Style block (paste first)

> A blog header illustration for a Vedic astrology site. Landscape, 16:9,
> wider than tall. A single flat illustration that fills the whole frame:
> not a photo of a screen, not a phone or app screenshot, no interface
> icons. Aged parchment or a deep navy night sky, fine gold and ink line
> work, calm and uncluttered. Draw ONLY the exact words I put in quotes,
> spelled exactly as given. No other writing of any kind: no sign names, no
> numbers, no Devanagari or other script, no captions, no signatures.

| File | Prompt |
| --- | --- |
| `sade-sati-saturn-transit.png` | A zodiac wheel of 12 equal segments. Each segment holds one zodiac glyph and nothing else: no sign names anywhere on the wheel. A crescent Moon sits in one segment; that segment and the one on each side of it are tinted gold, and ringed Saturn moves across those three along one curved arrow. Title, exactly: "Sade Sati". Subtitle, exactly: "Saturn's seven and a half years". |
| `vedic-astrology-yoga-planetary-combinations.png` | A round birth-chart wheel of 12 empty segments in gold line on parchment. Four small planet icons sit in it: a crescent Moon joined to Jupiter by a glowing line, and the Sun joined to Mercury by a glowing line. The wheel has no writing and no numbers at all. No yoga postures, no people. Title, exactly: "Yogas in Vedic Astrology". |

Check each result before sending it: wider than tall, every word spelled as
given, and nothing else written anywhere.
