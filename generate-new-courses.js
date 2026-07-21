const fs = require('fs');
const path = require('path');

function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log('  Created:', path.relative(__dirname, filePath));
}

function writeJS(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content);
  console.log('  Created:', path.relative(__dirname, filePath));
}

// ============================================
// HINDI TYPING COURSE
// ============================================
console.log('\n=== Generating Hindi Typing Course ===');
const htBase = 'content/hindi-typing';

writeJS(`${htBase}/index.js`, `module.exports = [
  { id: "01-keyboard-basics", title: "\u0915\u0940\u092c\u094b\u0930\u094d\u0921 \u0915\u093e \u092a\u0930\u093f\u091a\u093f\u0924", group: "basics", day_fast_track: 1, day_full_course: 1, icon: "\ud83d\udd10", description: "Hindi keyboard layout and finger positioning basics.", prerequisites: [] },
  { id: "02-home-row-left", title: "Home Row - Left Hand Keys", group: "home-row", day_fast_track: 2, day_full_course: 3, icon: "\ud83e\udd1f", description: "Learn left hand home row keys: fa, ka, gha, tha, cha.", prerequisites: ["01-keyboard-basics"] },
  { id: "03-home-row-right", title: "Home Row - Right Hand Keys", group: "home-row", day_fast_track: 3, day_full_course: 5, icon: "\ud83e\udd1e", description: "Learn right hand home row keys: ja, da, ga, ma, na.", prerequisites: ["01-keyboard-basics"] },
  { id: "04-home-row-combined", title: "Home Row Combined Practice", group: "home-row", day_fast_track: 4, day_full_course: 7, icon: "\u270b", description: "Practice both hands on home row together.", prerequisites: ["02-home-row-left", "03-home-row-right"] },
  { id: "05-upper-row", title: "Upper Row Keys", group: "rows", day_fast_track: 5, day_full_course: 9, icon: "\u2b06\ufe0f", description: "Keys above the home row for complete coverage.", prerequisites: ["04-home-row-combined"] },
  { id: "06-lower-row", title: "Lower Row Keys", group: "rows", day_fast_track: 6, day_full_course: 11, icon: "\u2b07\ufe0f", description: "Keys below the home row.", prerequisites: ["04-home-row-combined"] },
  { id: "07-common-words", title: "Common Hindi Words", group: "practice", day_fast_track: 7, day_full_course: 13, icon: "\ud83d\udca4", description: "Frequently used Hindi words for daily typing.", prerequisites: ["05-upper-row", "06-lower-row"] },
  { id: "08-numbers-symbols", title: "Numbers and Symbols", group: "practice", day_fast_track: 8, day_full_course: 15, icon: "\ud83d\udd22", description: "Hindi numbers and special characters.", prerequisites: ["07-common-words"] },
  { id: "09-sentences", title: "Hindi Sentences Practice", group: "practice", day_fast_track: 9, day_full_course: 17, icon: "\ud83d\udcdd", description: "Type complete Hindi sentences fluently.", prerequisites: ["07-common-words"] },
  { id: "10-speed-building", title: "Speed Building Drills", group: "advanced", day_fast_track: 10, day_full_course: 20, icon: "\u26a1", description: "Timed practice sessions to build speed.", prerequisites: ["09-sentences"] }
];`);

const hindiData = [
  { id: "01-keyboard-basics", words: "fa, ka, gha, tha, cha, ja, da, ga, ma, na", sentences: "main hindi seekhta hoon\nyah mera naam hai\nkya haal hai\nachha lagta hai", desc: "Keyboard basics and finger positioning" },
  { id: "02-home-row-left", words: "fa, ka, gha, tha, cha, fak, kag, ghat, thach", sentences: "fak ghat thach\nkag cha tha", desc: "Left hand home row practice" },
  { id: "03-home-row-right", words: "ja, da, ga, ma, na, jag, dam, gam, man", sentences: "jag dam gam\nman da ja", desc: "Right hand home row practice" },
  { id: "04-home-row-combined", words: "fak, jag, dam, gam, than, cha, man, da, ga", sentences: "fak jag dam gam\nthan cha man da", desc: "Both hands combined home row" },
  { id: "05-upper-row", words: "ha, ta, ka, ra, tha, hat, tak, kar, thak", sentences: "hum roj kaam karte hain\ntum kya karte ho", desc: "Upper row key practice" },
  { id: "06-lower-row", words: "ba, na, ma, la, ba, ban, mal, bal, nam", sentences: "ban mal bal nam\nlab man bal", desc: "Lower row key practice" },
  { id: "07-common-words", words: "yah, hai, main, tum, hum, kya, achha, theek, haan, nahi, karo, jao, aao, lo, de", sentences: "main accha hoon\ntum kaise ho\nyah bahut achha hai\nhum sab saath mein hain\nkya tum chalte ho\nhaan main samajhta hoon\nnahi mujhe nahi chahiye\naao baithte hain\nyahan aao\ndekho yeh dekho", desc: "Common everyday Hindi words" },
  { id: "08-numbers-symbols", words: "0, 1, 2, 3, 4, 5, 6, 7, 8, 9", sentences: "mere paas nau kitabein hain\nchar log aaye\nek sau bees log the", desc: "Numbers and special characters" },
  { id: "09-sentences", words: "", sentences: "main har din subah jaldi uthkar exercise karta hoon\nschool mein humein bahut kuch seekhne ko milta hai\nmeri family mein char log hain\nmujhe kitabein padhna bahut pasand hai\nhum sab milkar kaam karte hain\naaj ka din bahut achha hai\nmujhe apne desh par garv hai\nhumare ghar mein ek chhota bagicha hai\nbahar mausam bahut achha hai\nmujhe gaane sunna bahut pasand hai", desc: "Complete Hindi sentence practice" },
  { id: "10-speed-building", words: "the, and, for, are, but, not, you, all, can, had, her, was, one, our, out", sentences: "The quick brown fox jumps over the lazy dog\nI am learning Hindi typing every day\nPractice makes a person perfect\nConsistency is the key to success\nHard work always pays off in life\nKnowledge is power and wisdom is key\nSuccess comes to those who never give up\nEvery day is a new opportunity to learn", desc: "Speed building with mixed content" }
];

