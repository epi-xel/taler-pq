// App entry point (loaded last from index.html): load the logic scripts in
// order, then startApp(). theme.js/gsap are already loaded via static tags.

// Disable GSAP lag-smoothing: after the tab is backgrounded, GSAP's "catch up"
// can lock the diagram animation for seconds.
if (window.gsap && gsap.ticker && typeof gsap.ticker.lagSmoothing === 'function') {
	gsap.ticker.lagSmoothing(0);
}

const LOGIC_SCRIPTS = [
	'logic/section-loader.js',
	// diagram.js before svg.js (svg.js calls its initAnimation()).
	'logic/sections/diagram.js',
	'logic/svg.js',
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
		loadSVGs();
		Reveal.initialize({
			width: 1280,
			height: 720,
			hash: true,
			preloadIframes: true,
			autoAnimateUnmatched: false,
			autoAnimateDuration: 0.5,
			autoAnimateStyles: ['opacity', 'color'],
			plugins: [RevealMarkdown, RevealHighlight, RevealNotes],
			controls: 'speaker'
		});
	});
}
