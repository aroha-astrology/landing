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

## Astrology illustrations still needed (10)

In October 2026 the team supplied 94 illustrated drafts for the astrology
articles. 27 are in use (`public/assets/blog/illustrations/`). For these ten
articles every draft had a visible error (misspelt or invented labels, a
file name printed as the title, wrong figures), so they keep their
code-generated art until a clean image arrives.

Most errors came from the model writing its own text. These prompts give
the exact words to draw and forbid everything else.

### Style block (paste first)

> I'm going to ask you for a series of blog header illustrations for a Vedic
> astrology site. Landscape 16:9. One consistent style: aged parchment or a
> deep navy night sky, fine gold and ink line work, calm and uncluttered.
> Draw ONLY the exact words I put in quotes, spelled exactly as given.
> No other text anywhere: no extra labels, no numbers, no Devanagari, no
> captions, no file names, no signatures. If a label won't fit, leave it out
> rather than changing it. No real people's faces.

| File | Prompt |
| --- | --- |
| `27-nakshatras-list.png` | A ring divided into 27 equal segments around a crescent Moon on a navy night sky. Each segment holds one small gold star cluster and no writing. Title, exactly: "The 27 Nakshatras". |
| `dhan-yoga-wealth-vedic-astrology.png` | A North Indian diamond-style birth chart drawn in gold on parchment, two of its houses softly glowing, with a small pile of gold coins and a brass kalash beside it. Nothing written inside the chart. Title, exactly: "Dhan Yoga". |
| `navagraha-nine-planets-vedic-astrology.png` | Nine round medallions in a 3×3 grid on parchment, each a simple icon: the Sun, a crescent Moon, red Mars, green Mercury, large yellow Jupiter, white Venus, ringed Saturn, a serpent's head, a serpent's tail. One label under each, exactly, in this order: "Surya", "Chandra", "Mangala", "Budha", "Guru", "Shukra", "Shani", "Rahu", "Ketu". Title, exactly: "Navagraha". |
| `rashi-vs-nakshatra.png` | Two wheels side by side on a navy sky. Left wheel: 12 equal segments, one zodiac glyph in each. Right wheel: 27 equal segments, one small star in each, a crescent Moon at the centre. Text, exactly: "Rashi" above the left wheel and "12 signs" below it; "Nakshatra" above the right wheel and "27 lunar mansions" below it. |
| `retrograde-planets-vedic-astrology.png` | Five planets on concentric orbits around a small Sun, on parchment, each with a short curved arrow pointing backwards along its orbit. No planet labels. Title, exactly: "Retrograde Planets". Subtitle, exactly: "Vakri Grahas". |
| `sade-sati-saturn-transit.png` | A zodiac wheel of 12 segments with a crescent Moon in one segment. That segment and the one on each side of it are shaded, and ringed Saturn travels across the three along a curved arrow. Title, exactly: "Sade Sati". Subtitle, exactly: "Saturn's seven and a half years". |
| `vimshottari-dasha-guide.png` | A ring split into nine arcs of unequal length, clockwise, in the proportions 7, 20, 6, 10, 7, 18, 16, 19, 17. One label on each arc, exactly, in that order: "Ketu 7", "Venus 20", "Sun 6", "Moon 10", "Mars 7", "Rahu 18", "Jupiter 16", "Saturn 19", "Mercury 17". Centre text, exactly: "120 years". Title, exactly: "Vimshottari Dasha". |
| `vedic-astrology-yoga-planetary-combinations.png` | A birth-chart wheel in gold on parchment with pairs of planet icons joined by glowing lines (the Moon with Jupiter, the Sun with Mercury), to show planets combining. Nothing written inside the chart. No yoga postures and no people exercising. Title, exactly: "Yogas in Vedic Astrology". |
| `what-is-a-moon-sign.png` | A large crescent Moon inside a zodiac wheel of 12 segments that hold only the zodiac glyphs, one segment highlighted, on a navy night sky. Title, exactly: "What Is a Moon Sign?". One label under the Moon, exactly: "Chandra Rashi". |
| `what-is-kundli-birth-chart.png` | A North Indian diamond-style kundli drawn in red and black ink on aged cream paper, lying on a wooden desk beside a brass compass and an old book, in warm light. The twelve houses of the chart are empty: nothing written on the paper at all. |

Check each result before sending it: every word spelled as given, nothing
extra written anywhere, and for the dasha ring all nine labels present once.