for (const lesson of hindiData) {
  const dir = `${htBase}/${lesson.id}`;
  writeJSON(`${dir}/quick.json`, {
    topicId: lesson.id, type: "quick", estimatedMinutes: 5,
    sections: [
      { heading: lesson.desc, body: `Practice these words and sentences:\n\nWords: ${lesson.words || "See sentences below"}\n\n${lesson.sentences}` },
      { heading: "Practice Tips", body: "1. Keep your eyes on the screen\n2. Use proper finger placement\n3. Start slow, accuracy first\n4. Speed will come with practice" }
    ],
    jargon: [{ term: "WPM", definition: "Words Per Minute - typing speed measure" }, { term: "Accuracy", definition: "Percentage of correctly typed characters" }],
    summary: `Complete this lesson to improve your ${lesson.desc} skills.`
  });
  writeJSON(`${dir}/deep.json`, {
    topicId: lesson.id, type: "deep", estimatedMinutes: 15,
    sections: [
      { heading: "Finger Positioning", body: "Each finger is responsible for specific keys. Left index on F, Right index on J. Each finger reaches for its assigned keys without moving the hand position." },
      { heading: "Practice Content", body: lesson.sentences },
      { heading: "Speed Tips", body: "1. Do not look at the keyboard\n2. Keep a steady rhythm\n3. Practice for 15-20 minutes daily\n4. Track your WPM and accuracy over time" }
    ],
    summary: "Consistent practice will improve your typing speed within weeks."
  });
  writeJSON(`${dir}/exercises.json`, {
    topicId: lesson.id,
    exercises: [
      { title: "Basic Practice", description: `Type these words: ${lesson.words || lesson.sentences.split("\n")[0]}`, hints: ["Keep eyes on screen", "Use proper finger placement"], solution: { language: "text", code: lesson.words || lesson.sentences.split("\n")[0] }, difficulty: "easy" },
      { title: "Sentence Practice", description: "Type each sentence without looking at the keyboard.", hints: ["Focus on accuracy", "Use all fingers"], solution: { language: "text", code: lesson.sentences }, difficulty: "medium" }
    ]
  });
}

// ============================================
// ENGLISH TYPING COURSE
// ============================================
console.log('\n=== Generating English Typing Course ===');
const etBase = 'content/english-typing';

writeJS(`${etBase}/index.js`, `module.exports = [
  { id: "01-touch-typing-intro", title: "Introduction to Touch Typing", group: "basics", day_fast_track: 1, day_full_course: 1, icon: "\ud83d\udd11", description: "Learn what touch typing is and why it matters.", prerequisites: [] },
  { id: "02-home-row-asdf", title: "Home Row - ASDF Left Hand", group: "home-row", day_fast_track: 2, day_full_course: 3, icon: "\ud83e\udd1f", description: "Master left hand home row keys.", prerequisites: ["01-touch-typing-intro"] },
  { id: "03-home-row-jkl", title: "Home Row - JKL Right Hand", group: "home-row", day_fast_track: 3, day_full_course: 5, icon: "\ud83e\udd1e", description: "Master right hand home row keys.", prerequisites: ["01-touch-typing-intro"] },
  { id: "04-home-row-combined", title: "Home Row Combined Practice", group: "home-row", day_fast_track: 4, day_full_course: 7, icon: "\u270b", description: "Practice both hands on the home row.", prerequisites: ["02-home-row-asdf", "03-home-row-jkl"] },
  { id: "05-upper-row", title: "Upper Row - QWERTY", group: "rows", day_fast_track: 5, day_full_course: 9, icon: "\u2b06\ufe0f", description: "Keys above the home row.", prerequisites: ["04-home-row-combined"] },
  { id: "06-lower-row", title: "Lower Row - ZXCVB", group: "rows", day_fast_track: 6, day_full_course: 11, icon: "\u2b07\ufe0f", description: "Keys below the home row.", prerequisites: ["04-home-row-combined"] },
  { id: "07-shift-keys", title: "Shift Keys and Capitals", group: "rows", day_fast_track: 7, day_full_course: 13, icon: "\u21e7", description: "Using shift for capital letters.", prerequisites: ["05-upper-row", "06-lower-row"] },
  { id: "08-common-words", title: "Common English Words", group: "practice", day_fast_track: 8, day_full_course: 15, icon: "\ud83d\udca4", description: "Most frequently used English words.", prerequisites: ["07-shift-keys"] },
  { id: "09-sentences-paragraphs", title: "Sentences and Paragraphs", group: "practice", day_fast_track: 9, day_full_course: 17, icon: "\ud83d\udcdd", description: "Complete sentences and paragraphs.", prerequisites: ["08-common-words"] },
  { id: "10-speed-accuracy", title: "Speed and Accuracy Building", group: "advanced", day_fast_track: 10, day_full_course: 20, icon: "\u26a1", description: "Timed tests to maximize speed.", prerequisites: ["09-sentences-paragraphs"] }
];`);

