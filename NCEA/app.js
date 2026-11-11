const state = {
  words: [], sublist: 1, selectedId: null, mode: 'learn', query: '',
  learned: new Set(JSON.parse(localStorage.getItem('awl-learned') || '[]')),
  quiz: [], quizIndex: 0, score: 0, answered: false,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const labels = ['Most frequent', 'Very frequent', 'High frequency', 'Common academic', 'Core academic', 'Developing range', 'Extended range', 'Advanced range', 'Less frequent', 'Least frequent'];

function saveProgress() {
  localStorage.setItem('awl-learned', JSON.stringify([...state.learned]));
  renderProgress();
}

function renderProgress() {
  $('#progressText').textContent = `${state.learned.size} of 570 learned`;
  $('#progressFill').style.width = `${state.learned.size / 570 * 100}%`;
  $$('.sublist-button').forEach((button, index) => {
    const total = index === 9 ? 30 : 60;
    const learned = state.words.filter(w => w.sublist === index + 1 && state.learned.has(w.id)).length;
    button.querySelector('.sub-progress').textContent = `${learned}/${total} learned`;
  });
}

function renderSublists() {
  $('#sublistNav').innerHTML = Array.from({ length: 10 }, (_, i) => `
    <button class="sublist-button ${state.sublist === i + 1 ? 'is-active' : ''}" data-sublist="${i + 1}" aria-pressed="${state.sublist === i + 1}">
      <span class="sub-number">${String(i + 1).padStart(2, '0')}</span><span class="sub-progress">0 learned</span>
    </button>`).join('');
  $$('.sublist-button').forEach(button => button.addEventListener('click', () => selectSublist(Number(button.dataset.sublist))));
  renderProgress();
}

function selectSublist(number) {
  state.sublist = number;
  state.query = '';
  $('#searchInput').value = '';
  $('#clearSearch').hidden = true;
  state.selectedId = state.words.find(w => w.sublist === number)?.id;
  renderSublists();
  renderWordList();
  renderDetail();
  startQuiz();
  $('#sublistLabel').textContent = `Sublist ${number}`;
  $('#listHeading').textContent = labels[number - 1];
  $('#practiceSublist').textContent = `Sublist ${number} practice`;
}

function visibleWords() {
  const query = state.query.trim().toLowerCase();
  if (query) return state.words.filter(w => [w.word, w.definition, ...w.family].some(value => value.toLowerCase().includes(query)));
  return state.words.filter(w => w.sublist === state.sublist);
}

function renderWordList() {
  const words = visibleWords();
  $('#resultCount').textContent = `${words.length} ${words.length === 1 ? 'word' : 'words'}`;
  if (!words.length) {
    $('#wordList').innerHTML = '<div class="empty-state">No words match your search.<br>Try a different spelling or word-family form.</div>';
    return;
  }
  if (!words.some(w => w.id === state.selectedId)) state.selectedId = words[0].id;
  $('#wordList').innerHTML = words.map((word, i) => `
    <button class="word-item ${word.id === state.selectedId ? 'is-active' : ''}" role="option" aria-selected="${word.id === state.selectedId}" data-id="${word.id}">
      <span class="word-index">${String(i + 1).padStart(2, '0')}</span>
      <span><span class="word-name">${word.word}</span><span class="word-pos"> · ${word.partOfSpeech}</span></span>
      <span class="learned-dot" aria-label="${state.learned.has(word.id) ? 'Learned' : 'Not yet learned'}">${state.learned.has(word.id) ? '●' : '○'}</span>
    </button>`).join('');
  $$('.word-item').forEach(button => button.addEventListener('click', () => {
    state.selectedId = button.dataset.id; renderWordList(); renderDetail();
  }));
}

function selectedWord() { return state.words.find(w => w.id === state.selectedId); }

function renderDetail() {
  const word = selectedWord();
  if (!word) return;
  const sublistWords = state.words.filter(w => w.sublist === word.sublist);
  const position = sublistWords.findIndex(w => w.id === word.id);
  $('#detailMeta').textContent = `Sublist ${word.sublist} · Word ${position + 1} of ${sublistWords.length}`;
  $('#detailWord').textContent = word.word;
  $('#detailPos').textContent = word.partOfSpeech;
  $('#detailDefinition').textContent = word.definition;
  $('#detailExample').textContent = word.example;
  $('#familyCount').textContent = `${word.familyCount} forms in the full family`;
  $('#familyWords').innerHTML = word.family.length ? word.family.map(item => `<span class="family-chip">${item}</span>`).join('') : '<span class="family-chip">No additional forms listed</span>';
  const learned = state.learned.has(word.id);
  $('#learnedButton').setAttribute('aria-pressed', String(learned));
  $('#learnedButton').textContent = learned ? '✓ Learned' : 'Mark as learned';
  $('#speakWord').setAttribute('aria-label', `Hear the word ${word.word}`);
  $('#prevWord').disabled = position === 0;
  $('#nextWord').disabled = position === sublistWords.length - 1;
  document.title = `${word.word} — AWL Study Desk`;
}

function moveWord(direction) {
  const word = selectedWord();
  const set = state.words.filter(w => w.sublist === word.sublist);
  const next = set[set.findIndex(w => w.id === word.id) + direction];
  if (next) { state.selectedId = next.id; renderWordList(); renderDetail(); $('#wordDetail').scrollIntoView({ behavior: 'smooth', block: 'start' }); }
}

function speak(text) {
  if (!('speechSynthesis' in window)) { $('#status').textContent = 'Speech is not available in this browser.'; return; }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices.find(v => v.lang === 'en-NZ') || voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en')) || null;
  utterance.lang = utterance.voice?.lang || 'en-GB';
  utterance.rate = .88;
  speechSynthesis.speak(utterance);
}

function shuffle(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [copy[i], copy[j]] = [copy[j], copy[i]]; }
  return copy;
}

