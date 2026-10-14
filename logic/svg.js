svgs = ['coin-struc', 
        'payment1',
        'payment2',
        'cheat1',
        'cheat2',
        'cheat3',
        'reobtain-coin', // cointains HTML, cannot be loaded only as a svg
        'streaming',
        'blind-sig1',
        'blind-sig2',
        'blind-sig3',
        'withdraw1',
        'withdraw2',
        'withdraw3',
        'diagram',
        'bs', 
        'bs-taler', 
        'refresh-prot',
        'refresh-derive',
        'pq-idea', // note: this file contains HTML and it doesn't render alone as SVG
        'rand',
        'tsig',
        'new-rd',
        'reveal-ex',
        'recap'
        ]

function loadSVGs() {
  const loads = svgs.map(s => {
    const container = document.getElementById(s);
    if (!container) return Promise.resolve();

    // If we've already loaded this SVG, skip re-fetching to avoid
    // heavy DOM churn that can cause animation jank when resuming.
    if (container.innerHTML && container.innerHTML.trim().length > 0) {
      if (s == 'diagram') {
        // ensure animation hook is initialized if needed
        initAnimation();
      }
      return Promise.resolve();
    }

    return fetch('assets/' + s + '.svg')
      .then(r => r.text())
      .then(svg => {
        container.innerHTML = svg;
        if (s == 'diagram') {
            initAnimation();
        }
      });
  });

  Promise.all(loads).then(() => {
    if (window.Reveal) {
      Reveal.layout();
      Reveal.sync();
    }
  });
}

// Initial load
loadSVGs();

window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    loadSVGs();
  }, 150);
});

window.addEventListener('resize', event => {
    setTimeout(() => {
        loadSVGs();
    }, 100);
});

window.addEventListener('pageshow', event => {
    setTimeout(() => {
        loadSVGs();
    }, 100);
});