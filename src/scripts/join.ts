  const TAG_COLORS = 4;
  let skills: string[] = [];

  function escapeHtml(str: string) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function v(id: string) {
    return (document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement)?.value?.trim() || '';
  }

  function setError(fieldId: string, errId: string, msg: string) {
    const field = document.getElementById(fieldId);
    const err = document.getElementById(errId);
    if (field) field.classList.toggle('is-error', !!msg);
    if (err) err.textContent = msg;
  }

  /* ── GENERIC DROPDOWN BUILDER ── */
  function initDropdown(prefix: string, hiddenId: string, onSelect?: (val: string) => void) {
    const trigger = document.getElementById(`${prefix}-btn`);
    const list = document.getElementById(`${prefix}-dd-list`);
    const label = document.getElementById(`${prefix}-dd-label`);
    const hidden = document.getElementById(hiddenId) as HTMLInputElement;
    if (!trigger || !list || !label || !hidden) return;

    trigger.addEventListener('click', () => {
      const isOpen = trigger.classList.contains('is-open');
      // close any other open dropdowns
      document.querySelectorAll('.category-dd-trigger.is-open').forEach(t => {
        if (t !== trigger) {
          t.classList.remove('is-open');
          t.setAttribute('aria-expanded', 'false');
          const l = t.parentElement?.querySelector('.category-dd-list') as HTMLElement;
          if (l) l.style.display = 'none';
        }
      });
      if (isOpen) {
        trigger.classList.remove('is-open');
        (list as HTMLElement).style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        trigger.classList.add('is-open');
        (list as HTMLElement).style.display = 'block';
        trigger.setAttribute('aria-expanded', 'true');
      }
    });

    list.querySelectorAll('.category-dd-item').forEach(item => {
      item.addEventListener('mousedown', e => {
        e.preventDefault();
        const val = (item as HTMLElement).dataset.value || '';
        hidden.value = val;
        label.textContent = item.textContent?.trim() || '';
        trigger.classList.add('has-value');
        (list as HTMLElement).style.display = 'none';
        trigger.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        list.querySelectorAll('.category-dd-item').forEach(i => i.classList.remove('is-selected'));
        item.classList.add('is-selected');
        trigger.classList.remove('is-error');
        const errEl = document.getElementById(`err-${hiddenId}`);
        if (errEl) errEl.textContent = '';
        if (onSelect) onSelect(val);
      });
    });

    document.addEventListener('click', e => {
      const wrap = trigger.closest('.category-dd-wrap');
      if (wrap && !wrap.contains(e.target as Node)) {
        trigger.classList.remove('is-open');
        (list as HTMLElement).style.display = 'none';
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  initDropdown('status', 'status', (val) => {
    const studentInfoField = document.getElementById('field-student-info');
    const programInput = document.getElementById('student-program') as HTMLInputElement;
    const yearInput = document.getElementById('student-year') as HTMLInputElement;
    if (!studentInfoField) return;
    if (val === 'student') {
      studentInfoField.style.display = '';
      programInput?.setAttribute('required', 'required');
      yearInput?.setAttribute('required', 'required');
    } else {
      studentInfoField.style.display = 'none';
      programInput?.removeAttribute('required');
      yearInput?.removeAttribute('required');
      setError('student-program', 'err-student-program', '');
      setError('student-year', 'err-student-year', '');
    }
  });

  initDropdown('heard', 'heard-about');
  initDropdown('experience', 'experience');

  /* ── SKILLS TAG INPUT ── */
  const tagInput = document.getElementById('skills-text') as HTMLInputElement;
  const tagsList = document.getElementById('tags-list') as HTMLElement;
  const addTagBtn = document.getElementById('add-tag-btn') as HTMLButtonElement;
  const skillsHidden = document.getElementById('skills-hidden') as HTMLInputElement;

  function renderTags() {
    tagsList.innerHTML = '';
    skills.forEach((tag, i) => {
      const el = document.createElement('span');
      el.className = 'tag';
      el.dataset.ci = String(i % TAG_COLORS);
      el.innerHTML = `${escapeHtml(tag)}<button type="button" class="tag-remove" data-i="${i}" aria-label="Remove ${escapeHtml(tag)}">
        <svg viewBox="0 0 12 12" fill="none"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      </button>`;
      tagsList.appendChild(el);
    });
    skillsHidden.value = JSON.stringify(skills);
  }

  function addSkill() {
    const val = tagInput.value.trim().replace(/,$/, '');
    if (val && !skills.includes(val)) { skills.push(val); renderTags(); }
    tagInput.value = '';
    tagInput.focus();
    document.getElementById('err-skills')!.textContent = '';
  }

  addTagBtn.addEventListener('click', addSkill);
  tagInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkill(); }
    if (e.key === 'Backspace' && !tagInput.value && skills.length) { skills.pop(); renderTags(); }
  });
  tagsList.addEventListener('click', e => {
    const btn = (e.target as HTMLElement).closest('.tag-remove') as HTMLElement;
    if (btn) { skills.splice(parseInt(btn.dataset.i || '0'), 1); renderTags(); }
  });

  /* ── WORD COUNT (Why Join) ── */
  const whyJoin = document.getElementById('why-join') as HTMLTextAreaElement;
  const whyJoinCount = document.getElementById('why-join-count') as HTMLElement;
  whyJoin.addEventListener('input', () => {
    const wc = whyJoin.value.trim() ? whyJoin.value.trim().split(/\s+/).length : 0;
    whyJoinCount.textContent = `${wc} / 300 words`;
    whyJoinCount.classList.toggle('over', wc > 300);
  });

  /* ── CLEAR ERRORS ON INPUT ── */
  ['full-name', 'email'].forEach(id => {
    const el = document.getElementById(id);
    const errEl = document.getElementById(`err-${id}`);
    el?.addEventListener('input', () => { el.classList.remove('is-error'); if (errEl) errEl.textContent = ''; });
  });
  whyJoin.addEventListener('input', () => { document.getElementById('err-why-join')!.textContent = ''; });

  const consentCheckbox = document.getElementById('consent-checkbox') as HTMLInputElement;
  consentCheckbox.addEventListener('change', () => { document.getElementById('err-consent')!.textContent = ''; });

  /* ── FORM VALIDATION + SUBMIT ── */
  const form = document.getElementById('join-form') as HTMLFormElement;
  const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement;
  const successState = document.getElementById('success-state') as HTMLElement;
  const formLevelError = document.getElementById('form-level-error') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    formLevelError.style.display = 'none';
    let ok = true;

    if (!v('full-name')) { setError('full-name', 'err-full-name', 'Please enter your full name.'); ok = false; }
    else setError('full-name', 'err-full-name', '');

    const emailVal = v('email');
    if (!emailVal) { setError('email', 'err-email', 'Please enter your email address.'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) { setError('email', 'err-email', 'Please enter a valid email address.'); ok = false; }
    else setError('email', 'err-email', '');

    if (!v('phone')) { setError('phone', 'err-phone', 'Please enter your phone / WhatsApp number.'); ok = false; }
    else setError('phone', 'err-phone', '');

    if (!v('status')) { setError('status-btn', 'err-status', 'Please select your status.'); ok = false; }
    else setError('status-btn', 'err-status', '');

    if (v('status') === 'student' && !v('student-program')) {
      setError('student-program', 'err-student-program', 'Please enter your program.'); ok = false;
    } else {
      setError('student-program', 'err-student-program', '');
    }

    if (v('status') === 'student' && !v('student-year')) {
      setError('student-year', 'err-student-year', 'Please enter your year or level.'); ok = false;
    } else {
      setError('student-year', 'err-student-year', '');
    }

    if (!v('why-join')) { setError('why-join', 'err-why-join', 'Please tell us why you want to join.'); ok = false; }
    else setError('why-join', 'err-why-join', '');

    if (!v('heard-about')) { setError('heard-btn', 'err-heard-about', 'Please let us know how you heard about us.'); ok = false; }
    else setError('heard-btn', 'err-heard-about', '');

    if (skills.length === 0) { document.getElementById('err-skills')!.textContent = 'Please add at least one skill or interest.'; ok = false; }
    else document.getElementById('err-skills')!.textContent = '';

    if (!v('experience')) { setError('experience-btn', 'err-experience', 'Please select your experience level.'); ok = false; }
    else setError('experience-btn', 'err-experience', '');

    if (!consentCheckbox.checked) { document.getElementById('err-consent')!.textContent = 'Please agree to be contacted before submitting.'; ok = false; }
    else document.getElementById('err-consent')!.textContent = '';

    if (!ok) {
      const firstError = form.querySelector('.is-error, .err:not(:empty)');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.submit-btn__label')!.textContent = 'Submitting…';

    const payload = {
      full_name: v('full-name'),
      email: v('email'),
      phone: v('phone'),
      status_type: v('status'),
      student_program: v('status') === 'student' ? v('student-program') : null,
      student_year: v('status') === 'student' ? v('student-year') : null,
      why_join: v('why-join'),
      heard_about: v('heard-about'),
      skills,
      experience: v('experience') || null,
      portfolio: v('portfolio') || null,
      consent: consentCheckbox.checked,
      website: (document.getElementById('website-hp') as HTMLInputElement | null)?.value ?? '',
    };

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      form.style.display = 'none';
      document.getElementById('hero-inner')!.querySelector('.hero__logo')!.parentElement!.style.padding = '0';
      successState.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      requestAnimationFrame(() => requestAnimationFrame(() => successState.classList.add('is-visible')));
    } catch (err: any) {
      formLevelError.textContent = err?.message || 'Something went wrong. Please try again.';
      formLevelError.style.display = 'block';
      formLevelError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      submitBtn.disabled = false;
      submitBtn.querySelector('.submit-btn__label')!.textContent = 'Submit Application';
    }
  });
