// ---- Split gradient titles --------------------------------------------------
// A heading split into pieces (so one piece can auto-animate on its own, e.g.
// "Post-quantum | t-unique signatures | ?") would paint the text gradient once
// per piece. For .split-title headings, size each piece's gradient to the whole
// title and shift it by the piece's offset, so the pieces read as one gradient
// while each still carries its own background through the morph.

// Offset of `el` inside `root`, from layout offsets: unaffected by reveal's
// scaling and by the transforms auto-animate applies mid-morph.
function splitOffset(el, root) {
	let x = 0;
	for (let n = el; n && n !== root.offsetParent; n = n.offsetParent) x += n.offsetLeft;
	for (let n = root; n && n !== root.offsetParent; n = n.offsetParent) x -= n.offsetLeft;
	return x;
}

function layoutSplitTitles(slide) {
	if (!slide) return;
	slide.querySelectorAll('.split-title').forEach(title => {
		const pieces = Array.from(title.querySelectorAll(':scope > .taler-title'));
		if (!pieces.length) return;
		const first = splitOffset(pieces[0], title);
		const last = pieces[pieces.length - 1];
		const span = splitOffset(last, title) + last.offsetWidth - first;
		pieces.forEach(p => {
			p.style.setProperty('--split-w', span + 'px');
			p.style.setProperty('--split-x', (first - splitOffset(p, title)) + 'px');
		});
	});
}

Reveal.on('ready', e => layoutSplitTitles(e.currentSlide));
Reveal.on('slidechanged', e => layoutSplitTitles(e.currentSlide));
