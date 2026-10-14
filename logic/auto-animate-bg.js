// ---- Backgrounds in step with auto-animate -----------------------------------
// Slide backgrounds crossfade on reveal's own curve (0.8s, front-loaded), so on
// an auto-animate step a differing background (e.g. the section band behind
// "Payment and Change") is mostly gone before the morph has started: it reads as
// a cut. For auto-animate steps only, give both backgrounds the morph's
// duration and easing; any other step keeps reveal's default.

// Same rule reveal uses: both slides auto-animate, same group, and the later of
// the two doesn't restart the group.
function isAutoAnimateStep(from, to) {
	if (!from || !to || from === to) return false;
	if (!from.hasAttribute('data-auto-animate') || !to.hasAttribute('data-auto-animate')) return false;
	if ((from.dataset.autoAnimateId || '') !== (to.dataset.autoAnimateId || '')) return false;
	const slides = Reveal.getSlides();
	const later = slides.indexOf(to) > slides.indexOf(from) ? to : from;
	return !later.hasAttribute('data-auto-animate-restart');
}

Reveal.on('beforeslidechange', e => {
	const from = Reveal.getCurrentSlide();
	const to = Reveal.getSlide(e.indexh, e.indexv);
	const sync = isAutoAnimateStep(from, to);
	const config = Reveal.getConfig();
	const duration = (to && to.dataset.autoAnimateDuration) || config.autoAnimateDuration;
	const easing = (to && to.dataset.autoAnimateEasing) || config.autoAnimateEasing;
	[from, to].forEach(slide => {
		const bg = slide && Reveal.getSlideBackground(slide);
		if (!bg) return;
		bg.style.transitionDuration = sync ? duration + 's' : '';
		bg.style.transitionTimingFunction = sync ? easing : '';
	});
});