function startQuiz() {
  const pool = state.words.filter(w => w.sublist === state.sublist);
  state.quiz = shuffle(pool).slice(0, 10).map(answer => ({ answer, options: shuffle([answer, ...shuffle(pool.filter(w => w.id !== answer.id)).slice(0, 3)]) }));
  state.quizIndex = 0; state.score = 0; state.answered = false;
  renderQuestion();
}

function cloze(example, word) {
  const pattern = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i');
  if (pattern.test(example)) return example.replace(pattern, '________');
  return `${example} Which key term is being defined? ________`;
}

function renderQuestion() {
  const item = state.quiz[state.quizIndex];
  if (!item) return;
  state.answered = false;
  $('#quizCounter').textContent = `Question ${state.quizIndex + 1} of ${state.quiz.length}`;
  $('#quizScore').textContent = `${state.score} correct`;
  $('#quizFill').style.width = `${(state.quizIndex + 1) / state.quiz.length * 100}%`;
  $('#quizPrompt').textContent = cloze(item.answer.example, item.answer.word);
  $('#quizOptions').innerHTML = item.options.map(option => `<button class="quiz-option" data-id="${option.id}" type="button">${option.word}</button>`).join('');
  $('#quizFeedback').innerHTML = '';
  $('#nextQuestion').disabled = true;
  $('#nextQuestion').textContent = state.quizIndex === state.quiz.length - 1 ? 'See results' : 'Next question';
  $$('.quiz-option').forEach(button => button.addEventListener('click', () => answerQuestion(button.dataset.id)));
}

function answerQuestion(id) {
  if (state.answered) return;
  state.answered = true;
  const item = state.quiz[state.quizIndex];
  const correct = id === item.answer.id;
  if (correct) state.score++;
  $$('.quiz-option').forEach(button => {
    button.disabled = true;
    if (button.dataset.id === item.answer.id) button.classList.add('is-correct');
    else if (button.dataset.id === id) button.classList.add('is-wrong');
  });
  $('#quizScore').textContent = `${state.score} correct`;
  $('#quizFeedback').innerHTML = `<strong>${correct ? 'Correct.' : `Not quite — the answer is ${item.answer.word}.`}</strong>${item.answer.definition}<br><button id="hearAnswer" type="button">◖)) Hear complete sentence</button>`;
  $('#hearAnswer').addEventListener('click', () => speak(item.answer.example));
  $('#nextQuestion').disabled = false;
}

function nextQuestion() {
  if (state.quizIndex < state.quiz.length - 1) { state.quizIndex++; renderQuestion(); return; }
  const total = state.quiz.length;
  $('#quizPrompt').textContent = `Set complete: ${state.score} out of ${total}.`;
  $('#quizOptions').innerHTML = '';
  $('#quizFeedback').innerHTML = `<strong>${state.score >= 8 ? 'Excellent control of this sublist.' : state.score >= 5 ? 'A sound start — review the missed words and try again.' : 'Return to Learn mode, then try a fresh set.'}</strong>`;
  $('#nextQuestion').disabled = true;
}

function switchMode(mode) {
  state.mode = mode;
  $('#learnView').hidden = mode !== 'learn';
  $('#practiseView').hidden = mode !== 'practise';
  $$('.mode-tab').forEach(button => { const active = button.dataset.mode === mode; button.classList.toggle('is-active', active); button.setAttribute('aria-pressed', String(active)); });
  document.title = mode === 'practise' ? `Practise Sublist ${state.sublist} — AWL Study Desk` : `${selectedWord()?.word || 'Learn'} — AWL Study Desk`;
}

async function init() {
  try {
    const response = await fetch('assets/awl-data.json');
    if (!response.ok) throw new Error('Data could not be loaded');
    state.words = await response.json();
    state.selectedId = state.words[0].id;
    renderSublists(); renderWordList(); renderDetail(); startQuiz();
  } catch (error) {
    $('#wordList').innerHTML = '<div class="empty-state">The word list could not be loaded. Please refresh the page or check that the assets folder was uploaded.</div>';
    $('#status').textContent = error.message;
  }
}

$('#searchInput').addEventListener('input', event => { state.query = event.target.value; $('#clearSearch').hidden = !state.query; renderWordList(); renderDetail(); });
$('#clearSearch').addEventListener('click', () => { state.query = ''; $('#searchInput').value = ''; $('#clearSearch').hidden = true; renderWordList(); renderDetail(); $('#searchInput').focus(); });
$('#learnedButton').addEventListener('click', () => { const id = selectedWord().id; state.learned.has(id) ? state.learned.delete(id) : state.learned.add(id); saveProgress(); renderWordList(); renderDetail(); });
$('#speakWord').addEventListener('click', () => speak(selectedWord().word));
$('#speakExample').addEventListener('click', () => speak(selectedWord().example));
$('#prevWord').addEventListener('click', () => moveWord(-1));
$('#nextWord').addEventListener('click', () => moveWord(1));
$('#restartQuiz').addEventListener('click', startQuiz);
$('#nextQuestion').addEventListener('click', nextQuestion);
$$('.mode-tab').forEach(button => button.addEventListener('click', () => switchMode(button.dataset.mode)));
document.addEventListener('keydown', event => { if (state.mode === 'learn' && event.target.tagName !== 'INPUT' && (event.key === 'ArrowDown' || event.key === 'ArrowRight')) moveWord(1); else if (state.mode === 'learn' && event.target.tagName !== 'INPUT' && (event.key === 'ArrowUp' || event.key === 'ArrowLeft')) moveWord(-1); });
init();