const engTypeData = [
  { id: "01-touch-typing-intro", words: "the quick brown fox jumps over lazy dog", sentences: "The quick brown fox jumps over the lazy dog.\nPack my box with five dozen liquor jugs.\nHow vexingly quick daft zebras jump!", desc: "Introduction to touch typing" },
  { id: "02-home-row-asdf", words: "sad fad dad ask add ash flask lass dash", sentences: "A glad dad had a flask.\nA lass had a sad dad.\nDash had a glad flask.", desc: "Left hand home row ASDF" },
  { id: "03-home-row-jkl", words: "all ask sad fall shall half hall lash salt", sentences: "A shall fall.\nHalf a hall has a lash.\nSalt all falls.", desc: "Right hand home row JKL" },
  { id: "04-home-row-combined", words: "flask lad salad fall lass daffodil flash dash", sentences: "A flask had a lad of salad.\nFlash had a sad lass.\nDash falls all.", desc: "Both hands combined home row" },
  { id: "05-upper-row", words: "were quit your type write tower port trip pretty", sentences: "Were you pretty tired?\nWrite your trip report.\nThe port tower quits.", desc: "Upper row QWERTY keys" },
  { id: "06-lower-row", words: "can vinyl box van cube ban zinc cave vine", sentences: "Can you fix the box?\nThe van has a big cube.\nZinc cave van.", desc: "Lower row ZXCVB keys" },
  { id: "07-shift-keys", words: "The Quick Brown Fox JavaScript Python Hello World GitHub Server", sentences: "The Quick Brown Fox Jumps Over The Lazy Dog.\nHello World From JavaScript!\nGitHub Is The Best Server For Code.", desc: "Shift keys and capitals" },
  { id: "08-common-words", words: "the be to of and a in that have it for not on with he as you do at this but his by from they we her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us", sentences: "The quick brown fox jumps over the lazy dog.\nShe sells seashells by the seashore.\nThe best time to plant a tree was twenty years ago.\nIn the middle of difficulty lies opportunity.\nTalk is cheap. Show me the code.", desc: "Most common English words" },
  { id: "09-sentences-paragraphs", words: "", sentences: "The art of programming is the skill of controlling complexity.\nSimplicity is prerequisite for reliability.\nFirst solve the problem then write the code.\nThe only way to learn a new programming language is by writing programs in it.\nPrograms must be written for people to read.\nAny fool can write code that a computer can understand.\nGood code is its own best documentation.\nBefore software can be reusable it first has to be usable.", desc: "Sentences and paragraphs practice" },
  { id: "10-speed-accuracy", words: "about their which would there could other after thought people because through between become country history program question general believe million remember nothing already example however perhaps certainly", sentences: "The best error message is the one that never shows up.\nFirst solve the problem then write the code.\nSimplicity is prerequisite for reliability.\nThe most dangerous phrase is we have always done it this way.\nProgramming is not about typing it is about thinking.\nCode is like humor when you have to explain it it is bad.\nIt works on my machine works on mine too", desc: "Speed and accuracy building drills" }
];

for (const lesson of engTypeData) {
  const dir = `${etBase}/${lesson.id}`;
  writeJSON(`${dir}/quick.json`, {
    topicId: lesson.id, type: "quick", estimatedMinutes: 5,
    sections: [
      { heading: lesson.desc, body: `Practice these words and sentences:\n\nWords: ${lesson.words || "See sentences below"}\n\n${lesson.sentences}` },
      { heading: "Practice Tips", body: "1. Keep your eyes on the screen\n2. Use proper finger placement\n3. Start slow, accuracy first\n4. Speed will come with practice" }
    ],
    jargon: [{ term: "WPM", definition: "Words Per Minute - typing speed measure" }, { term: "Accuracy", definition: "Percentage of correctly typed characters" }],
    summary: `Complete this lesson to improve your ${lesson.desc} skills.`
  });
  writeJSON(`${dir}/deep.json`, {
    topicId: lesson.id, type: "deep", estimatedMinutes: 15,
    sections: [
      { heading: "Finger Positioning", body: "Each finger is responsible for specific keys. Left index on F, Right index on J. Each finger reaches for its assigned keys without moving the hand position." },
      { heading: "Practice Content", body: lesson.sentences },
      { heading: "Speed Tips", body: "1. Do not look at the keyboard\n2. Keep a steady rhythm\n3. Practice for 15-20 minutes daily\n4. Track your WPM and accuracy over time" }
    ],
    summary: "Consistent practice will improve your typing speed within weeks."
  });
  writeJSON(`${dir}/exercises.json`, {
    topicId: lesson.id,
    exercises: [
      { title: "Basic Practice", description: `Type these words: ${lesson.words || lesson.sentences.split("\n")[0]}`, hints: ["Keep eyes on screen", "Use proper finger placement"], solution: { language: "text", code: lesson.words || lesson.sentences.split("\n")[0] }, difficulty: "easy" },
      { title: "Sentence Practice", description: "Type each sentence without looking at the keyboard.", hints: ["Focus on accuracy", "Use all fingers"], solution: { language: "text", code: lesson.sentences }, difficulty: "medium" }
    ]
  });
}

// ============================================
// ENGLISH LEARNING COURSE
// ============================================
console.log('\n=== Generating English Learning Course ===');
const elBase = 'content/english-learning';

writeJS(`${elBase}/index.js`, `module.exports = [
  { id: "01-english-basics", title: "English Basics - Alphabet and Pronunciation", group: "grammar", day_fast_track: 1, day_full_course: 1, icon: "\ud83d\udd24", description: "Master the 26 letters, vowel sounds, and basic pronunciation.", prerequisites: [] },
  { id: "02-nouns-pronouns", title: "Nouns Pronouns and Articles", group: "grammar", day_fast_track: 2, day_full_course: 3, icon: "\ud83d\udcdd", description: "The building blocks of English sentences.", prerequisites: ["01-english-basics"] },
  { id: "03-verbs-tenses", title: "Verbs and Present Tense", group: "grammar", day_fast_track: 3, day_full_course: 5, icon: "\u2699\ufe0f", description: "Action words and how they work in the present.", prerequisites: ["02-nouns-pronouns"] },
  { id: "04-past-future", title: "Past and Future Tenses", group: "grammar", day_fast_track: 4, day_full_course: 7, icon: "\u23ed\ufe0f", description: "Talk about what happened and what will happen.", prerequisites: ["03-verbs-tenses"] },
  { id: "05-sentence-structure", title: "Sentence Structure SVO", group: "grammar", day_fast_track: 5, day_full_course: 9, icon: "\ud83d\udce6", description: "Subject-Verb-Object: the backbone of English.", prerequisites: ["03-verbs-tenses"] },
  { id: "06-questions-negation", title: "Questions and Negation", group: "grammar", day_fast_track: 6, day_full_course: 11, icon: "\u2753", description: "How to ask questions and make negative statements.", prerequisites: ["05-sentence-structure"] },
  { id: "07-vocabulary-builder", title: "Vocabulary Building Techniques", group: "vocabulary", day_fast_track: 7, day_full_course: 13, icon: "\ud83d\udca2", description: "Strategies to learn and remember new words.", prerequisites: ["01-english-basics"] },
  { id: "08-prepositions", title: "Prepositions and Conjunctions", group: "grammar", day_fast_track: 8, day_full_course: 15, icon: "\ud83d\udd17", description: "Connecting words that give context.", prerequisites: ["05-sentence-structure"] },
  { id: "09-active-passive", title: "Active and Passive Voice", group: "grammar", day_fast_track: 9, day_full_course: 17, icon: "\ud83d\udd04", description: "Two ways to express the same action.", prerequisites: ["04-past-future"] },
  { id: "10-daily-english", title: "Daily Use English Conversations", group: "conversation", day_fast_track: 10, day_full_course: 19, icon: "\ud83d\udde3\ufe0f", description: "Common phrases for everyday life.", prerequisites: ["05-sentence-structure"] },
  { id: "11-essay-writing", title: "Paragraph and Essay Writing", group: "writing", day_fast_track: 11, day_full_course: 21, icon: "\u270d\ufe0f", description: "Structure your thoughts into clear writing.", prerequisites: ["10-daily-english"] },
  { id: "12-interview-english", title: "Interview English and Professional Communication", group: "professional", day_fast_track: 12, day_full_course: 24, icon: "\ud83d\udcbc", description: "Speak confidently in interviews and work.", prerequisites: ["10-daily-english"] }
];`);

