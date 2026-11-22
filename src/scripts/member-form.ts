  /* ── CONFIG ── */
  const SUPABASE_URL  = 'https://nxhtannzwwrlgfgdxnvw.supabase.co';
  const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54aHRhbm56d3dybGdmZ2R4bnZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4ODY3NzEsImV4cCI6MjA5NTQ2Mjc3MX0.aN5T5PgWQ4LyBU0iiGnZjxcyt6aIo3vnWfBDT3Xj_dY';

  const PLATFORMS = [
    { value: 'instagram',  label: 'Instagram',   placeholder: 'https://instagram.com/username',
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="2" width="20" height="20" rx="6" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>` },
    { value: 'tiktok',     label: 'TikTok',      placeholder: 'https://tiktok.com/@username',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/></svg>` },
    { value: 'linkedin',   label: 'LinkedIn',    placeholder: 'https://linkedin.com/in/username',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>` },
    { value: 'behance',    label: 'Behance',     placeholder: 'https://behance.net/username',
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 19C1.67157 19 1 18.3284 1 17.5V6.5C1 5.67157 1.67157 5 2.5 5H8C13 5 13 11.5 10 11.5C13 11.5 14 19 8 19H2.5ZM4.5 11C4.22386 11 4 10.7761 4 10.5V7.5C4 7.22386 4.22386 7 4.5 7H7C7 7 9 7 9 9C9 11 7 11 7 11H4.5ZM4.5 13C4.22386 13 4 13.2239 4 13.5V16.5C4 16.7761 4.22386 17 4.5 17H8C8 17 9.5 17 9.5 15C9.5 13 8 13 8 13H4.5Z" fill="currentColor"/><path fill-rule="evenodd" clip-rule="evenodd" d="M21.499 14.0034C22.3279 14.0034 23.0212 13.3199 22.8522 12.5085C21.6065 6.52886 12.9128 7.08088 13 14.0034C13.0665 19.2762 20.4344 20.9671 22.6038 16.1898C22.9485 15.4308 22.1747 14.9997 21.5372 14.9997C20.9706 14.9997 20.5313 15.5223 20.1693 15.9582C19.1272 17.2132 15.9628 17.1221 15.5449 14.5142C15.5005 14.2375 15.7304 14.0034 16.0106 14.0034H21.499ZM15.8184 11.9997C15.671 11.9997 15.5758 11.8453 15.6545 11.7207C16.7141 10.0424 19.2614 10.0605 20.3398 11.7189C20.4207 11.8434 20.3257 11.9997 20.1772 11.9997H15.8184Z" fill="currentColor"/><path d="M16 6C15.4477 6 15 6.44772 15 7C15 7.55228 15.4477 8 16 8H20C20.5523 8 21 7.55228 21 7C21 6.44772 20.5523 6 20 6H16Z" fill="currentColor"/></svg>` },
    { value: 'dribbble',   label: 'Dribbble',    placeholder: 'https://dribbble.com/username',
      icon: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M25.916 7.921c-1.881 2.234-4.289 3.965-7.035 5.009l-0.118 0.039c0.3 0.612 0.587 1.231 0.85 1.857 0.1 0.225 0.187 0.45 0.275 0.662 0.927-0.102 2.003-0.16 3.092-0.16 2.063 0 4.077 0.208 6.023 0.605l-0.193-0.033c-0.020-3.040-1.107-5.821-2.904-7.994l0.017 0.021zM13.001 3.569c1.595 2.15 3.176 4.6 4.598 7.151l0.178 0.347c2.712-0.908 4.989-2.511 6.694-4.6l0.021-0.026c-2.247-2.006-5.228-3.232-8.494-3.232-1.063 0-2.096 0.13-3.084 0.375l0.088-0.018zM3.46 13.395c4.219-0.022 8.295-0.59 12.176-1.636l-0.333 0.076c-1.652-2.899-3.222-5.318-4.912-7.644l0.163 0.236c-3.596 1.721-6.227 4.966-7.077 8.875l-0.015 0.085zM6.484 24.585c2.42-3.882 6.010-6.839 10.271-8.408l0.141-0.045c0.169-0.056 0.337-0.105 0.506-0.15-0.325-0.731-0.675-1.458-1.040-2.174-3.888 1.154-8.355 1.819-12.977 1.819-0.066 0-0.131-0-0.196-0l0.010 0-0.005 0.39c0 0.003 0 0.006 0 0.009 0 3.297 1.25 6.302 3.301 8.568l-0.010-0.011zM21.005 27.809c-0.682-3.699-1.63-6.957-2.863-10.070l0.126 0.361-0.082 0.025c-4.314 1.346-7.826 4.192-10.002 7.915l-0.045 0.083c2.145 1.688 4.885 2.707 7.863 2.707 1.805 0 3.522-0.374 5.078-1.049l-0.083 0.032zM28.646 18.052c-1.571-0.474-3.376-0.747-5.245-0.747-0.964 0-1.911 0.073-2.836 0.213l0.104-0.013c0.98 2.564 1.842 5.629 2.436 8.789l0.054 0.344c2.874-1.96 4.893-4.993 5.482-8.51l0.010-0.075zM16 30.996c0 0 0 0-0 0-8.282 0-14.996-6.714-14.996-14.996s6.714-14.996 14.996-14.996c8.282 0 14.996 6.714 14.996 14.996 0 0 0 0 0 0v0c-0.011 8.277-6.718 14.984-14.995 14.996h-0.001z"/></svg>` },
    { value: 'artstation', label: 'ArtStation',  placeholder: 'https://artstation.com/username',
      icon: `<svg viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 23.63l2.703 4.672c0.552 1.094 1.667 1.781 2.885 1.781h17.943l-3.724-6.453zM32 23.661c0-0.641-0.193-1.245-0.516-1.75l-10.516-18.276c-0.557-1.057-1.656-1.719-2.854-1.719h-5.557l16.24 28.135 2.563-4.432c0.5-0.849 0.641-1.224 0.641-1.958zM17.161 19.047l-7.255-12.568-7.26 12.568z"/></svg>` },
    { value: 'youtube',    label: 'YouTube',     placeholder: 'https://youtube.com/@username',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>` },
    { value: 'vimeo',      label: 'Vimeo',       placeholder: 'https://vimeo.com/username',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 3.708-3.304C5.139 2.601 6.205 1.83 6.903 1.766c1.765-.17 2.844 1.034 3.237 3.614.435 2.755.737 4.473.905 5.152.502 2.282 1.056 3.402 1.658 3.402.468 0 1.172-.741 2.115-2.224.937-1.482 1.44-2.609 1.503-3.385.134-1.278-.37-1.92-1.503-1.92-.535 0-1.088.124-1.658.367 1.102-3.61 3.21-5.364 6.331-5.276 2.307.063 3.396 1.564 3.286 4.52z"/></svg>` },
    { value: 'twitter',    label: 'X / Twitter', placeholder: 'https://x.com/username',
      icon: `<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>` },
    { value: 'github',     label: 'GitHub',      placeholder: 'https://github.com/username',
      icon: `<svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10,1 C5.02943725,1 1,5.02943725 1,10 C1,13.9901613 3.53501565,17.3729659 7.08016444,18.5819604 C7.53015965,18.6625125 7.69530384,18.3874271 7.69530384,18.1497321 C7.69530384,17.9353681 7.68773694,17.2846083 7.68354231,16.4235982 C5.1668598,16.9653342 4.63451437,15.2029741 4.63451437,15.2029741 C4.22648283,14.1463867 3.63399171,13.8725392 3.63399171,13.8725392 C2.82276757,13.3162912 3.69398614,13.3274322 3.69398614,13.3274322 C4.58895338,13.390152 5.05942099,14.2481642 5.05942099,14.2481642 C5.85545756,15.6354614 7.1977897,15.2338846 7.71215806,15.0027587 C7.79195468,14.4238518 8.02394851,14.0234149 8.27929319,13.7966499 C6.24521527,13.5677451 4.10539261,12.7916316 4.10539261,9.2119636 C4.10539261,8.21475236 4.45484638,7.39837212 5.07740601,6.75741994 C4.98518651,6.52814949 4.67828463,5.59721742 5.16567258,4.33487269 C5.16567258,4.33487269 5.91459737,4.0910705 7.67384397,5.27697586 C8.44573028,5.07493152 9.22571954,4.97277265 10,4.96913414 C10.7742805,4.97277265 11.5542697,5.07493152 12.327396,5.27697586 C14.0854026,4.0910705 14.8331875,4.33487269 14.8331875,4.33487269 C15.3217154,5.59721742 15.0148135,6.52814949 14.922594,6.75741994 C15.5463935,7.39837212 15.8929672,8.21475236 15.8929672,9.2119636 C15.8929672,12.8008727 13.7494644,13.5647053 11.7086054,13.7893306 C12.0290973,14.069187 12.3154896,14.6230463 12.3154896,15.4672194 C12.3154896,16.6711154 12.304729,17.6453813 12.304729,17.9417131 C12.304729,18.1812879 12.4667932,18.4587731 12.9231099,18.3699327 C16.4673932,17.1576508 19,13.7773799 19,10 C19,5.02943725 14.9705627,1 10,1 Z"/></svg>` },
    { value: 'others',     label: 'Others',      placeholder: 'https://yoursite.com',
      icon: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 2a14.5 14.5 0 0 1 0 20M12 2a14.5 14.5 0 0 0 0 20M2 12h20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>` },
  ];

  /* ── STATE ── */
  let tags = [];
  const TAG_COLORS = 4;
  let croppedBlob = null;
  let pendingFileName = '';

  /* ── ELEMENTS ── */
  const form          = document.getElementById('member-form');
  const submitStrip   = document.getElementById('submit-strip');
  const goToReviewBtn = document.getElementById('go-to-review-btn');
  const reviewPage    = document.getElementById('review-page');
  const reviewGrid    = document.getElementById('review-grid');
  const btnBack       = document.getElementById('btn-back');
  const btnConfirm    = document.getElementById('btn-confirm');
  const successState  = document.getElementById('success-state');

  const step1El    = document.getElementById('step-1');
  const step2El    = document.getElementById('step-2');
  const label1     = document.getElementById('label-1');
  const label2     = document.getElementById('label-2');
  const connector12 = document.getElementById('connector-1-2');
  const heroTitleS1 = document.getElementById('hero-title-s1');
  const heroTitleS2 = document.getElementById('hero-title-s2');
  const heroSubS1   = document.getElementById('hero-sub-s1');
  const heroSubS2   = document.getElementById('hero-sub-s2');

  /* ── PREVENT ENTER SUBMITTING FORM ── */
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      e.preventDefault();
    }
  });

  /* ── STAGE NAVIGATION ── */
  function goToStage2() {
    form.style.display = 'none';
    submitStrip.style.display = 'none';
    buildReviewPage();
    reviewPage.style.display = 'block';
    step1El.classList.remove('stage-step--active');
    step1El.classList.add('stage-step--done');
    step2El.classList.add('stage-step--active');
    connector12.classList.add('stage-connector--filled');
    label1.classList.remove('label--active');
    label1.classList.add('label--done');
    label2.classList.add('label--active');
    heroTitleS1.style.display = 'none';
    heroTitleS2.style.display = 'block';
    heroSubS1.style.display = 'none';
    heroSubS2.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToStage1() {
    form.style.display = 'block';
    submitStrip.style.display = 'flex';
    reviewPage.style.display = 'none';
    step2El.classList.remove('stage-step--active');
    step1El.classList.remove('stage-step--done');
    step1El.classList.add('stage-step--active');
    connector12.classList.remove('stage-connector--filled');
    label2.classList.remove('label--active');
    label1.classList.remove('label--done');
    label1.classList.add('label--active');
    heroTitleS1.style.display = 'block';
    heroTitleS2.style.display = 'none';
    heroSubS1.style.display = 'block';
    heroSubS2.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  label1.classList.add('label--active');

  goToReviewBtn.addEventListener('click', () => {
    if (!validate()) {
      document.querySelector('.is-error')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    goToStage2();
  });

  btnBack.addEventListener('click', goToStage1);

  /* ── BUILD REVIEW PAGE ── */
  function val(id) { return (document.getElementById(id)?.value || '').trim(); }

  function buildReviewPage() {
    reviewGrid.innerHTML = '';

    const SECTION_COLORS = {
      '01': 'pink', '02': 'teal', '03': 'yellow',
      '04': 'purple', '05': 'pink', '06': 'teal', '07': 'yellow'
    };
    const NUM_COLORS = {
      'pink': '#E9295D', 'teal': '#3FD3D5', 'yellow': '#FEC843', 'purple': '#9F6ACD'
    };

    function makeCard(num, title, rowsHtml, full = false) {
      const color = SECTION_COLORS[num];
      const bgColor = NUM_COLORS[color];
      const card = document.createElement('div');
      card.className = `rv-card rv-card--${color}${full ? ' rv-card--full' : ''}`;
      card.style.animationDelay = `${(parseInt(num) - 1) * 0.05}s`;
      card.innerHTML = `
        <div class="rv-card__head">
          <div class="rv-card__num" style="background:${bgColor}">${num}</div>
          <span class="rv-card__title">${title}</span>
        </div>
        <div class="rv-rows">${rowsHtml}</div>
      `;
      return card;
    }

    function row(key, valHtml) {
      return `<div class="rv-row"><span class="rv-row__key">${key}</span><span class="rv-row__val">${valHtml}</span></div>`;
    }

    // 01 Identity
    const nicknameVal = val('nickname');
    reviewGrid.appendChild(makeCard('01', 'Identity',
      row('Full Name', escapeHtml(val('full-name')) || '<em style="color:var(--muted)">—</em>') +
      row('Initials',  escapeHtml(val('initials'))  || '<em style="color:var(--muted)">—</em>') +
      (nicknameVal ? row('Nickname', escapeHtml(nicknameVal)) : '')
    ));

    // 02 Your Role
    const cat = val('category');
    reviewGrid.appendChild(makeCard('02', 'Your Role',
      row('Status',     cat ? (cat.charAt(0).toUpperCase() + cat.slice(1)) : '<em style="color:var(--muted)">—</em>') +
      row('Program',    escapeHtml(val('program'))  || '<em style="color:var(--muted)">Not specified</em>') +
      row('Role/Title', escapeHtml(val('role'))     || '<em style="color:var(--muted)">—</em>')
    ));

    // 03 Expertise
    const tagsHtml = tags.length
      ? `<div class="rv-tags">${tags.map((t,i) => `<span class="tag" data-ci="${i % TAG_COLORS}">${escapeHtml(t)}</span>`).join('')}</div>`
      : '<em style="color:var(--muted)">No skills added</em>';
    reviewGrid.appendChild(makeCard('03', 'Expertise',
      `<div class="rv-row" style="border:none;padding-top:0"><span class="rv-row__val" style="grid-column:1/-1">${tagsHtml}</span></div>`
    ));

    // 04 Your Bio
    const bioVal = val('bio');
    reviewGrid.appendChild(makeCard('04', 'Your Bio',
      `<div class="rv-row" style="border:none;padding-top:0;display:block">
        <p class="rv-row__val" style="line-height:1.7;font-weight:500">${escapeHtml(bioVal) || '<em style="color:var(--muted)">No bio entered</em>'}</p>
        ${bioVal ? `<span class="rv-bio-count">${bioVal.trim() === '' ? 0 : bioVal.trim().split(/\s+/).length} / 240 words</span>` : ''}
      </div>`
    ));

    // 05 Contact & Portfolio
    reviewGrid.appendChild(makeCard('05', 'Contact & Portfolio',
      row('Email',     escapeHtml(val('email'))     || '<em style="color:var(--muted)">—</em>') +
      row('Portfolio', val('portfolio') ? `<a href="${escapeHtml(val('portfolio'))}" style="color:var(--teal);word-break:break-all">${escapeHtml(val('portfolio'))}</a>` : '<em style="color:var(--muted)">Not specified</em>')
    ));

    // 06 Social Links
    const socials = JSON.parse(document.getElementById('socials-hidden').value || '{}');
    const socialsEntries = Object.entries(socials);
    let socialsHtml;
    if (socialsEntries.length) {
      socialsHtml = `<div class="rv-socials">` +
        socialsEntries.map(([platform, url]) => {
          const p = PLATFORMS.find(x => x.value === platform);
          return `<div class="rv-social-row">
            <span class="rv-social-icon">${p ? p.icon : ''}</span>
            <span class="rv-social-platform">${p ? p.label : platform}</span>
            <span class="rv-social-url">${escapeHtml(url)}</span>
          </div>`;
        }).join('') + `</div>`;
    } else {
      socialsHtml = '<em style="color:var(--muted)">No social links added</em>';
    }
    reviewGrid.appendChild(makeCard('06', 'Social Links',
      `<div class="rv-row" style="border:none;padding-top:0;display:block"><div class="rv-row__val">${socialsHtml}</div></div>`
    ));

    // 07 Photo (full width)
    const photoCard = document.createElement('div');
    photoCard.className = 'rv-card rv-card--yellow rv-card--full';
    photoCard.style.animationDelay = '0.3s';

    let photoBodyHtml;
    if (croppedBlob) {
      const previewSrc = document.getElementById('avatar-preview-img').src;
      const sizeKb = Math.round(croppedBlob.size / 1024);
      photoBodyHtml = `
        <div class="rv-photo-layout">
          <img src="${previewSrc}" class="rv-photo-avatar" alt="Your photo" />
          <div class="rv-photo-divider-v"></div>
          <div class="rv-photo-info-row">
            <div class="rv-photo-info-cell">
              <div class="rv-photo-cell-icon rv-photo-cell-icon--teal">
                <svg viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12.0002L11.333 14.3332L16 9.66724" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="rv-photo-cell-label">Uploaded</span>
              <span class="rv-photo-cell-val">${pendingFileName ? escapeHtml(pendingFileName) + '.jpg' : 'photo.jpg'}</span>
            </div>
            <div class="rv-photo-info-cell">
              <div class="rv-photo-cell-icon rv-photo-cell-icon--pink">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 11C9.10457 11 10 10.1046 10 9C10 7.89543 9.10457 7 8 7C6.89543 7 6 7.89543 6 9C6 10.1046 6.89543 11 8 11Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M6.56055 21C12.1305 8.89998 16.7605 6.77998 22.0005 14.63" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 3H6C3.79086 3 2 4.79086 2 7V17C2 19.2091 3.79086 21 6 21H18C20.2091 21 22 19.2091 22 17V7C22 4.79086 20.2091 3 18 3Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="rv-photo-cell-label">File Type</span>
              <span class="rv-photo-cell-val">JPG</span>
            </div>
            <div class="rv-photo-info-cell">
              <div class="rv-photo-cell-icon rv-photo-cell-icon--purple">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 9V17.8C19 18.9201 19 19.4802 18.782 19.908C18.5903 20.2843 18.2843 20.5903 17.908 20.782C17.4802 21 16.9201 21 15.8 21H8.2C7.07989 21 6.51984 21 6.09202 20.782C5.71569 20.5903 5.40973 20.2843 5.21799 19.908C5 19.4802 5 18.9201 5 17.8V6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H13M19 9L13 3M19 9H14C13.4477 9 13 8.55228 13 8V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="rv-photo-cell-label">File Size</span>
              <span class="rv-photo-cell-val">${sizeKb} KB</span>
            </div>
            <div class="rv-photo-info-cell">
              <div class="rv-photo-cell-icon rv-photo-cell-icon--yellow">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.2691 4.41115C11.5006 3.89177 11.6164 3.63208 11.7776 3.55211C11.9176 3.48263 12.082 3.48263 12.222 3.55211C12.3832 3.63208 12.499 3.89177 12.7305 4.41115L14.5745 8.54808C14.643 8.70162 14.6772 8.77839 14.7302 8.83718C14.777 8.8892 14.8343 8.93081 14.8982 8.95929C14.9705 8.99149 15.0541 9.00031 15.2213 9.01795L19.7256 9.49336C20.2911 9.55304 20.5738 9.58288 20.6997 9.71147C20.809 9.82316 20.8598 9.97956 20.837 10.1342C20.8108 10.3122 20.5996 10.5025 20.1772 10.8832L16.8125 13.9154C16.6877 14.0279 16.6252 14.0842 16.5857 14.1527C16.5507 14.2134 16.5288 14.2807 16.5215 14.3503C16.5132 14.429 16.5306 14.5112 16.5655 14.6757L17.5053 19.1064C17.6233 19.6627 17.6823 19.9408 17.5989 20.1002C17.5264 20.2388 17.3934 20.3354 17.2393 20.3615C17.0619 20.3915 16.8156 20.2495 16.323 19.9654L12.3995 17.7024C12.2539 17.6184 12.1811 17.5765 12.1037 17.56C12.0352 17.5455 11.9644 17.5455 11.8959 17.56C11.8185 17.5765 11.7457 17.6184 11.6001 17.7024L7.67662 19.9654C7.18404 20.2495 6.93775 20.3915 6.76034 20.3615C6.60623 20.3354 6.47319 20.2388 6.40075 20.1002C6.31736 19.9408 6.37635 19.6627 6.49434 19.1064L7.4341 14.6757C7.46898 14.5112 7.48642 14.429 7.47814 14.3503C7.47081 14.2807 7.44894 14.2134 7.41394 14.1527C7.37439 14.0842 7.31195 14.0279 7.18708 13.9154L3.82246 10.8832C3.40005 10.5025 3.18884 10.3122 3.16258 10.1342C3.13978 9.97956 3.19059 9.82316 3.29993 9.71147C3.42581 9.58288 3.70856 9.55304 4.27406 9.49336L8.77835 9.01795C8.94553 9.00031 9.02911 8.99149 9.10139 8.95929C9.16534 8.93081 9.2226 8.8892 9.26946 8.83718C9.32241 8.77839 9.35663 8.70162 9.42508 8.54808L11.2691 4.41115Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="rv-photo-cell-val rv-photo-cell-val--note">This photo will appear on your profile on the 24fps website.</span>
            </div>
          </div>
        </div>`;
    } else {
      photoBodyHtml = `
        <div class="rv-no-photo">
          <svg viewBox="0 0 24 24" fill="none" width="36" height="36" flex-shrink="0">
            <circle cx="12" cy="8" r="4" stroke="var(--yellow)" stroke-width="2"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="var(--yellow)" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p><strong>No photo uploaded</strong>We'll create a custom illustrated avatar for you once your profile is approved.</p>
        </div>`;
    }

    photoCard.innerHTML = `
      <div class="rv-card__head">
        <div class="rv-card__num" style="background:#FEC843;">07</div>
        <span class="rv-card__title">Photo</span>
      </div>
      ${photoBodyHtml}
    `;
    reviewGrid.appendChild(photoCard);
  }

  /* ── BIO WORD COUNTER ── */
  const bioTa     = document.getElementById('bio');
  const bioCount  = document.getElementById('bio-count');
  const charCount = document.querySelector('.char-count');

  function countWords(str) { return str.trim() === '' ? 0 : str.trim().split(/\s+/).length; }
  function trimToWords(str, max) { const w = str.trim().split(/\s+/); return w.length <= max ? str : w.slice(0, max).join(' '); }

  bioTa.addEventListener('input', () => {
    const wc = countWords(bioTa.value);
    if (wc > 240) bioTa.value = trimToWords(bioTa.value, 240);
    bioCount.textContent = Math.min(wc, 240);
    charCount.classList.toggle('over', wc > 220);
  });

  /* ── TAGS ── */
  const tagInput   = document.getElementById('expertise-text');
  const tagsList   = document.getElementById('tags-list');
  const addTagBtn  = document.getElementById('add-tag-btn');
  const tagsHidden = document.getElementById('expertise-hidden');

  function renderTags() {
    tagsList.innerHTML = '';
    tags.forEach((tag, i) => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.dataset.ci = i % TAG_COLORS;
      el.innerHTML = `${escapeHtml(tag)}<button type="button" class="tag-remove" data-i="${i}" aria-label="Remove ${tag}">
        <svg viewBox="0 0 12 12" fill="none"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`;
      tagsList.appendChild(el);
    });
    tagsHidden.value = JSON.stringify(tags);
  }

  function addTag() {
    const v = tagInput.value.trim().replace(/,$/, '');
    if (v && !tags.includes(v)) { tags.push(v); renderTags(); }
    tagInput.value = '';
    tagInput.focus();
  }

  addTagBtn.addEventListener('click', addTag);
  tagInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
    if (e.key === 'Backspace' && !tagInput.value && tags.length) { tags.pop(); renderTags(); }
  });
  tagsList.addEventListener('click', e => {
    const btn = e.target.closest('.tag-remove');
    if (btn) { tags.splice(parseInt(btn.dataset.i), 1); renderTags(); }
  });

  /* ── SOCIAL LINKS BUILDER ── */
  const socialsBuilder = document.getElementById('socials-builder');
  const addSocialBtn   = document.getElementById('add-social-btn');
  const socialsHidden  = document.getElementById('socials-hidden');

  function updateSocials() {
    const obj = {};
    socialsBuilder.querySelectorAll('.social-row').forEach(row => {
      const p = row.dataset.platform || '';
      const u = row.querySelector('.social-url').value.trim();
      if (p && u) obj[p] = u;
    });
    socialsHidden.value = JSON.stringify(obj);
  }

  function closeAllDropdowns(except = null) {
    document.querySelectorAll('.social-dropdown.is-open').forEach(d => {
      if (d !== except) {
        d.classList.remove('is-open');
        d.setAttribute('aria-expanded', 'false');
        const list = d.parentElement.querySelector('.social-dd-list');
        if (list) list.style.display = 'none';
      }
    });
  }

  function buildCustomDropdown(selectedValue = '') {
    const selected = PLATFORMS.find(p => p.value === selectedValue) || null;
    const wrap = document.createElement('div');
    wrap.className = 'social-select-wrap';

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'social-dropdown';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');

    const triggerIcon = document.createElement('span');
    triggerIcon.className = 'social-dd-icon';
    triggerIcon.innerHTML = selected ? selected.icon : `<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="16" r="1.5" fill="currentColor"/></svg>`;

    const triggerLabel = document.createElement('span');
    triggerLabel.className = 'social-dd-label';
    triggerLabel.textContent = selected ? selected.label : 'Select platform';

    const caret = document.createElement('span');
    caret.className = 'social-dd-caret';
    caret.innerHTML = `<svg viewBox="0 0 16 16" fill="none"><path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

    trigger.appendChild(triggerIcon);
    trigger.appendChild(triggerLabel);
    trigger.appendChild(caret);

    const list = document.createElement('ul');
    list.className = 'social-dd-list';
    list.setAttribute('role', 'listbox');
    list.style.display = 'none';

    PLATFORMS.forEach(p => {
      const item = document.createElement('li');
      item.className = 'social-dd-item' + (p.value === selectedValue ? ' is-selected' : '');
      item.setAttribute('role', 'option');
      item.dataset.value = p.value;
      item.innerHTML = `<span class="social-dd-item-icon">${p.icon}</span><span>${p.label}</span>`;
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        triggerIcon.innerHTML = p.icon;
        triggerLabel.textContent = p.label;
        list.querySelectorAll('.social-dd-item').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
        const row = wrap.closest('.social-row');
        row.dataset.platform = p.value;
        const urlInput = row.querySelector('.social-url');
        urlInput.placeholder = p.placeholder;
        trigger.classList.remove('is-open');
        list.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
        updateSocials();
      });
      list.appendChild(item);
    });

    trigger.addEventListener('click', () => {
      const isOpen = trigger.classList.contains('is-open');
      closeAllDropdowns(trigger);
      if (isOpen) {
        trigger.classList.remove('is-open');
        list.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        trigger.classList.add('is-open');
        list.style.display = 'block';
        trigger.setAttribute('aria-expanded', 'true');
        list.style.top = 'calc(100% + 6px)';
        list.style.bottom = 'auto';
      }
    });

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) {
        trigger.classList.remove('is-open');
        list.style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    wrap.appendChild(trigger);
    wrap.appendChild(list);
    return wrap;
  }

  function addSocialRow(platform = '', url = '') {
    const row = document.createElement('div');
    row.className = 'social-row';
    row.dataset.platform = platform;

    const ddWrap = buildCustomDropdown(platform);

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.className = 'social-url';
    urlInput.placeholder = PLATFORMS.find(p => p.value === platform)?.placeholder || 'Paste your profile URL';
    urlInput.value = url;
    urlInput.addEventListener('input', updateSocials);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'social-remove';
    removeBtn.setAttribute('aria-label', 'Remove link');
    removeBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6H21M5 6V20C5 21.1046 5.89543 22 7 22H17C18.1046 22 19 21.1046 19 20V6M8 6V4C8 2.89543 8.89543 2 10 2H14C15.1046 2 16 2.89543 16 4V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    removeBtn.addEventListener('click', () => { row.remove(); updateSocials(); });

    row.appendChild(ddWrap);
    row.appendChild(urlInput);
    row.appendChild(removeBtn);
    socialsBuilder.appendChild(row);
  }

  addSocialBtn.addEventListener('click', () => addSocialRow());

  /* ── CATEGORY DROPDOWN ── */
  const categoryTrigger = document.getElementById('category-btn');
  const categoryList    = document.getElementById('category-dd-list');
  const categoryLabel   = document.getElementById('category-dd-label');
  const categoryHidden  = document.getElementById('category');

  categoryTrigger.addEventListener('click', () => {
    const isOpen = categoryTrigger.classList.contains('is-open');
    if (isOpen) {
      categoryTrigger.classList.remove('is-open');
      categoryList.style.display = 'none';
      categoryTrigger.setAttribute('aria-expanded', 'false');
    } else {
      categoryTrigger.classList.add('is-open');
      categoryList.style.display = 'block';
      categoryTrigger.setAttribute('aria-expanded', 'true');
    }
  });

  categoryList.querySelectorAll('.category-dd-item').forEach(item => {
    item.addEventListener('mousedown', e => {
      e.preventDefault();
      categoryHidden.value = item.dataset.value;
      categoryLabel.textContent = item.textContent.trim();
      categoryTrigger.classList.add('has-value');
      categoryList.style.display = 'none';
      categoryTrigger.classList.remove('is-open');
      categoryTrigger.setAttribute('aria-expanded', 'false');
      categoryList.querySelectorAll('.category-dd-item').forEach(i => i.classList.remove('is-selected'));
      item.classList.add('is-selected');
      categoryTrigger.classList.remove('is-error');
      const errEl = document.getElementById('err-category');
      if (errEl) errEl.textContent = '';
    });
  });

  document.addEventListener('click', e => {
    const wrap = document.getElementById('category-dd-wrap');
    if (wrap && !wrap.contains(e.target)) {
      categoryTrigger.classList.remove('is-open');
      categoryList.style.display = 'none';
      categoryTrigger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── AUTO-INITIALS FROM NAME ── */
  const fullNameInput = document.getElementById('full-name');
  const initialsInput = document.getElementById('initials');

  function derivedInitials(name) {
    return name.trim().split(/\s+/).filter(Boolean).map(w => w[0].toUpperCase()).slice(0, 3).join('');
  }
  function nameToSlug(name) {
    return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  fullNameInput.addEventListener('input', () => {
    initialsInput.value = derivedInitials(fullNameInput.value);
    pendingFileName = nameToSlug(fullNameInput.value);
  });

  /* ── PHOTO UPLOAD + CROP ── */
  const photoInput    = document.getElementById('photo');
  const uploadZone    = document.getElementById('upload-zone');
  const uploadUi      = document.getElementById('upload-ui');
  const avatarPreview = document.getElementById('avatar-preview-img');
  const previewDelete = document.getElementById('preview-delete');
  const cropOverlay   = document.getElementById('crop-overlay');
  const cropCanvas    = document.getElementById('crop-canvas');
  const cropWrap      = document.getElementById('crop-canvas-wrap');
  const cropZoom      = document.getElementById('crop-zoom');
  const cropCancel    = document.getElementById('crop-cancel');
  const cropConfirm   = document.getElementById('crop-confirm');

  let cropImg = null, cropScale = 1, cropOffX = 0, cropOffY = 0;
  let cropDragging = false, dragStartX = 0, dragStartY = 0, dragOffX = 0, dragOffY = 0;
  let cropObjectUrl = null;

  function drawCrop() {
    const size = cropCanvas.width;
    const ctx = cropCanvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);
    const sw = cropImg.naturalWidth * cropScale;
    const sh = cropImg.naturalHeight * cropScale;
    ctx.drawImage(cropImg, cropOffX + (size - sw) / 2, cropOffY + (size - sh) / 2, sw, sh);
  }

  function openCropper(file) {
    if (cropObjectUrl) URL.revokeObjectURL(cropObjectUrl);
    cropObjectUrl = URL.createObjectURL(file);
    cropImg = new Image();
    cropImg.onload = () => {
      cropOverlay.style.display = 'flex';
      requestAnimationFrame(() => {
        const dpr = window.devicePixelRatio || 1;
        const displayPx = cropWrap.clientWidth;
        const s = Math.round(displayPx * dpr);
        cropCanvas.width = s;
        cropCanvas.height = s;
        const ratio = Math.max(s / cropImg.naturalWidth, s / cropImg.naturalHeight);
        cropScale = ratio;
        cropZoom.min = ratio; cropZoom.max = ratio * 3; cropZoom.step = ratio * 0.01; cropZoom.value = ratio;
        cropOffX = 0; cropOffY = 0;
        drawCrop();
      });
    };
    cropImg.src = cropObjectUrl;
  }

  cropZoom.addEventListener('input', () => { cropScale = parseFloat(cropZoom.value); clampOffset(); drawCrop(); });

  function clampOffset() {
    const s = cropCanvas.width;
    const sw = cropImg.naturalWidth * cropScale;
    const sh = cropImg.naturalHeight * cropScale;
    const maxX = Math.max(0, (sw - s) / 2);
    const maxY = Math.max(0, (sh - s) / 2);
    cropOffX = Math.max(-maxX, Math.min(maxX, cropOffX));
    cropOffY = Math.max(-maxY, Math.min(maxY, cropOffY));
  }

  cropWrap.addEventListener('mousedown', e => { cropDragging = true; dragStartX = e.clientX; dragStartY = e.clientY; dragOffX = cropOffX; dragOffY = cropOffY; });
  window.addEventListener('mousemove', e => { if (!cropDragging) return; cropOffX = dragOffX + (e.clientX - dragStartX); cropOffY = dragOffY + (e.clientY - dragStartY); clampOffset(); drawCrop(); });
  window.addEventListener('mouseup', () => { cropDragging = false; });
  cropWrap.addEventListener('touchstart', e => { cropDragging = true; dragStartX = e.touches[0].clientX; dragStartY = e.touches[0].clientY; dragOffX = cropOffX; dragOffY = cropOffY; }, { passive: true });
  window.addEventListener('touchmove', e => { if (!cropDragging) return; cropOffX = dragOffX + (e.touches[0].clientX - dragStartX); cropOffY = dragOffY + (e.touches[0].clientY - dragStartY); clampOffset(); drawCrop(); }, { passive: true });
  window.addEventListener('touchend', () => { cropDragging = false; });
  cropWrap.addEventListener('wheel', e => { e.preventDefault(); cropScale = Math.max(parseFloat(cropZoom.min), Math.min(parseFloat(cropZoom.max), cropScale - e.deltaY * 0.001 * cropScale)); cropZoom.value = cropScale; clampOffset(); drawCrop(); }, { passive: false });

  cropCancel.addEventListener('click', () => { cropOverlay.style.display = 'none'; photoInput.value = ''; });

  cropConfirm.addEventListener('click', () => {
    const OUTPUT_SIZE = 512;
    const out = document.createElement('canvas');
    out.width = OUTPUT_SIZE; out.height = OUTPUT_SIZE;
    const displaySize = cropCanvas.width;
    const scaleFactor = OUTPUT_SIZE / displaySize;
    const ctx = out.getContext('2d');
    const sw = cropImg.naturalWidth  * cropScale * scaleFactor;
    const sh = cropImg.naturalHeight * cropScale * scaleFactor;
    const dx = (cropOffX + (displaySize - cropImg.naturalWidth  * cropScale) / 2) * scaleFactor;
    const dy = (cropOffY + (displaySize - cropImg.naturalHeight * cropScale) / 2) * scaleFactor;
    ctx.drawImage(cropImg, dx, dy, sw, sh);
    out.toBlob(blob => {
      croppedBlob = blob;
      if (cropObjectUrl) { URL.revokeObjectURL(cropObjectUrl); cropObjectUrl = null; }
      const previewUrl = URL.createObjectURL(blob);
      avatarPreview.src = previewUrl;
      previewDelete.dataset.hasPhoto = 'true';
      uploadUi.querySelector('.upload-text').innerHTML = 'Photo selected ✓<br/><span style="font-weight:500;font-size:0.8em;color:var(--muted)">Click to change</span>';
      cropOverlay.style.display = 'none';
    }, 'image/jpeg', 0.92);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Photo must be under 5MB.'); return; }
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      if (img.naturalWidth === img.naturalHeight) {
        const OUTPUT_SIZE = 512;
        const canvas = document.createElement('canvas');
        canvas.width = OUTPUT_SIZE; canvas.height = OUTPUT_SIZE;
        canvas.getContext('2d').drawImage(img, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        canvas.toBlob(blob => {
          croppedBlob = blob;
          const previewUrl = URL.createObjectURL(blob);
          avatarPreview.src = previewUrl;
          previewDelete.dataset.hasPhoto = 'true';
          uploadUi.querySelector('.upload-text').innerHTML = 'Photo selected ✓<br/><span style="font-weight:500;font-size:0.8em;color:var(--muted)">Click to change</span>';
        }, 'image/jpeg', 0.92);
      } else {
        openCropper(file);
      }
    };
    img.src = url;
  }

  previewDelete.addEventListener('click', () => {
    croppedBlob = null;
    if (avatarPreview.src && avatarPreview.src.startsWith('blob:')) URL.revokeObjectURL(avatarPreview.src);
    avatarPreview.src = '/images/profile-avatar.svg';
    previewDelete.dataset.hasPhoto = 'false';
    photoInput.value = '';
    uploadUi.querySelector('.upload-text').innerHTML = 'Drag &amp; drop your photo here<br/>or click to browse';
  });

  photoInput.addEventListener('change', () => handleFile(photoInput.files[0]));
  uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragover'); });
  uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
  uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.classList.remove('dragover'); const f = e.dataTransfer.files[0]; if (f?.type.startsWith('image/')) handleFile(f); });

  /* ── VALIDATION ── */
  function setError(fieldId, errId, msg) {
    const el = document.getElementById(fieldId);
    const err = document.getElementById(errId);
    if (msg) { el?.classList.add('is-error'); if (err) err.textContent = msg; }
    else      { el?.classList.remove('is-error'); if (err) err.textContent = ''; }
  }

  function validate() {
    let ok = true;
    const v = id => (document.getElementById(id)?.value || '').trim();

    if (v('full-name').length < 2) { setError('full-name','err-full-name','Please enter your full name.'); ok = false; }
    else setError('full-name','err-full-name','');

    setError('initials','err-initials','');

    if (!v('category')) { setError('category-btn','err-category','Please select your status.'); ok = false; }
    else setError('category-btn','err-category','');

    if (v('role').length < 2) { setError('role','err-role','Please enter your role / title.'); ok = false; }
    else setError('role','err-role','');

    if (tags.length === 0) { document.getElementById('err-expertise').textContent = 'Add at least one skill.'; ok = false; }
    else document.getElementById('err-expertise').textContent = '';

    if (countWords(v('bio')) < 10) { setError('bio','err-bio','Bio must be at least 10 words.'); ok = false; }
    else setError('bio','err-bio','');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('email'))) { setError('email','err-email','Please enter a valid email address.'); ok = false; }
    else setError('email','err-email','');

    const portVal = v('portfolio');
    if (portVal) {
      const portInput = document.getElementById('portfolio');
      let normalised = portVal;
      if (!/^https?:\/\//i.test(portVal)) { normalised = 'https://' + portVal; portInput.value = normalised; }
      try {
        const parsed = new URL(normalised);
        if (!parsed.hostname.includes('.')) { setError('portfolio','err-portfolio','Please enter a real portfolio URL.'); ok = false; }
        else setError('portfolio','err-portfolio','');
      } catch { setError('portfolio','err-portfolio','Please enter a valid portfolio URL.'); ok = false; }
    } else {
      setError('portfolio','err-portfolio','');
    }

    return ok;
  }

  /* ── DUPLICATE CHECK ── */
  async function checkDuplicate(email) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/member_submissions?select=id&email=eq.${encodeURIComponent(email)}&status=in.(pending,approved)`,
        { headers: { 'apikey': SUPABASE_ANON, 'Authorization': `Bearer ${SUPABASE_ANON}` } }
      );
      const data = await res.json();
      return Array.isArray(data) && data.length > 0;
    } catch { return false; }
  }

  /* ── PHOTO UPLOAD TO SUPABASE STORAGE ── */
  async function uploadPhoto(file, name) {
    if (!file) return null;
    const slug = pendingFileName || name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'member';
    const path = `${Date.now()}-${slug}.jpg`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/member-photos/${path}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'image/jpeg' },
      body: file,
    });
    if (!res.ok) return null;
    return `${SUPABASE_URL}/storage/v1/object/public/member-photos/${path}`;
  }

  /* ── CONFIRM SUBMIT → SUPABASE ── */
  btnConfirm.addEventListener('click', async () => {
    btnConfirm.disabled = true;
    btnConfirm.classList.add('is-loading');
    btnConfirm.querySelector('.btn-confirm-label').textContent = 'Submitting…';

    const v = id => (document.getElementById(id)?.value || '').trim();
    const email = v('email');

    const isDuplicate = await checkDuplicate(email);
    if (isDuplicate) {
      alert(`A submission with the email "${email}" already exists and is under review or approved.`);
      btnConfirm.disabled = false;
      btnConfirm.classList.remove('is-loading');
      btnConfirm.querySelector('.btn-confirm-label').textContent = 'Confirm & Submit';
      return;
    }

    try {
      const photoUrl = await uploadPhoto(croppedBlob, v('full-name'));

      const payload = {
        name:      v('full-name'),
        nickname:  v('nickname') || null,
        initials:  v('initials'),
        category:  v('category'),
        program:   v('program') || null,
        role:      v('role'),
        expertise: tags,
        bio:       v('bio'),
        email,
        portfolio: v('portfolio'),
        socials:   JSON.parse(socialsHidden.value || '{}'),
        photo_url: photoUrl,
        status:    'pending',
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/member_submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON,
          'Authorization': `Bearer ${SUPABASE_ANON}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Submission failed');

      reviewPage.style.display = 'none';
      const heroEl = document.querySelector('.hero');
      heroEl.querySelector('.hero__inner').style.display = 'none';
      heroEl.style.padding = '0';
      document.getElementById('stage-bar').style.display = 'none';
      successState.style.display = 'block';
      document.querySelector('.form-wrap').style.paddingBottom = '100px';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => requestAnimationFrame(() => successState.classList.add('is-visible')));

    } catch {
      btnConfirm.disabled = false;
      btnConfirm.classList.remove('is-loading');
      btnConfirm.querySelector('.btn-confirm-label').textContent = 'Confirm & Submit';
      alert('Something went wrong. Please check your connection and try again.');
    }
  });

  /* ── CLEAR ERRORS ON INPUT ── */
  ['full-name','role','bio','email','portfolio'].forEach(id => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(`err-${id}`);
    el?.addEventListener('input', () => { el.classList.remove('is-error'); if (errEl) errEl.textContent = ''; });
  });
  tagInput.addEventListener('input', () => { document.getElementById('err-expertise').textContent = ''; });

  /* ── STICKY STAGE BAR SHADOW ── */
  const stageBar = document.getElementById('stage-bar');
  if (stageBar) {
    const observer = new IntersectionObserver(
      ([entry]) => stageBar.classList.toggle('is-stuck', !entry.isIntersecting),
      { threshold: 1, rootMargin: '-1px 0px 0px 0px' }
    );
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none';
    stageBar.parentNode.insertBefore(sentinel, stageBar);
    observer.observe(sentinel);
  }

  /* ── SYNC UPLOAD ZONE HEIGHT ── */
  function syncUploadHeight() {
    const card = document.getElementById('photo-preview-card');
    const zone = document.getElementById('upload-zone');
    if (card && zone) { const h = card.offsetHeight; if (h > 0) zone.style.height = h + 'px'; }
  }
  syncUploadHeight();
  window.addEventListener('resize', syncUploadHeight);

  /* ── HELPERS ── */
  function escapeHtml(str) {
    return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }
