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
	'diagram-recap',
	'reobtain-coin',
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
				markNodeIcons(container);
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

// Tag agent nodes (Customer, Merchant, banks, A/B avatars) with .node-icon so
// document.css can recolour their icon in dark. A node is a surface-filled
// circle in a drop-shadow wrapper whose group also holds a text label; key and
// coin circles have no shadow wrapper or no label, so they're left alone.
function markNodeIcons(container) {
	const probe = document.createElement('div');
	probe.style.color = 'var(--diagram-surface)';
	container.appendChild(probe);
	const surface = getComputedStyle(probe).color;
	probe.remove();
	container.querySelectorAll('circle, ellipse').forEach(function (shape) {
		const wrapper = shape.parentNode;
		if (wrapper.children.length !== 1 || getComputedStyle(shape).fill !== surface) return;
		const node = wrapper.parentNode;
		const label = node.querySelector('text');
		if (!label) return;
		node.classList.add('node-icon');
		// Label as a hook for per-agent styling, e.g. data-node="a" (document.css).
		node.setAttribute('data-node', label.textContent.trim().toLowerCase());
	});
}

// <img data-themed> can't read CSS vars, so fetch the SVG, resolve each
// var(--diagram-x, fallback) to the current value, and swap in a data URL.
// Both modes go through this (light sets e.g. the title logo's blue fill);
// unset light vars ('') keep each SVG's fallback, i.e. the original colour.
// data-themed records the mode an image was last drawn for, so this re-runs
// cheaply (resize) and redraws only after a theme switch (logic/theme-toggle.js).
// The original file is kept in data-original-src (not data-src: reveal.js
// treats that as a lazy-load source and copies it back into src).
function themeImages() {
	const mode = window.TALER.mode;
	const rootStyle = getComputedStyle(document.documentElement);
	const imgs = document.querySelectorAll('img[data-themed]:not([data-themed="' + mode + '"])');
	return Array.from(imgs).map(function (img) {
		if (!img.dataset.originalSrc) img.dataset.originalSrc = img.getAttribute('src');
		img.setAttribute('data-themed', mode);
		return fetch(img.dataset.originalSrc)
			.then(r => r.text())
			.then(svg => {
				// Fallbacks may hold one level of parens (url(...), a nested var(...));
				// repeat so nested vars resolve outside-in.
				const VAR = /var\((--[\w-]+),\s*((?:[^()]|\([^()]*\))+)\)/g;
				for (let prev = null; prev !== svg; ) {
					prev = svg;
					svg = svg.replace(VAR, function (_, name, fallback) {
						return rootStyle.getPropertyValue(name).trim() || fallback.trim();
					});
				}
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
