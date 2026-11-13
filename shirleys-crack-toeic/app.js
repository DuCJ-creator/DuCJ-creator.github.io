(() => {
  "use strict";

  const content = window.TOEIC_CONTENT;
  const storageKey = "shirley-crack-toeic-v1";
  const state = loadState();
  let vocabulary = [];
  let filteredWords = [];
  let activeWordIndex = 0;
  let visibleWords = 30;
  let activePart = 1;
  let quiz = null;
  let timerSeconds = 15 * 60;
  let timerRound = 1;
  let timerId = null;
  let toastTimer = null;
  let activeUniversityTopic = 1;
  let activeProofSet = 1;
  let selectedProofFragments = new Set();
  let proofSubmitted = false;
  let speechRunId = 0;
  let speechPauseTimer = null;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escapeHTML = (value = "") => String(value).replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
  const proofReasonZh = {
    "1a":"west wing 是動作承受者；未來被動要使用 will be 加過去分詞。", "1b":"表示一段持續時間使用 for；during 後面通常接事件或特定期間。", "1c":"複數主詞 employees 搭配 are，且被動結構完整。",
    "2a":"information 是不可數名詞，不能加複數 -s。", "2b":"by 表示截止期限；until 表示動作持續到某個時間。", "2c":"attached 正確描述隨信附上的檔案。",
    "3a":"活動是動作承受者，現在完成被動需用 has been 加過去分詞。", "3b":"because of 後接名詞片語 heavy rain，用法正確。", "3c":"will 之後的被動語態需用 be 加過去分詞。",
    "4a":"修飾動詞 increased 需要副詞 steadily。", "4b":"complaints 是可數名詞，因此比較級 fewer 正確。", "4c":"recommend 通常接動名詞或 that 子句，不接不定詞。",
    "5a":"each 後面接單數可數名詞。", "5b":"情態動詞 must 後面直接接原形動詞，不加 to。", "5c":"此處 research 為不可數名詞，搭配單數動詞 takes 正確。",
    "6a":"冠詞、形容詞與名詞組成正確的名詞片語。", "6b":"原句代名詞讓執行動作的人不清楚，應直接說明主詞 participants。", "6c":"簡化時間子句使用 when arriving。"
  };

  function loadState() {
    const defaults = { target: 850, mastered: [], review: [], attempts: 0, correct: 0, studyDates: [], notes: { cues:"", notes:"", summary:"" } };
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(storageKey) || "{}") }; }
    catch { return defaults; }
  }

  function saveState() {
    localStorage.setItem(storageKey, JSON.stringify(state));
  }

  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function markStudyDay() {
    const today = new Date().toISOString().slice(0, 10);
    if (!state.studyDates.includes(today)) {
      state.studyDates.push(today);
      state.studyDates = state.studyDates.slice(-45);
      saveState();
    }
    let streak = 0;
    const days = new Set(state.studyDates);
    const cursor = new Date();
    while (days.has(cursor.toISOString().slice(0, 10))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
    $("#streak-count").textContent = streak;
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 6);
    const recent = state.studyDates.filter(date => new Date(`${date}T00:00:00`) >= weekStart).length;
    $("#week-progress").style.width = `${Math.min(100, recent / 7 * 100)}%`;
  }

  function setupRouting() {
    const route = () => {
      stopSpeech();
      const requested = location.hash.replace("#", "") || "dashboard";
      const valid = ["dashboard", "exam", "vocab", "practice", "proofread", "readiness"];
      const current = valid.includes(requested) ? requested : "dashboard";
      $$("[data-view]").forEach(view => { view.hidden = view.dataset.view !== current; });
      $$("[data-route]").forEach(link => link.classList.toggle("active", link.dataset.route === current));
      document.title = `${routeTitle(current)} · Shirley's Crack TOEIC`;
      window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    window.addEventListener("hashchange", route);
    $$('[data-go]').forEach(button => button.addEventListener("click", () => { location.hash = button.dataset.go; }));
    route();
  }

  function routeTitle(route) {
    return ({ dashboard:"Overview · 總覽", exam:"Exam Strategy · 題型攻略", vocab:"Vocabulary · 字彙實驗室", practice:"Practice · 模擬訓練", proofread:"Proofreading · 校對實驗室", readiness:"Ready for University · 大學先修" })[route];
  }

  function renderMatrix() {
    const matrix = $("#exam-matrix");
    const labels = $("#matrix-labels");
    matrix.innerHTML = content.parts.flatMap(part => Array.from({ length: part.count }, (_, i) =>
      `<button class="exam-cell ${part.section === "Listening" ? "listening" : ""}" data-part="${part.id}" title="Part ${part.id} · Q${i + 1} · ${escapeHTML(part.zh)}"><span class="sr-only">Part ${part.id} 第 ${i + 1} 題</span></button>`
    )).join("");
    labels.innerHTML = content.parts.map(part => `<button data-matrix-part="${part.id}">P${part.id} · ${part.count}</button>`).join("");
    $$('[data-part]', matrix).forEach(cell => cell.addEventListener("click", () => goToPart(Number(cell.dataset.part))));
    $$('[data-matrix-part]', labels).forEach(button => button.addEventListener("click", () => goToPart(Number(button.dataset.matrixPart))));
  }

  function goToPart(part) {
    activePart = part;
    renderPartDetail();
    location.hash = "exam";
  }

  function renderPartTabs() {
    const tabs = $("#part-tabs");
    tabs.innerHTML = content.parts.map(part => `<button class="part-tab" role="tab" id="part-tab-${part.id}" aria-controls="part-panel" aria-selected="${part.id === activePart}" data-tab-part="${part.id}">P${part.id}<br>${escapeHTML(part.zh)}</button>`).join("");
    $$('[data-tab-part]', tabs).forEach(tab => tab.addEventListener("click", () => {
      activePart = Number(tab.dataset.tabPart);
      renderPartTabs();
      renderPartDetail();
    }));
  }

  function renderPartDetail() {
    renderPartTabs();
    const part = content.parts.find(item => item.id === activePart);
    $("#part-detail").innerHTML = `
      <div class="part-hero" id="part-panel" role="tabpanel" aria-labelledby="part-tab-${part.id}">
        <div>
          <div class="part-identity"><span class="part-number ${part.section === "Reading" ? "reading" : ""}">P${part.id}</span><div><p>${part.section}</p><h2>${escapeHTML(part.title)} · ${escapeHTML(part.zh)}</h2></div></div>
          <p class="part-lede"><b>Core move · 核心任務：</b>${escapeHTML(part.signalEn)}<span class="zh-support">${escapeHTML(part.signal)}</span></p>
          <ol class="strategy-list">${part.strategiesEn.map((strategy, index) => `<li><b>${escapeHTML(strategy)}</b><span class="zh-support">${escapeHTML(part.strategies[index])}</span></li>`).join("")}</ol>
          <button class="button primary" data-start-part="${part.id}">Practise this part · 練這一題型 <span aria-hidden="true">→</span></button>
        </div>
        <aside class="part-side">
          <dl><div><dt>Questions · 題數</dt><dd>${part.count}</dd></div><div><dt>Pacing · 建議節奏</dt><dd>${escapeHTML(part.time)}</dd></div><div><dt>Focus · 能力焦點</dt><dd>${escapeHTML(part.focusEn)}<br>${escapeHTML(part.focus)}</dd></div></dl>
          <div class="trap-box"><b>Common trap · 常見陷阱</b><p>${escapeHTML(part.trap)}</p></div>
        </aside>
      </div>`;
    $("[data-start-part]").addEventListener("click", () => preparePracticePart(part.id));
  }

  function setupTarget() {
    const dialog = $("#target-dialog");
    const input = $("#target-score");
    const display = $("#target-score-display");
    display.textContent = state.target;
    input.value = state.target;
    $("#edit-target").addEventListener("click", () => dialog.showModal());
    $("#save-target").addEventListener("click", event => {
      const value = Number(input.value);
      const valid = value >= 10 && value <= 990 && value % 5 === 0;
      if (!valid) {
        event.preventDefault();
        $("#target-error").classList.add("show");
        input.setAttribute("aria-invalid", "true");
        input.setAttribute("aria-describedby", "target-error");
        input.focus();
        return;
      }
      state.target = value;
      saveState();
      display.textContent = value;
      $("#target-error").classList.remove("show");
      input.removeAttribute("aria-invalid");
      toast(`Target updated to ${value} · 目標已更新為 ${value} 分`);
    });
  }

  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (quoted) {
        if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
        else if (char === '"') quoted = false;
        else field += char;
      } else if (char === '"') quoted = true;
      else if (char === ",") { row.push(field); field = ""; }
      else if (char === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
      else field += char;
    }
    if (field || row.length) { row.push(field); rows.push(row); }
    const headers = rows.shift().map(value => value.trim());
    return rows.filter(rowData => rowData.some(Boolean)).map(rowData => Object.fromEntries(headers.map((header, i) => [header, rowData[i] || ""])));
  }

  async function loadVocabulary() {
    try {
      const response = await fetch("data/toeic-vocab.csv");
      if (!response.ok) throw new Error("Vocabulary request failed");
      vocabulary = parseCSV(await response.text()).map((word, index) => ({ ...word, id: `${word.word.toLowerCase()}-${index}` }));
      populateChapterFilter();
      filterVocabulary();
    } catch {
      $("#flashcard-title").textContent = "Vocabulary unavailable · 字彙未載入";
      $("#word-list").innerHTML = `<div class="empty-state"><b>Open this site through a local server or GitHub Pages.</b><p>直接雙擊 HTML 時，瀏覽器通常會阻擋 CSV 載入。</p></div>`;
      $("#load-more-words").hidden = true;
    }
  }

  function populateChapterFilter() {
    const select = $("#chapter-filter");
    [...new Set(vocabulary.map(word => word.chapter))].forEach(chapter => {
      const option = document.createElement("option");
      option.value = chapter;
      option.textContent = chapter;
      select.append(option);
    });
  }

  function filterVocabulary() {
    const query = $("#vocab-search").value.trim().toLowerCase();
    const chapter = $("#chapter-filter").value;
    const sort = $("#vocab-sort").value;
    filteredWords = vocabulary.filter(word => {
      const haystack = `${word.word} ${word.meaning} ${word["english sentence"]} ${word["chinese sentence"]}`.toLowerCase();
      return (chapter === "all" || word.chapter === chapter) && (!query || haystack.includes(query));
    });
    if (sort === "az") filteredWords.sort((a, b) => a.word.localeCompare(b.word));
    if (sort === "unfamiliar") filteredWords.sort((a, b) => Number(state.mastered.includes(a.id)) - Number(state.mastered.includes(b.id)));
    activeWordIndex = Math.min(activeWordIndex, Math.max(0, filteredWords.length - 1));
    visibleWords = 30;
    renderFlashcard();
    renderWordList();
    $("#clear-search").hidden = !query;
  }

  function renderFlashcard() {
    const card = $("#flashcard");
    card.classList.remove("flipped");
    if (!filteredWords.length) {
      $("#flashcard-counter").textContent = "0 / 0";
      $("#flashcard-title").textContent = "No matching words · 沒有符合的字彙";
      $("#flashcard-domain").textContent = "Adjust the search or domain filter · 請調整搜尋或主題";
      $("#flashcard-pos").textContent = "";
      $("#flashcard-meaning").textContent = "";
      $("#flashcard-example").textContent = "";
      $("#flashcard-translation").textContent = "";
      return;
    }
    const word = filteredWords[activeWordIndex];
    $("#flashcard-counter").textContent = `${activeWordIndex + 1} / ${filteredWords.length}`;
    $("#flashcard-domain").textContent = word.subchapter;
    $("#flashcard-title").textContent = word.word;
    $("#flashcard-pos").textContent = word.pos;
    $("#flashcard-meaning").textContent = word.meaning;
    $("#flashcard-example").textContent = word["english sentence"];
    $("#flashcard-translation").textContent = word["chinese sentence"];
  }

  function renderWordList() {
    const list = $("#word-list");
    $("#word-result-count").textContent = `${filteredWords.length} words`;
    $("#mastered-count").textContent = state.mastered.length;
    if (!filteredWords.length) {
      list.innerHTML = `<div class="empty-state">No matching words. Clear the search or choose another domain.<br>找不到符合的字彙，請清除搜尋或改選其他主題。</div>`;
      $("#load-more-words").hidden = true;
      return;
    }
    list.innerHTML = filteredWords.slice(0, visibleWords).map((word, index) => `<button class="word-row ${state.mastered.includes(word.id) ? "mastered" : ""}" data-word-index="${index}"><b>${escapeHTML(word.word)}</b><span>${escapeHTML(word.meaning)}</span><i aria-label="${state.mastered.includes(word.id) ? "已熟練" : "未熟練"}"></i></button>`).join("");
    $$('[data-word-index]', list).forEach(button => button.addEventListener("click", () => {
      activeWordIndex = Number(button.dataset.wordIndex);
      renderFlashcard();
      $("#flashcard").scrollIntoView({ behavior: "smooth", block: "center" });
    }));
    $("#load-more-words").hidden = visibleWords >= filteredWords.length;
  }

  function setupVocabulary() {
    let searchTimer;
    $("#vocab-search").addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(filterVocabulary, 180);
      $("#clear-search").hidden = !$("#vocab-search").value;
    });
    $("#clear-search").addEventListener("click", () => {
      $("#vocab-search").value = "";
      filterVocabulary();
      $("#vocab-search").focus();
    });
    $("#chapter-filter").addEventListener("change", filterVocabulary);
    $("#vocab-sort").addEventListener("change", filterVocabulary);
    $("#flashcard").addEventListener("click", () => $("#flashcard").classList.toggle("flipped"));
    $("#flashcard").addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); $("#flashcard").classList.toggle("flipped"); }
      if (event.key === "ArrowRight" && filteredWords.length) { activeWordIndex = (activeWordIndex + 1) % filteredWords.length; renderFlashcard(); }
      if (event.key === "ArrowLeft" && filteredWords.length) { activeWordIndex = (activeWordIndex - 1 + filteredWords.length) % filteredWords.length; renderFlashcard(); }
    });
    $("#shuffle-vocab").addEventListener("click", () => {
      if (!filteredWords.length) return;
      activeWordIndex = Math.floor(Math.random() * filteredWords.length);
      renderFlashcard();
    });
    $("#mark-mastered").addEventListener("click", () => markWord(true));
    $("#mark-review").addEventListener("click", () => markWord(false));
    $("#load-more-words").addEventListener("click", () => { visibleWords += 30; renderWordList(); });
  }

  function markWord(mastered) {
    if (!filteredWords.length) return;
    const word = filteredWords[activeWordIndex];
    state.mastered = state.mastered.filter(id => id !== word.id);
    state.review = state.review.filter(id => id !== word.id);
    (mastered ? state.mastered : state.review).push(word.id);
    saveState();
    toast(mastered ? `${word.word} marked as mastered · 已標為熟練` : `${word.word} added to review · 已放入待複習`);
    if (activeWordIndex < filteredWords.length - 1) activeWordIndex += 1;
    renderFlashcard();
    renderWordList();
  }

  function renderPracticeOptions() {
    $("#practice-part-options").innerHTML = `<label><input type="radio" name="practice-part" value="all" checked><span>Mixed · 綜合</span></label>${content.parts.map(part => `<label><input type="radio" name="practice-part" value="${part.id}"><span>P${part.id}</span></label>`).join("")}`;
  }

  function preparePracticePart(part) {
    location.hash = "practice";
    const input = $(`input[name="practice-part"][value="${part}"]`);
    if (input) input.checked = true;
    $("#practice-setup").hidden = false;
    $("#quiz-stage").hidden = true;
    setTimeout(() => $("#start-practice").focus(), 150);
  }

  function startQuiz() {
    const part = $('input[name="practice-part"]:checked').value;
    const countValue = $('input[name="question-count"]:checked').value;
    let pool = content.questions.filter(question => part === "all" || question.part === Number(part));
    pool = shuffle([...pool]);
    const requested = countValue === "all" ? pool.length : Number(countValue);
    const questions = pool.slice(0, Math.min(requested, pool.length));
    quiz = { questions, index: 0, correct: 0, answered: false };
    $("#practice-setup").hidden = true;
    $("#quiz-stage").hidden = false;
    $("#session-score").textContent = "0%";
    renderQuestion();
  }

  function renderQuestion() {
    stopSpeech();
    const question = quiz.questions[quiz.index];
    const part = content.parts.find(item => item.id === question.part);
    const listening = question.part <= 4;
    const transcriptText = listening ? getListeningTranscript(question) : "";
    quiz.answered = false;
    $("#quiz-stage").innerHTML = `
      <div class="quiz-top"><span>PART ${question.part} · ${escapeHTML(part.zh)}</span><span>${quiz.index + 1} / ${quiz.questions.length}</span></div>
      <div class="quiz-progress"><span style="width:${(quiz.index + 1) / quiz.questions.length * 100}%"></span></div>
      <article class="quiz-card">
        ${question.context ? `<div class="quiz-context ${listening ? "" : "reading"}">${escapeHTML(question.context)}</div>` : ""}
        ${listening ? `<div class="audio-actions"><button class="button primary" id="play-audio" aria-pressed="false">▶ Play with natural pauses · 自然停頓播放</button><button class="button quiet" id="toggle-transcript">Show punctuated transcript · 顯示標點逐字稿</button></div><p class="audio-note" id="audio-status" aria-live="polite">Sentence boundaries and speaker turns are preserved. · 依句界、選項與說話者自然停頓。</p><div class="quiz-context transcript-panel" id="transcript" hidden>${escapeHTML(transcriptText)}</div>` : ""}
        <h2 class="quiz-question">${escapeHTML(question.question)}</h2>
        <div class="answer-options">${question.options.map((option, index) => `<button class="answer-option" data-answer="${index}"><strong>${String.fromCharCode(65 + index)}</strong><span>${escapeHTML(option)}</span></button>`).join("")}</div>
        <div class="explanation" id="explanation" hidden></div>
        <div class="quiz-next" id="quiz-next" hidden><button class="button primary">${quiz.index === quiz.questions.length - 1 ? "View results · 查看結果" : "Next question · 下一題"} →</button></div>
      </article>`;
    $$('[data-answer]', $("#quiz-stage")).forEach(button => button.addEventListener("click", () => answerQuestion(Number(button.dataset.answer))));
    const play = $("#play-audio");
    if (play) play.addEventListener("click", () => speakQuestion(question));
    const transcript = $("#toggle-transcript");
    if (transcript) transcript.addEventListener("click", () => {
      const panel = $("#transcript");
      panel.hidden = !panel.hidden;
      transcript.textContent = panel.hidden ? "Show punctuated transcript · 顯示標點逐字稿" : "Hide transcript · 隱藏逐字稿";
    });
  }

  function getListeningTranscript(question) {
    const text = question.audioText || question.transcript || question.question;
    if (question.part === 1 || question.part === 2) return text.replace(/\s+(?=[A-D]\.\s)/g, "\n");
    if (question.part === 3) return text.replace(/\s+(?=(?:Woman|Man):\s)/g, "\n");
    return text;
  }

  function getSpeechSegments(question) {
    const text = question.audioText || question.question;
    if (question.part === 1) {
      return text.split(/\s+(?=[A-D]\.\s)/).map(value => ({ text: value.replace(/^([A-D])\.\s/, "Option $1. "), pause: 650 }));
    }
    if (question.part === 2) {
      const optionStart = text.search(/\sA\.\s/);
      const stem = optionStart < 0 ? text : text.slice(0, optionStart).trim();
      const options = optionStart < 0 ? [] : text.slice(optionStart + 1).split(/\s+(?=[A-C]\.\s)/);
      return [
        { text: stem, pause: 850 },
        ...options.map(value => ({ text: value.replace(/^([A-C])\.\s/, "Option $1. "), pause: 650 }))
      ];
    }
    if (question.part === 3) {
      return text.split(/\s+(?=(?:Woman|Man):\s)/).map(value => ({ text: value, pause: 520 }));
    }
    if (typeof Intl.Segmenter === "function") {
      const segmenter = new Intl.Segmenter("en-US", { granularity: "sentence" });
      return [...segmenter.segment(text)].map(({ segment }) => ({ text: segment.trim(), pause: 460 })).filter(item => item.text);
    }
    return text.split(/(?<=[!?])\s+|(?<!\b(?:Mr|Ms|Dr|p|a))\.\s+/i).map(value => ({ text: value.trim(), pause: 460 })).filter(item => item.text);
  }

  function setAudioButtonState(playing) {
    const button = $("#play-audio");
    if (!button) return;
    button.textContent = playing ? "■ Stop audio · 停止播放" : "▶ Play with natural pauses · 自然停頓播放";
    button.setAttribute("aria-pressed", String(playing));
  }

  function stopSpeech() {
    const wasPlaying = $("#play-audio")?.getAttribute("aria-pressed") === "true";
    speechRunId += 1;
    clearTimeout(speechPauseTimer);
    speechPauseTimer = null;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    setAudioButtonState(false);
    const status = $("#audio-status");
    if (wasPlaying && status) status.textContent = "Playback stopped. Replay when ready. · 播放已停止，可再次聆聽。";
  }

  function speakQuestion(question) {
    if (!("speechSynthesis" in window)) { toast("Audio is unavailable; use the transcript. · 此瀏覽器不支援語音，請使用逐字稿。"); return; }
    const playButton = $("#play-audio");
    if (playButton?.getAttribute("aria-pressed") === "true") { stopSpeech(); return; }
    stopSpeech();
    const runId = speechRunId;
    const segments = getSpeechSegments(question);
    const status = $("#audio-status");
    setAudioButtonState(true);
    if (status) status.textContent = "Playing the punctuated script with natural pauses. · 正以完整標點與自然停頓播放。";

    const speakSegment = index => {
      if (runId !== speechRunId) return;
      if (index >= segments.length) {
        setAudioButtonState(false);
        if (status) status.textContent = "Playback complete. Replay when ready. · 播放完畢，可再次聆聽。";
        return;
      }
      const segment = segments[index];
      const utterance = new SpeechSynthesisUtterance(segment.text);
      utterance.lang = "en-US";
      utterance.rate = .84;
      utterance.pitch = 1;
      utterance.onend = () => {
        if (runId !== speechRunId) return;
        speechPauseTimer = setTimeout(() => speakSegment(index + 1), segment.pause);
      };
      utterance.onerror = event => {
        if (event.error === "canceled" || runId !== speechRunId) return;
        stopSpeech();
        if (status) status.textContent = "Playback stopped. Use the punctuated transcript below. · 播放中止，請改用下方標點逐字稿。";
      };
      speechSynthesis.speak(utterance);
    };
    speakSegment(0);
  }

  function answerQuestion(selected) {
    if (quiz.answered) return;
    quiz.answered = true;
    const question = quiz.questions[quiz.index];
    const correct = selected === question.answer;
    if (correct) quiz.correct += 1;
    state.attempts += 1;
    if (correct) state.correct += 1;
    saveState();
    $$('[data-answer]', $("#quiz-stage")).forEach((button, index) => {
      button.disabled = true;
      if (index === question.answer) button.classList.add("correct");
      if (index === selected && !correct) button.classList.add("incorrect");
    });
    const explanation = $("#explanation");
    explanation.innerHTML = `<b>${correct ? "Correct · 答對了" : "Review the evidence · 再看一次"}</b><span>${escapeHTML(question.explanation)}</span>`;
    explanation.hidden = false;
    $("#quiz-next").hidden = false;
    $("#session-score").textContent = `${Math.round(quiz.correct / (quiz.index + 1) * 100)}%`;
    $("#quiz-next button").addEventListener("click", () => {
      if (quiz.index < quiz.questions.length - 1) { quiz.index += 1; renderQuestion(); }
      else renderResult();
    });
  }

  function renderResult() {
    const percentage = Math.round(quiz.correct / quiz.questions.length * 100);
    $("#quiz-stage").innerHTML = `<div class="result-card"><p class="eyebrow">Session complete</p><h2>Practice complete <span class="zh-inline">這回合完成了</span></h2><strong>${percentage}%</strong><p>${quiz.correct} / ${quiz.questions.length} correct · 答對。${percentage >= 80 ? " Your decisions are steady; increase the set next time. · 節奏與判斷穩定，下回可增加題數。" : " Review the explanations and identify the repeated signal. · 回看解析，找出重複的錯誤訊號。"}</p><div class="hero-actions" style="justify-content:center"><button class="button primary" id="retry-quiz">Practise again · 再練一回</button><button class="button quiet" data-result-go="exam">Exam strategy · 回題型攻略</button></div></div>`;
    $("#retry-quiz").addEventListener("click", () => { $("#practice-setup").hidden = false; $("#quiz-stage").hidden = true; });
    $('[data-result-go]').addEventListener("click", () => { location.hash = "exam"; });
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function renderMethods() {
    $("#method-grid").innerHTML = content.methods.map(method => `<article class="method-card"><span class="method-index">METHOD ${method.index}</span><h2>${escapeHTML(method.titleEn)}<span class="zh-support">${escapeHTML(method.title)}</span></h2><p><b>${escapeHTML(method.textEn)}</b><span class="zh-support">${escapeHTML(method.text)}</span></p><div class="method-steps">${method.steps.map(step => `<span>${escapeHTML(step)}</span>`).join("")}</div></article>`).join("");
  }

  function renderUniversityTopics() {
    const tabs = $("#university-topic-tabs");
    tabs.innerHTML = content.universityTopics.map(topic => `<button type="button" class="university-topic-tab" role="tab" aria-selected="${topic.id === activeUniversityTopic}" data-university-topic="${topic.id}"><span>TOPIC ${String(topic.id).padStart(2, "0")}</span><b>${escapeHTML(topic.title)}</b><small>${escapeHTML(topic.zh)}</small></button>`).join("");
    $$('[data-university-topic]', tabs).forEach(button => button.addEventListener("click", () => {
      activeUniversityTopic = Number(button.dataset.universityTopic);
      renderUniversityTopics();
    }));
    const topic = content.universityTopics.find(item => item.id === activeUniversityTopic);
    $("#university-topic-detail").innerHTML = `
      <article role="tabpanel">
        <div class="course-intro"><div><p class="eyebrow">Topic ${String(topic.id).padStart(2, "0")} · Ready for University</p><h3>${escapeHTML(topic.title)}</h3><p class="thesis-en">${escapeHTML(topic.thesis)}</p><p class="thesis-zh">${escapeHTML(topic.zh)}｜${escapeHTML(topic.thesisZh)}</p></div><div class="course-terms">${topic.terms.map(term => `<span>${escapeHTML(term)}</span>`).join("")}</div></div>
        <div class="course-lessons">${topic.lessons.map((lesson, index) => `<section class="course-lesson"><span>KEY IDEA ${index + 1}</span><p class="lesson-en">${escapeHTML(lesson.en)}</p><p class="lesson-zh">${escapeHTML(lesson.zh)}</p></section>`).join("")}</div>
        <div class="course-prompts"><section class="course-prompt"><b>Action task · 行動任務</b><p>${escapeHTML(topic.action)}</p><small>${escapeHTML(topic.actionZh)}</small></section><section class="course-prompt reflect"><b>Reflection · 反思</b><p>${escapeHTML(topic.reflection)}</p><small>${escapeHTML(topic.reflectionZh)}</small></section></div>
      </article>`;
  }

  function renderProofreading() {
    const list = $("#proofread-set-list");
    const coverage = content.proofreadingCoverage || { textbookModules: content.proofreadingSets.length, integratedReviews: 0, decisions: content.proofreadingSets.length * 3 };
    $("#proof-count").textContent = content.proofreadingSets.length;
    const categoryCounts = content.proofreadingSets.reduce((counts, set) => counts.set(set.category || "Integrated review · 綜合複習", (counts.get(set.category || "Integrated review · 綜合複習") || 0) + 1), new Map());
    $("#grammar-coverage").innerHTML = `<div><p class="eyebrow">Complete textbook coverage · 教材完整覆蓋</p><h2>22 core rules + the Essential Grammar Mind Map</h2><p>Each module contains a business or academic passage, three proofreading decisions, and a bilingual rule key. <span class="zh-support">每個單元包含情境短文、三個校對判斷，以及雙語規則解析。</span></p></div><dl><div><dt>Textbook modules · 教材單元</dt><dd>${coverage.textbookModules}</dd></div><div><dt>Integrated reviews · 綜合複習</dt><dd>${coverage.integratedReviews}</dd></div><div><dt>Grammar decisions · 文法判斷</dt><dd>${coverage.decisions}</dd></div></dl><div class="coverage-tags">${[...categoryCounts].map(([name, count]) => `<span>${escapeHTML(name)} <b>${count}</b></span>`).join("")}</div>`;
    list.innerHTML = content.proofreadingSets.map(set => `<button type="button" class="proofread-set-button" data-proof-set="${set.id}" aria-current="${set.id === activeProofSet}"><span>${String(set.id).padStart(2, "0")}</span><div><em>${escapeHTML(set.rule || "Integrated Review")} · ${escapeHTML(set.ruleZh || "綜合複習")}</em><b>${escapeHTML(set.title)}</b><small>${escapeHTML(set.zh)}</small></div></button>`).join("");
    $$('[data-proof-set]', list).forEach(button => button.addEventListener("click", () => {
      activeProofSet = Number(button.dataset.proofSet);
      selectedProofFragments = new Set();
      proofSubmitted = false;
      renderProofreading();
    }));
    const set = content.proofreadingSets.find(item => item.id === activeProofSet);
    const passage = set.parts.map(part => typeof part === "string" ? escapeHTML(part) : `<button type="button" class="proof-fragment" data-proof-fragment="${part.id}">${escapeHTML(part.text)}</button>`).join("");
    const setIndex = content.proofreadingSets.findIndex(item => item.id === activeProofSet);
    $("#proofread-stage").innerHTML = `
      <div class="proofread-head"><div><p class="eyebrow">Module ${String(set.id).padStart(2, "0")} / ${content.proofreadingSets.length}</p><h2>${escapeHTML(set.title)} · ${escapeHTML(set.zh)}</h2><p class="module-rule">${escapeHTML(set.rule || "Integrated Review")} <span>${escapeHTML(set.ruleZh || "綜合複習")}</span></p><p>${escapeHTML(set.lead)} <span class="zh-support">${escapeHTML(set.leadZh)}</span></p></div><span class="level-tag">${escapeHTML(set.level)}</span></div>
      <div class="proof-passage">${passage}</div>
      <div class="proof-actions"><p>Select all fragments that contain an error. · 選出所有含有錯誤的片段。</p><button type="button" class="button primary" id="check-proof">Check my proof · 核對答案</button></div>
      <div class="proof-module-nav"><button type="button" class="button quiet" id="proof-prev" ${setIndex === 0 ? "disabled" : ""}>← Previous rule · 上一個</button><span>${setIndex + 1} / ${content.proofreadingSets.length}</span><button type="button" class="button quiet" id="proof-next" ${setIndex === content.proofreadingSets.length - 1 ? "disabled" : ""}>Next rule · 下一個 →</button></div>`;
    $$('[data-proof-fragment]', $("#proofread-stage")).forEach(button => button.addEventListener("click", () => {
      const id = button.dataset.proofFragment;
      if (selectedProofFragments.has(id)) selectedProofFragments.delete(id); else selectedProofFragments.add(id);
      button.classList.toggle("selected", selectedProofFragments.has(id));
      button.setAttribute("aria-pressed", String(selectedProofFragments.has(id)));
    }));
    $("#check-proof").addEventListener("click", checkProofreading);
    const moveToSet = offset => {
      const next = content.proofreadingSets[setIndex + offset];
      if (!next) return;
      activeProofSet = next.id;
      selectedProofFragments = new Set();
      proofSubmitted = false;
      renderProofreading();
      $("#proofread-stage").scrollIntoView({ block: "start", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    };
    $("#proof-prev").addEventListener("click", () => moveToSet(-1));
    $("#proof-next").addEventListener("click", () => moveToSet(1));
  }

  function checkProofreading() {
    if (proofSubmitted) return;
    proofSubmitted = true;
    const set = content.proofreadingSets.find(item => item.id === activeProofSet);
    const fragments = set.parts.filter(part => typeof part !== "string");
    const errors = fragments.filter(part => part.text !== part.correct);
    let correctMarks = 0;
    fragments.forEach(fragment => {
      const isError = fragment.text !== fragment.correct;
      const selected = selectedProofFragments.has(fragment.id);
      if (isError === selected) correctMarks += 1;
      const button = $(`[data-proof-fragment="${fragment.id}"]`);
      button.disabled = true;
      button.classList.add(isError ? "is-error" : "is-correct");
    });
    $("#check-proof").disabled = true;
    $("#check-proof").textContent = `${correctMarks}/${fragments.length} decisions correct · 判斷正確`;
    $("#proofread-stage").insertAdjacentHTML("beforeend", `<div class="proof-key"><h3>Correction key · 訂正解析</h3>${fragments.map(fragment => {
      const isError = fragment.text !== fragment.correct;
      return `<article class="proof-key-item ${isError ? "error" : "correct"}"><b>${escapeHTML(fragment.type)}</b><code>${isError ? `${escapeHTML(fragment.text)} → ${escapeHTML(fragment.correct)}` : `${escapeHTML(fragment.text)} ✓`}</code><p>${escapeHTML(fragment.reason)}<span class="zh-support">${escapeHTML(fragment.reasonZh || proofReasonZh[fragment.id] || "")}</span></p></article>`;
    }).join("")}</div>`);
    toast(`${errors.length} planted errors · 本題共有 ${errors.length} 個錯誤`);
  }

  function setupTimer() {
    const render = () => {
      const minutes = Math.floor(timerSeconds / 60).toString().padStart(2, "0");
      const seconds = (timerSeconds % 60).toString().padStart(2, "0");
      $("#timer-display").textContent = `${minutes}:${seconds}`;
      $("#focus-round").textContent = `Round ${timerRound} / 4`;
    };
    $("#timer-toggle").addEventListener("click", () => {
      if (timerId) {
        clearInterval(timerId); timerId = null; $("#timer-toggle").textContent = "Continue · 繼續"; return;
      }
      if (!$("#focus-task").value.trim()) { toast("Write one specific, achievable task first. · 先寫下具體可完成的任務。"); $("#focus-task").focus(); return; }
      $("#timer-toggle").textContent = "Pause · 暫停";
      timerId = setInterval(() => {
        timerSeconds -= 1;
        render();
        if (timerSeconds <= 0) {
          clearInterval(timerId); timerId = null;
          if (timerRound < 4) { timerRound += 1; timerSeconds = 15 * 60; toast("Round complete. Breathe, then prepare for the next 15 minutes. · 完成一輪，起身呼吸。"); }
          else { timerRound = 1; timerSeconds = 15 * 60; toast("Four rounds complete. Take a longer break. · 四輪完成，請安排較長休息。"); }
          $("#timer-toggle").textContent = "Start · 開始";
          render();
        }
      }, 1000);
    });
    $("#timer-reset").addEventListener("click", () => {
      clearInterval(timerId); timerId = null; timerSeconds = 15 * 60; timerRound = 1; $("#timer-toggle").textContent = "Start · 開始"; render();
    });
    render();
  }

  function setupNotes() {
    const fields = { "#cornell-cues":"cues", "#cornell-notes":"notes", "#cornell-summary":"summary" };
    Object.entries(fields).forEach(([selector, key]) => {
      const field = $(selector);
      field.value = state.notes[key] || "";
      field.addEventListener("input", () => { state.notes[key] = field.value; saveState(); });
    });
  }

  function setupDialogsAndMobile() {
    $("#open-sources").addEventListener("click", () => $("#sources-dialog").showModal());
    const toggle = $("#mobile-nav-toggle");
    toggle.addEventListener("click", () => {
      const nav = $("#mobile-nav");
      nav.hidden = !nav.hidden;
      toggle.setAttribute("aria-expanded", String(!nav.hidden));
    });
    $$("#mobile-nav a").forEach(link => link.addEventListener("click", () => {
      if (innerWidth <= 780) { $("#mobile-nav").hidden = true; toggle.setAttribute("aria-expanded", "false"); }
    }));
    $$('[data-practice-part]').forEach(button => button.addEventListener("click", () => preparePracticePart(Number(button.dataset.practicePart))));
  }

  function init() {
    markStudyDay();
    renderMatrix();
    renderPartDetail();
    renderPracticeOptions();
    renderMethods();
    renderUniversityTopics();
    renderProofreading();
    setupRouting();
    setupTarget();
    setupVocabulary();
    setupTimer();
    setupNotes();
    setupDialogsAndMobile();
    $("#start-practice").addEventListener("click", startQuiz);
    loadVocabulary();
  }

  init();
})();
