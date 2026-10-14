/* ==========================================================================
 *  theme.js  —  ALL EDITABLE COLOURS
 * ==========================================================================
 *  The one file to edit for the deck's colours. Reload the browser after
 *  editing. A colour is inside the quotes; change it and it updates everywhere.
 *
 *  Two palettes below share the brand blue; DARK swaps the "paper" colours
 *  (backgrounds, text, card surfaces). Switch the whole deck with the MODE line
 *  below the palettes ('light' | 'dark'), or per visit with ?theme=dark in the
 *  URL, or live with the top-right toggle button (logic/theme-toggle.js).
 *
 *  Photo and black slides are theme-independent on purpose.
 * ========================================================================== */

window.TALER = {

	/* THEMES — slide colours, published as --taler-* CSS vars. */
	themes: {
		light: {
			blue:     '#0042b3',                  // brand blue (headings, accents, links)
			blueHover: '#0054e5',                 // link hover
			bg:       '#ffffff',                  // slide background ("paper")
			text:     '#222222',                  // body text
			heading:  '#222222',                  // default heading text
			tint:     'rgba(0, 66, 179, 0.255)',  // translucent blue pill/panel (#0042b341)
			card:     '#ffffff',                  // card surface
			cardBorder: '#d8e2f3',                // 1px card border
			cardShadow: 'rgba(0, 66, 179, 0.12)', // card drop shadow
			gradFrom: '#0042b3',                  // title gradient start (right)
			gradTo:   '#222222',                  // title gradient end (left)
			stripeFrom: '#0042b3',                // section band (assets/section.html) start (right)
			stripeTo: '#222222',                  // section band end (left)
			gradTextFrom: '#0042b3',              // slide-title gradient TEXT start (right), as in gnufi-www
			gradTextTo: '#222222',                // slide-title gradient text end (left)
		},
		dark: {
			blue:     '#5b8def',                  // brighter brand blue so it reads on dark
			blueHover: '#8db0f5',
			bg:       '#0e1626',
			text:     '#dbe3f2',
			heading:  '#eaf0fb',
			tint:     '#1b2436',                  // tinted pills/panels become cards (styles/sections.css adds the border)
			card:     '#1b2436',
			cardBorder: '#3a4d75',                // bright enough to outline cards on the dark bg
			cardShadow: 'rgba(0, 0, 0, 0.7)',
			gradFrom: '#0042b3',                  // gradient stays blue→black (white text on top)
			gradTo:   '#050b16',
			stripeFrom: '#0042b3',
			stripeTo: '#16223a',                  // band fades into a navy just above bg, not black
			gradTextFrom: '#bbd0f3',              // bright blue→ice so title text reads on dark (gnufi-www)
			gradTextTo: 'rgb(81, 113, 174)',
		},
	},

	/* DIAGRAM — colour roles inside the SVG diagrams (assets/*.svg), published
	 * as --diagram-* vars. Each SVG keeps its original colour as the var()
	 * fallback, so light mode matches the source files exactly. Coin yellow and
	 * the teal keys are left hard-coded: they read on both themes. */
	diagram: {
		light: {
			brand:   '#0042b3',                   // blue strokes, text, filled nodes
			surface: '#fff',                      // node fills / text on blue
			panel:   '#c6d6ee',                   // light-blue backing panels
			tint:    '#0042b341',                 // translucent blue pills
			ink:     '#000',                      // "How Taler works" dark strokes
			muted:   '#999',                      // muted wires
			muted2:  '#ccc',                      // lighter muted marks
			bg:      'white',                     // fade overlay (= slide background)
			text:    '#000',                      // labels with no fill (SVG default black)
			paper:   'none',                      // envelope body (light: the white slide shows through)
			paperGreen: 'none',                   // green (derived) envelope body
			letter:  '',                          // letter in open envelopes ('' = each SVG's own colour)
			icon:    '#0042b3',                   // icon inside agent nodes (Customer, Merchant, …) = brand
			reserve: '',                          // "Reserve" bubble ('' = its light-blue gradient)
			green:   '#39b54a',                   // derived-coin green (refresh derive)
			washBlue: '',                         // translucent panels, per hue ('' = the SVG's own tint)
			washGreen: '',
			washTeal: '',
			washGold: '',
			washOpacity: '',                      // … and their opacity ('' = the SVG's own)
			washStroke: '',                       // … and border ('' = none)
			washShadow: '',                       // … and shadow ('' = none)
			keyboxYellow: '',                     // frame around a key/lock pair, per key colour:
			keyboxLime: '',                       //   keybox* = fill, keyframe* = border
			keyboxTeal: '',                       //   ('' = surface fill / brand border)
			keyframeYellow: '',
			keyframeLime: '',
			keyframeTeal: '',
			coinRefreshed: '',                    // refreshed ($5) coin on "Re-obtaining" ('' = coin yellow)
			cardBorder: '',                       // coin card borders (coin-struc, withdraw) ('' = brand)
			card:    '',                          // coin card fill (coin-struc, withdraw) ('' = surface)
		},
		dark: {
			brand:   '#5b8def',
			surface: '#2a3a5c',                   // node fill: above the cards (#1b2436) and bg; text on blue turns dark
			panel:   '#1b2436',                   // backing panels are cards in dark (= --taler-card)
			tint:    'rgba(91, 141, 239, 0.25)',
			ink:     '#c7d2e6',
			muted:   '#7d8aa3',
			muted2:  '#48566f',
			bg:      '#0e1626',
			text:    '#dbe3f2',
			paper:   '#1b2436',                   // filled envelope (= card): darker than the nodes/cards drawn on it
			paperGreen: '#1b3a2c',                // green envelope: matches the green key panels
			letter:  '#d6e0f3',                   // letter pulled out of an envelope: light paper
			icon:    '#dbe3f2',                   // node icons match the label text
			reserve: '#2a3a5c',                   // solid node colour instead of the light gradient
			green:   '#a3e635',                   // lime: reads better than grass green on navy
			washBlue: '#1b2436',                  // translucent tints become cards (= --taler-card),
			washGreen: '#1b2436',                 // whatever their hue
			washTeal: '#1b2436',
			washGold: '#1b2436',
			washOpacity: '1',
			washStroke: '#3a4d75',                // card border (= --taler-card-border)
			washShadow: 'url(#card-shadow)',      // card shadow (SVG filter in index.html)
			keyboxYellow: '#3b3418',              // key frames take their keys' colour: dark tint fill…
			keyboxLime: '#26381a',
			keyboxTeal: '#163a40',
			keyframeYellow: '#fbd63b',            // …and a border in the key colour itself
			keyframeLime: '#a3e635',              // (= green above)
			keyframeTeal: '#65c8d0',
			coinRefreshed: '#a3e635',             // lime, like the derived keys
			cardBorder: '#34497a',                // softer than brand so the cards don't glow
			card:    '#0e1626',                   // cards inset to bg so they read against the blue-wash panel
		},
	},

	/* MODE — the one switch: 'light' or 'dark', then reload. ?theme= overrides. */
	MODE: 'light',

	mode: 'light',   // current mode; set by applyTheme()

	// Copy a theme onto TALER, publish the CSS vars, tag <html data-theme>.
	applyTheme: function (mode) {
		this.mode = this.themes[mode] ? mode : 'light';
		Object.assign(this, this.themes[this.mode]);
		document.documentElement.setAttribute('data-theme', this.mode);
		this.applyCssVars();
		this.applyDiagramVars();
	},

	// Publish the palette as --taler-* vars (camelCase -> kebab-case) and drive
	// the reveal.js theme vars (styles/theme.css reads these).
	applyCssVars: function () {
		const t = this.themes[this.mode];
		const root = document.documentElement.style;
		Object.keys(t).forEach(function (k) {
			root.setProperty('--taler-' + k.replace(/([A-Z])/g, '-$1').toLowerCase(), t[k]);
		});
		root.setProperty('--taler-gradient', 'linear-gradient(to left, ' + t.gradFrom + ', ' + t.gradTo + ')');
		root.setProperty('--taler-text-gradient', 'linear-gradient(to left, ' + t.gradTextFrom + ', ' + t.gradTextTo + ')');
		root.setProperty('--r-background-color', t.bg);
		root.setProperty('--r-main-color', t.text);
		root.setProperty('--r-heading-color', t.heading);
		root.setProperty('--r-link-color', t.blue);
		root.setProperty('--r-link-color-hover', t.blueHover);
	},

	// Publish the diagram colours as --diagram-* vars (muted2 -> --diagram-muted-2),
	// read by the inline-injected SVGs.
	applyDiagramVars: function () {
		const d = this.diagram[this.mode];
		const root = document.documentElement.style;
		Object.keys(d).forEach(function (k) {
			root.setProperty('--diagram-' + k.replace(/([A-Z0-9])/g, '-$1').toLowerCase(), d[k]);
		});
	},
};

// Apply MODE (or ?theme=) immediately — before the partials are injected — so
// the whole deck is drawn once with the selected palette.
(function () {
	const fromUrl = new URLSearchParams(location.search).get('theme');
	window.TALER.applyTheme(fromUrl || window.TALER.MODE);
})();