const engLearnData = [
  { id: "01-english-basics", sections: ["The English alphabet has 26 letters: A B C D E F G H I J K L M N O P Q R S T U V W X Y Z", "Vowels: A, E, I, O, U - These are the core sounds of English.", "Consonants: B, C, D, F, G, H, J, K, L, M, N, P, Q, R, S, T, V, W, X, Y, Z", "Short vowels: cat (a), bed (e), sit (i), hot (o), cup (u)", "Long vowels: cake (a), these (e), bike (i), home (o), cute (u)"], vocab: ["apple", "elephant", "ice cream", "orange", "umbrella", "hello", "goodbye", "please", "thank you", "sorry"], examples: ["Hello, my name is Ali.", "I am learning English.", "Thank you very much."] },
  { id: "02-nouns-pronouns", sections: ["A noun is a word for a person, place, thing, or idea.", "Common nouns: boy, city, book. Proper nouns: Ali, London, Harry Potter.", "Pronouns replace nouns: I, you, he, she, it, we, they.", "Articles: a (before consonants), an (before vowels), the (specific)."], vocab: ["teacher", "student", "computer", "school", "family", "friend", "music", "water", "food", "house"], examples: ["The teacher is teaching the students.", "I saw a movie yesterday.", "She is an engineer."] },
  { id: "03-verbs-tenses", sections: ["A verb is an action word: run, eat, write, think.", "Simple Present: I work, You work, He works, She works.", "Present Continuous: I am working, He is working.", "Third person rule: Add -s or -es for he/she/it."], vocab: ["work", "study", "eat", "drink", "sleep", "read", "write", "speak", "listen", "learn"], examples: ["I study English every day.", "She works at a bank.", "They are eating lunch now."] },
  { id: "04-past-future", sections: ["Simple Past: I worked, He played, She studied.", "Irregular past: go-went, see-saw, eat-ate, write-wrote.", "Past Continuous: I was working when you called.", "Simple Future: I will work, I am going to work."], vocab: ["yesterday", "ago", "last week", "tomorrow", "next week", "will", "going to", "already", "yet", "just"], examples: ["I went to school yesterday.", "She studied English last night.", "I will visit London next year."] },
  { id: "05-sentence-structure", sections: ["Basic English order: Subject + Verb + Object (SVO)", "Example: Ali reads books.", "Subject: Who or what does the action?", "Verb: What is the action?", "Object: What receives the action?", "Add time/place at the end."], vocab: ["subject", "verb", "object", "adjective", "adverb", "preposition"], examples: ["The dog chased the cat.", "She wrote a letter to her friend.", "We play football every weekend."] },
  { id: "06-questions-negation", sections: ["Yes/No Questions: Do you speak English? Is she a teacher?", "Wh- Questions: What do you do? Where do you live?", "Negation: Add not after the verb. I do not work.", "Question word order: Wh + auxiliary + subject + verb?"], vocab: ["what", "where", "when", "why", "how", "who", "which", "do", "does", "did"], examples: ["Do you speak English?", "Where do you live?", "I don't understand."] },
  { id: "07-vocabulary-builder", sections: ["Technique 1: Word families - learn related words together.", "Example: teach, teacher, teaching, teachable.", "Technique 2: Prefixes and suffixes change word meaning.", "un- = not (unhappy), re- = again (rewrite), -ly = adverb.", "Technique 3: Learn words in context, not isolation.", "Technique 4: Use new words immediately in sentences."], vocab: ["happy-unhappy", "write-rewrite", "quick-quickly", "educate-education", "possible-impossible"], examples: ["I am unhappy about the situation.", "Please rewrite your essay.", "She speaks English beautifully."] },
  { id: "08-prepositions", sections: ["Prepositions show relationships: in, on, at, to, for, with, by.", "Time: at (specific time), on (days/dates), in (months/years).", "Place: at (specific point), on (surface), in (enclosed space).", "Conjunctions connect words: and, but, or, because, so."], vocab: ["in", "on", "at", "to", "for", "with", "from", "by", "and", "but", "or", "because"], examples: ["I work at a bank.", "The book is on the table.", "She studies because she wants to succeed."] },
  { id: "09-active-passive", sections: ["Active: The chef cooks the dinner.", "Passive: The dinner is cooked by the chef.", "Passive formula: Object + be + past participle + by subject.", "Present passive: English is spoken worldwide.", "Past passive: The window was broken by the ball."], vocab: ["active", "passive", "voice", "by", "is spoken", "was written"], examples: ["Ali wrote the letter. The letter was written by Ali.", "English is spoken in many countries.", "The homework has been completed."] },
  { id: "10-daily-english", sections: ["Greetings: Hello! How are you? I am fine, thank you.", "At a shop: How much is this? Can I have the receipt?", "At a restaurant: I would like to order...", "Making plans: What are you doing this weekend?", "Phone: Hello, this is Ali speaking."], vocab: ["menu", "receipt", "order", "appointment", "meeting", "schedule", "address", "directions"], examples: ["Hi, how are you doing today?", "Could you help me find the nearest hospital?", "I would like to book a table for two."] },
  { id: "11-essay-writing", sections: ["Paragraph structure: Topic sentence, supporting sentences, concluding sentence.", "Essay structure: Introduction, Body (2-3 paragraphs), Conclusion.", "Introduction: Hook + background + thesis statement.", "Body: Each paragraph = one main idea + evidence.", "Conclusion: Restate thesis + summarize + final thought.", "Transition words: however, moreover, furthermore, in addition."], vocab: ["introduction", "conclusion", "thesis", "argument", "evidence", "furthermore", "however", "therefore"], examples: ["Technology has changed our lives in many ways.", "In conclusion, learning English is essential for career growth.", "Moreover, practice makes perfect."] },
  { id: "12-interview-english", sections: ["Tell me about yourself: I am a [role] with [X] years of experience.", "Why this company: I am impressed by your mission and want to contribute.", "Strengths: I am a quick learner and I work well under pressure.", "Weaknesses: I sometimes focus too much on details.", "Closing: Thank you for your time. I look forward to hearing from you."], vocab: ["interview", "resume", "experience", "qualification", "salary", "position", "opportunity", "skills"], examples: ["I am a software developer with 3 years of experience.", "I am passionate about building user-friendly applications.", "I would welcome the opportunity to join your team."] }
];

