/* ==========================================================================
 *  theme.js  —  ALL EDITABLE COLOURS
 * ==========================================================================
 *  The one file to edit for the deck's colours. Reload the browser after
 *  editing. A colour is inside the quotes; change it and it updates everywhere.
 *
 *  Two palettes below share the brand blue; DARK swaps the "paper" colours
 *  (backgrounds, text, card surfaces). Switch the whole deck with the MODE line
 *  below the palettes ('light' | 'dark'), or per visit with ?theme=dark in the
 *  URL. It's applied once at load.
 *
 *  Photo, black and gradient-stripe slides are theme-independent on purpose.
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
			tile:     '#ffffff',                  // icon tiles on the gradient stripe
			gradFrom: '#0042b3',                  // title gradient start (right)
			gradTo:   '#222222',                  // title gradient end (left)
		},
		dark: {
			blue:     '#5b8def',                  // brighter brand blue so it reads on dark
			blueHover: '#8db0f5',
			bg:       '#0e1626',
			text:     '#dbe3f2',
			heading:  '#eaf0fb',
			tint:     'rgba(91, 141, 239, 0.25)',
			tile:     '#1b2436',
			gradFrom: '#0042b3',                  // gradient stays blue→black (white text on top)
			gradTo:   '#050b16',
		},
	},

	/* DIAGRAM — colour roles inside the SVG diagrams (assets/*.svg), published
	 * as --diagram-* vars. Each SVG keeps its original colour as the var()
	 * fallback, so light mode matches the source files exactly. Coin yellow and
	 * the green/teal keys are left hard-coded: they read on both themes. */
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
		},
		dark: {
			brand:   '#5b8def',
			surface: '#1b2436',                   // dark card; text on blue turns dark
			panel:   '#24365c',
			tint:    'rgba(91, 141, 239, 0.25)',
			ink:     '#c7d2e6',
			muted:   '#7d8aa3',
			muted2:  '#48566f',
			bg:      '#0e1626',
			text:    '#dbe3f2',
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
