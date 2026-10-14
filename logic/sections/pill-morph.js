// ---- Pill morph across slides -----------------------------------------------
// A pill with data-morph="name" morphs into the pill with the same name on
// the next/previous slide. With the same text, each word flies to its place in
// the new line breaks; different text crossfades. The real pills are hidden
// while copies fly above both slides: the slides crossfade underneath, so the
// copies must not live inside either.

const PILL_MORPH_DURATION = 0.7;

// Layout position/size inside .reveal .slides: offset* ignore reveal's scaling
// and slide transforms, so both slides share the same coordinate space.
function pillBox(el, slides) {
	let x = 0, y = 0;
	for (let n = el; n && n !== slides; n = n.offsetParent) {
		x += n.offsetLeft;
		y += n.offsetTop;
	}
	return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight };
}

// A fragment pill only counts once it has been shown.
function pillVisible(el) {
	return !el.classList.contains('fragment') || el.classList.contains('visible');
}

function morphPill(from, to) {
	const slides = document.querySelector('.reveal .slides');
	const a = pillBox(from, slides);
	const b = pillBox(to, slides);

	// Empty clone of the destination pill: just the box, which slides/resizes.
	const clone = to.cloneNode(false);
	clone.removeAttribute('data-morph');
	clone.classList.remove('fragment', 'visible', 'current-fragment');
	Object.assign(clone.style, {
		position: 'absolute', left: 0, top: 0, margin: 0, maxWidth: 'none',
		overflow: 'hidden', zIndex: 100, pointerEvents: 'none',
	});
	slides.appendChild(clone);

	// Same text: each word flies from its spot in the old pill's lines to its
	// spot in the new pill's lines. Otherwise the two texts crossfade.
	const fromWords = wrapWords(from);
	const toWords = wrapWords(to);
	const sameText = fromWords.length === toWords.length &&
		fromWords.every((w, i) => w.textContent === toWords[i].textContent);
	const flying = sameText ? fromWords.map(w => flyingWord(w, slides)) : [];

	from.style.visibility = 'hidden';
	to.style.visibility = 'hidden';
	const done = () => {
		clone.remove();
		flying.forEach(w => w.remove());
		from.style.visibility = '';
		to.style.visibility = '';
	};

	const tl = gsap.timeline({ onComplete: done, onInterrupt: done })
		.fromTo(clone,
			{ x: a.x, y: a.y, width: a.w, height: a.h },
			{ x: b.x, y: b.y, width: b.w, height: b.h, duration: PILL_MORPH_DURATION, ease: 'power2.inOut' });

	if (sameText) {
		flying.forEach((w, i) => {
			const p = pillBox(fromWords[i], slides);
			const q = pillBox(toWords[i], slides);
			tl.fromTo(w, { x: p.x, y: p.y },
				{ x: q.x, y: q.y, duration: PILL_MORPH_DURATION, ease: 'power2.inOut' }, 0);
		});
	} else {
		const oldText = centredText(from, a);
		const newText = centredText(to, b);
		clone.append(oldText, newText);
		tl.to(oldText, { opacity: 0, duration: 0.35, ease: 'none' }, 0.1)
			.fromTo(newText, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'none' }, 0.25);
	}
}

// Wrap every word of el in a span (once), keeping inline markup like <strong>.
function wrapWords(el) {
	if (!el.dataset.wordsWrapped) {
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		const nodes = [];
		while (walker.nextNode()) nodes.push(walker.currentNode);
		nodes.forEach(node => {
			const frag = document.createDocumentFragment();
			node.textContent.split(/(\s+)/).forEach(part => {
				if (!part) return;
				if (/^\s+$/.test(part)) {
					frag.appendChild(document.createTextNode(part));
				} else {
					const w = document.createElement('span');
					w.className = 'morph-word';
					w.textContent = part;
					frag.appendChild(w);
				}
			});
			node.replaceWith(frag);
		});
		el.dataset.wordsWrapped = '1';
	}
	return Array.from(el.querySelectorAll('.morph-word'));
}

// Free-floating copy of a word (same font/colour), placed above the slides.
function flyingWord(word, slides) {
	const st = getComputedStyle(word);
	const w = document.createElement('span');
	w.textContent = word.textContent;
	Object.assign(w.style, {
		position: 'absolute', left: 0, top: 0, margin: 0, padding: 0,
		whiteSpace: 'nowrap', zIndex: 101, pointerEvents: 'none',
		font: st.font, color: st.color, letterSpacing: st.letterSpacing,
		lineHeight: word.offsetHeight + 'px',
	});
	slides.appendChild(w);
	return w;
}

// Copy of el's text laid out at its own width, centred in the morphing box.
function centredText(el, box) {
	const t = document.createElement('span');
	t.innerHTML = el.innerHTML;
	const st = getComputedStyle(el);
	Object.assign(t.style, {
		position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
		width: box.w + 'px', boxSizing: 'border-box',
		padding: st.padding, textAlign: st.textAlign, lineHeight: st.lineHeight,
	});
	return t;
}

Reveal.on('slidechanged', e => {
	if (!e.previousSlide) return;
	e.currentSlide.querySelectorAll('[data-morph]').forEach(to => {
		const from = e.previousSlide.querySelector(
			'[data-morph="' + to.dataset.morph + '"]');
		if (from && pillVisible(from) && pillVisible(to)) morphPill(from, to);
	});
});