for (const lesson of engLearnData) {
  const dir = `${elBase}/${lesson.id}`;
  writeJSON(`${dir}/quick.json`, {
    topicId: lesson.id, type: "quick", estimatedMinutes: 5,
    sections: lesson.sections.map(s => ({ heading: lesson.sections.indexOf(s) === 0 ? "Key Concepts" : "Important Points", body: s })),
    jargon: lesson.vocab.slice(0, 4).map(v => ({ term: v.split("-")[0], definition: `Related vocabulary: ${v}` })),
    summary: lesson.sections[lesson.sections.length - 1]
  });
  writeJSON(`${dir}/deep.json`, {
    topicId: lesson.id, type: "deep", estimatedMinutes: 15,
    sections: [
      ...lesson.sections.map(s => ({ heading: `Point ${lesson.sections.indexOf(s) + 1}`, body: s })),
      { heading: "Examples", body: lesson.examples.join("\n") },
      { heading: "Vocabulary to Remember", body: lesson.vocab.join(", ") }
    ],
    summary: `Practice these concepts daily and you will master this topic quickly.`
  });
  writeJSON(`${dir}/exercises.json`, {
    topicId: lesson.id,
    exercises: [
      { title: "Fill in the Blanks", description: `Practice using these words: ${lesson.vocab.slice(0, 3).join(", ")}`, hints: ["Read the examples first", "Try making your own sentences"], solution: { language: "text", code: lesson.examples.join("\n") }, difficulty: "easy" },
      { title: "Write Your Own", description: "Write 5 sentences using what you learned.", hints: ["Start with simple sentences", "Use the vocabulary from this lesson"], solution: { language: "text", code: lesson.examples.join("\n") }, difficulty: "medium" }
    ]
  });
  writeJSON(`${dir}/interview.json`, {
    topicId: lesson.id,
    questions: [
      { question: `What is the main concept of this lesson?`, answer: lesson.sections[0], difficulty: "easy" },
      { question: `Give an example.`, answer: lesson.examples[0], difficulty: "medium" }
    ]
  });
  writeJSON(`${dir}/comparison.json`, {
    topicId: lesson.id,
    comparisons: [{ concept: lesson.id.replace(/^\d+-/, "").replace(/-/g, " "), javascript: { language: "english", code: lesson.examples[0] }, python: { language: "english", code: lesson.examples[1] || lesson.examples[0] }, explanation: "English follows consistent patterns once you learn the rules." }],
    keyInsight: `Understanding this concept is fundamental to English fluency.`
  });
}

// ============================================
// PERSONALITY DEVELOPMENT COURSE
// ============================================
console.log('\n=== Generating Personality Development Course ===');
const pdBase = 'content/personality-dev';

writeJS(`${pdBase}/index.js`, `module.exports = [
  { id: "01-self-awareness", title: "Self-Awareness and Emotional Intelligence", group: "foundation", day_fast_track: 1, day_full_course: 1, icon: "\ud83e\udde0", description: "Understand yourself, your emotions, and how others perceive you.", prerequisites: [] },
  { id: "02-communication", title: "Effective Communication Skills", group: "communication", day_fast_track: 2, day_full_course: 3, icon: "\ud83d\udde3\ufe0f", description: "Express yourself clearly in speaking, writing, and listening.", prerequisites: ["01-self-awareness"] },
  { id: "03-body-language", title: "Body Language and Non-Verbal Communication", group: "communication", day_fast_track: 3, day_full_course: 5, icon: "\ud83d\udc64", description: "Master the art of unspoken signals.", prerequisites: ["02-communication"] },
  { id: "04-confidence", title: "Confidence Building and Self-Esteem", group: "mindset", day_fast_track: 4, day_full_course: 7, icon: "\ud83d\udcaa", description: "Build unshakeable confidence and overcome self-doubt.", prerequisites: ["01-self-awareness"] },
  { id: "05-time-management", title: "Time Management and Productivity", group: "productivity", day_fast_track: 5, day_full_course: 9, icon: "\u23f0", description: "Master your time, priorities, and daily habits.", prerequisites: [] },
  { id: "06-leadership", title: "Leadership and Team Management", group: "professional", day_fast_track: 6, day_full_course: 11, icon: "\ud83d\udee1\ufe0f", description: "Lead teams, make decisions, and inspire others.", prerequisites: ["02-communication", "04-confidence"] },
  { id: "07-stress-management", title: "Stress Management and Mental Health", group: "wellness", day_fast_track: 7, day_full_course: 13, icon: "\ud83c\udf3f", description: "Handle pressure, reduce stress, and maintain well-being.", prerequisites: ["01-self-awareness"] },
  { id: "08-public-speaking", title: "Public Speaking and Presentation Skills", group: "communication", day_fast_track: 8, day_full_course: 15, icon: "\ud83c\udf99\ufe0f", description: "Speak confidently to any audience.", prerequisites: ["02-communication", "03-body-language"] },
  { id: "09-networking", title: "Professional Networking and Personal Branding", group: "professional", day_fast_track: 9, day_full_course: 17, icon: "\ud83d\udd17", description: "Build meaningful professional relationships.", prerequisites: ["02-communication"] },
  { id: "10-goal-setting", title: "Goal Setting and Career Planning", group: "career", day_fast_track: 10, day_full_course: 20, icon: "\ud83c\udfaf", description: "Set meaningful goals and create actionable plans.", prerequisites: ["05-time-management", "04-confidence"] }
];`);

