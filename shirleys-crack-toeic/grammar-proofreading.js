(() => {
  "use strict";

  const f = (id, text, correct, type, reason, reasonZh) => ({ id, text, correct, type, reason, reasonZh });
  const make = (id, rule, ruleZh, title, zh, category, parts) => ({
    id,
    rule,
    ruleZh,
    title,
    zh,
    category,
    level: id <= 22 ? `Rule ${String(id).padStart(2, "0")}` : "Mind Map",
    lead: "Find every fragment that needs revision. One fragment may already be correct.",
    leadZh: "找出所有需要修正的片段；其中可能有一個片段原本就是正確的。",
    parts
  });

  const textbookSets = [
    make(1, "Simple Present", "現在簡單式", "Daily Operations", "日常營運", "Verb time & agreement · 時態與一致", [
      "The customer service desk ",
      f("r01a", "open at 8:30 every weekday", "opens at 8:30 every weekday", "Simple present · 現在簡單式", "A singular third-person subject takes a verb ending in -s in the simple present.", "第三人稱單數主詞在現在簡單式中，動詞要加 -s。"),
      " and ",
      f("r01b", "handles international inquiries", "handles international inquiries", "No error · 無錯誤", "Handles correctly agrees with the singular subject desk.", "handles 與單數主詞 desk 正確一致。"),
      ". It also ",
      f("r01c", "answer online requests", "answers online requests", "Habitual action · 習慣動作", "Use the simple present for a routine and add -s after it.", "例行工作使用現在簡單式；主詞 it 後的動詞要加 -s。"),
      " within one business day."
    ]),
    make(2, "Simple Past", "過去簡單式", "Expense Review", "費用審查", "Verb time & agreement · 時態與一致", [
      "Last Friday, the finance team ",
      f("r02a", "review the travel claims", "reviewed the travel claims", "Simple past · 過去簡單式", "The finished time marker last Friday requires the simple past.", "last Friday 表示已結束的過去時間，因此要用過去簡單式。"),
      ", ",
      f("r02b", "identified two duplicate receipts", "identified two duplicate receipts", "No error · 無錯誤", "Identified correctly reports a completed past action.", "identified 正確表示已完成的過去動作。"),
      ", and ",
      f("r02c", "send the report to management", "sent the report to management", "Irregular past · 不規則過去式", "The irregular past form of send is sent.", "send 的不規則過去式是 sent。"),
      "."
    ]),
    make(3, "Present Perfect", "現在完成式", "Sustainability Progress", "永續進度", "Verb time & agreement · 時態與一致", [
      "Since January, the company ",
      f("r03a", "has launch three recycling programs", "has launched three recycling programs", "Present perfect · 現在完成式", "Use has plus the past participle launched.", "現在完成式使用 has 加過去分詞 launched。"),
      " and ",
      f("r03b", "has reduced paper use by 18 percent", "has reduced paper use by 18 percent", "No error · 無錯誤", "Has reduced correctly links past progress to the present.", "has reduced 正確連結過去開始、目前仍有結果的進展。"),
      ". It ",
      f("r03c", "did not receive any complaints since the change", "has not received any complaints since the change", "Since + present perfect · since 搭配完成式", "A period beginning with since normally takes the present perfect.", "since 引出的延續期間通常搭配現在完成式。"),
      "."
    ]),
    make(4, "Subject-Verb Agreement", "主詞動詞一致", "Supplier Directory", "供應商名錄", "Verb time & agreement · 時態與一致", [
      "A list of approved suppliers ",
      f("r04a", "are posted on the intranet", "is posted on the intranet", "Agreement · 主詞動詞一致", "The head noun list is singular; the phrase of approved suppliers does not control the verb.", "主要名詞 list 是單數；of approved suppliers 不決定動詞形式。"),
      ". Each department ",
      f("r04b", "submits an update monthly", "submits an update monthly", "No error · 無錯誤", "Each department is singular and correctly takes submits.", "each department 是單數，正確搭配 submits。"),
      ". Neither the manager nor the assistants ",
      f("r04c", "was available", "were available", "Neither...nor · 就近一致", "With neither...nor, the verb agrees with the nearer plural subject assistants.", "neither...nor 結構中，動詞與較近的複數主詞 assistants 一致。"),
      " during the audit."
    ]),
    make(5, "Negatives", "否定句", "Customer Complaints", "客訴紀錄", "Verb time & agreement · 時態與一致", [
      "The new ticketing system ",
      f("r05a", "doesn't requires a password reset", "doesn't require a password reset", "Do-support · 助動詞否定", "After doesn't, use the base form require.", "doesn't 後面要接原形動詞 require。"),
      ". We ",
      f("r05b", "have not received any security complaints", "have not received any security complaints", "No error · 無錯誤", "Not...any forms a standard negative expression.", "not...any 是正確的否定結構。"),
      ", and ",
      f("r05c", "hardly no users need assistance", "hardly any users need assistance", "Double negative · 雙重否定", "Hardly is already negative in meaning, so use any rather than no.", "hardly 已含否定意義，因此應使用 any，避免雙重否定。"),
      "."
    ]),
    make(6, "Verb 'To Be'", "be 動詞", "Training Schedule", "訓練時程", "Verb time & agreement · 時態與一致", [
      "The orientation session ",
      f("r06a", "is scheduled for Monday", "is scheduled for Monday", "No error · 無錯誤", "Is correctly agrees with the singular subject and forms the present passive.", "is 與單數主詞一致，也正確構成現在式被動。"),
      ". The meeting rooms ",
      f("r06b", "was unavailable yesterday", "were unavailable yesterday", "Past be · be 動詞過去式", "The plural subject rooms takes were in the past.", "複數主詞 rooms 的過去式要搭配 were。"),
      ", but the final session ",
      f("r06c", "be tomorrow", "will be tomorrow", "Future be · be 動詞未來式", "Use will be to express a future state.", "表示未來狀態要使用 will be。"),
      "."
    ]),
    make(7, "Verb 'Can'", "can／could／be able to", "Portal Access", "系統存取", "Verb time & agreement · 時態與一致", [
      "Applicants ",
      f("r07a", "can submit documents online", "can submit documents online", "No error · 無錯誤", "Can plus the base form submit correctly expresses present ability.", "can 加原形動詞 submit 正確表示目前能力。"),
      ". Last year, overseas users ",
      f("r07b", "cannot access the portal", "could not access the portal", "Past ability · 過去能力", "Use could not for inability in a past time frame.", "過去時間範圍中的無法做到要用 could not。"),
      ". After the upgrade, they ",
      f("r07c", "will can upload larger files", "will be able to upload larger files", "Future ability · 未來能力", "Can has no future form with will; use will be able to.", "can 不能與 will 直接連用；未來能力使用 will be able to。"),
      "."
    ]),
    make(8, "Adverbs", "副詞", "Performance Review", "績效評估", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "Mina responded ",
      f("r08a", "quick to the client's request", "quickly to the client's request", "Adverb form · 副詞形式", "The verb responded must be modified by the adverb quickly.", "修飾動詞 responded 必須使用副詞 quickly。"),
      ", ",
      f("r08b", "carefully reviewed the contract", "carefully reviewed the contract", "No error · 無錯誤", "Carefully correctly modifies reviewed.", "carefully 正確修飾 reviewed。"),
      ", and prepared an ",
      f("r08c", "extreme useful summary", "extremely useful summary", "Degree adverb · 程度副詞", "Use the adverb extremely to modify the adjective useful.", "修飾形容詞 useful 要使用程度副詞 extremely。"),
      "."
    ]),
    make(9, "Adverbs of Frequency", "頻率副詞", "Inventory Routine", "庫存例行作業", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "We ",
      f("r09a", "every week update the inventory list", "update the inventory list every week", "Frequency placement · 頻率表達位置", "The time expression every week is most natural at the end of the clause.", "時間片語 every week 最自然的位置是在子句末端。"),
      ". The delivery truck ",
      f("r09b", "usually arrives before noon", "usually arrives before noon", "No error · 無錯誤", "A frequency adverb normally comes before a main verb.", "頻率副詞通常放在一般動詞之前。"),
      ", and staff members ",
      f("r09c", "are often submit counts by three", "often submit counts by three", "Frequency + main verb · 頻率副詞與一般動詞", "Do not insert be before a simple-present main verb; place often before submit.", "現在簡單式的一般動詞前不加 be；often 放在 submit 前。"),
      "."
    ]),
    make(10, "This / That / These / Those", "指示詞", "Document Control", "文件管理", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      f("r10a", "This documents", "These documents", "Demonstrative agreement · 指示詞一致", "The plural noun documents requires the plural demonstrative these.", "複數名詞 documents 必須搭配複數指示詞 these。"),
      " must be archived today. Please keep ",
      f("r10b", "that policy", "that policy", "No error · 無錯誤", "That correctly modifies the singular noun policy.", "that 正確修飾單數名詞 policy。"),
      " for reference, and replace ",
      f("r10c", "these type of label", "this type of label", "Singular head noun · 單數中心詞", "Type is singular, so use this; alternatively, write these types of labels.", "type 是單數，因此用 this；也可改為 these types of labels。"),
      "."
    ]),
    make(11, "Countable and Uncountable Nouns", "可數與不可數名詞", "Equipment Request", "設備申請", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "The design team needs ",
      f("r11a", "many new equipment", "a lot of new equipment", "Uncountable noun · 不可數名詞", "Equipment is uncountable, so do not use many or add a plural ending.", "equipment 是不可數名詞，不能搭配 many，也不加複數字尾。"),
      ". The technician gave us ",
      f("r11b", "three pieces of advice", "three pieces of advice", "No error · 無錯誤", "Pieces of correctly counts the uncountable noun advice.", "pieces of 正確用來計算不可數名詞 advice。"),
      ", but the form provides ",
      f("r11c", "fewer information", "less information", "Less vs. fewer · less 與 fewer", "Use less with the uncountable noun information.", "不可數名詞 information 應搭配 less。"),
      " than we need."
    ]),
    make(12, "Comparisons", "比較級與最高級", "Service Comparison", "服務比較", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "The new courier is ",
      f("r12a", "more efficient than the previous provider", "more efficient than the previous provider", "No error · 無錯誤", "More efficient than is the correct comparative structure.", "more efficient than 是正確的比較級結構。"),
      " and ",
      f("r12b", "costs least than before", "costs less than before", "Comparative · 比較級", "Use less than for a two-way comparison; least is a superlative.", "兩者比較使用 less than；least 是最高級。"),
      ". It also offers ",
      f("r12c", "the most fastest delivery option", "the fastest delivery option", "Double comparison · 重複比較", "Do not combine most with the -est form fastest.", "最高級不能同時使用 most 與 -est。"),
      "."
    ]),
    make(13, "Indefinite Pronouns", "不定代名詞", "Office Handover", "工作交接", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      f("r13a", "Everyone have received the checklist", "Everyone has received the checklist", "Indefinite pronoun agreement · 不定代名詞一致", "Everyone is grammatically singular and takes has.", "everyone 在文法上是單數，要搭配 has。"),
      ". ",
      f("r13b", "Something needs clarification", "Something needs clarification", "No error · 無錯誤", "Something is singular and correctly takes needs.", "something 是單數，正確搭配 needs。"),
      ", but ",
      f("r13c", "nobody know which file is final", "nobody knows which file is final", "Singular agreement · 單數一致", "Nobody is singular and takes knows.", "nobody 是單數，要搭配 knows。"),
      "."
    ]),
    make(14, "Conditional", "條件句", "Delivery Contingency", "配送備案", "Sentence logic & cohesion · 句子邏輯與連貫", [
      "If the shipment arrives before noon, we ",
      f("r14a", "will dispatch it today", "will dispatch it today", "First conditional · 第一類條件句", "The present tense in the if-clause and will in the result clause are correct.", "if 子句用現在式、結果子句用 will，結構正確。"),
      ". If it ",
      f("r14b", "will be delayed", "is delayed", "If-clause tense · if 子句時態", "Do not normally use will in the if-clause of a real future condition.", "真實未來條件的 if 子句通常不使用 will。"),
      ". If the carrier had checked the address, it ",
      f("r14c", "would avoid the problem", "would have avoided the problem", "Third conditional · 第三類條件句", "An unreal past condition requires would have plus a past participle.", "與過去事實相反的條件句要用 would have 加過去分詞。"),
      "."
    ]),
    make(15, "Reported Speech", "間接引語", "Budget Briefing", "預算簡報", "Sentence logic & cohesion · 句子邏輯與連貫", [
      "The director said that ",
      f("r15a", "the budget had been approved", "the budget had been approved", "No error · 無錯誤", "The backshift to had been approved is correct after a past reporting verb.", "過去式轉述動詞後，回溯為 had been approved 是正確的。"),
      ". She ",
      f("r15b", "told that hiring could begin", "told us that hiring could begin", "Say vs. tell · say 與 tell", "Tell requires an object before the that-clause.", "tell 後面需要先接受詞，再接 that 子句。"),
      ", and the manager asked ",
      f("r15c", "where was the approval email", "where the approval email was", "Reported question · 間接問句", "A reported question uses statement word order.", "間接問句要使用直述句語序。"),
      "."
    ]),
    make(16, "Used to", "used to 用法", "Hybrid Work History", "混合辦公沿革", "Sentence logic & cohesion · 句子邏輯與連貫", [
      "The company ",
      f("r16a", "used to operate from one office", "used to operate from one office", "No error · 無錯誤", "Used to plus a base verb correctly describes a past habit or state.", "used to 加原形動詞正確描述過去習慣或狀態。"),
      ". Most employees are now ",
      f("r16b", "used to work remotely", "used to working remotely", "Be used to · 習慣於", "In be used to, to is a preposition and is followed by a gerund.", "be used to 中的 to 是介系詞，後面接動名詞。"),
      ", although some teams ",
      f("r16c", "didn't used to meet online", "didn't use to meet online", "Negative used to · used to 否定", "After didn't, use the base form use.", "didn't 後面要接原形 use。"),
      "."
    ]),
    make(17, "Either / Neither / Both", "either／neither／both", "Vendor Choice", "供應商選擇", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "Either delivery option ",
      f("r17a", "are acceptable", "is acceptable", "Either + singular · either 搭配單數", "Either followed by a singular noun takes a singular verb.", "either 加單數名詞時，要搭配單數動詞。"),
      ". ",
      f("r17b", "Both vendors have provided references", "Both vendors have provided references", "No error · 無錯誤", "Both correctly refers to two plural vendors and takes have.", "both 指兩個複數 vendors，正確搭配 have。"),
      ", but ",
      f("r17c", "neither the printers or the scanners", "neither the printers nor the scanners", "Correlative pair · 成對連接詞", "Neither must be paired with nor, not or.", "neither 必須和 nor 成對，不能搭配 or。"),
      " include installation."
    ]),
    make(18, "Other / Another", "other／another", "Additional Meeting", "追加會議", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "Please send me ",
      f("r18a", "another copy of the agenda", "another copy of the agenda", "No error · 無錯誤", "Another correctly means one additional copy.", "another 正確表示再一份。"),
      ". ",
      f("r18b", "The others department", "The other department", "Other + singular noun · other 加單數名詞", "Use the other before a specified singular noun.", "特定的另一個單數名詞前使用 the other。"),
      " has requested ",
      f("r18c", "other one meeting", "one other meeting", "Other word order · other 語序", "Place the number before other and the singular noun: one other meeting.", "數量詞放在 other 前面：one other meeting。"),
      " next week."
    ]),
    make(19, "Passive Voice", "被動語態", "Security Upgrade", "資安升級", "Voice & verb forms · 語態與動詞形式", [
      "The risk report ",
      f("r19a", "was prepared by an external consultant", "was prepared by an external consultant", "No error · 無錯誤", "Was prepared correctly forms the simple-past passive.", "was prepared 正確構成過去簡單式被動。"),
      ". New access cards ",
      f("r19b", "will deliver by Friday", "will be delivered by Friday", "Future passive · 未來被動", "The receiver of the action needs will be plus the past participle.", "動作承受者需要使用 will be 加過去分詞。"),
      ", and the visitor policy ",
      f("r19c", "has updated", "has been updated", "Present perfect passive · 現在完成被動", "Use has been updated when the policy receives the completed action.", "policy 承受已完成的動作，要用 has been updated。"),
      "."
    ]),
    make(20, "Prepositions", "介系詞", "Travel Instructions", "差旅指引", "Sentence logic & cohesion · 句子邏輯與連貫", [
      "Travelers are responsible ",
      f("r20a", "of checking visa requirements", "for checking visa requirements", "Adjective + preposition · 形容詞介系詞搭配", "Responsible is followed by for.", "responsible 固定搭配介系詞 for。"),
      ". The briefing will be held ",
      f("r20b", "on Monday", "on Monday", "No error · 無錯誤", "Use on with days of the week.", "星期幾前使用介系詞 on。"),
      ", and participants should arrive ",
      f("r20c", "to the venue by nine", "at the venue by nine", "Place preposition · 地點介系詞", "Use arrive at for a specific place such as a venue.", "抵達特定地點使用 arrive at。"),
      "."
    ]),
    make(21, "Parallelism", "平行結構", "Role Description", "職務說明", "Sentence architecture · 句型與子句", [
      "The coordinator's duties include scheduling interviews, ",
      f("r21a", "to train new staff", "training new staff", "Parallel gerunds · 動名詞平行", "All items after include should use the same gerund form.", "include 後的列舉項目應保持相同的動名詞形式。"),
      ", and monitoring deadlines. Reports must be ",
      f("r21b", "both accurate and easy to read", "both accurate and easy to read", "No error · 無錯誤", "Both...and correctly joins two parallel adjective phrases.", "both...and 正確連接兩個平行的形容詞片語。"),
      ". The role may either reduce costs or ",
      f("r21c", "improving service quality", "improve service quality", "Parallel base verbs · 原形動詞平行", "Either...or must join the parallel base verbs reduce and improve.", "either...or 應連接平行的原形動詞 reduce 與 improve。"),
      "."
    ]),
    make(22, "Pronoun Reference", "代名詞指涉", "Approval Chain", "核准流程", "Sentence logic & cohesion · 句子邏輯與連貫", [
      "The policy applies to all contractors, and ",
      f("r22a", "they must sign the form", "they must sign the form", "No error · 無錯誤", "They clearly refers to the plural noun contractors.", "they 清楚指向複數名詞 contractors。"),
      ". When Julia discussed the proposal with Ana, ",
      f("r22b", "she approved it", "Julia approved the proposal", "Ambiguous reference · 指涉不清", "She and it each have more than one possible antecedent; name the actor and object.", "she 與 it 都可能有多個先行詞，應明確寫出行動者與事物。"),
      ". The signature was missing. ",
      f("r22c", "This caused a delay", "The missing signature caused a delay", "Vague reference · 模糊指涉", "Replace vague this with the exact cause.", "以明確原因取代模糊的 this。"),
      "."
    ]),
    make(23, "Basic Sentence Patterns", "五大基本句型", "Proposal Review", "提案審查", "Sentence architecture · 句型與子句", [
      "The proposal ",
      f("r23a", "seems clearly", "seems clear", "Linking verb complement · 連綴動詞補語", "A linking verb takes an adjective complement, not an adverb.", "連綴動詞後面接形容詞補語，不接副詞。"),
      ". The manager ",
      f("r23b", "gave the interns clear instructions", "gave the interns clear instructions", "S + V + IO + DO · 雙受詞句型", "The indirect object interns and direct object instructions are correctly ordered.", "間接受詞 interns 與直接受詞 instructions 的順序正確。"),
      ", and the committee made the approval process ",
      f("r23c", "efficiently", "efficient", "Object complement · 受詞補語", "The adjective efficient describes the object process.", "形容詞 efficient 用來說明受詞 process。"),
      "."
    ]),
    make(24, "Compound and Complex Sentences", "複合句與複雜句", "Launch Decision", "上市決策", "Sentence architecture · 句型與子句", [
      "The prototype passed every test, ",
      f("r24a", "the team approved the launch", "so the team approved the launch", "Comma splice · 逗號拼接", "Two independent clauses need a coordinating conjunction such as so.", "兩個獨立子句之間需要 so 等對等連接詞。"),
      ". We delayed the announcement ",
      f("r24b", "because the legal review was incomplete", "because the legal review was incomplete", "No error · 無錯誤", "Because correctly introduces a dependent reason clause.", "because 正確引導表示原因的從屬子句。"),
      ". ",
      f("r24c", "Although the website was ready.", "Although the website was ready, the team waited.", "Sentence fragment · 句子片段", "An although-clause is dependent and needs an independent clause.", "although 子句是從屬子句，必須搭配獨立子句。"),
      ""
    ]),
    make(25, "Articles and Quantifiers", "冠詞與量詞", "Applicant Guidance", "申請指引", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "The institute will host ",
      f("r25a", "an university seminar", "a university seminar", "Indefinite article · 不定冠詞", "University begins with the consonant sound /j/, so use a.", "university 以子音音素 /j/ 開頭，因此使用 a。"),
      ". ",
      f("r25b", "Information is available online", "Information is available online", "Zero article · 零冠詞", "Uncountable information used generally needs no article.", "泛指的不可數名詞 information 不需要冠詞。"),
      ", and ",
      f("r25c", "much applicants have registered", "many applicants have registered", "Quantifier · 量詞", "Use many with the plural countable noun applicants.", "複數可數名詞 applicants 搭配 many。"),
      "."
    ]),
    make(26, "Adjective and Pronoun Forms", "形容詞與代名詞形式", "Team Presentation", "團隊簡報", "Modifiers, nouns & pronouns · 修飾語與名代詞", [
      "The audience was ",
      f("r26a", "interesting in the proposal", "interested in the proposal", "Participial adjective · 分詞形容詞", "Use interested for how people feel; interesting describes the thing causing the feeling.", "描述人的感受用 interested；interesting 描述引發感受的事物。"),
      ". Nadia ",
      f("r26b", "prepared the slides herself", "prepared the slides herself", "No error · 無錯誤", "The reflexive pronoun herself correctly emphasizes Nadia.", "反身代名詞 herself 正確用來強調 Nadia。"),
      ", and kept the draft between ",
      f("r26c", "you and I", "you and me", "Object pronoun · 受格代名詞", "A preposition takes the object form me, not the subject form I.", "介系詞後面要用受格 me，而不是主格 I。"),
      "."
    ]),
    make(27, "Verb Types and Phrasal Verbs", "動詞類型與片語動詞", "Issue Investigation", "問題調查", "Voice & verb forms · 語態與動詞形式", [
      "The pilot program became ",
      f("r27a", "successfully", "successful", "Linking verb · 連綴動詞", "The linking verb became takes the adjective complement successful.", "連綴動詞 became 後面接形容詞補語 successful。"),
      ". The committee ",
      f("r27b", "discussed about the complaint", "discussed the complaint", "Transitive verb · 及物動詞", "Discuss is transitive and takes a direct object without about.", "discuss 是及物動詞，直接接受詞，不加 about。"),
      " and ",
      f("r27c", "looked into the cause", "looked into the cause", "No error · 無錯誤", "Look into is the correct phrasal verb meaning investigate.", "look into 是表示調查的正確片語動詞。"),
      "."
    ]),
    make(28, "Infinitives and Gerunds", "不定詞與動名詞", "Project Planning", "專案規劃", "Voice & verb forms · 語態與動詞形式", [
      "The team wants to avoid ",
      f("r28a", "to delay the release", "delaying the release", "Gerund after avoid · avoid 後接動名詞", "Avoid is followed by a gerund, not an infinitive.", "avoid 後面接動名詞，不接不定詞。"),
      ". It plans ",
      f("r28b", "launching the update in June", "to launch the update in June", "Infinitive after plan · plan 後接不定詞", "Plan is normally followed by a to-infinitive.", "plan 通常接 to 不定詞。"),
      ", and everyone looks forward to ",
      f("r28c", "meeting the new clients", "meeting the new clients", "No error · 無錯誤", "In look forward to, to is a preposition followed by a gerund.", "look forward to 中的 to 是介系詞，後面接動名詞。"),
      "."
    ]),
    make(29, "Participles", "現在分詞與過去分詞", "Installation Notice", "安裝通知", "Voice & verb forms · 語態與動詞形式", [
      "Several attendees were ",
      f("r29a", "boring by the technical lecture", "bored by the technical lecture", "Past participle adjective · 過去分詞形容詞", "People who experience the feeling are bored; the lecture is boring.", "感到無聊的人使用 bored；造成無聊的演講才是 boring。"),
      ". Documents ",
      f("r29b", "requiring a signature", "requiring a signature", "No error · 無錯誤", "The present participle requiring correctly has an active meaning.", "現在分詞 requiring 正確表達主動意義。"),
      " are on the desk beside the equipment ",
      f("r29c", "installing yesterday", "installed yesterday", "Reduced passive clause · 簡化被動子句", "Use the past participle installed because the equipment received the action.", "equipment 承受安裝動作，因此使用過去分詞 installed。"),
      "."
    ]),
    make(30, "Noun Clauses", "名詞子句", "Client Requirements", "客戶需求", "Sentence architecture · 句型與子句", [
      "We need to confirm ",
      f("r30a", "what does the client need", "what the client needs", "Embedded question · 嵌入問句", "A noun-clause question uses statement word order.", "名詞子句中的問句使用直述句語序。"),
      ". The team is discussing ",
      f("r30b", "whether the deadline is realistic", "whether the deadline is realistic", "No error · 無錯誤", "Whether correctly introduces a yes-or-no noun clause.", "whether 正確引導是非型名詞子句。"),
      ", but no one understands ",
      f("r30c", "that why the scope changed", "why the scope changed", "Noun-clause marker · 名詞子句連接詞", "Use why alone; do not combine that with an interrogative marker.", "why 可單獨引導子句，不與 that 疊用。"),
      "."
    ]),
    make(31, "Adjective Clauses", "形容詞子句／關係子句", "Consultant Profile", "顧問簡介", "Sentence architecture · 句型與子句", [
      "The consultant ",
      f("r31a", "which led the audit", "who led the audit", "Relative pronoun · 關係代名詞", "Use who for a person functioning as the subject of the relative clause.", "關係子句中指人且作主詞時使用 who。"),
      " has submitted the report ",
      f("r31b", "that you requested", "that you requested", "No error · 無錯誤", "That correctly introduces a defining relative clause modifying report.", "that 正確引導修飾 report 的限定關係子句。"),
      ". She will visit the office ",
      f("r31c", "where located the compliance team", "where the compliance team is located", "Relative adverb · 關係副詞", "After where, use normal clause order with a subject and verb.", "where 後面要使用包含主詞與動詞的正常子句語序。"),
      "."
    ]),
    make(32, "Adverb Clauses", "副詞子句", "Shipment Delay", "貨運延誤", "Sentence architecture · 句型與子句", [
      f("r32a", "Despite the shipment arrived late", "Although the shipment arrived late", "Clause connector · 子句連接詞", "Despite takes a noun phrase; although can introduce a full clause.", "despite 後接名詞片語；完整子句要使用 although。"),
      ", the team completed inspection. Please lock the warehouse ",
      f("r32b", "before you leave", "before you leave", "No error · 無錯誤", "Before correctly introduces a time clause.", "before 正確引導時間副詞子句。"),
      ", and we will assume approval ",
      f("r32c", "unless you do not reply", "unless you reply", "Unless · 除非", "Unless already means if not, so another not creates an unintended double negative.", "unless 已含 if not 的意思，不應再加 not。"),
      " by Friday."
    ]),
    make(33, "Subjunctive Mood and Inversion", "假設語氣與倒裝", "Compliance Resolution", "合規決議", "Sentence architecture · 句型與子句", [
      "The board recommended that every applicant ",
      f("r33a", "submits a new form", "submit a new form", "Mandative subjunctive · 要求型假設語氣", "After recommend that, formal English uses the base-form subjunctive submit.", "recommend that 後的正式英文使用原形假設語氣 submit。"),
      ". ",
      f("r33b", "Never we have seen such a complete audit", "Never have we seen such a complete audit", "Negative inversion · 否定倒裝", "A fronted negative adverb triggers auxiliary-subject inversion.", "否定副詞置於句首時，要進行助動詞與主詞倒裝。"),
      ". The chair insisted that the record ",
      f("r33c", "be kept confidential", "be kept confidential", "No error · 無錯誤", "Be is the correct subjunctive form after insisted that.", "insisted that 後使用原形 be，結構正確。"),
      "."
    ]),
    make(34, "Exclamations and Tag Questions", "感嘆句與附加問句", "Workshop Feedback", "工作坊回饋", "Sentence architecture · 句型與子句", [
      f("r34a", "How a helpful suggestion!", "What a helpful suggestion!", "What-exclamation · what 感嘆句", "Use what before a noun phrase; how normally introduces an adjective or adverb.", "名詞片語前使用 what；how 通常引導形容詞或副詞。"),
      " The deadline is Friday, ",
      f("r34b", "isn't it?", "isn't it?", "No error · 無錯誤", "A positive statement takes the negative tag isn't it.", "肯定陳述句搭配否定附加問句 isn't it。"),
      " The presenters haven't replied, ",
      f("r34c", "haven't they?", "have they?", "Tag polarity · 附加問句正負", "A negative statement takes a positive tag.", "否定陳述句要搭配肯定附加問句。"),
      ""
    ])
  ];

  const integratedReviews = window.TOEIC_CONTENT.proofreadingSets.map((set, index) => ({
    ...set,
    id: textbookSets.length + index + 1,
    rule: "Integrated Review",
    ruleZh: "綜合複習",
    category: "Integrated review · 綜合複習",
    level: "Integrated"
  }));

  window.TOEIC_CONTENT.proofreadingSets = [...textbookSets, ...integratedReviews];
  window.TOEIC_CONTENT.proofreadingCoverage = {
    textbookModules: textbookSets.length,
    integratedReviews: integratedReviews.length,
    decisions: [...textbookSets, ...integratedReviews].reduce((sum, set) => sum + set.parts.filter(part => typeof part !== "string").length, 0)
  };
})();
