/* Chief Pilot · la pagina.
   Tutto il testo sta nell'HTML (inglese, chiave delle traduzioni future): qui si legge dal DOM
   e si anima, senza scrivere frasi nuove. Aperta come file funziona uguale: niente fetch. */

(() => {
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  const seen = (els, fn, opts = { threshold: 0.25 }) => {
    if (!('IntersectionObserver' in window)) { els.forEach((el) => fn(el)); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); fn(e.target); } });
    }, opts);
    els.forEach((el) => io.observe(el));
  };

  /* MARK: Il tabellone Solari. Ogni modulo gira solo in avanti e passa per tutte le palette
     in mezzo, come i Solari veri (MASTER §9.1): uno scatto ogni 60 ms, sfalsati da sinistra. */
  const SET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.:-/';
  const FALL = [{ transform: 'scaleY(1)' }, { transform: 'scaleY(0)' }];
  const boards = [];
  document.querySelectorAll('[data-flap]').forEach((el) => {
    const text = el.textContent.trim().toUpperCase();
    const n = Number(el.dataset.cells) || text.length;
    const target = text.padEnd(n, ' ').slice(0, n);
    el.textContent = '';
    const cells = [...target].map((ch) => {
      const c = document.createElement('span');
      c.className = 'cell' + (ch === ' ' ? ' blank' : '');
      const b = document.createElement('b');
      b.textContent = still ? ch : ' ';
      c.append(b);
      el.append(c);
      return { c, b, target: ch };
    });
    boards.push(cells);
  });

  function spin(groups) {
    let col = 0;
    groups.forEach((cells, row) => {
      cells.forEach(({ c, b, target }, i) => {
        const steps = SET.indexOf(target) < 0 ? 0 : SET.indexOf(target);
        const pace = 60 * (0.96 + Math.random() * 0.08);
        const start = row * 40 + i * 25 + (col++ % 7) * 3;
        for (let k = 1; k <= steps; k++) {
          setTimeout(() => {
            b.textContent = SET[k];
            // la metà alta che cade: un'animazione sul ::before, senza ricalcolare il layout
            try { c.animate(FALL, { duration: 60, easing: 'ease-in', pseudoElement: '::before' }); } catch { /* niente caduta, resta lo scatto */ } // taste-skill-ignore: la paletta cade accelerando
          }, start + k * pace);
        }
        if (target === ' ') c.classList.add('blank');
      });
    });
  }
  if (!still && boards.length) setTimeout(() => spin(boards), 450);

  /* MARK: Le scie, disegnate a ritroso quando la mappa entra in vista (MASTER §9.4) */
  document.querySelectorAll('.chart').forEach((svg) => {
    // In ordine di volo: ogni tratta parte quando la precedente è quasi atterrata, dalla partenza all'arrivo.
    // Le tratte con data-c (l'apertura) hanno un orologio per catena: ogni catena parte un paio di secondi dopo
    // la precedente, come voli diversi nella stessa sera.
    const core = [...svg.querySelectorAll('.scie path')];
    const glow = [...svg.querySelectorAll('.scie-alone path')];
    const clock = {};
    core.forEach((p, i) => {
      const c = p.dataset.c || 0;
      const t = clock[c] ?? 0.3 + c * 1.9;
      const len = Math.ceil(p.getTotalLength());
      const dur = Math.min(1.1, Math.max(0.35, len / 700));
      for (const el of [p, glow[i]]) {
        if (!el) continue;
        el.style.setProperty('--len', len);
        el.style.setProperty('--d', `${t.toFixed(2)}s`);
        el.style.setProperty('--dur', `${dur.toFixed(2)}s`);
      }
      clock[c] = t + dur * 0.9;
    });
    svg.style.setProperty('--end', `${Math.max(...Object.values(clock)).toFixed(2)}s`);
  });
  if (still) document.querySelectorAll('.chart').forEach((s) => s.classList.add('drawn'));
  else seen([...document.querySelectorAll('.chart')], (s) => s.classList.add('drawn'), { threshold: 0.2 });

  /* MARK: Il giro: la missione cambia stato con il passo che si legge */
  const mission = document.querySelector('.mission');
  const steps = [...document.querySelectorAll('.loop-steps li')];
  if (mission && steps.length && 'IntersectionObserver' in window) {
    const set = (li) => {
      steps.forEach((s) => s.classList.toggle('on', s === li));
      const state = li.dataset.step;
      if (mission.dataset.state !== state) {
        mission.dataset.state = state;
        const panel = mission.querySelector(`.mission-panel[data-for="${state}"]`);
        if (panel && !still) { panel.classList.remove('show'); void panel.offsetWidth; panel.classList.add('show'); }
      }
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) set(e.target); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    steps.forEach((s) => io.observe(s));
    set(steps[0]);
  } else steps.forEach((s) => s.classList.add('on'));

  /* MARK: Le storie delle missioni, generate dall'app: un aereo, poi «Another story» */
  const picks = [...document.querySelectorAll('.picker [role="tab"]')];
  const tales = [...document.querySelectorAll('.tale')];
  let group = picks.find((p) => p.getAttribute('aria-selected') === 'true')?.dataset.pick;
  const show = (tale) => {
    tales.forEach((x) => { x.hidden = x !== tale; });
    if (!still) { tale.classList.remove('tale-in'); void tale.offsetWidth; tale.classList.add('tale-in'); }
  };
  const ofGroup = (g) => tales.filter((x) => x.dataset.pick === g);
  picks.forEach((p, i) => {
    if (!ofGroup(p.dataset.pick).length) { p.hidden = true; return; }
    p.tabIndex = p.getAttribute('aria-selected') === 'true' ? 0 : -1;
    const choose = () => {
      group = p.dataset.pick;
      picks.forEach((x) => { x.setAttribute('aria-selected', String(x === p)); x.tabIndex = x === p ? 0 : -1; });
      show(ofGroup(group)[0]);
    };
    p.addEventListener('click', choose);
    p.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const live = picks.filter((x) => !x.hidden);
      const n = live[(live.indexOf(p) + d + live.length) % live.length];
      n.focus(); n.click();
    });
  });
  document.getElementById('tale-next')?.addEventListener('click', () => {
    const list = ofGroup(group);
    const at = list.findIndex((x) => !x.hidden);
    if (list.length) show(list[(at + 1) % list.length]);
  });

  /* MARK: La ricevuta: le regole dell'app su un volo d'esempio */
  const money = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const signed = (v) => (v < 0 ? '−' : '+') + money.format(Math.abs(v));
  const form = document.querySelector('.howdid');
  const paper = document.querySelector('.paper');
  if (form && paper) {
    const FEE = 5980, COSTS = 820 + 1140 + 760 + 130 + 600;
    const words = Object.fromEntries([...paper.querySelectorAll('.paper-words li')].map((li) => [li.dataset.key, li.textContent]));
    const out = (k) => paper.querySelector(`[data-line="${k}"]`);
    const label = (k) => paper.querySelector(`[data-label="${k}"]`);
    const draw = () => {
      const land = Number(form.landing.value), arr = Number(form.arrival.value);
      const sales = Math.round(FEE * 0.05), l = Math.round(FEE * land), a = Math.round(FEE * arr);
      out('sales').textContent = signed(sales);
      out('landing').textContent = signed(l);
      out('arrival').textContent = signed(a);
      label('landing').textContent = words[form.landing.value];
      label('arrival').textContent = words['a' + form.arrival.value];
      const total = out('total');
      total.textContent = money.format(FEE + sales + l + a - COSTS);
      if (!still) { total.classList.remove('bump'); void total.offsetWidth; total.classList.add('bump'); }
    };
    form.addEventListener('change', draw);
    draw();
  }

  /* MARK: L'hangar: le cinque famiglie dei modellini dell'app */
  const plane = document.getElementById('plane');
  const tabs = [...document.querySelectorAll('.tabs [role="tab"]')];
  const cellWords = Object.fromEntries([...document.querySelectorAll('.cell-words li')].map((li) => [li.dataset.k, li.textContent]));
  const pick = (tab) => {
    const slug = tab.dataset.plane;
    tabs.forEach((t) => { t.setAttribute('aria-selected', String(t === tab)); t.tabIndex = t === tab ? 0 : -1; });
    document.querySelectorAll('.tabtext').forEach((d) => { d.hidden = d.dataset.plane !== slug; });
    document.querySelector('[data-cell="buy"]').textContent = cellWords[`${slug}-buy`];
    document.querySelector('[data-cell="lease"]').textContent = cellWords[`${slug}-lease`];
    const src = `assets/disegni/aereo-${slug}.svg`;
    if (plane.getAttribute('src') === src) return;
    const swap = () => { plane.src = src; plane.alt = tab.dataset.alt; };
    if (still) { swap(); return; }
    plane.classList.add('swap');
    setTimeout(() => { swap(); plane.onload = () => plane.classList.remove('swap'); }, 220);
  };
  const first = tabs.find((t) => t.getAttribute('aria-selected') === 'true');
  if (first) {
    document.querySelector('[data-cell="buy"]').textContent = cellWords[`${first.dataset.plane}-buy`];
    document.querySelector('[data-cell="lease"]').textContent = cellWords[`${first.dataset.plane}-lease`];
  }
  tabs.forEach((t, i) => {
    t.tabIndex = t.getAttribute('aria-selected') === 'true' ? 0 : -1;
    t.addEventListener('click', () => pick(t));
    t.addEventListener('keydown', (e) => {
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      const next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus(); pick(next);
    });
  });

  /* MARK: La compagnia: nome, codice, livrea, stile. Restano per la prossima visita. */
  const KEEP = 'chiefpilot-compagnia';
  let mine = {};
  try { mine = JSON.parse(localStorage.getItem(KEEP)) || {}; } catch { /* navigazione privata */ }
  const save = () => { try { localStorage.setItem(KEEP, JSON.stringify(mine)); } catch { /* niente */ } };
  // Un biglietto per stile (linea, charter, tour, aeroclub): tutti portano nome, codice e livrea della compagnia.
  const pass = document.querySelector('.tickets');
  const nameIn = document.getElementById('in-name'), codeIn = document.getElementById('in-code');
  const outNames = [...document.querySelectorAll('[data-out="name"]')], outCodes = [...document.querySelectorAll('[data-out="code"]')];
  const tickets = [...document.querySelectorAll('.ticket')];
  const radios = (group, onPick) => {
    const items = [...group.querySelectorAll('[role="radio"]')];
    const choose = (b, quiet) => {
      items.forEach((x) => { x.setAttribute('aria-checked', String(x === b)); x.tabIndex = x === b ? 0 : -1; });
      onPick(b, quiet);
    };
    items.forEach((b, i) => {
      b.tabIndex = b.getAttribute('aria-checked') === 'true' ? 0 : -1;
      b.addEventListener('click', () => choose(b));
      b.addEventListener('keydown', (e) => {
        const d = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        const n = items[(i + d + items.length) % items.length];
        n.focus(); choose(n);
      });
    });
    return { items, choose };
  };
  if (pass && nameIn && codeIn) {
    const setName = (v) => { outNames.forEach((o) => { o.textContent = v.trim() || nameIn.defaultValue; }); };
    const setCode = (v) => { outCodes.forEach((o) => { o.textContent = v || codeIn.defaultValue; }); };
    nameIn.addEventListener('input', () => { setName(nameIn.value); mine.name = nameIn.value; save(); });
    codeIn.addEventListener('input', () => {
      codeIn.value = codeIn.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
      setCode(codeIn.value); mine.code = codeIn.value; save();
    });
    const sw = radios(document.querySelector('.swatches'), (b) => {
      pass.style.setProperty('--livery', b.dataset.c); mine.livery = b.dataset.c; save();
    });
    const st = radios(document.querySelector('.segments'), (b, quiet) => {
      tickets.forEach((t) => {
        const on = t.dataset.ticket === b.dataset.style;
        if (on && t.hidden && !still && !quiet) { t.classList.remove('ticket-in'); void t.offsetWidth; t.classList.add('ticket-in'); }
        t.hidden = !on;
      });
      mine.style = b.textContent; save();
    });
    if (mine.name) { nameIn.value = mine.name; setName(mine.name); }
    if (mine.code) { codeIn.value = mine.code; setCode(mine.code); }
    const lv = sw.items.find((b) => b.dataset.c === mine.livery); if (lv) sw.choose(lv);
    const sy = st.items.find((b) => b.textContent === mine.style); if (sy) st.choose(sy, true);
  }

  /* MARK: Le entrate: titolo, poi testo, poi figura, sfalsati, una volta sola */
  if (!still) {
    const groups = [
      '.intro-text > *', '.intro-mac', '.flight .mac', '.loop-text > h2, .loop-intro', '.mblock', '.missions-mac', '.tales-head > *', '.picker', '.tale-stage',
      '.receipt-lead, .howdid, .receipt-small', '.paper', '.logbook h2', '.logbook-text > div, .logbook-text .mac',
      '.hangar-copy, .cells', '.hangar-mac', '.network-head > *', '.levels li', '.ntext > *', '.nrow .mac',
      '.airline-text h2', '.ranks-col > *', '.everywhere > *', '.letter-sheet, .letter-stub', '.faq h2, .faq-text p', '.close > *',
    ];
    groups.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.setAttribute('data-rise', '');
        el.style.setProperty('--rd', `${Math.min(i, 8) * 75}ms`);
      });
    });
    seen([...document.querySelectorAll('[data-rise]')], (el) => el.classList.add('in'), { threshold: 0.12 });
  }
})();