const persData = [
  { id: "01-self-awareness", sections: ["Self-awareness is knowing your strengths, weaknesses, emotions, and values.", "Emotional Intelligence has 5 components: Self-awareness, Self-regulation, Motivation, Empathy, Social skills.", "Daily self-reflection: Spend 5 minutes each evening reviewing your day.", "Journal prompt: What made me happy today? What frustrated me?", "The Johari Window: What you know about yourself vs. what others see.", "Values exercise: List your top 5 values (honesty, growth, family, creativity, freedom)."], exercises: ["Write down 3 strengths and 3 areas for improvement", "Ask 3 people how they would describe you", "Track your emotions for 1 week", "Identify your top 5 core values"], quotes: ["Knowing yourself is the beginning of all wisdom. - Aristotle", "The greatest discovery is that human beings can alter their lives by altering their attitudes. - William James"] },
  { id: "02-communication", sections: ["Communication is 7% words, 38% tone, 55% body language.", "Active Listening: Give full attention, do not interrupt, ask questions.", "The THINK framework: Is it True? Helpful? Inspiring? Necessary? Kind?", "Non-violent Communication: Observation, Feeling, Need, Request.", "Written communication: Clear subject lines, short paragraphs.", "Difficult conversations: Use I-statements instead of you-statements."], exercises: ["Practice active listening in your next conversation", "Write a professional email", "Role-play a difficult conversation", "Record yourself speaking and analyze your tone"], quotes: ["The single biggest problem in communication is the illusion that it has taken place. - George Bernard Shaw"] },
  { id: "03-body-language", sections: ["Open body language: Uncrossed arms, forward lean, direct eye contact.", "The power pose: Stand tall, hands on hips, shoulders back for 2 minutes.", "Eye contact: Maintain 60-70% of the time during conversations.", "Mirroring: Subtly match the other person's body language.", "Hand gestures: Use open palms to show honesty.", "Cultural differences: Eye contact norms vary across cultures."], exercises: ["Practice power poses before your next meeting", "Observe body language in a TV show without sound", "Practice maintaining appropriate eye contact", "Record yourself giving a 1-minute speech"], quotes: ["What you do speaks so loudly that I cannot hear what you say. - Ralph Waldo Emerson"] },
  { id: "04-confidence", sections: ["Confidence comes from action, not from waiting to feel ready.", "The Comfort Zone model: Comfort Zone -> Stretch Zone -> Panic Zone.", "Growth Mindset: I cannot do it yet (vs. I cannot do it).", "Positive self-talk: Replace I am stupid with I am learning.", "Competence builds confidence: Master one skill at a time.", "Visualization: See yourself succeeding before the event.", "Small wins: Celebrate daily achievements to build momentum."], exercises: ["List 5 things you have accomplished you are proud of", "Do one thing that scares you this week", "Write 10 positive affirmations", "Practice a new skill for 15 minutes daily"], quotes: ["Confidence comes from preparation. - Kobe Bryant", "You gain strength by every experience in which you stop to look fear in the face. - Eleanor Roosevelt"] },
  { id: "05-time-management", sections: ["The Eisenhower Matrix: Urgent+Important, Important+Not Urgent, Urgent+Not Important, Neither.", "Time blocking: Schedule specific tasks in dedicated time slots.", "The 2-minute rule: If it takes less than 2 minutes, do it now.", "Pomodoro Technique: 25 minutes focused work + 5 minute break.", "MIT (Most Important Tasks): Identify top 3 tasks each morning.", "Eliminate time wasters: Social media, unnecessary meetings.", "Weekly review: Every Sunday, plan the week ahead."], exercises: ["Track how you spend your time for 3 days", "Create a weekly schedule using time blocking", "Identify your top 3 time wasters", "Set up a daily planning routine"], quotes: ["The key is not to prioritize what is on your schedule, but to schedule your priorities. - Stephen Covey"] },
  { id: "06-leadership", sections: ["Leadership is influence, not a title.", "Servant leadership: Serve your team first, they will follow you.", "The 5 levels: Position, Permission, Production, People Development, Pinnacle.", "Delegation: Give the right task to the right person.", "Decision-making: Gather facts, consider options, decide, execute.", "Conflict resolution: Listen, acknowledge, find common ground.", "Motivation: Understand each team member's drivers."], exercises: ["Identify your leadership style", "Practice delegating one task this week", "Give specific positive feedback", "Resolve a minor conflict"], quotes: ["A leader knows the way, goes the way, and shows the way. - John C. Maxwell"] },
  { id: "07-stress-management", sections: ["Stress is the body's response to demands.", "The 4 A's: Avoid, Alter, Adapt, Accept.", "Deep breathing: 4-7-8 technique.", "Physical exercise: 30 minutes daily reduces stress by 30%.", "Mindfulness: Focus on the present moment.", "Sleep hygiene: 7-9 hours, consistent schedule.", "Social support: Talk to friends or professionals."], exercises: ["Practice 4-7-8 breathing 3 times today", "Take a 30-minute walk without your phone", "Write down your top 3 stressors", "Create a bedtime routine"], quotes: ["It is not stress that kills us, it is our reaction to it. - Hans Selye"] },
  { id: "08-public-speaking", sections: ["The 3 P's: Preparation, Practice, Performance.", "Structure: Hook -> 3 main points -> Call to action -> Close.", "The first 30 seconds determine engagement.", "Use stories: People remember stories 22x more than facts.", "Voice projection: Speak from your diaphragm.", "Managing nervousness: Reframe anxiety as excitement.", "Body on stage: Move with purpose."], exercises: ["Record a 2-minute speech and review it", "Practice speaking to a mirror for 5 minutes", "Give a short presentation to friends", "Join a speaking group"], quotes: ["All great speakers were bad speakers at first. - Ralph Waldo Emerson"] },
  { id: "09-networking", sections: ["Networking is about building genuine relationships.", "The 5-5-5 rule: 5 people you know, 5 you want to know, 5 who know you.", "Elevator pitch: 30-second introduction.", "LinkedIn optimization: Photo, headline, summary, recommendations.", "Give first: Offer value before asking.", "Follow up: Message within 24 hours of meeting.", "Personal brand: What do people say about you when you leave?"], exercises: ["Write your 30-second elevator pitch", "Optimize your LinkedIn profile", "Reach out to 2 new professionals this week", "Write your personal brand statement"], quotes: ["Your network is your net worth. - Porter Gale"] },
  { id: "10-goal-setting", sections: ["SMART Goals: Specific, Measurable, Achievable, Relevant, Time-bound.", "OKRs: Objectives + Key Results.", "Break big goals into 90-day sprints.", "The 7 habits: Be proactive, Begin with end in mind, Put first things first.", "Career planning: Skills inventory -> Gap analysis -> Learning plan.", "Accountability: Share goals with someone who holds you accountable.", "Review and adjust: Monthly check-ins."], exercises: ["Set 3 SMART goals for next 90 days", "Create a skills inventory", "Find an accountability partner", "Create a weekly review habit"], quotes: ["A goal without a plan is just a wish. - Antoine de Saint-Exupery", "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt"] }
];

