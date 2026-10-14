// ---- "How Taler works" diagram animation ----------------------------------
// Drives the coin through the inline assets/diagram.svg (#diagram) with GSAP.
// Each fragment inside #diagram carries data-step; steps run strictly in order
// through a queue, so fast key presses can't overlap animations. Stepping back
// (or re-entering the slide) resets the diagram to its first state.

const stepQueue = [];
let isProcessing = false;
let animationInitialized = false;

// Hook the reveal events once (svg.js calls this every time the SVG is injected).
function initAnimation() {
	if (animationInitialized) return;
	animationInitialized = true;

	Reveal.on('fragmentshown', e => {
		// Only fragments that belong to the diagram.
		const container = document.getElementById('diagram');
		if (!e.fragment || !container || !container.contains(e.fragment)) return;
		enqueueStep(e);
	});

	Reveal.on('fragmenthidden', () => {
		if (Reveal.getCurrentSlide().querySelector('#diagram')) resetDiagram();
	});

	Reveal.on('slidechanged', e => {
		if (e.currentSlide.querySelector('#diagram')) resetDiagram();
	});
}

function enqueueStep(event) {
	// Skip a fragment already queued/run.
	if (event && event.fragment && event.fragment.dataset && event.fragment.dataset.processed) return;
	stepQueue.push(event);
	processQueue();
}

async function processQueue() {
	if (isProcessing) return;
	isProcessing = true;

	while (stepQueue.length) {
		await handleStep(stepQueue.shift());
	}

	isProcessing = false;
}

// Back to the first state: coin at start, anonymous coin hidden, all fragments hidden.
function resetDiagram() {
	const coin = document.getElementById('coin');
	const anon = document.getElementById('anon-coin');

	if (!coin || !anon) return;

	gsap.killTweensOf('*');
	gsap.set([coin, anon], { x: 0, y: 0 });
	gsap.set(coin, { opacity: 1 });
	gsap.set(anon, { opacity: 0 });
	gsap.set('#wallet-overlay', { opacity: 0 });

	stepQueue.length = 0;
	isProcessing = false;

	// Clear processed flags so the animation can run again.
	const container = document.getElementById('diagram');
	if (container) {
		container.querySelectorAll('[data-step]').forEach(el => {
			if (el.dataset) delete el.dataset.processed;
		});
	}

	const { h, v } = Reveal.getIndices();
	Reveal.slide(h, v, -1);
}

// One data-step = one leg of the coin's journey.
async function handleStep(event) {
	if (!event || !event.fragment) return;
	if (event.fragment.dataset && event.fragment.dataset.processed) return;
	if (event.fragment.dataset) event.fragment.dataset.processed = '1';

	const step = event.fragment.dataset.step;
	const coin = document.getElementById('coin');
	const anon = document.getElementById('anon-coin');

	switch (step) {

		case 'wallet':
			showWallet();
			break;

		case 'wire-money1':
			await move(coin, 'Reserve');
			break;

		case 'withdraw':
			await move(anon, 'exchange', 0);
			await move(coin, 'exchange');
			await crossfade(coin, anon);
			await move(anon, 'wallet-group');
			break;

		case 'pay':
			await move(anon, 'merchant');
			break;

		case 'deposit':
			await move(anon, 'exchange');
			break;

		case 'wire-money2':
			await crossfade(anon, coin);
			await move(coin, 'bankm');
			break;
	}
}

function getCenter(el) {
	const b = el.getBBox();
	return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
}

// Translate `el` so its centre lands on the centre of #targetId.
function move(el, targetId, duration = 0.8) {
	return new Promise(res => {
		const t = document.getElementById(targetId);
		if (!t) return res();

		const c1 = getCenter(el);
		const c2 = getCenter(t);

		gsap.to(el, {
			duration,
			x: c2.x - c1.x,
			y: c2.y - c1.y,
			ease: 'power2.inOut',
			onComplete: res
		});
	});
}

function crossfade(a, b, duration = 1.5) {
	return new Promise(res => {
		gsap.timeline({ onComplete: res })
			.to(a, { opacity: 0, duration }, 0)
			.to(b, { opacity: 1, duration }, 0);
	});
}

function showWallet() {
	gsap.set('#wallet-overlay', { opacity: 1 });
}
