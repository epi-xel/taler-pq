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
	gsap.set([coin, anon], { x: 0, y: 0, scaleX: 1 });
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
			await flip(coin, anon);
			await moveIntoWallet(anon);
			break;

		case 'pay':
			await moveOntoNode(anon, 'merchant-circle');
			break;

		case 'deposit':
			await move(anon, 'exchange');
			break;

		case 'deanonymize':
			await move(coin, 'exchange', 0);
			await flip(anon, coin);
			break;

		case 'wire-money2':
			await moveOntoNode(coin, 'bankm-circle');
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

// Rest a coin on a node's rim, up and to the right (its centre on the circle's
// circumference), the way the pile perches on the customer's bank at the start.
// Driven off the node's circle, not its <g>, whose label drags the centre down.
const COIN_DIR_X = 0.584, COIN_DIR_Y = -0.811;  // unit vector: up and to the right
function moveOntoNode(el, circleId, duration = 0.8) {
	return new Promise(res => {
		const circle = document.getElementById(circleId);
		if (!circle) return res();

		const c1 = getCenter(el);
		const c2 = getCenter(circle);
		const r = circle.getBBox().width / 2;

		gsap.to(el, {
			duration,
			x: c2.x + COIN_DIR_X * r - c1.x,
			y: c2.y + COIN_DIR_Y * r - c1.y,
			ease: 'power2.inOut',
			onComplete: res
		});
	});
}

// Move a coin into the wallet, stopping near the top so it peeks out.
function moveIntoWallet(el, duration = 0.8) {
	return new Promise(res => {
		const wallet = document.getElementById('wallet-group');
		if (!wallet) return res();

		const c1 = getCenter(el);
		const b = wallet.getBBox();

		gsap.to(el, {
			duration,
			x: b.x + b.width / 2 - c1.x,
			y: b.y + b.height * 0.28 - c1.y,
			ease: 'power2.inOut',
			onComplete: res
		});
	});
}

// Flip coin `a` into coin `b`: `a` turns edge-on (scaleX -> 0), then `b`
// turns back from edge-on to full. Both must already share a position.
function flip(a, b, duration = 0.8) {
	return new Promise(res => {
		gsap.set(b, { opacity: 1, scaleX: 0, transformOrigin: '50% 50%' });
		gsap.set(a, { transformOrigin: '50% 50%' });

		gsap.timeline({ onComplete: res })
			.to(a, { scaleX: 0, duration: duration / 2, ease: 'power1.in' }, 0)
			.set(a, { opacity: 0 })
			.to(b, { scaleX: 1, duration: duration / 2, ease: 'power1.out' }, duration / 2);
	});
}

function showWallet() {
	gsap.set('#wallet-overlay', { opacity: 1 });
}
