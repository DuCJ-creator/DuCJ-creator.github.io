window.TOEIC_CONTENT = {
  parts: [
    {
      id: 1, section: "Listening", title: "Photographs", zh: "照片描述", count: 6, time: "約 2–3 分鐘",
      focus: "動作、位置、被動語態", focusEn: "actions, position, passive voice", signal: "先掃描人物、物件與位置關係，再聽動詞。", signalEn: "Scan people, objects, and spatial relationships before listening for the verb.",
      strategies: ["播放前快速確認人物、主要物件與場景。", "人物正在做什麼，優先聽現在進行式；物件狀態常用被動語態。", "選項只要有一個關鍵細節不符，就立即排除。"],
      strategiesEn: ["Identify the people, main objects, and setting before the audio begins.", "Listen for the present progressive with people and the passive voice with objects.", "Eliminate an option as soon as one key detail conflicts with the image."],
      trap: "用照片中確實存在的名詞，搭配錯誤動作或位置。"
    },
    {
      id: 2, section: "Listening", title: "Question–Response", zh: "應答問題", count: 25, time: "約 9 分鐘",
      focus: "問句功能、間接回答", focusEn: "question function, indirect responses", signal: "鎖定第一個疑問詞與助動詞，不等整句翻譯。", signalEn: "Lock onto the opening question word or auxiliary; do not wait to translate the whole sentence.",
      strategies: ["先判斷是 who、where、when、why、how 或 Yes/No 類型。", "正確答案常是自然的間接回答，而非重複問句字詞。", "錯過一題就立刻猜答並重置注意力，不能追想。"],
      strategiesEn: ["Classify the prompt as who, where, when, why, how, or yes/no.", "Expect a natural indirect response rather than repeated words from the question.", "If you miss one item, guess, reset your attention, and move on immediately."],
      trap: "用相似音、同字重複或文法正確但功能不符的回應。"
    },
    {
      id: 3, section: "Listening", title: "Conversations", zh: "簡短對話", count: 39, time: "約 17 分鐘",
      focus: "意圖、細節、圖表整合", focusEn: "intention, detail, visual integration", signal: "利用題目空檔先讀問題，建立要聽的三個目標。", signalEn: "Use the preview time to turn the three questions into three listening targets.",
      strategies: ["播放前先讀三題題幹，圈出人物、問題與下一步。", "依說話者輪替記錄：誰、問題、決定。", "意圖題要連結語氣與上下文，不只抓單句字面。"],
      strategiesEn: ["Preview all three stems and identify the people, problem, and likely next step.", "Track speaker turns with three notes: who, problem, decision.", "For intention questions, connect tone with context instead of relying on one literal sentence."],
      trap: "對話提到某選項，但那不是最後決定或題目所問的人。"
    },
    {
      id: 4, section: "Listening", title: "Talks", zh: "簡短獨白", count: 30, time: "約 16 分鐘",
      focus: "主旨、結構、行動指示", focusEn: "purpose, structure, action", signal: "開頭辨認類型：公告、留言、導覽、廣告或簡報。", signalEn: "Identify the genre at the opening: announcement, message, tour, advertisement, or presentation.",
      strategies: ["先讀題目，預測要找時間、地點、目的或行動。", "注意 first、however、because、finally 等結構訊號。", "數字資訊要和單位、對象一起記，避免只記單一數字。"],
      strategiesEn: ["Preview the questions and predict whether you need a time, place, purpose, or action.", "Listen for structure signals such as first, however, because, and finally.", "Record numbers together with their unit and referent, never as isolated digits."],
      trap: "混用公告中的舊安排、例外資訊與最後更新。"
    },
    {
      id: 5, section: "Reading", title: "Incomplete Sentences", zh: "句子填空", count: 30, time: "建議 10 分鐘",
      focus: "詞性、句法、搭配", focusEn: "part of speech, syntax, collocation", signal: "先看空格左右，判斷缺的是詞性還是語法功能。", signalEn: "Read around the blank first and decide whether the gap tests form or meaning.",
      strategies: ["四個選項同字根：先做詞性定位。", "四個選項不同字：回到語意與搭配。", "每題約 20 秒；卡住先標記，不讓單題偷走時間。"],
      strategiesEn: ["If the options share one word family, identify the required part of speech first.", "If the options are different words, test meaning and collocation.", "Aim for about 20 seconds; mark difficult items so one question cannot steal the section."],
      trap: "字義看似合理，但詞性、時態、主動被動或搭配不成立。"
    },
    {
      id: 6, section: "Reading", title: "Text Completion", zh: "段落填空", count: 16, time: "建議 8 分鐘",
      focus: "篇章連貫、代名詞、句子插入", focusEn: "cohesion, reference, sentence insertion", signal: "先辨認文件類型與溝通目的，再處理每個空格。", signalEn: "Identify the document type and communication purpose before solving individual blanks.",
      strategies: ["文法題看句內；連接詞與句子插入題看前後兩句。", "追蹤代名詞、時間與語氣是否一致。", "完成後快速通讀，確認整段像同一個人寫的。"],
      strategiesEn: ["Use the sentence for grammar; use both surrounding sentences for connectors and insertion.", "Track pronouns, time, and tone for consistency.", "Reread the completed text quickly and check that it sounds like one coherent message."],
      trap: "句子本身正確，但與前後文的指涉、時序或語氣斷裂。"
    },
    {
      id: 7, section: "Reading", title: "Reading Comprehension", zh: "閱讀理解", count: 54, time: "建議 57 分鐘",
      focus: "定位、推論、多文本整合", focusEn: "location, inference, cross-text synthesis", signal: "先掃文件來源、標題、日期與版面，再用題幹建立搜尋目標。", signalEn: "Scan the source, title, date, and layout; then turn the questions into search targets.",
      strategies: ["主旨題看整體目的；細節題用關鍵詞定位後讀上下句。", "推論必須有文本證據，不用背景常識補故事。", "雙篇、三篇題先辨認文件關係，再做跨文本整合題。"],
      strategiesEn: ["Use the whole document for purpose questions; locate keywords and read nearby lines for details.", "An inference needs textual evidence—do not complete the story with outside assumptions.", "For double and triple passages, identify the relationship between documents before synthesising them."],
      trap: "把文本中的真實資訊重新拼接成一個沒有被支持的結論。"
    }
  ],
  methods: [
    { index: "01", titleEn: "SQ3R Reading", title: "SQ3R 有效閱讀", textEn: "Survey and question before you read; then recite and review. In Part 7, questions become targets for evidence.", text: "先巡覽、提問，再閱讀、複述、複習。用在 Part 7 時，題目會成為定位證據的目標。", steps: ["Survey", "Question", "Read", "Recite", "Review"] },
    { index: "02", titleEn: "Active Listening", title: "主動聆聽", textEn: "Predict before listening, notice structure while listening, and restate the message afterwards.", text: "聽之前預測、聽的時候辨認結構、聽完用自己的話重述。", steps: ["Predict", "Listen", "Rephrase"] },
    { index: "03", titleEn: "Cornell Notes", title: "Cornell 筆記", textEn: "Put evidence on the right, cues on the left, and an actionable summary at the bottom.", text: "右欄記證據，左欄寫問題與線索，底部濃縮成可執行規則。", steps: ["Cue", "Evidence", "Summary"] },
    { index: "04", titleEn: "Time & Stress", title: "時間與壓力管理", textEn: "Use daily actions and weekly plans while protecting sleep, movement, and realistic recovery.", text: "用每日清單看見下一步，以週計畫安排任務，同時保護睡眠、活動與恢復。", steps: ["Plan", "Protect", "Reflect"] },
    { index: "05", titleEn: "Action before Motivation", title: "先做再有動機", textEn: "Shrink the task to 15 minutes and record visible evidence. Motivation often follows action.", text: "把任務縮小到 15 分鐘並記錄完成證據；動機常在開始之後出現。", steps: ["Define", "15 min", "Record"] }
  ],
  universityTopics: [
    {
      id: 1, title: "Personal Management", zh: "自我管理",
      thesis: "University success begins with managing your own attention, effort, and choices.",
      thesisZh: "大學的成功，從管理自己的注意力、投入程度與選擇開始。",
      lessons: [
        { en: "Motivation can be intrinsic (personal satisfaction) or extrinsic (rewards and recognition). Use both deliberately.", zh: "動機可來自內在滿足，也可來自獎勵與肯定；兩者都能有意識地運用。" },
        { en: "Make progress visible: keep a work diary, list concrete tasks, and mark what you complete.", zh: "讓進度看得見：用學習日誌列出具體任務，完成後留下紀錄。" },
        { en: "Beat procrastination by shrinking the first step and starting before you feel completely ready.", zh: "把第一步縮小，在尚未覺得完全準備好之前就開始，以此破解拖延。" }
      ],
      action: "Write one 15-minute goal, complete it, and record the evidence.",
      actionZh: "寫下一個 15 分鐘目標，完成它，並留下完成證據。",
      reflection: "Which obstacle is really stopping you: unclear goals, distraction, fear, or fatigue?",
      reflectionZh: "真正阻礙你的是目標不清、分心、害怕，還是疲勞？",
      terms: ["intrinsic motivation 內在動機", "accountability 責任追蹤", "procrastination 拖延"]
    },
    {
      id: 2, title: "Time & Stress Management", zh: "時間與壓力管理",
      thesis: "A calendar protects important work; recovery protects the person doing it.",
      thesisZh: "行事曆保護重要任務，而休息與恢復保護執行任務的人。",
      lessons: [
        { en: "Use a daily to-do list for immediate actions and a semester plan for deadlines, exams, and major projects.", zh: "每日清單管理眼前行動；學期計畫則安排截止日、考試與大型專案。" },
        { en: "Identify time robbers such as unnecessary notifications, vague meetings, overcommitment, and poor communication.", zh: "辨認時間竊賊，例如不必要的通知、目的不明的會議、過度承諾與溝通不良。" },
        { en: "Stress management includes realistic planning, sleep, movement, nutrition, social support, and timely help.", zh: "壓力管理包括務實規劃、睡眠、活動、飲食、社會支持，以及適時求助。" }
      ],
      action: "Map the next four weeks and mark every fixed deadline before adding study sessions.",
      actionZh: "先在四週行事曆標出所有固定期限，再加入讀書時段。",
      reflection: "Which repeated activity takes time without moving an important goal forward?",
      reflectionZh: "哪一項重複活動持續耗時，卻沒有推進任何重要目標？",
      terms: ["semester plan 學期計畫", "time robber 時間竊賊", "overcommitment 過度承諾"]
    },
    {
      id: 3, title: "Efficient Listening & Reading", zh: "高效聽讀",
      thesis: "Active learners predict, question, connect, and restate; they do not merely receive information.",
      thesisZh: "主動學習者會預測、提問、連結與重述，而不是只接收資訊。",
      lessons: [
        { en: "Before a lecture, preview the topic and prepare questions; during it, listen for structure and emphasis.", zh: "課前先預覽主題並準備問題；課中聆聽結構與重點訊號。" },
        { en: "Use SQ3R: Survey, Question, Read, Recite, and Review to turn reading into a purposeful cycle.", zh: "用 SQ3R——巡覽、提問、閱讀、複述、複習——把閱讀變成有目的的循環。" },
        { en: "Skim for the map, scan for a target, then slow down only where evidence or reasoning matters.", zh: "先略讀建立地圖，再掃讀定位目標；只有在證據或推理處才放慢。" }
      ],
      action: "Preview one text for two minutes and write three questions before reading it closely.",
      actionZh: "精讀前先花兩分鐘預覽文章，並寫下三個想解答的問題。",
      reflection: "What changed when you read with a question instead of reading line by line?",
      reflectionZh: "帶著問題閱讀，而不是逐行閱讀時，你注意到哪些改變？",
      terms: ["active listening 主動聆聽", "skim 略讀", "scan 掃讀", "recite 複述"]
    },
    {
      id: 4, title: "Note-taking", zh: "筆記能力",
      thesis: "Notes are not a transcript; they are a thinking tool for remembering, questioning, and reviewing.",
      thesisZh: "筆記不是逐字稿，而是用來記憶、提問與複習的思考工具。",
      lessons: [
        { en: "Record main ideas, supporting evidence, definitions, examples, and changes in the lecturer's emphasis.", zh: "記錄主旨、支持證據、定義、例子，以及講者語氣或重點的變化。" },
        { en: "Use abbreviations and space deliberately; capture diagrams or mark where to find them later.", zh: "有意識地使用縮寫與留白；記下圖表，或標示之後可取得的位置。" },
        { en: "In Cornell notes, keep cues on the left, evidence on the right, and a concise summary at the bottom.", zh: "Cornell 筆記左欄放線索，右欄放證據，底部寫精簡摘要。" }
      ],
      action: "Turn one page of notes into five cue questions, then answer them without looking.",
      actionZh: "把一頁筆記改寫成五個線索問題，再不看筆記回答。",
      reflection: "Could your future self reconstruct the idea from these notes one week later?",
      reflectionZh: "一週後的你，能否只靠這份筆記重建完整概念？",
      terms: ["cue 線索", "evidence 證據", "abbreviation 縮寫", "review 複習"]
    },
    {
      id: 5, title: "Library Research", zh: "圖書館研究",
      thesis: "Research is a planned search for credible evidence, not a random collection of links.",
      thesisZh: "研究是有計畫地尋找可信證據，而不是隨機蒐集連結。",
      lessons: [
        { en: "Learn the library layout, catalogue, loan system, databases, reference desk, and quiet work areas.", zh: "熟悉圖書館配置、館藏目錄、借閱系統、資料庫、參考服務與安靜工作區。" },
        { en: "Begin with a preliminary outline and search terms; use bibliographies to discover stronger sources.", zh: "先建立初步大綱與搜尋詞，再利用參考書目找到更有力的來源。" },
        { en: "Evaluate authority, relevance, currency, evidence, and purpose before using a source.", zh: "使用來源前，評估作者權威性、相關性、時效、證據與寫作目的。" }
      ],
      action: "Find one overview source and use its references to locate two more specialized sources.",
      actionZh: "先找一份概論來源，再沿其參考資料找到兩份更專門的來源。",
      reflection: "What makes this source trustworthy enough for academic work?",
      reflectionZh: "這份來源憑什麼值得放進學術作業？",
      terms: ["catalogue 館藏目錄", "database 資料庫", "authority 權威性", "citation 引用"]
    },
    {
      id: 6, title: "Writing Essays", zh: "學術寫作",
      thesis: "Good writing is scheduled, researched, drafted, and rewritten—not produced in one sitting.",
      thesisZh: "好文章來自排程、研究、起草與重寫，而不是一次坐下就完成。",
      lessons: [
        { en: "Create one file for each assignment: instructions, early ideas, sources, notes, outline, and drafts.", zh: "每份作業建立一個完整檔案：題目要求、初步想法、來源、筆記、大綱與草稿。" },
        { en: "Plan backward from the deadline and give reading, outlining, drafting, feedback, and revision their own weeks.", zh: "從截止日倒推，分別替閱讀、大綱、起草、回饋與修訂安排時間。" },
        { en: "Start the first draft on schedule. Revision improves argument, structure, evidence, language, and accuracy.", zh: "按計畫開始第一稿；修訂會改善論點、結構、證據、語言與準確度。" }
      ],
      action: "Build a five-week backward plan for one real assignment and schedule the first drafting day.",
      actionZh: "替一份真實作業建立五週倒推計畫，並排定第一天起草日期。",
      reflection: "Which stage do you usually skip, and what quality problem does that create?",
      reflectionZh: "你通常跳過哪個階段？這會造成什麼品質問題？",
      terms: ["outline 大綱", "draft 草稿", "redraft 重寫", "proofread 校對"]
    }
  ],
  proofreadingSets: [
    {
      id: 1, title: "Office Renovation", zh: "辦公室整修", level: "Core",
      lead: "Select every highlighted fragment that needs revision.",
      leadZh: "選出所有需要修正的標示片段。",
      parts: [
        "The west wing ",
        { id:"1a", text:"will be close", correct:"will be closed", type:"Passive voice · 被動語態", reason:"The wing receives the action, so the future passive requires will be + past participle." },
        " ",
        { id:"1b", text:"during two weeks", correct:"for two weeks", type:"Preposition · 介系詞", reason:"Use for with a duration; during is followed by an event or named period." },
        " while the lighting system is replaced. ",
        { id:"1c", text:"Employees are asked", correct:"Employees are asked", type:"No error · 無錯誤", reason:"The plural subject employees correctly takes are, and the passive form is complete." },
        " to use the east entrance."
      ]
    },
    {
      id: 2, title: "Client Follow-up", zh: "客戶後續信", level: "Core",
      lead: "Proofread this email before it is sent to a client.", leadZh: "在寄給客戶前完成這封郵件的校對。",
      parts: [
        "Thank you for meeting with us yesterday. The ",
        { id:"2a", text:"informations", correct:"information", type:"Countability · 可數性", reason:"Information is an uncountable noun and does not take a plural -s." },
        " you provided will help us prepare the proposal. Please reply ",
        { id:"2b", text:"until Friday", correct:"by Friday", type:"Deadline preposition · 截止時間", reason:"By marks a deadline. Until describes a continuing action up to a time." },
        ". The revised price list is ",
        { id:"2c", text:"attached", correct:"attached", type:"No error · 無錯誤", reason:"Attached correctly describes the file included with the message." },
        " for your review."
      ]
    },
    {
      id: 3, title: "Event Update", zh: "活動異動公告", level: "Intermediate",
      lead: "Find the errors in this public announcement.", leadZh: "找出這則公開公告中的錯誤。",
      parts: [
        "The outdoor product demonstration ",
        { id:"3a", text:"has postpone", correct:"has been postponed", type:"Present perfect passive · 現在完成被動", reason:"The event receives the action; use has been + past participle." },
        " ",
        { id:"3b", text:"because of heavy rain", correct:"because of heavy rain", type:"No error · 無錯誤", reason:"Because of correctly introduces the noun phrase heavy rain." },
        ". It will now ",
        { id:"3c", text:"held", correct:"be held", type:"Future passive · 未來被動", reason:"After will, the passive needs be + past participle." },
        " in Hall B at 2:30 p.m."
      ]
    },
    {
      id: 4, title: "Quarterly Report", zh: "季度報告", level: "Intermediate",
      lead: "Check the grammar and business style in this report excerpt.", leadZh: "檢查這段報告的文法與商務表達。",
      parts: [
        "Online sales increased ",
        { id:"4a", text:"steady", correct:"steadily", type:"Part of speech · 詞性", reason:"The verb increased must be modified by the adverb steadily." },
        " throughout the quarter. We also received ",
        { id:"4b", text:"fewer complaints", correct:"fewer complaints", type:"No error · 無錯誤", reason:"Complaints is countable, so fewer is the correct comparative." },
        " than last year. The management team ",
        { id:"4c", text:"recommends to expand", correct:"recommends expanding", type:"Verb pattern · 動詞搭配", reason:"Recommend is normally followed by a gerund or a that-clause, not an infinitive." },
        " the delivery service next quarter."
      ]
    },
    {
      id: 5, title: "Research Skills", zh: "研究能力", level: "Advanced",
      lead: "Proofread this university study guide.", leadZh: "校對這段大學學習指南。",
      parts: [
        { id:"5a", text:"Each students", correct:"Each student", type:"Determiner agreement · 限定詞一致", reason:"Each is followed by a singular countable noun." },
        " should begin with a clear research question. Before using a source, students ",
        { id:"5b", text:"must to evaluate", correct:"must evaluate", type:"Modal verb · 情態動詞", reason:"A modal verb is followed by the base form without to." },
        " its authority, relevance, and evidence. Good ",
        { id:"5c", text:"research takes time", correct:"research takes time", type:"No error · 無錯誤", reason:"Research is uncountable here and correctly takes the singular verb takes." },
        "."
      ]
    },
    {
      id: 6, title: "Conference Registration", zh: "研討會報名", level: "Advanced",
      lead: "Look for errors in grammar, reference, and cohesion.", leadZh: "找出文法、指涉與連貫性問題。",
      parts: [
        "Participants who register before May 10 will receive ",
        { id:"6a", text:"a discounted fee", correct:"a discounted fee", type:"No error · 無錯誤", reason:"The article, adjective, and noun form a correct noun phrase." },
        ". After completing the online form, ",
        { id:"6b", text:"it should be printed", correct:"participants should print the confirmation page", type:"Dangling reference · 指涉不清", reason:"The original pronoun leaves the person performing the action unclear; name the actor directly." },
        ". The confirmation page must be presented ",
        { id:"6c", text:"when arrive", correct:"when arriving", type:"Reduced clause · 簡化子句", reason:"Use the -ing form in the reduced time clause: when arriving." },
        " at the venue."
      ]
    }
  ],
  questions: [
    { id:"p1-1", part:1, context:"場景：一名員工站在會議室白板前，手上拿著筆；幾位同事坐在桌旁。", audioText:"A. The chairs are being stacked in a corner. B. A woman is making a presentation. C. The employees are leaving the building. D. A screen is being repaired.", question:"哪一句最符合照片場景？", options:["The chairs are being stacked in a corner.","A woman is making a presentation.","The employees are leaving the building.","A screen is being repaired."], answer:1, explanation:"人物正站在白板前向同事說明，making a presentation 最精確。" },
    { id:"p1-2", part:1, context:"場景：兩個紙箱放在辦公桌旁，桌上有電話與數份文件。", audioText:"A. Some boxes have been placed beside a desk. B. A telephone is being installed on the wall. C. The documents are being mailed. D. The desk is being moved outdoors.", question:"哪一句最符合照片場景？", options:["Some boxes have been placed beside a desk.","A telephone is being installed on the wall.","The documents are being mailed.","The desk is being moved outdoors."], answer:0, explanation:"boxes、beside a desk 與完成狀態 have been placed 都吻合。" },
    { id:"p1-3", part:1, context:"場景：旅客坐在車站長椅上看手機，一只行李箱立在腳邊。", audioText:"A. A passenger is checking a mobile device. B. The luggage is being weighed. C. A bench is being painted. D. The train has arrived at the platform.", question:"哪一句最符合照片場景？", options:["A passenger is checking a mobile device.","The luggage is being weighed.","A bench is being painted.","The train has arrived at the platform."], answer:0, explanation:"checking a mobile device 描述可見動作；其餘資訊並未出現在場景中。" },

    { id:"p2-1", part:2, audioText:"When will the revised schedule be available? A. By tomorrow afternoon. B. In the conference room. C. Yes, it was revised.", question:"選出最自然的回應。", options:["By tomorrow afternoon.","In the conference room.","Yes, it was revised."], answer:0, explanation:"When 詢問時間；By tomorrow afternoon 直接提供完成期限。" },
    { id:"p2-2", part:2, audioText:"Why don't we move the meeting online? A. The connection was stable. B. That would make it easier for Leo to join. C. I moved the file yesterday.", question:"選出最自然的回應。", options:["The connection was stable.","That would make it easier for Leo to join.","I moved the file yesterday."], answer:1, explanation:"Why don't we… 是提議；B 自然回應提議的好處。" },
    { id:"p2-3", part:2, audioText:"Who approved the travel reimbursement? A. I think Ms. Patel did. B. A round-trip ticket. C. It was quite expensive.", question:"選出最自然的回應。", options:["I think Ms. Patel did.","A round-trip ticket.","It was quite expensive."], answer:0, explanation:"Who 詢問人物；Ms. Patel 是唯一回答人物的選項。" },

    { id:"p3-1", part:3, audioText:"Woman: Have you finished the brochure for the trade fair? Man: The text is ready, but the designer needs the new product photo. Woman: I'll ask the marketing team to send it before noon.", transcript:"Woman: Have you finished the brochure for the trade fair?\nMan: The text is ready, but the designer needs the new product photo.\nWoman: I'll ask the marketing team to send it before noon.", question:"What will the woman probably do next?", options:["Print the brochure","Contact the marketing team","Attend the trade fair","Rewrite the product description"], answer:1, explanation:"女子最後明確表示 I'll ask the marketing team，因此下一步是聯絡行銷團隊。" },
    { id:"p3-2", part:3, audioText:"Man: The client dinner starts at seven, but my train arrives at six forty-five. Woman: That's tight. I can reserve a taxi to meet you at the station. Man: Thanks. Please tell the driver to use the east exit.", transcript:"Man: The client dinner starts at seven, but my train arrives at 6:45.\nWoman: I can reserve a taxi to meet you at the station.\nMan: Please tell the driver to use the east exit.", question:"Why does the man need a taxi?", options:["He is carrying heavy luggage.","He is unfamiliar with the city.","He has little time before an event.","The east exit is closed."], answer:2, explanation:"6:45 抵達、7:00 晚餐，時間很趕；這是需要計程車的原因。" },
    { id:"p3-3", part:3, audioText:"Woman: We received twelve applications for the internship. Man: Great. Should we interview everyone on Friday? Woman: We only have two hours, so let's choose the six strongest candidates first.", transcript:"Woman: We received 12 applications for the internship.\nMan: Should we interview everyone on Friday?\nWoman: We only have two hours, so let's choose the six strongest candidates first.", question:"What do the speakers decide to do?", options:["Extend the application deadline","Select candidates before interviewing","Cancel Friday's interviews","Hire two interns immediately"], answer:1, explanation:"因只有兩小時，他們決定先選出六位較強的候選人。" },

    { id:"p4-1", part:4, audioText:"Attention library visitors. The third floor study area will close at six p.m. today for electrical maintenance. Quiet study rooms remain available on the second floor until nine. Please take all personal items with you when leaving.", transcript:"The third-floor study area will close at 6:00 p.m. today for electrical maintenance. Quiet study rooms remain available on the second floor until 9:00.", question:"Why will part of the library close early?", options:["A private event is scheduled.","Electrical work will be done.","The staff will attend training.","New furniture will be delivered."], answer:1, explanation:"公告直接說明 for electrical maintenance。" },
    { id:"p4-2", part:4, audioText:"Thank you for calling Northline Dental Clinic. Our office is closed for the holiday and will reopen Tuesday at eight thirty. To change an appointment, leave your name, phone number, and preferred date after the tone.", transcript:"Northline Dental Clinic is closed for the holiday and will reopen Tuesday at 8:30. Callers may leave information to change an appointment.", question:"What are callers asked to provide?", options:["An insurance number","A home address","A preferred appointment date","A payment method"], answer:2, explanation:"留言需包含 name、phone number 與 preferred date。" },
    { id:"p4-3", part:4, audioText:"Welcome to today's software workshop. Before we begin, please download the sample file from the link in your confirmation email. During the first hour, we will build a sales dashboard. After a short break, you will work in pairs to customize it.", transcript:"Before the workshop begins, participants should download a sample file. First they will build a dashboard; later they will customize it in pairs.", question:"What should participants do first?", options:["Form pairs","Open a sales account","Download a sample file","Complete a survey"], answer:2, explanation:"Before we begin 明確指出第一步是下載 sample file。" },

    { id:"p5-1", part:5, question:"The finance director requested a more ______ explanation of the quarterly expenses.", options:["detail","detailed","details","detailing"], answer:1, explanation:"空格修飾名詞 explanation，需要形容詞 detailed。" },
    { id:"p5-2", part:5, question:"All visitors must register at reception ______ entering the research facility.", options:["before","during","despite","unless"], answer:0, explanation:"依語意是進入設施之前登記；before 可接動名詞 entering。" },
    { id:"p5-3", part:5, question:"Ms. Huang has worked in international sales ______ more than eight years.", options:["since","for","while","from"], answer:1, explanation:"完成式搭配一段時間 more than eight years，使用 for。" },

    { id:"p6-1", part:6, context:"To: All staff\nSubject: West entrance closure\nBeginning Monday, the west entrance will be closed for two weeks while the security gates are replaced. ______, employees should enter through the lobby on King Street. ID badges will still be required.", question:"選出最適合空格的連接詞。", options:["For example","In the meantime","Otherwise","Similarly"], answer:1, explanation:"施工兩週期間改走另一入口，In the meantime 表示『在此期間』。" },
    { id:"p6-2", part:6, context:"Thank you for registering for the Green Office webinar. A link will be sent one day before the event. Please add events@greenteam.org to your contacts. ______.", question:"選出最適合放在結尾的句子。", options:["This will help prevent the message from being sent to your spam folder.","The office furniture was delivered last week.","Our annual report contains four sections.","Several speakers live near the venue."], answer:0, explanation:"前句要求加入聯絡人，後句應解釋原因：避免連結郵件進入垃圾信箱。" },
    { id:"p6-3", part:6, context:"The Riverside Café is pleased to introduce online ordering. Customers can now place and pay for orders through our website. Orders are usually ready within fifteen minutes, but preparation may take ______ during the lunch rush.", question:"選出最適合空格的答案。", options:["long","longer","longest","lengthen"], answer:1, explanation:"與平常 15 分鐘相比，午餐尖峰需要更久，使用比較級 longer。" },

    { id:"p7-1", part:7, context:"FROM: Facilities Office\nTO: Building occupants\nDATE: May 12\n\nThe air-conditioning system will be inspected on Saturday, May 17. Technicians will need access to every office between 9:00 a.m. and 1:00 p.m. Please unlock interior office doors before leaving on Friday. Employees do not need to be present during the inspection.", question:"What are employees asked to do?", options:["Work from home on Friday","Leave office doors unlocked","Meet the technicians at 9:00","Turn off the air-conditioning system"], answer:1, explanation:"通知明確要求 Please unlock interior office doors before leaving on Friday。" },
    { id:"p7-2", part:7, context:"CITY CYCLE MEMBERSHIP\nBasic — $12/month: unlimited 30-minute rides\nPlus — $20/month: unlimited 60-minute rides and two free guest passes\nDay Pass — $8: unlimited 20-minute rides for 24 hours\n\nExtra time is billed at $3 per additional 15 minutes for all plans.", question:"Which plan includes benefits for another rider?", options:["Basic","Plus","Day Pass","All plans"], answer:1, explanation:"只有 Plus 明列 two free guest passes，可供其他騎士使用。" },
    { id:"p7-3", part:7, context:"Email 1 — From Lina to Marco, 10:15 a.m.\nThe samples for the Weston presentation arrived, but the blue model is missing. Can you check with the warehouse?\n\nEmail 2 — From Marco to Lina, 10:42 a.m.\nThe warehouse shipped the blue model separately because it needed extra packaging. The courier expects to deliver it by 2:00 p.m. I'll bring all three models to Conference Room B at 3:30.", question:"Why was the blue model sent separately?", options:["It was ordered later.","It required different packaging.","It will be shown in another room.","It came from a different warehouse."], answer:1, explanation:"第二封信指出 because it needed extra packaging，屬跨文本定位。" }
  ]
};
