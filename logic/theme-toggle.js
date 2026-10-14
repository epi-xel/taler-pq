// ---- Theme toggle ---------------------------------------------------------
// Small sun/moon button fixed to the top-right of the window (outside the
// scaled slides, so it sits in the same corner on every slide). A click
// switches light <-> dark live: theme.js republishes the colour vars, then the
// few things painted once at load are redone (dark photo backgrounds, themed
// <img> SVGs, the section-band iframes). The choice goes into ?theme= so a
// reload keeps it. The slides switch instantly; only the button's icon animates.

// Apply a theme; resolves once the recoloured <img> SVGs are in place.
function setTheme(mode) {
	// Instant switch: suspend CSS transitions (reveal fragments have
	// `transition: all`, which would fade every colour) until the new colours
	// have been painted, two frames later.
	const root = document.documentElement;
	root.classList.add('theme-switching');
	requestAnimationFrame(function () {
		requestAnimationFrame(function () { root.classList.remove('theme-switching'); });
	});
	window.TALER.applyTheme(mode);
	applyThemedBackgrounds();
	const images = Promise.all(themeImages());
	if (window.Reveal && Reveal.isReady && Reveal.isReady()) Reveal.sync();
	// Band iframes read the theme on load; ask the live ones to re-read it.
	document.querySelectorAll('.reveal .backgrounds iframe').forEach(function (frame) {
		try { if (frame.contentWindow.applyParentTheme) frame.contentWindow.applyParentTheme(); }
		catch (e) { /* not loaded yet: it reads the theme when it loads */ }
	});
	const url = new URL(location.href);
	url.searchParams.set('theme', window.TALER.mode);
	history.replaceState(null, '', url);
	updateThemeToggle(true);
	return images;
}

// animate: spin the new icon in (on a click, not on page load).
function updateThemeToggle(animate) {
	const button = document.getElementById('theme-toggle');
	if (!button) return;
	const dark = window.TALER.mode === 'dark';
	button.innerHTML = '<i class="bi ' + (dark ? 'bi-sun-fill' : 'bi-moon-fill') + (animate ? ' spin-in' : '') + '"></i>';
	button.title = dark ? 'Switch to light mode' : 'Switch to dark mode';
	button.setAttribute('aria-label', button.title);
}

(function createThemeToggle() {
	const button = document.createElement('button');
	button.id = 'theme-toggle';
	button.type = 'button';
	// Not focusable: Space/arrow keys must keep driving the deck after a click.
	button.tabIndex = -1;
	button.addEventListener('click', function () {
		setTheme(window.TALER.mode === 'dark' ? 'light' : 'dark');
		button.blur();
	});
	document.body.appendChild(button);
	updateThemeToggle();
})();
