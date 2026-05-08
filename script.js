const COLORS = { none: '#333', weak: '#ff3a3a', fair: '#ff8c00', good: '#f0d000', strong: '#00ff96' };
const LABELS = { none: '— Enter Password', weak: 'Weak', fair: 'Fair', good: 'Good', strong: 'Strong' };

/**
 * Analyse the current password value and update UI.
 */
function analyze() {
  const pw = document.getElementById('pw').value;

  // Criteria checks
  const checks = {
    len:   pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    num:   /\d/.test(pw),
    sym:   /[^a-zA-Z0-9]/.test(pw),
    long:  pw.length >= 12,
  };

  // Update criteria badges
  ['len','upper','lower','num','sym','long'].forEach(k => {
    document.getElementById('c-' + k).classList.toggle('pass', checks[k]);
  });

  // Empty state
  if (pw.length === 0) { setLevel('none', 0); return; }

  // Score: 1 point per criterion
  let score = Object.values(checks).filter(Boolean).length;

  const level = score <= 1 ? 'weak' : score <= 3 ? 'fair' : score <= 5 ? 'good' : 'strong';
  setLevel(level, score);
}

/**
 * Apply strength level to UI.
 */
function setLevel(level, score) {
  const bars  = document.getElementById('bars');
  bars.className = 'bars ' + level;

  const txt = document.getElementById('str-text');
  txt.textContent = LABELS[level];
  txt.style.color = COLORS[level];

  document.getElementById('str-score').textContent = level === 'none' ? '' : `${score}/6`;
}

/**
 * Toggle password visibility.
 */
function toggleVis() {
  const input = document.getElementById('pw');
  const eye   = document.getElementById('eye');
  if (input.type === 'password') {
    input.type = 'text';
    eye.textContent = '🙈';
  } else {
    input.type = 'password';
    eye.textContent = '👁';
  }
}

/**
 * Generate a strong random password.
 */
function generate() {
  const charSets = [
    'abcdefghijklmnopqrstuvwxyz',
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    '0123456789',
    '!@#$%^&*()-_=+[]{}',
  ];
  const all = charSets.join('');

  // Ensure at least one char from each set
  let pw = charSets.map(s => s[Math.floor(Math.random() * s.length)]).join('');

  // Fill to 16 characters
  for (let i = pw.length; i < 16; i++) {
    pw += all[Math.floor(Math.random() * all.length)];
  }

  // Shuffle
  pw = pw.split('').sort(() => 0.5 - Math.random()).join('');

  const input = document.getElementById('pw');
  input.type = 'text';
  input.value = pw;
  document.getElementById('eye').textContent = '🙈';
  analyze();
}