for (const lesson of persData) {
  const dir = `${pdBase}/${lesson.id}`;
  writeJSON(`${dir}/quick.json`, {
    topicId: lesson.id, type: "quick", estimatedMinutes: 5,
    sections: lesson.sections.slice(0, 3).map(s => ({ heading: lesson.sections.indexOf(s) === 0 ? "Key Concept" : "Important Point", body: s })),
    jargon: [{ term: "EQ", definition: "Emotional Intelligence - ability to understand and manage emotions" }, { term: "Growth Mindset", definition: "Belief that abilities can be developed through dedication" }],
    summary: lesson.quotes[0]
  });
  writeJSON(`${dir}/deep.json`, {
    topicId: lesson.id, type: "deep", estimatedMinutes: 15,
    sections: [
      ...lesson.sections.map((s, i) => ({ heading: `Section ${i + 1}`, body: s })),
      { heading: "Key Quotes", body: lesson.quotes.join("\n\n") }
    ],
    summary: `Apply these principles daily to transform your skills.`
  });
  writeJSON(`${dir}/exercises.json`, {
    topicId: lesson.id,
    exercises: lesson.exercises.map((ex, i) => ({
      title: `Exercise ${i + 1}`,
      description: ex,
      hints: ["Start small and build consistency", "Track your progress", "Seek feedback from others"],
      solution: { language: "text", code: `Complete this exercise by: ${ex}` },
      difficulty: i < 2 ? "easy" : i < 4 ? "medium" : "hard"
    }))
  });
  writeJSON(`${dir}/interview.json`, {
    topicId: lesson.id,
    questions: [
      { question: `How do you practice this skill?`, answer: `I focus on daily practice: ${lesson.exercises[0]}. I also review key principles regularly and seek feedback from peers.`, difficulty: "medium" },
      { question: `Why are these skills important?`, answer: `${lesson.sections[0]} These skills are essential for personal and professional growth.`, difficulty: "easy" }
    ]
  });
  writeJSON(`${dir}/comparison.json`, {
    topicId: lesson.id,
    comparisons: [{ concept: lesson.id.replace(/^\d+-/, "").replace(/-/g, " "), javascript: { language: "text", code: "Before: Avoiding challenges due to fear\nAfter: Taking action despite discomfort" }, python: { language: "text", code: "Before: Reacting impulsively to stress\nAfter: Responding thoughtfully with strategies" }, explanation: "Growth in personality development is about shifting from reactive to proactive behavior." }],
    keyInsight: lesson.quotes[0]
  });
}

console.log('\n=== All courses generated successfully! ===');
console.log('Courses created:');
console.log('  1. content/hindi-typing/ (10 lessons)');
console.log('  2. content/english-typing/ (10 lessons)');
console.log('  3. content/english-learning/ (12 lessons)');
console.log('  4. content/personality-dev/ (10 lessons)');
