// ---- SVG loader -----------------------------------------------------------
// Injects assets/<id>.svg INLINE into the element with that id. Inline (not
// <img>) so the SVGs use the page's Montserrat, follow the --diagram-* theme
// vars, and diagram.js can animate their inner elements.
const SVGS = [
	'coin-struc',
	'payment1',
	'payment2',
	'cheat1',
	'cheat2',
	'cheat3',
	'blind-sig1',
	'blind-sig2',
	'blind-sig3',
	'withdraw1',
	'withdraw2',
	'withdraw3',
	'diagram',
	'refresh-prot',
	'refresh-derive',
	'pq-idea',   // contains HTML (foreignObject): only renders inline, not standalone
	'rand',
	'tsig',
	'new-rd',
	'reveal-ex',
];

function loadSVGs() {
	const loads = SVGS.map(function (name) {
		const container = document.getElementById(name);
		if (!container) return Promise.resolve();

		// Already injected: don't re-fetch (DOM churn janks the animation on resume).
		if (container.innerHTML.trim().length > 0) return Promise.resolve();

		return fetch('assets/' + name + '.svg')
			.then(r => r.text())
			.then(svg => {
				container.innerHTML = svg;
				if (name === 'diagram') initAnimation();
			});
	});

	Promise.all(loads.concat(themeImages())).then(() => {
		// Reveal may exist but not be ready yet (init runs right after this call).
		const relayout = () => { Reveal.layout(); Reveal.sync(); };
		if (Reveal.isReady && Reveal.isReady()) relayout();
		else Reveal.on('ready', relayout);
	});
}

// <img data-themed> can't read CSS vars, so in dark mode fetch the SVG, resolve
// each var(--diagram-x, fallback) to the current value, and swap in a data URL.
// Light mode keeps the original files (the fallbacks are the light colours).
function themeImages() {
	if (window.TALER.mode === 'light') return [];
	const rootStyle = getComputedStyle(document.documentElement);
	const imgs = document.querySelectorAll('img[data-themed]:not([data-themed="done"])');
	return Array.from(imgs).map(function (img) {
		img.setAttribute('data-themed', 'done');
		return fetch(img.getAttribute('src'))
			.then(r => r.text())
			.then(svg => {
				svg = svg.replace(/var\((--[\w-]+),\s*([^)]+)\)/g, function (_, name, fallback) {
					return rootStyle.getPropertyValue(name).trim() || fallback;
				});
				// Unfilled text defaults to black; lift it like the inline SVGs.
				svg = svg.replace('<svg', '<svg style="fill: ' + rootStyle.getPropertyValue('--diagram-text').trim() + '"');
				img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
			});
	});
}

// Re-run on viewport changes that can re-lay the slide (no-op fetches by then).
['orientationchange', 'resize', 'pageshow'].forEach(function (evt) {
	window.addEventListener(evt, function () { setTimeout(loadSVGs, 120); });
});
