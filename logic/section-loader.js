// ---- Section loader ------------------------------------------------------
// Each <div data-include="sections/x.html"> placeholder in index.html is
// REPLACED (not filled) with its partial's markup. Replacing keeps <section>
// nesting flat — reveal only supports horizontal > vertical, so a wrapper
// around an injected <section> would break slide indexing.
//
// Must finish before Reveal.initialize() so reveal indexes every slide. Fetches
// run in parallel but apply in document order for deterministic slide order.
window.loadSections = async function () {
	const placeholders = Array.from(document.querySelectorAll('[data-include]'));
	const htmls = await Promise.all(placeholders.map(async function (ph) {
		const src = ph.getAttribute('data-include');
		const res = await fetch(src);
		if (!res.ok) {
			console.error('Section include failed:', src, res.status);
			return null;
		}
		return await res.text();
	}));
	placeholders.forEach(function (ph, i) {
		if (htmls[i] == null) return;
		const frag = document.createRange().createContextualFragment(htmls[i]);
		ph.replaceWith(frag);
	});
};
