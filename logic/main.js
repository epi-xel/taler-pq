// App entry point (loaded last from index.html): load the logic scripts in
// order, then startApp(). theme.js/gsap are already loaded via static tags.

// Disable GSAP lag-smoothing: after the tab is backgrounded, GSAP's "catch up"
// can lock the diagram animation for seconds.
if (window.gsap && gsap.ticker && typeof gsap.ticker.lagSmoothing === 'function') {
	gsap.ticker.lagSmoothing(0);
}

const LOGIC_SCRIPTS = [
	'logic/section-loader.js',
	'logic/auto-animate-bg.js',
	// diagram.js before svg.js (svg.js calls its initAnimation()).
	'logic/sections/diagram.js',
	'logic/svg.js',
	'logic/sections/pill-morph.js',
	'logic/sections/split-title.js',
	'logic/theme-toggle.js',
];

// Load the scripts in order. async=false preserves execution order (injected
// scripts otherwise default to async).
function loadLogicScripts() {
	return LOGIC_SCRIPTS.reduce(function (chain, src) {
		return chain.then(function () {
			return new Promise(function (resolve, reject) {
				const s = document.createElement('script');
				s.src = src;
				s.async = false;
				s.onload = resolve;
				s.onerror = function () { reject(new Error('Failed to load ' + src)); };
				document.head.appendChild(s);
			});
		});
	}, Promise.resolve());
}

loadLogicScripts().then(startApp);

// Inject section partials, start filling the SVGs, then start reveal.js.
function startApp() {
	return loadSections().then(function () {
		applyThemedBackgrounds();
		loadSVGs();
		Reveal.initialize({
			width: 1280,
			height: 720,
			hash: true,
			preloadIframes: true,
			autoAnimateUnmatched: false,
			autoAnimateDuration: 0.5,
			autoAnimateStyles: ['opacity', 'color'],
			plugins: [RevealNotes],
			controls: true   // hidden in fullscreen (styles/document.css)
		});
	});
}

// In dark mode, a section's data-dark-background* attributes replace its
// data-background* ones (e.g. a photo washed to white gets a dark wash instead);
// in light the originals (kept in data-light-backgrounds) come back. Runs before
// Reveal.initialize(), and again on a theme switch followed by Reveal.sync().
function applyThemedBackgrounds() {
	const dark = window.TALER.mode === 'dark';
	document.querySelectorAll('.reveal .slides section').forEach(function (slide) {
		const darkAttrs = Array.from(slide.attributes).filter(function (attr) {
			return attr.name.indexOf('data-dark-background') === 0;
		});
		if (!darkAttrs.length) return;
		if (!slide.hasAttribute('data-light-backgrounds')) {
			const light = {};
			darkAttrs.forEach(function (attr) {
				const name = attr.name.replace('data-dark-', 'data-');
				light[name] = slide.getAttribute(name);   // null = attribute absent
			});
			slide.setAttribute('data-light-backgrounds', JSON.stringify(light));
		}
		const light = JSON.parse(slide.getAttribute('data-light-backgrounds'));
		darkAttrs.forEach(function (attr) {
			const name = attr.name.replace('data-dark-', 'data-');
			const value = dark ? attr.value : light[name];
			if (value === null) slide.removeAttribute(name);
			else slide.setAttribute(name, value);
		});
	});
}
