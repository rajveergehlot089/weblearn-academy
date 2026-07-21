const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, 'content');

// Helper to write JSON file
function writeJSON(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log('Created:', filePath);
}

// ===== TOPIC 02: CSS =====
writeJSON(path.join(CONTENT_DIR, '02-css', 'quick.json'), {
  "topicId": "02-css",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is CSS?",
      "body": "CSS stands for Cascading Style Sheets. If HTML is the skeleton of a webpage, CSS is the clothes, makeup, and decoration. It controls colors, fonts, spacing, layout — everything that makes a page look good."
    },
    {
      "heading": "How CSS Works",
      "body": "CSS uses 'selectors' to pick HTML elements and 'properties' to style them. Think of it like giving instructions: 'Make all paragraphs blue and big.'",
      "code": {
        "language": "css",
        "snippet": "p {\n  color: blue;\n  font-size: 18px;\n  margin: 10px;\n}\n\nh1 {\n  color: #333;\n  font-family: Arial;\n}",
        "explanation": "'p' is the selector (targets all <p> elements). 'color: blue' is a property-value pair. The curly braces {} contain all the styles for that selector."
      }
    },
    {
      "heading": "Three Ways to Add CSS",
      "body": "1. Inline: style='color: red' (on the element itself)\n2. Internal: <style> tag in <head> (for one page)\n3. External: <link> to a .css file (best practice — separate styling from content)"
    }
  ],
  "jargon": [
    { "term": "Selector", "definition": "The part before the curly braces that tells CSS which HTML elements to style." },
    { "term": "Property", "definition": "What you want to change (color, size, spacing, etc.)." },
    { "term": "Value", "definition": "The setting for a property (blue, 18px, 10px, etc.)." }
  ],
  "summary": "CSS makes HTML beautiful. It uses selectors to target elements and properties to style them. The best practice is external CSS files linked from your HTML."
});

writeJSON(path.join(CONTENT_DIR, '02-css', 'deep.json'), {
  "topicId": "02-css",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "CSS Selectors Deep Dive",
      "body": "Different ways to target elements:",
      "code": {
        "language": "css",
        "snippet": "/* Element selector */\np { color: black; }\n\n/* Class selector (dot prefix) */\n.card { border: 1px solid #ccc; }\n\n/* ID selector (hash prefix) */\n#header { background: navy; }\n\n/* Descendant selector */\nnav a { text-decoration: none; }\n\n/* Pseudo-class */\na:hover { color: red; }\n\n/* Child combinator */\narticle > p { font-size: 16px; }",
        "explanation": "Class selectors (.card) are the most commonly used — they're reusable. ID selectors (#header) are unique per page. Pseudo-classes like :hover respond to user interaction."
      }
    },
    {
      "heading": "The Box Model",
      "body": "Every HTML element is a box with 4 layers: content → padding → border → margin. Understanding this is the KEY to layouts.",
      "code": {
        "language": "css",
        "snippet": "/* Without box-sizing (default — painful!) */\n.box {\n  width: 200px;\n  padding: 20px;\n  border: 2px solid black;\n  /* Actual width = 200 + 20*2 + 2*2 = 244px !!!! */\n}\n\n/* With box-sizing (the sane way) */\n.box {\n  box-sizing: border-box;\n  width: 200px;\n  padding: 20px;\n  border: 2px solid black;\n  /* Actual width = 200px. Padding and border are INSIDE. */\n}",
        "explanation": "box-sizing: border-box makes width/height include padding and border. This is why almost every modern project starts with * { box-sizing: border-box; }."
      }
    },
    {
      "heading": "Colors, Units & Fonts",
      "body": "CSS offers several ways to specify colors and sizes:",
      "code": {
        "language": "css",
        "snippet": "/* Colors */\np {\n  color: red;              /* Named color */\n  color: #ff0000;          /* Hex */\n  color: rgb(255, 0, 0);   /* RGB */\n  color: rgba(255, 0, 0, 0.5); /* RGB with transparency */\n}\n\n/* Units */\nh1 { font-size: 32px; }        /* Pixels - fixed */\np  { font-size: 1.2rem; }       /* Relative to root font size */\n.box { width: 50%; }            /* Percentage of parent */\n.box { width: 100vw; }          /* Viewport width */",
        "explanation": "px is fixed (same size always). rem/em are relative (scale with font size). % and vw/vh are responsive (adapt to container/viewport). Use rem for font sizes, % for layouts."
      }
    },
    {
      "heading": "Practice Task: Style a Card Component",
      "body": "Given this HTML, write CSS to create a card with: dark background, rounded corners, padding, a shadow, and hover effect that lifts the card up.",
      "code": {
        "language": "css",
        "snippet": ".card {\n  background: #1e293b;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.3);\n  transition: transform 0.2s ease;\n  box-sizing: border-box;\n}\n\n.card:hover {\n  transform: translateY(-4px);\n  box-shadow: 0 8px 12px rgba(0,0,0,0.4);\n}",
        "explanation": "border-radius rounds corners. box-shadow adds depth. transition makes the hover effect smooth (0.2 seconds). translateY(-4px) moves the card up on hover."
      }
    }
  ],
  "summary": "CSS uses selectors to target elements and properties to style them. The box model (content + padding + border + margin) is fundamental. Use box-sizing: border-box, rem for fonts, and percentages for responsive widths."
});

writeJSON(path.join(CONTENT_DIR, '02-css', 'comparison.json'), {
  "topicId": "02-css",
  "comparisons": [
    {
      "concept": "Changing text color",
      "javascript": {
        "language": "html",
        "code": "<style>\n  p { color: blue; }\n</style>\n<p>This is blue</p>"
      },
      "python": {
        "language": "python",
        "code": "# In a terminal, there's no 'color' concept.\n# In Python GUI (tkinter):\nfrom tkinter import *\nroot = Tk()\nlabel = Label(root, fg='blue', text='Blue text')\nlabel.pack()"
      },
      "explanation": "CSS styling is unique to web development. In Python, you'd need a GUI library to get colored text. The concept of 'styling' exists everywhere, but the tools differ by platform."
    }
  ],
  "keyInsight": "CSS is specific to web browsers — Python and other languages don't have CSS. But the CONCEPT of separating presentation from logic is universal. In mobile apps, you use XML (Android) or SwiftUI (iOS) instead. The principle is always: structure (HTML/XML) + style (CSS/attributes) + logic (JS/Python)."
});

writeJSON(path.join(CONTENT_DIR, '02-css', 'interview.json'), {
  "topicId": "02-css",
  "questions": [
    {
      "question": "What is the CSS box model?",
      "answer": "The box model describes how every HTML element is rendered as a rectangular box with four layers: content (the actual text/image), padding (space inside the border), border (the edge), and margin (space outside the border). Understanding this is essential for layout control. Using box-sizing: border-box makes width/height include padding and border, which is much easier to work with.",
      "difficulty": "easy"
    },
    {
      "question": "What is the difference between class and id selectors in CSS?",
      "answer": "A class selector (.classname) can be applied to multiple elements — it's reusable. An id selector (#idname) must be unique — only one element per page. Use classes for styles you'll reuse (like card styling), and ids for unique elements or JavaScript targeting.",
      "difficulty": "easy"
    },
    {
      "question": "What does 'Cascading' mean in CSS?",
      "answer": "Cascading means that multiple CSS rules can apply to the same element, and they 'cascade' down in priority. The order of specificity is: inline styles > id selectors > class selectors > element selectors. When two rules conflict, the more specific one wins. If specificity is equal, the last rule wins.",
      "difficulty": "medium"
    },
    {
      "question": "How do you make a website responsive?",
      "answer": "Responsive design makes your site look good on all screen sizes. Key techniques: (1) Use relative units (%, rem, vw) instead of fixed px, (2) Use media queries to apply different styles at different screen widths, (3) Use Flexbox or CSS Grid for flexible layouts, (4) Always include the viewport meta tag in HTML.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '02-css', 'exercises.json'), {
  "topicId": "02-css",
  "exercises": [
    {
      "title": "Style a Navbar",
      "description": "Given a <nav> with 4 links, write CSS to: make it a horizontal bar with a dark background, white text links, padding, and a hover effect that changes link color.",
      "hints": ["Use display: flex on the nav for horizontal layout", "Use text-decoration: none to remove underlines", "Use :hover pseudo-class for the effect"],
      "solution": { "language": "css", "code": "nav {\n  display: flex;\n  gap: 20px;\n  background: #1a1a2e;\n  padding: 16px 24px;\n}\n\nnav a {\n  color: white;\n  text-decoration: none;\n  font-size: 16px;\n}\n\nnav a:hover {\n  color: #60a5fa;\n}" },
      "difficulty": "easy"
    },
    {
      "title": "Create a Responsive Grid of Cards",
      "description": "Write CSS for a .grid container that holds .card items. On wide screens, show 3 cards per row. On medium screens (below 768px), show 2. On small screens (below 480px), show 1.",
      "hints": ["Use CSS Grid with grid-template-columns", "Use media queries for different breakpoints", "Use repeat(auto-fit, minmax(250px, 1fr)) as a shortcut"],
      "solution": { "language": "css", "code": ".grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  padding: 20px;\n}\n\n.card {\n  background: white;\n  border-radius: 8px;\n  padding: 20px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 03: JavaScript =====
writeJSON(path.join(CONTENT_DIR, '03-javascript', 'quick.json'), {
  "topicId": "03-javascript",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is JavaScript?",
      "body": "JavaScript is the programming language of the web. If HTML is the skeleton and CSS is the clothes, JavaScript is the BRAIN — it makes things happen. When you click a button and a popup appears, when a form validates your email, when a menu slides open — that's all JavaScript."
    },
    {
      "heading": "Your First Script",
      "body": "You can add JavaScript directly in your HTML using <script> tags:",
      "code": {
        "language": "javascript",
        "snippet": "<button onclick=\"sayHello()\">Click Me</button>\n\n<script>\n  function sayHello() {\n    alert('Hello! You clicked the button!');\n  }\n</script>",
        "explanation": "function sayHello() defines a reusable block of code. onclick='sayHello()' tells the button to run that code when clicked. alert() pops up a message box."
      }
    },
    {
      "heading": "Variables — Storing Information",
      "body": "Variables are like labeled boxes that hold data:",
      "code": {
        "language": "javascript",
        "snippet": "let name = 'Rajveer';       // Text (string)\nlet age = 25;                // Number\nlet isStudent = true;        // Boolean (true/false)\nlet items = ['a', 'b', 'c']; // Array (list)\n\nconsole.log(name);  // Prints: Rajveer",
        "explanation": "'let' creates a variable. = assigns a value. Use console.log() to see output in the browser's developer console (press F12)."
      }
    }
  ],
  "jargon": [
    { "term": "Variable", "definition": "A named container that stores a value. You give it a name and can change what's inside." },
    { "term": "Function", "definition": "A reusable block of code that performs a specific task. Like a recipe — you write it once, use it many times." },
    { "term": "Console", "definition": "A debugging tool in the browser (press F12). Developers use console.log() to see what their code is doing." }
  ],
  "summary": "JavaScript is the brain of web pages. Variables store data, functions perform actions, and events respond to user clicks/typing. It runs in the browser and makes pages interactive."
});

writeJSON(path.join(CONTENT_DIR, '03-javascript', 'deep.json'), {
  "topicId": "03-javascript",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Conditionals — Making Decisions",
      "body": "Programs make decisions based on conditions — just like you decide what to wear based on weather:",
      "code": {
        "language": "javascript",
        "snippet": "let weather = 'rainy';\n\nif (weather === 'sunny') {\n  console.log('Wear sunglasses!');\n} else if (weather === 'rainy') {\n  console.log('Bring an umbrella!');\n} else {\n  console.log('Dress normally.');\n}\n\n// Comparison operators: === (equal), !== (not equal), > < >= <=",
        "explanation": "if/else if/else lets your code choose different paths. === checks equality (always use ===, not ==)."
      }
    },
    {
      "heading": "Loops — Repeating Things",
      "body": "Loops do the same thing multiple times — like washing each dish in a pile:",
      "code": {
        "language": "javascript",
        "snippet": "// For loop — when you know how many times\nfor (let i = 0; i < 5; i++) {\n  console.log('Iteration ' + i);\n}\n\n// For...of — when looping through a list\nlet fruits = ['apple', 'banana', 'cherry'];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}\n\n// While loop — when you don't know when to stop\nlet count = 0;\nwhile (count < 3) {\n  console.log(count);\n  count++;\n}",
        "explanation": "for loops run a set number of times. for...of loops through each item in a list. while loops keep going until a condition is false."
      }
    },
    {
      "heading": "DOM Manipulation — Changing the Page",
      "body": "JavaScript can find HTML elements and change them:",
      "code": {
        "language": "javascript",
        "snippet": "// Find an element\nlet title = document.getElementById('my-title');\nlet buttons = document.querySelectorAll('.btn');\n\n// Change content\ntitle.textContent = 'New Title!';\ntitle.style.color = 'blue';\n\n// Add a click handler\ndocument.getElementById('my-btn').addEventListener('click', function() {\n  alert('Button was clicked!');\n});\n\n// Create new elements\nlet newParagraph = document.createElement('p');\nnewParagraph.textContent = 'I was added by JavaScript!';\ndocument.body.appendChild(newParagraph);",
        "explanation": "document.getElementById() finds one element. querySelectorAll finds multiple. textContent changes text. style changes CSS. addEventListener waits for user actions."
      }
    },
    {
      "heading": "Practice Task: Interactive To-Do List",
      "body": "Build a simple to-do list: an input field, an 'Add' button, and a list. When you click Add, the item appears in the list. Write the JavaScript yourself!",
      "code": {
        "language": "javascript",
        "snippet": "document.getElementById('add-btn').addEventListener('click', function() {\n  let input = document.getElementById('todo-input');\n  let text = input.value.trim();\n\n  if (text === '') return;\n\n  let li = document.createElement('li');\n  li.textContent = text;\n  document.getElementById('todo-list').appendChild(li);\n  input.value = '';  // Clear the input\n});",
        "explanation": "We wait for the click, get the input value, create a new <li>, add it to the list, and clear the input. This pattern (listen → read → create → append → reset) is the foundation of interactive web apps."
      }
    }
  ],
  "summary": "JavaScript adds interactivity. Variables store data, conditionals make decisions, loops repeat actions, and DOM manipulation changes the page in response to users."
});

writeJSON(path.join(CONTENT_DIR, '03-javascript', 'comparison.json'), {
  "topicId": "03-javascript",
  "comparisons": [
    {
      "concept": "Variables and data types",
      "javascript": {
        "language": "javascript",
        "code": "let name = 'Rajveer';\nlet age = 25;\nlet isStudent = true;\nconsole.log(name, age, isStudent);"
      },
      "python": {
        "language": "python",
        "code": "name = 'Rajveer'\nage = 25\nis_student = True\nprint(name, age, is_student)"
      },
      "explanation": "Same concept: store values in named containers. JavaScript needs 'let'/'const' to declare variables; Python doesn't. JavaScript uses camelCase (isStudent); Python uses snake_case (is_student). Both hold the same types: strings, numbers, booleans."
    },
    {
      "concept": "If/else conditions",
      "javascript": {
        "language": "javascript",
        "code": "let age = 18;\nif (age >= 18) {\n  console.log('Adult');\n} else {\n  console.log('Minor');\n}"
      },
      "python": {
        "language": "python",
        "code": "age = 18\nif age >= 18:\n    print('Adult')\nelse:\n    print('Minor')"
      },
      "explanation": "The logic is identical: check a condition, do one thing if true, another if false. The only difference is syntax: JavaScript uses curly braces {}, Python uses indentation."
    },
    {
      "concept": "For loops",
      "javascript": {
        "language": "javascript",
        "code": "let fruits = ['apple', 'banana', 'cherry'];\nfor (let fruit of fruits) {\n  console.log(fruit);\n}"
      },
      "python": {
        "language": "python",
        "code": "fruits = ['apple', 'banana', 'cherry']\nfor fruit in fruits:\n    print(fruit)"
      },
      "explanation": "Both loop through a list the same way conceptually. Python's 'for x in list' is simpler syntax. JavaScript's 'for...of' is the modern equivalent. The logic is identical."
    },
    {
      "concept": "Functions",
      "javascript": {
        "language": "javascript",
        "code": "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(3, 5));  // 8"
      },
      "python": {
        "language": "python",
        "code": "def add(a, b):\n    return a + b\n\nprint(add(3, 5))  # 8"
      },
      "explanation": "Same concept: a reusable block that takes inputs, does something, returns a result. JavaScript uses 'function', Python uses 'def'. JavaScript uses curly braces; Python uses indentation. Both use 'return'."
    }
  ],
  "keyInsight": "The LOGIC is always the same: variables store data, conditionals branch, loops repeat, functions encapsulate. Only the syntax (how you write it) changes between languages. Once you learn programming logic in one language, learning a second language is mostly learning new syntax."
});

writeJSON(path.join(CONTENT_DIR, '03-javascript', 'interview.json'), {
  "topicId": "03-javascript",
  "questions": [
    {
      "question": "What is the difference between var, let, and const?",
      "answer": "var is the old way — it's function-scoped and can be redeclared, which leads to bugs. let is block-scoped (confined to its curly braces) and can be reassigned but not redeclared. const is also block-scoped but cannot be reassigned at all. Use const by default, let when you need to reassign, and never use var in modern code.",
      "difficulty": "medium"
    },
    {
      "question": "What is the DOM?",
      "answer": "The Document Object Model is a tree representation of your HTML that the browser builds in memory. Every HTML element becomes a JavaScript object you can interact with. JavaScript uses the DOM API to find elements (getElementById, querySelector), change their content (textContent, innerHTML), modify their styles (style property), and respond to events (addEventListener).",
      "difficulty": "medium"
    },
    {
      "question": "What is event delegation and why is it useful?",
      "answer": "Event delegation is a technique where you attach one event listener to a parent element instead of individual listeners to each child. It works because events 'bubble up' from the child to the parent. It's useful for: (1) Better performance with many elements, (2) Automatically works for dynamically added elements, (3) Less memory usage.",
      "difficulty": "hard"
    },
    {
      "question": "Explain the difference between == and === in JavaScript.",
      "answer": "== performs type coercion before comparing — it tries to convert both values to the same type. For example, '5' == 5 is true because the string '5' is converted to number 5. === (strict equality) compares both value AND type without conversion. '5' === 5 is false. Always use === to avoid unexpected behavior.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '03-javascript', 'exercises.json'), {
  "topicId": "03-javascript",
  "exercises": [
    {
      "title": "FizzBuzz",
      "description": "Write a loop from 1 to 30. For each number: if divisible by 3, print 'Fizz'. If divisible by 5, print 'Buzz'. If divisible by both, print 'FizzBuzz'. Otherwise, print the number.",
      "hints": ["Use the modulo operator (%) to check divisibility", "Check divisibility by BOTH 3 and 5 FIRST", "The order of your if/else matters!"],
      "solution": { "language": "javascript", "code": "for (let i = 1; i <= 30; i++) {\n  if (i % 3 === 0 && i % 5 === 0) {\n    console.log('FizzBuzz');\n  } else if (i % 3 === 0) {\n    console.log('Fizz');\n  } else if (i % 5 === 0) {\n    console.log('Buzz');\n  } else {\n    console.log(i);\n  }\n}" },
      "difficulty": "easy"
    },
    {
      "title": "Reverse a String",
      "description": "Write a function that takes a string and returns it reversed. Example: reverseString('hello') should return 'olleh'.",
      "hints": ["Split the string into an array with split('')", "Reverse the array with reverse()", "Join it back with join('')"],
      "solution": { "language": "javascript", "code": "function reverseString(str) {\n  return str.split('').reverse().join('');\n}\n\nconsole.log(reverseString('hello'));  // olleh" },
      "difficulty": "easy"
    },
    {
      "title": "Find the Largest Number",
      "description": "Write a function that takes an array of numbers and returns the largest one. Don't use Math.max().",
      "hints": ["Start by assuming the first element is the largest", "Loop through and compare each number", "Update the largest if you find a bigger one"],
      "solution": { "language": "javascript", "code": "function findLargest(numbers) {\n  let largest = numbers[0];\n  for (let num of numbers) {\n    if (num > largest) {\n      largest = num;\n    }\n  }\n  return largest;\n}\n\nconsole.log(findLargest([3, 7, 2, 9, 1]));  // 9" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 04: HTTP/HTTPS =====
writeJSON(path.join(CONTENT_DIR, '04-http-https', 'quick.json'), {
  "topicId": "04-http-https",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is HTTP?",
      "body": "HTTP (HyperText Transfer Protocol) is the language computers use to talk on the internet. When you visit a website, your browser sends a REQUEST to a server, and the server sends back a RESPONSE. Think of it like ordering food: you tell the waiter what you want (request), and they bring it to you (response)."
    },
    {
      "heading": "Client vs Server",
      "body": "The CLIENT is your browser (Chrome, Firefox). It makes requests. The SERVER is a powerful computer somewhere that stores websites and sends back responses. Every website you visit is stored on a server."
    },
    {
      "heading": "HTTPS = HTTP + Security",
      "body": "HTTPS is the same as HTTP but encrypted. The 'S' stands for Secure. When you see the padlock icon in your browser, that means HTTPS — your data is encrypted so hackers can't read it."
    }
  ],
  "jargon": [
    { "term": "HTTP", "definition": "HyperText Transfer Protocol — the set of rules for how browsers and servers exchange data." },
    { "term": "Request", "definition": "A message from the client (browser) asking the server for something — a page, an image, data." },
    { "term": "Response", "definition": "The server's reply to a request — it includes a status code, headers, and the data you asked for." },
    { "term": "Status Code", "definition": "A number that tells you what happened: 200 = success, 404 = not found, 500 = server error." }
  ],
  "summary": "HTTP is how browsers and servers communicate via requests and responses. HTTPS adds encryption for security. Status codes (200, 404, 500) tell you the outcome."
});

writeJSON(path.join(CONTENT_DIR, '04-http-https', 'deep.json'), {
  "topicId": "04-http-https",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "HTTP Methods (Verbs)",
      "body": "Each request has a METHOD that describes what you want to do:",
      "code": {
        "language": "javascript",
        "snippet": "// GET — Retrieve data (most common)\nfetch('https://api.example.com/users')\n  .then(res => res.json())\n  .then(data => console.log(data));\n\n// POST — Create new data\nfetch('https://api.example.com/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Raj', email: 'raj@example.com' })\n});\n\n// PUT — Update existing data\n// DELETE — Remove data",
        "explanation": "GET reads, POST creates, PUT updates, DELETE removes. This maps directly to CRUD operations (Create, Read, Update, Delete) that you'll use in every app."
      }
    },
    {
      "heading": "Status Codes You Must Know",
      "body": "Every response comes with a status code:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  2xx — Success\n  200 OK              — Request worked\n  201 Created          — New resource was created\n\n  3xx — Redirect\n  301 Moved Permanently — Page moved to a new URL\n\n  4xx — Client Error (your fault)\n  400 Bad Request      — Invalid input\n  401 Unauthorized     — Not logged in\n  403 Forbidden        — Logged in but no permission\n  404 Not Found        — URL doesn't exist\n\n  5xx — Server Error (their fault)\n  500 Internal Error   — Server broke\n  503 Unavailable      — Server is overloaded\n*/",
        "explanation": "2xx means success. 4xx means you made a mistake (wrong URL, not logged in). 5xx means the server has a problem. Understanding these helps you debug API calls instantly."
      }
    },
    {
      "heading": "Request & Response Anatomy",
      "body": "A complete HTTP exchange:",
      "code": {
        "language": "javascript",
        "snippet": "// REQUEST has 3 parts:\n// 1. Method + URL: GET /api/users\n// 2. Headers: { Authorization: 'Bearer token123' }\n// 3. Body (for POST/PUT): { name: 'Raj' }\n\n// RESPONSE has 3 parts:\n// 1. Status: 200 OK\n// 2. Headers: { Content-Type: 'application/json' }\n// 3. Body: [{ id: 1, name: 'Raj' }, ...]\n\n// In JavaScript:\nlet response = await fetch('/api/users');\nlet status = response.status;     // 200\nlet headers = response.headers;   // Headers object\nlet data = await response.json(); // The actual data",
        "explanation": "Every HTTP exchange follows this exact pattern. Headers carry metadata (auth tokens, content types, caching rules). The body carries the actual data."
      }
    },
    {
      "heading": "HTTPS and Security",
      "body": "HTTPS uses TLS (Transport Layer Security) to encrypt data:",
      "code": {
        "language": "javascript",
        "snippet": "// HTTP:  GET /login → sends password in PLAIN TEXT\n//         Anyone on the network can read it!\n\n// HTTPS: GET /login → password is ENCRYPTED\n//         Even if intercepted, it's unreadable\n\n// Signs of HTTPS:\n// 1. URL starts with https://\n// 2. Padlock icon in browser\n// 3. SSL certificate (you can click to view it)\n\n// Always use HTTPS in production!",
        "explanation": "Without HTTPS, passwords, credit cards, and personal data travel in plain text — anyone on the same WiFi can intercept them. HTTPS encrypts everything. Modern browsers warn you about HTTP sites."
      }
    }
  ],
  "summary": "HTTP uses methods (GET, POST, PUT, DELETE) to request actions and status codes (200, 404, 500) to report outcomes. HTTPS adds encryption. Every request has method + URL + headers + body; every response has status + headers + body."
});

writeJSON(path.join(CONTENT_DIR, '04-http-https', 'comparison.json'), {
  "topicId": "04-http-https",
  "comparisons": [
    {
      "concept": "Making an HTTP request",
      "javascript": {
        "language": "javascript",
        "code": "const response = await fetch('https://api.example.com/users');\nconst data = await response.json();\nconsole.log(data);"
      },
      "python": {
        "language": "python",
        "code": "import requests\n\nresponse = requests.get('https://api.example.com/users')\ndata = response.json()\nprint(data)"
      },
      "explanation": "Same concept: send a GET request, receive JSON data. JavaScript uses fetch() (built-in), Python uses the requests library. Both return a response object you parse with .json(). The HTTP protocol is the same regardless of language."
    }
  ],
  "keyInsight": "HTTP is a PROTOCOL — a set of rules independent of any programming language. Whether you use JavaScript, Python, Go, or Java, the request/response pattern, status codes, and methods are IDENTICAL. The only difference is the syntax for making the call in each language."
});

writeJSON(path.join(CONTENT_DIR, '04-http-https', 'interview.json'), {
  "topicId": "04-http-https",
  "questions": [
    {
      "question": "What is the difference between HTTP and HTTPS?",
      "answer": "HTTP sends data in plain text — anyone on the network can read it. HTTPS adds TLS encryption, so all data (passwords, personal info) is encrypted and unreadable to interceptors. HTTPS uses port 443, HTTP uses port 80. Modern browsers mark HTTP sites as 'Not Secure'. Always use HTTPS in production.",
      "difficulty": "easy"
    },
    {
      "question": "What is the difference between GET and POST methods?",
      "answer": "GET retrieves data and has no body — all parameters are in the URL (like /api/users?page=1). It should be idempotent (calling it multiple times gives the same result) and never changes server state. POST sends data in the request body to create new resources. It's used for form submissions, sign-ups, and any action that changes data on the server.",
      "difficulty": "medium"
    },
    {
      "question": "What does status code 401 vs 403 mean?",
      "answer": "401 Unauthorized means 'you're not authenticated' — the server doesn't know who you are (you need to log in). 403 Forbidden means 'you're authenticated but not authorized' — the server knows who you are but you don't have permission for this action. 401 → login required. 403 → access denied.",
      "difficulty": "medium"
    },
    {
      "question": "What happens when you type a URL in the browser?",
      "answer": "1. DNS lookup translates the domain to an IP address, 2. Browser establishes a TCP connection to the server, 3. If HTTPS, a TLS handshake encrypts the connection, 4. Browser sends an HTTP GET request for the page, 5. Server processes the request and sends back HTML, 6. Browser parses HTML, finds CSS/JS/images, 7. Sends additional requests for each resource, 8. Renders the page (layout, paint, composite).",
      "difficulty": "hard"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '04-http-https', 'exercises.json'), {
  "topicId": "04-http-https",
  "exercises": [
    {
      "title": "Status Code Identifier",
      "description": "Match each scenario to the correct status code: (A) User successfully registered → ?, (B) User tries to access admin page without admin role → ?, (C) API endpoint doesn't exist → ?, (D) Server crashed while processing → ?, (E) User submits a form with missing required fields → ?",
      "hints": ["2xx = success, 4xx = client error, 5xx = server error", "401 = not logged in, 403 = logged in but no permission", "400 = bad input, 404 = not found"],
      "solution": { "language": "text", "code": "A = 201 Created\nB = 403 Forbidden\nC = 404 Not Found\nD = 500 Internal Server Error\nE = 400 Bad Request" },
      "difficulty": "easy"
    },
    {
      "title": "Build a Fetch Wrapper",
      "description": "Write a JavaScript function called apiCall that takes a URL and returns the JSON response. Handle both success AND error cases (if the server returns a non-200 status, throw an error with the status code).",
      "hints": ["Use fetch() with await", "Check response.ok or response.status", "Use try/catch for error handling"],
      "solution": { "language": "javascript", "code": "async function apiCall(url) {\n  try {\n    const response = await fetch(url);\n    if (!response.ok) {\n      throw new Error('HTTP ' + response.status);\n    }\n    return await response.json();\n  } catch (error) {\n    console.error('API call failed:', error.message);\n    throw error;\n  }\n}" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 05: API Gateway =====
writeJSON(path.join(CONTENT_DIR, '05-api-gateway', 'quick.json'), {
  "topicId": "05-api-gateway",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is an API Gateway?",
      "body": "Imagine a hotel front desk. Guests (clients) don't go directly to rooms — they go to the front desk, which routes them to the right place. An API Gateway works the same way: it's the single entry point for all requests to your backend."
    },
    {
      "heading": "Why Do We Need It?",
      "body": "Without a gateway, clients need to know every server's address. With a gateway, they only talk to one URL. The gateway handles: routing (sending requests to the right service), authentication (checking who's asking), rate limiting (preventing abuse), and logging (tracking what happens)."
    },
    {
      "heading": "What is Rate Limiting?",
      "body": "Rate limiting controls how many requests a client can make in a time window. Think of a nightclub bouncer — they only let a certain number of people in per minute. This prevents abuse and protects servers from crashing."
    }
  ],
  "jargon": [
    { "term": "API Gateway", "definition": "A server that sits between clients and your backend services, handling routing, security, and rate limiting." },
    { "term": "Rate Limiting", "definition": "Restricting how many requests a client can make in a given time period to prevent abuse." },
    { "term": "Endpoint", "definition": "A specific URL path that accepts requests, like /api/users or /api/products." }
  ],
  "summary": "An API Gateway is the front desk of your backend — it routes requests, checks auth, and applies rate limits. Rate limiting prevents abuse by capping requests per time window."
});

writeJSON(path.join(CONTENT_DIR, '05-api-gateway', 'deep.json'), {
  "topicId": "05-api-gateway",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "How an API Gateway Works",
      "body": "The gateway sits between clients and multiple backend services:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  Client Request Flow:\n\n  Browser -> API Gateway -> Auth Service\n                         -> User Service\n                         -> Product Service\n                         -> Order Service\n\n  The gateway:\n  1. Receives the request\n  2. Authenticates the user (check token)\n  3. Rate limits (check request count)\n  4. Routes to the correct service\n  5. Returns the response to the client\n*/",
        "explanation": "In real companies, your request might hit 5-10 different services. The gateway abstracts this complexity — the client just sees one URL."
      }
    },
    {
      "heading": "Rate Limiting Implementation",
      "body": "A simple but effective rate limiter:",
      "code": {
        "language": "javascript",
        "snippet": "const rateLimiter = {};\n\nfunction isAllowed(ip, maxRequests = 100, windowMs = 60000) {\n  const now = Date.now();\n  \n  if (!rateLimiter[ip]) {\n    rateLimiter[ip] = { count: 1, windowStart: now };\n    return true;\n  }\n  \n  const record = rateLimiter[ip];\n  \n  // Reset if window expired\n  if (now - record.windowStart > windowMs) {\n    record.count = 1;\n    record.windowStart = now;\n    return true;\n  }\n  \n  // Check limit\n  if (record.count >= maxRequests) {\n    return false;  // Rate limited!\n  }\n  \n  record.count++;\n  return true;\n}",
        "explanation": "This tracks requests per IP per time window. If a client exceeds the limit, they get a 429 (Too Many Requests) response."
      }
    },
    {
      "heading": "Rate Limit Headers",
      "body": "Good APIs tell clients about their limits:",
      "code": {
        "language": "javascript",
        "snippet": "// Add these headers to your response:\nres.set({\n  'X-RateLimit-Limit': '100',        // Max requests per window\n  'X-RateLimit-Remaining': '67',     // How many left\n  'X-RateLimit-Reset': '1626000000', // When window resets\n  'Retry-After': '30'                // Seconds to wait (when limited)\n});",
        "explanation": "Rate limit headers help clients be good citizens. They can slow down before hitting the limit, and know exactly when to retry."
      }
    }
  ],
  "summary": "An API Gateway is the single entry point that routes requests, authenticates users, applies rate limits, and logs activity. Rate limiting tracks requests per client per time window and returns 429 when exceeded."
});

writeJSON(path.join(CONTENT_DIR, '05-api-gateway', 'comparison.json'), {
  "topicId": "05-api-gateway",
  "comparisons": [
    {
      "concept": "Rate limiting implementation",
      "javascript": {
        "language": "javascript",
        "code": "// JavaScript (Express middleware)\nconst rateLimit = require('express-rate-limit');\napp.use(rateLimit({\n  windowMs: 60 * 1000,\n  max: 100\n}));"
      },
      "python": {
        "language": "python",
        "code": "# Python (Flask)\nfrom flask_limiter import Limiter\nlimiter = Limiter(app, default_limits=['100 per minute'])\n\n@app.route('/api/data')\n@limiter.limit('10 per minute')\ndef get_data():\n    return 'data'"
      },
      "explanation": "Both languages use middleware/decorators for rate limiting. The concept (count requests per time window, reject when exceeded) is identical."
    }
  ],
  "keyInsight": "API Gateway and Rate Limiting are CONCEPTS, not language-specific. Every backend language implements them. The pattern is always: intercept request -> check limits -> allow or reject -> route to service."
});

writeJSON(path.join(CONTENT_DIR, '05-api-gateway', 'interview.json'), {
  "topicId": "05-api-gateway",
  "questions": [
    {
      "question": "What is an API Gateway and why is it used?",
      "answer": "An API Gateway is a single entry point for all client requests to a backend system. It's used for: (1) Routing — directing requests to the right service, (2) Authentication — verifying user identity, (3) Rate limiting — preventing abuse, (4) Logging and monitoring, (5) Load balancing. It simplifies client code (one URL instead of many) and centralizes security concerns.",
      "difficulty": "medium"
    },
    {
      "question": "What HTTP status code is returned when rate limited?",
      "answer": "429 Too Many Requests. A good API also includes headers: X-RateLimit-Limit (max allowed), X-RateLimit-Remaining (how many left), X-RateLimit-Reset (when the window resets), and Retry-After (seconds to wait before retrying).",
      "difficulty": "medium"
    },
    {
      "question": "How would you implement rate limiting in a Node.js/Express app?",
      "answer": "Use a middleware that tracks requests per IP. Store counts in memory (Map object) or Redis (for distributed systems). On each request: check if the count exceeds the limit within the time window. If yes, return 429. If no, increment the counter and call next(). Reset counters when the window expires.",
      "difficulty": "hard"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '05-api-gateway', 'exercises.json'), {
  "topicId": "05-api-gateway",
  "exercises": [
    {
      "title": "Build a Simple Rate Limiter",
      "description": "Write a JavaScript function that tracks requests per IP address. Allow max 5 requests per 60-second window. Return true if allowed, false if rate limited.",
      "hints": ["Use a Map to store { ip: { count, windowStart } }", "Check if windowStart + 60000 < Date.now() to reset", "Increment count on each call"],
      "solution": { "language": "javascript", "code": "const requests = new Map();\n\nfunction isAllowed(ip, max = 5, windowMs = 60000) {\n  const now = Date.now();\n  const record = requests.get(ip);\n\n  if (!record || now - record.start > windowMs) {\n    requests.set(ip, { count: 1, start: now });\n    return true;\n  }\n\n  if (record.count >= max) return false;\n  record.count++;\n  return true;\n}" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 06: Routing, REST, GraphQL =====
writeJSON(path.join(CONTENT_DIR, '06-routing-rest-graphql', 'quick.json'), {
  "topicId": "06-routing-rest-graphql",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is Routing?",
      "body": "Routing is how a server decides what to do with each request. Think of it like a post office: different addresses go to different rooms. When you visit /about, the server sends the About page. When you visit /api/users, it sends user data."
    },
    {
      "heading": "REST APIs — The Standard Way",
      "body": "REST (Representational State Transfer) is a set of rules for building APIs. It uses URLs as addresses and HTTP methods (GET, POST, PUT, DELETE) as actions. It's like a well-organized library: every book (resource) has a shelf address (URL)."
    },
    {
      "heading": "GraphQL — The Flexible Alternative",
      "body": "GraphQL lets clients ask for EXACTLY the data they need — no more, no less. Think of it like ordering at a restaurant: REST gives you the whole menu, GraphQL lets you say 'I want the pasta but skip the soup.'"
    }
  ],
  "jargon": [
    { "term": "Route", "definition": "A URL pattern that maps to a specific handler function on the server." },
    { "term": "REST", "definition": "An architectural style for APIs using URLs as resource identifiers and HTTP methods as operations." },
    { "term": "GraphQL", "definition": "A query language for APIs that lets clients request exactly the data they need in a single request." },
    { "term": "Endpoint", "definition": "A specific URL + HTTP method combination, like GET /api/users or POST /api/orders." }
  ],
  "summary": "Routing maps URLs to handlers. REST uses standard URLs + HTTP methods. GraphQL lets clients specify exactly what data they want. Both are ways to build APIs."
});

writeJSON(path.join(CONTENT_DIR, '06-routing-rest-graphql', 'deep.json'), {
  "topicId": "06-routing-rest-graphql",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "REST API Design",
      "body": "Good REST APIs follow predictable patterns:",
      "code": {
        "language": "javascript",
        "snippet": "// RESTful URL patterns:\n// GET    /api/users          -> Get all users\n// GET    /api/users/123      -> Get user 123\n// POST   /api/users          -> Create new user\n// PUT    /api/users/123      -> Update user 123\n// DELETE /api/users/123      -> Delete user 123\n\n// In Express:\napp.get('/api/users/:id', (req, res) => {\n  const user = findUser(req.params.id);\n  res.json(user);\n});\n\napp.post('/api/users', (req, res) => {\n  const newUser = createUser(req.body);\n  res.status(201).json(newUser);\n});",
        "explanation": "REST conventions: plural nouns for resources (/users, not /user), use HTTP methods for actions, return appropriate status codes (201 for creation)."
      }
    },
    {
      "heading": "GraphQL Basics",
      "body": "GraphQL uses a single endpoint and a query language:",
      "code": {
        "language": "javascript",
        "snippet": "// REST: Multiple requests\nGET /api/users/123\nGET /api/users/123/posts\nGET /api/users/123/comments\n\n// GraphQL: One request with exact fields\n// POST /graphql\n// Body: {\n//   query: `\n//     {\n//       user(id: 123) {\n//         name\n//         email\n//         posts { title }\n//       }\n//     }\n//   `\n// }\n\n// Response: Only the fields you asked for",
        "explanation": "GraphQL's superpower: you ask for exactly what you need. No over-fetching (getting extra data) or under-fetching (needing multiple requests)."
      }
    },
    {
      "heading": "REST vs GraphQL",
      "body": "When to use which:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  REST: Best when\n  - Your API is CRUD-based\n  - You want HTTP caching\n  - Multiple teams consume your API\n  - You want simple, well-understood conventions\n\n  GraphQL: Best when\n  - Clients need different data shapes\n  - You want to avoid over/under-fetching\n  - Your data is deeply nested\n  - You have many clients (web, mobile)\n\n  REST = Simplicity + HTTP features\n  GraphQL = Flexibility + Single request\n*/",
        "explanation": "REST is simpler to build and debug. GraphQL is more efficient for complex data needs. Many companies use BOTH."
      }
    }
  ],
  "summary": "Routing maps URLs to handlers. REST uses URL patterns + HTTP methods for predictable CRUD APIs. GraphQL uses a single endpoint with a query language for flexible data fetching."
});

writeJSON(path.join(CONTENT_DIR, '06-routing-rest-graphql', 'comparison.json'), {
  "topicId": "06-routing-rest-graphql",
  "comparisons": [
    {
      "concept": "Fetching user data",
      "javascript": {
        "language": "javascript",
        "code": "// REST\nconst res = await fetch('/api/users/123');\nconst user = await res.json();\n\n// GraphQL\nconst res = await fetch('/api/graphql', {\n  method: 'POST',\n  body: JSON.stringify({\n    query: '{ user(id: 123) { name email } }'\n  })\n});"
      },
      "python": {
        "language": "python",
        "code": "# REST\nimport requests\nuser = requests.get('/api/users/123').json()\n\n# GraphQL\nimport requests\nres = requests.post('/api/graphql', json={\n    'query': '{ user(id: 123) { name email } }'\n})\ndata = res.json()['data']"
      },
      "explanation": "The concept is identical: send a request, get JSON data back. REST returns everything; GraphQL returns only what you ask for. The logic is the same."
    }
  ],
  "keyInsight": "REST and GraphQL are both ways to build APIs over HTTP. The underlying concepts (requests, responses, JSON data, status codes) are identical. The difference is in HOW you structure the query."
});

writeJSON(path.join(CONTENT_DIR, '06-routing-rest-graphql', 'interview.json'), {
  "topicId": "06-routing-rest-graphql",
  "questions": [
    {
      "question": "What makes an API 'RESTful'?",
      "answer": "A RESTful API follows these constraints: (1) Client-server architecture, (2) Stateless — each request contains all info needed, (3) Uses standard HTTP methods (GET, POST, PUT, DELETE), (4) Resource-based URLs (/users, /posts), (5) Returns appropriate status codes, (6) Uses JSON for data exchange. The key is predictability.",
      "difficulty": "medium"
    },
    {
      "question": "What is the N+1 problem in REST APIs?",
      "answer": "The N+1 problem occurs when fetching a list of items and then making individual requests for related data. Example: GET /posts returns 100 posts, then you make 100 separate GET /posts/:id/comments requests. That's 101 total requests. Solutions: use includes/joins in your database query, or batch endpoints.",
      "difficulty": "hard"
    },
    {
      "question": "What are the advantages of GraphQL over REST?",
      "answer": "(1) No over-fetching — clients get exactly the fields they need, (2) No under-fetching — related data in one request, (3) Single endpoint — simpler to manage, (4) Strongly typed schema — self-documenting, (5) Better for multiple clients (web/mobile need different data shapes).",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '06-routing-rest-graphql', 'exercises.json'), {
  "topicId": "06-routing-rest-graphql",
  "exercises": [
    {
      "title": "Design a REST API for a Library",
      "description": "Design REST endpoints for a library system with: books, authors, and borrowing. Include CRUD for books, list books by author, and track who borrowed which book.",
      "hints": ["Use /api/books for the book resource", "Nest borrowing under books: /api/books/:id/borrowers", "Use POST for borrowing, DELETE for returning"],
      "solution": { "language": "text", "code": "GET    /api/books              -> List all books\nGET    /api/books/:id          -> Get one book\nPOST   /api/books              -> Add a book\nPUT    /api/books/:id          -> Update a book\nDELETE /api/books/:id          -> Remove a book\n\nGET    /api/authors/:id/books  -> Books by author\n\nPOST   /api/books/:id/borrow   -> Borrow a book\nDELETE /api/books/:id/borrow   -> Return a book" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 07: Auth =====
writeJSON(path.join(CONTENT_DIR, '07-auth', 'quick.json'), {
  "topicId": "07-auth",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is Authentication?",
      "body": "Authentication is proving who you are. When you log in with email and password, you're authenticating. Think of it like showing your ID at a nightclub — the bouncer verifies you're who you say you are."
    },
    {
      "heading": "Sessions vs JWT vs OAuth",
      "body": "There are three main ways to handle auth:\n1. Sessions: Server remembers you (like a hotel key card the front desk tracks)\n2. JWT: You carry a signed ID card (like a passport you show everywhere)\n3. OAuth: Let someone else verify you (like logging in with Google)"
    },
    {
      "heading": "The Login Flow",
      "body": "1. You enter email + password\n2. Server checks credentials\n3. Server gives you a 'token' (like a wristband at a concert)\n4. You show the token on every request\n5. Server checks the token and knows it's you"
    }
  ],
  "jargon": [
    { "term": "Authentication", "definition": "Verifying who a user is (login)." },
    { "term": "Authorization", "definition": "Determining what a logged-in user is allowed to do (permissions)." },
    { "term": "Token", "definition": "A piece of data given to a user after login that proves their identity on future requests." },
    { "term": "JWT", "definition": "JSON Web Token — a self-contained token that stores user info and can be verified without asking the server." }
  ],
  "summary": "Authentication proves who you are. Sessions store state on the server, JWTs store state on the client, OAuth delegates verification to a third party."
});

writeJSON(path.join(CONTENT_DIR, '07-auth', 'deep.json'), {
  "topicId": "07-auth",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Session-Based Auth",
      "body": "The server stores session data and gives the client a session ID:",
      "code": {
        "language": "javascript",
        "snippet": "// Server-side session\nconst sessions = {};\n\n// Login: create session\napp.post('/login', (req, res) => {\n  const user = authenticate(req.body.email, req.body.password);\n  if (!user) return res.status(401).json({ error: 'Bad credentials' });\n\n  const sessionId = generateId();\n  sessions[sessionId] = { userId: user.id, name: user.name };\n\n  // Set cookie\n  res.cookie('sessionId', sessionId, { httpOnly: true });\n  res.json({ message: 'Logged in' });\n});",
        "explanation": "Sessions are simple: server stores user data, client stores only the session ID in a cookie. The downside: sessions don't scale well across multiple servers."
      }
    },
    {
      "heading": "JWT (JSON Web Tokens)",
      "body": "JWTs are self-contained tokens — no server-side storage needed:",
      "code": {
        "language": "javascript",
        "snippet": "const jwt = require('jsonwebtoken');\nconst SECRET = 'your-secret-key';\n\n// Login: create JWT\napp.post('/login', async (req, res) => {\n  const user = await authenticate(req.body.email, req.body.password);\n  if (!user) return res.status(401).json({ error: 'Bad credentials' });\n\n  const token = jwt.sign(\n    { id: user.id, name: user.name },\n    SECRET,\n    { expiresIn: '7d' }\n  );\n\n  res.json({ token });\n});\n\n// Middleware: verify JWT\nfunction auth(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  if (!token) return res.status(401).json({ error: 'No token' });\n\n  try {\n    const decoded = jwt.verify(token, SECRET);\n    req.user = decoded;\n    next();\n  } catch {\n    res.status(401).json({ error: 'Invalid token' });\n  }\n}",
        "explanation": "JWT has 3 parts: header (algorithm), payload (user data), signature (tamper-proof seal). The server signs it with a secret. Any server with the secret can verify it."
      }
    },
    {
      "heading": "JWT vs Sessions",
      "body": "Decision guide:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  Sessions:\n  + Simple to implement\n  + Easy to revoke\n  + Good for server-rendered apps\n  - Doesn't scale across servers\n  - Doesn't work well with mobile apps\n\n  JWT:\n  + Stateless (no server-side storage)\n  + Scales horizontally\n  + Works great with mobile + SPA\n  - Harder to revoke\n  - Token size grows with user data\n\n  Rule of thumb:\n  - Traditional websites -> Sessions\n  - SPAs + Mobile apps -> JWT\n  - Microservices -> JWT\n*/",
        "explanation": "Most modern apps use JWT because they work across servers and mobile apps. Sessions are simpler for small, server-rendered apps."
      }
    }
  ],
  "summary": "Sessions store data on the server (simple, revocable). JWTs store data on the client (scalable, stateless). OAuth delegates auth to a third party (secure, convenient)."
});

writeJSON(path.join(CONTENT_DIR, '07-auth', 'comparison.json'), {
  "topicId": "07-auth",
  "comparisons": [
    {
      "concept": "JWT creation and verification",
      "javascript": {
        "language": "javascript",
        "code": "const jwt = require('jsonwebtoken');\n\n// Create\nconst token = jwt.sign({ id: 1 }, 'secret', { expiresIn: '1h' });\n\n// Verify\nconst decoded = jwt.verify(token, 'secret');\nconsole.log(decoded.id);  // 1"
      },
      "python": {
        "language": "python",
        "code": "import jwt\n\n# Create\ntoken = jwt.encode({'id': 1}, 'secret', algorithm='HS256')\n\n# Verify\ndecoded = jwt.decode(token, 'secret', algorithms=['HS256'])\nprint(decoded['id'])  # 1"
      },
      "explanation": "Same concept: sign data with a secret to create a token, verify with the same secret to decode. The JWT standard is identical across all languages."
    }
  ],
  "keyInsight": "Authentication is a UNIVERSAL concept. JWTs are standardized (RFC 7519) so tokens created in Python can be verified in JavaScript and vice versa."
});

writeJSON(path.join(CONTENT_DIR, '07-auth', 'interview.json'), {
  "topicId": "07-auth",
  "questions": [
    {
      "question": "What is the difference between authentication and authorization?",
      "answer": "Authentication answers 'Who are you?' — verifying identity (login with email/password). Authorization answers 'What can you do?' — checking permissions (admin vs regular user). You authenticate first, then authorize. A user might be authenticated (logged in) but not authorized to access admin pages.",
      "difficulty": "easy"
    },
    {
      "question": "How does JWT work?",
      "answer": "JWT (JSON Web Token) has 3 parts separated by dots: header (algorithm used), payload (user data like id, name, expiry), and signature (hash of header+payload using a secret key). The server creates and signs the JWT on login. The client stores it and sends it in the Authorization header on every request. Any server with the secret key can verify it without checking a database.",
      "difficulty": "medium"
    },
    {
      "question": "Why should JWTs have short expiry times?",
      "answer": "JWTs are hard to revoke once issued — they're valid until they expire. If a token is stolen, the attacker has access for the full expiry duration. Short expiry (15 min for access tokens) limits damage. You can use refresh tokens (long-lived) to get new access tokens without re-logging in.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '07-auth', 'exercises.json'), {
  "topicId": "07-auth",
  "exercises": [
    {
      "title": "Build a Login Endpoint",
      "description": "Write an Express POST /api/auth/login endpoint that: takes email + password, looks up the user, compares passwords, and returns a JWT token on success or 401 on failure.",
      "hints": ["Use bcrypt.compare() for password checking", "Use jwt.sign() to create the token", "Return 401 for invalid credentials"],
      "solution": { "language": "javascript", "code": "app.post('/api/auth/login', async (req, res) => {\n  const { email, password } = req.body;\n  const user = await User.findOne({ email });\n  if (!user) return res.status(401).json({ error: 'Invalid credentials' });\n\n  const valid = await bcrypt.compare(password, user.passwordHash);\n  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });\n\n  const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1h' });\n  res.json({ token });\n});" },
      "difficulty": "medium"
    },
    {
      "title": "Create an Auth Middleware",
      "description": "Write Express middleware that checks for a JWT in the Authorization header (format: 'Bearer <token>'). If valid, attach user data to req.user. If invalid or missing, return 401.",
      "hints": ["Use req.headers.authorization", "Split by space to get the token", "Use try/catch around jwt.verify()"],
      "solution": { "language": "javascript", "code": "function auth(req, res, next) {\n  const header = req.headers.authorization;\n  if (!header || !header.startsWith('Bearer ')) {\n    return res.status(401).json({ error: 'No token' });\n  }\n  const token = header.split(' ')[1];\n  try {\n    const decoded = jwt.verify(token, SECRET);\n    req.user = decoded;\n    next();\n  } catch {\n    res.status(401).json({ error: 'Invalid token' });\n  }\n}" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 08: Cookies vs LocalStorage =====
writeJSON(path.join(CONTENT_DIR, '08-cookies-localstorage', 'quick.json'), {
  "topicId": "08-cookies-localstorage",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "Where Does the Browser Store Data?",
      "body": "Your browser has two main places to store data: Cookies and LocalStorage. Think of cookies as a sticky note the server puts on your file — it's sent back to the server with every request. LocalStorage is like a private notebook — only your browser reads it, the server never sees it."
    },
    {
      "heading": "Cookies",
      "body": "Cookies are small text files (max 4KB) that the server asks your browser to store. They're sent with every HTTP request automatically. Use them for: session tokens, user preferences, tracking."
    },
    {
      "heading": "LocalStorage",
      "body": "LocalStorage is a key-value store in the browser (5-10MB). It's only accessible via JavaScript — the server never sees it. It persists until you manually clear it. Use it for: form drafts, UI state, cached data."
    }
  ],
  "jargon": [
    { "term": "Cookie", "definition": "Small data (max 4KB) stored by the browser, sent to the server with every HTTP request." },
    { "term": "LocalStorage", "definition": "A larger (5-10MB) key-value store in the browser, only accessible via JavaScript, never sent to the server automatically." },
    { "term": "SessionStorage", "definition": "Like LocalStorage but cleared when the browser tab is closed." }
  ],
  "summary": "Cookies are small, sent to the server with every request (good for auth tokens). LocalStorage is larger, client-only (good for app state). Choose based on whether the server needs the data."
});

writeJSON(path.join(CONTENT_DIR, '08-cookies-localstorage', 'deep.json'), {
  "topicId": "08-cookies-localstorage",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Working with Cookies",
      "body": "Cookies can be set by the server or JavaScript:",
      "code": {
        "language": "javascript",
        "snippet": "// Server sets cookie (in Express)\nres.cookie('token', 'abc123', {\n  httpOnly: true,    // JavaScript can't read it (security!)\n  secure: true,      // Only sent over HTTPS\n  maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days\n  sameSite: 'strict' // Prevent CSRF attacks\n});\n\n// JavaScript reads cookies (non-httpOnly only)\nconsole.log(document.cookie);  // 'token=abc123; theme=dark'",
        "explanation": "httpOnly cookies can't be read by JavaScript — this prevents XSS attacks from stealing tokens. secure ensures HTTPS only."
      }
    },
    {
      "heading": "Working with LocalStorage",
      "body": "LocalStorage is simple key-value storage:",
      "code": {
        "language": "javascript",
        "snippet": "// Save data\nlocalStorage.setItem('username', 'Rajveer');\nlocalStorage.setItem('settings', JSON.stringify({\n  theme: 'dark',\n  fontSize: 16\n}));\n\n// Read data\nconst name = localStorage.getItem('username');\nconst settings = JSON.parse(localStorage.getItem('settings'));\n\n// Remove data\nlocalStorage.removeItem('username');\n\n// Clear everything\nlocalStorage.clear();",
        "explanation": "LocalStorage only stores strings, so use JSON.stringify/parse for objects. Data persists across browser restarts."
      }
    },
    {
      "heading": "Security Best Practices",
      "body": "Never store sensitive data in localStorage:",
      "code": {
        "language": "javascript",
        "snippet": "// BAD: Storing JWT in localStorage\nlocalStorage.setItem('token', jwtToken);  // XSS can steal it!\n\n// GOOD: Storing JWT in httpOnly cookie\nres.cookie('token', jwtToken, {\n  httpOnly: true,\n  secure: true,\n  sameSite: 'strict'\n});  // JavaScript can't access it\n\n// GOOD: What to store in localStorage\nlocalStorage.setItem('theme', 'dark');          // Non-sensitive\nlocalStorage.setItem('language', 'en');        // Non-sensitive\nlocalStorage.setItem('lastVisit', Date.now()); // Non-sensitive",
        "explanation": "localStorage is vulnerable to XSS attacks. httpOnly cookies are invisible to JavaScript, making them much safer for auth tokens."
      }
    }
  ],
  "summary": "Cookies (4KB) are sent to the server with every request — use httpOnly secure cookies for auth tokens. LocalStorage (5-10MB) stays in the browser — use for non-sensitive app state."
});

writeJSON(path.join(CONTENT_DIR, '08-cookies-localstorage', 'comparison.json'), {
  "topicId": "08-cookies-localstorage",
  "comparisons": [
    {
      "concept": "Storing user preferences",
      "javascript": {
        "language": "javascript",
        "code": "localStorage.setItem('theme', 'dark');\nconst theme = localStorage.getItem('theme');"
      },
      "python": {
        "language": "python",
        "code": "import json\n\n# Save\nwith open('preferences.json', 'w') as f:\n    json.dump({'theme': 'dark'}, f)\n\n# Load\nwith open('preferences.json') as f:\n    prefs = json.load(f)\n    print(prefs['theme'])"
      },
      "explanation": "Browser storage (cookies, localStorage) is a CLIENT-SIDE concept. Python running on a server doesn't have access to browser storage — it uses databases or files instead."
    }
  ],
  "keyInsight": "Cookies and localStorage are BROWSER-SPECIFIC concepts. Server-side languages (Python, Node.js, Java) don't have direct access to them. The concept of 'client-side storage' exists in all platforms but with different implementations."
});

writeJSON(path.join(CONTENT_DIR, '08-cookies-localstorage', 'interview.json'), {
  "topicId": "08-cookies-localstorage",
  "questions": [
    {
      "question": "What is the difference between cookies and localStorage?",
      "answer": "Cookies are small (4KB), sent to the server with every HTTP request, and can have expiration dates. LocalStorage is larger (5-10MB), only accessible via JavaScript (never sent to the server), and persists until manually cleared. Use cookies for auth tokens (httpOnly) and server-side tracking. Use localStorage for client-only state like themes and form drafts.",
      "difficulty": "easy"
    },
    {
      "question": "Why should you use httpOnly cookies for JWT instead of localStorage?",
      "answer": "localStorage is accessible to any JavaScript running on the page. If an XSS vulnerability exists, an attacker can steal the JWT token. httpOnly cookies are invisible to JavaScript — they're only sent via HTTP requests. Even if XSS exists, the attacker can't read the token.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '08-cookies-localstorage', 'exercises.json'), {
  "topicId": "08-cookies-localstorage",
  "exercises": [
    {
      "title": "Theme Switcher with Persistence",
      "description": "Build a theme switcher (dark/light mode) that remembers the user choice using localStorage. Create a button that toggles themes and persists the selection.",
      "hints": ["Use localStorage.setItem() when saving", "Use localStorage.getItem() on page load", "Apply the theme class to document.body"],
      "solution": { "language": "javascript", "code": "function toggleTheme() {\n  const current = document.body.dataset.theme;\n  const next = current === 'dark' ? 'light' : 'dark';\n  document.body.dataset.theme = next;\n  localStorage.setItem('theme', next);\n}\n\nconst saved = localStorage.getItem('theme');\nif (saved) document.body.dataset.theme = saved;" },
      "difficulty": "easy"
    }
  ]
});

// ===== TOPIC 09: Databases & CRUD =====
writeJSON(path.join(CONTENT_DIR, '09-databases-crud', 'quick.json'), {
  "topicId": "09-databases-crud",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is a Database?",
      "body": "A database is a structured place to store data permanently. Think of it like a filing cabinet: you can add files (Create), look them up (Read), update them (Update), and throw them away (Delete). These four operations are called CRUD."
    },
    {
      "heading": "Types of Databases",
      "body": "There are two main types:\n1. SQL (relational): Data in tables with rows and columns, like Excel. Examples: MySQL, PostgreSQL.\n2. NoSQL: Data in flexible formats (JSON, documents). Examples: MongoDB, Firebase."
    },
    {
      "heading": "CRUD = The 4 Basics",
      "body": "Every app that stores data does exactly 4 things:\n- Create: Add new data\n- Read: Get existing data\n- Update: Change existing data\n- Delete: Remove data\nIf you understand CRUD, you understand 90% of backend development."
    }
  ],
  "jargon": [
    { "term": "Database", "definition": "An organized collection of data that can be easily accessed, managed, and updated." },
    { "term": "CRUD", "definition": "Create, Read, Update, Delete — the four basic operations for managing data." },
    { "term": "Schema", "definition": "The structure of your database: what tables/collections exist and what fields they have." },
    { "term": "Query", "definition": "A request to the database to get, add, change, or delete data." }
  ],
  "summary": "A database stores data permanently. CRUD (Create, Read, Update, Delete) are the 4 operations you always need. SQL databases use tables; NoSQL databases use flexible documents."
});

writeJSON(path.join(CONTENT_DIR, '09-databases-crud', 'deep.json'), {
  "topicId": "09-databases-crud",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "SQL vs NoSQL",
      "body": "Understanding both paradigms:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  SQL (PostgreSQL, MySQL)\n  Tables with fixed columns:\n  Users: id | name  | email\n         1  | Alice | alice@e.com\n         2  | Bob   | bob@e.com\n\n  NoSQL (MongoDB)\n  Flexible documents:\n  { name: 'Alice', email: 'alice@e.com',\n    address: { city: 'NYC' } }  // Nested!\n\n  SQL: Fixed structure, relationships, joins\n  NoSQL: Flexible structure, nested data\n*/",
        "explanation": "SQL is like a spreadsheet — rigid structure, great for relationships. NoSQL is like a document — flexible, great for varied data."
      }
    },
    {
      "heading": "CRUD in Action",
      "body": "All four operations with Express:",
      "code": {
        "language": "javascript",
        "snippet": "// CREATE\napp.post('/api/users', async (req, res) => {\n  const user = await db.users.create({\n    name: req.body.name,\n    email: req.body.email\n  });\n  res.status(201).json(user);\n});\n\n// READ\napp.get('/api/users', async (req, res) => {\n  const users = await db.users.find();\n  res.json(users);\n});\n\n// UPDATE\napp.put('/api/users/:id', async (req, res) => {\n  const user = await db.users.findByIdAndUpdate(\n    req.params.id,\n    { name: req.body.name },\n    { new: true }\n  );\n  res.json(user);\n});\n\n// DELETE\napp.delete('/api/users/:id', async (req, res) => {\n  await db.users.findByIdAndDelete(req.params.id);\n  res.json({ success: true });\n});",
        "explanation": "Every API endpoint follows this pattern. POST creates (201), GET reads (200), PUT updates (200), DELETE removes (200)."
      }
    }
  ],
  "summary": "Databases store data permanently. CRUD (Create, Read, Update, Delete) are the 4 operations every app needs. SQL uses tables with fixed structure; NoSQL uses flexible documents."
});

writeJSON(path.join(CONTENT_DIR, '09-databases-crud', 'comparison.json'), {
  "topicId": "09-databases-crud",
  "comparisons": [
    {
      "concept": "CRUD operations",
      "javascript": {
        "language": "javascript",
        "code": "// JavaScript (MongoDB)\nawait db.collection('users').insertOne({ name: 'Raj' });\nconst user = await db.collection('users').findOne({ name: 'Raj' });\nawait db.collection('users').updateOne({ name: 'Raj' }, { $set: { email: 'raj@example.com' } });\nawait db.collection('users').deleteOne({ name: 'Raj' });"
      },
      "python": {
        "language": "python",
        "code": "# Python (SQLAlchemy ORM)\nuser = User(name='Raj')\nsession.add(user)\nsession.commit()\n\nuser = session.query(User).filter_by(name='Raj').first()\nuser.email = 'raj@example.com'\nsession.commit()\n\nsession.delete(user)\nsession.commit()"
      },
      "explanation": "CRUD is universal: every language and database implements these 4 operations. The syntax differs but the concept is identical."
    }
  ],
  "keyInsight": "CRUD is the FOUNDATION of all backend development. Whether you use SQL or NoSQL, JavaScript or Python, the 4 operations are always the same."
});

writeJSON(path.join(CONTENT_DIR, '09-databases-crud', 'interview.json'), {
  "topicId": "09-databases-crud",
  "questions": [
    {
      "question": "What is the difference between SQL and NoSQL databases?",
      "answer": "SQL databases (MySQL, PostgreSQL) use tables with fixed schemas — every row has the same columns. They excel at relationships and complex queries (JOINs). NoSQL databases (MongoDB, Redis) use flexible documents — each record can have different fields. They excel at scaling and varied data.",
      "difficulty": "medium"
    },
    {
      "question": "What is a primary key?",
      "answer": "A primary key is a unique identifier for each row in a database table. It must be unique (no duplicates) and not null. Examples: auto-incrementing integer (1, 2, 3...), UUID (abc-123-def), or email (if unique). Primary keys let you precisely identify and reference any record.",
      "difficulty": "easy"
    },
    {
      "question": "What is database indexing and why does it matter?",
      "answer": "An index is a data structure that speeds up data retrieval — like a book index that lets you find topics without reading every page. Without an index, the database scans every row (slow for large tables). With an index on the 'email' column, looking up a user by email is instant. Tradeoff: indexes speed up reads but slow down writes.",
      "difficulty": "hard"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '09-databases-crud', 'exercises.json'), {
  "topicId": "09-databases-crud",
  "exercises": [
    {
      "title": "Design a Database Schema",
      "description": "Design a database schema for a blog with: users, posts, and comments. A user has many posts, a post has many comments.",
      "hints": ["Each table needs a primary key", "Posts need a foreign key to users (authorId)", "Comments need foreign keys to both posts and users"],
      "solution": { "language": "text", "code": "Users:\n  id (PK)\n  name\n  email (unique)\n  passwordHash\n  createdAt\n\nPosts:\n  id (PK)\n  title\n  content\n  authorId (FK -> Users.id)\n  createdAt\n\nComments:\n  id (PK)\n  text\n  postId (FK -> Posts.id)\n  authorId (FK -> Users.id)\n  createdAt" },
      "difficulty": "medium"
    },
    {
      "title": "Build a CRUD API",
      "description": "Write Express endpoints for a 'todos' resource with all CRUD operations using an in-memory array.",
      "hints": ["Use an array to store todos in memory", "Use req.params.id to identify specific todos", "Return proper status codes: 201 for creation, 404 for not found"],
      "solution": { "language": "javascript", "code": "const todos = [];\nlet nextId = 1;\n\napp.get('/api/todos', (req, res) => res.json(todos));\napp.get('/api/todos/:id', (req, res) => {\n  const todo = todos.find(t => t.id === +req.params.id);\n  if (!todo) return res.status(404).json({ error: 'Not found' });\n  res.json(todo);\n});\napp.post('/api/todos', (req, res) => {\n  const todo = { id: nextId++, text: req.body.text, done: false };\n  todos.push(todo);\n  res.status(201).json(todo);\n});\napp.put('/api/todos/:id', (req, res) => {\n  const todo = todos.find(t => t.id === +req.params.id);\n  if (!todo) return res.status(404).json({ error: 'Not found' });\n  Object.assign(todo, req.body);\n  res.json(todo);\n});\napp.delete('/api/todos/:id', (req, res) => {\n  const index = todos.findIndex(t => t.id === +req.params.id);\n  if (index === -1) return res.status(404).json({ error: 'Not found' });\n  todos.splice(index, 1);\n  res.json({ success: true });\n});" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 10: Error Handling =====
writeJSON(path.join(CONTENT_DIR, '10-error-handling', 'quick.json'), {
  "topicId": "10-error-handling",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is Error Handling?",
      "body": "Things WILL go wrong in code — servers crash, users enter bad data, networks fail. Error handling is catching these problems gracefully instead of letting your app crash. It's like wearing a seatbelt — you hope you won't need it, but when you do, it saves you."
    },
    {
      "heading": "Try/Catch — The Basics",
      "body": "Try/catch lets you attempt risky code and handle failures:",
      "code": {
        "language": "javascript",
        "snippet": "try {\n  const data = JSON.parse(userInput);\n  console.log(data);\n} catch (error) {\n  console.log('That was not valid JSON!');\n  console.log('Error:', error.message);\n}",
        "explanation": "try { risky code } catch (handle error). If the risky code throws an error, execution jumps to catch. The app doesn't crash."
      }
    }
  ],
  "jargon": [
    { "term": "Error", "definition": "An unexpected problem that stops code from running normally." },
    { "term": "Exception", "definition": "An error that occurs during execution (same as error in JavaScript)." },
    { "term": "Throw", "definition": "Deliberately creating an error: throw new Error('message')." },
    { "term": "Catch", "definition": "Receiving and handling an error in a catch block." }
  ],
  "summary": "Error handling catches problems gracefully. Use try/catch for risky operations. Always handle errors instead of letting your app crash."
});

writeJSON(path.join(CONTENT_DIR, '10-error-handling', 'deep.json'), {
  "topicId": "10-error-handling",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Try/Catch/Finally",
      "body": "The complete error handling pattern:",
      "code": {
        "language": "javascript",
        "snippet": "try {\n  const response = await fetch('/api/data');\n  const data = await response.json();\n  return data;\n} catch (error) {\n  console.error('API failed:', error.message);\n  throw new Error('Failed to load data');\n} finally {\n  console.log('Cleanup happens here regardless');\n}",
        "explanation": "try: attempt the risky code. catch: handle any error. finally: runs ALWAYS (success or failure) — used for cleanup like hiding loading spinners."
      }
    },
    {
      "heading": "Custom Errors",
      "body": "Create meaningful error types:",
      "code": {
        "language": "javascript",
        "snippet": "class AppError extends Error {\n  constructor(message, statusCode) {\n    super(message);\n    this.statusCode = statusCode;\n    this.isOperational = true;\n  }\n}\n\n// Usage\nfunction findUser(id) {\n  const user = db.users.find(u => u.id === id);\n  if (!user) throw new AppError('User not found', 404);\n  return user;\n}\n\n// Express error handler\napp.use((err, req, res, next) => {\n  if (err.isOperational) {\n    res.status(err.statusCode).json({ error: err.message });\n  } else {\n    console.error('Unexpected error:', err);\n    res.status(500).json({ error: 'Something went wrong' });\n  }\n});",
        "explanation": "Custom errors let you distinguish between expected errors (user not found) and bugs (null reference)."
      }
    },
    {
      "heading": "HTTP Error Responses",
      "body": "Always return meaningful errors to clients:",
      "code": {
        "language": "javascript",
        "snippet": "// BAD: Vague error\nres.status(500).json({ error: 'Error' });\n\n// GOOD: Specific errors\nres.status(400).json({\n  error: 'Validation failed',\n  details: [\n    { field: 'email', message: 'Invalid email format' },\n    { field: 'password', message: 'Must be at least 8 characters' }\n  ]\n});",
        "explanation": "Good error responses tell the client WHAT went wrong and HOW to fix it. Never expose internal details (stack traces, database errors)."
      }
    }
  ],
  "summary": "Use try/catch for error handling. Create custom error classes for operational vs unexpected errors. Always return meaningful HTTP error responses. Never let errors crash your app silently."
});

writeJSON(path.join(CONTENT_DIR, '10-error-handling', 'comparison.json'), {
  "topicId": "10-error-handling",
  "comparisons": [
    {
      "concept": "Try/catch error handling",
      "javascript": {
        "language": "javascript",
        "code": "try {\n  const data = JSON.parse(input);\n} catch (error) {\n  console.log('Error:', error.message);\n}"
      },
      "python": {
        "language": "python",
        "code": "try:\n    data = json.loads(input)\nexcept json.JSONDecodeError as e:\n    print(f'Error: {e}')"
      },
      "explanation": "Same concept: attempt risky code, catch specific exceptions. JavaScript uses 'catch (error)', Python uses 'except ExceptionType as e'. The pattern is universal."
    }
  ],
  "keyInsight": "Error handling is a FUNDAMENTAL programming concept. Every language has try/catch (or try/except). The logic is always: attempt -> catch -> handle -> continue."
});

writeJSON(path.join(CONTENT_DIR, '10-error-handling', 'interview.json'), {
  "topicId": "10-error-handling",
  "questions": [
    {
      "question": "What is the difference between operational and programming errors?",
      "answer": "Operational errors are expected failures (network timeout, invalid input, file not found) — handle them gracefully. Programming errors (bugs) are unexpected (null reference, type errors) — fix them. Operational errors get user-friendly messages; programming errors get logged for debugging.",
      "difficulty": "medium"
    },
    {
      "question": "How do you handle errors in async JavaScript?",
      "answer": "Use try/catch with async/await (cleanest approach). For Express, wrap async handlers with an asyncHandler utility. For promises, use .catch(). Always handle rejections — unhandled promise rejections crash Node.js.",
      "difficulty": "medium"
    },
    {
      "question": "What should a good error response contain?",
      "answer": "(1) A machine-readable error code, (2) A human-readable message, (3) Details about what went wrong, (4) Appropriate HTTP status code, (5) For rate limits: retry timing. Never expose stack traces in production.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '10-error-handling', 'exercises.json'), {
  "topicId": "10-error-handling",
  "exercises": [
    {
      "title": "Build a Validation Function",
      "description": "Write a function validateUser(data) that checks: name is at least 2 chars, email contains @, password is at least 8 chars. Return an array of error messages.",
      "hints": ["Check each condition separately", "Push error messages to an array", "Return the array (empty = valid)"],
      "solution": { "language": "javascript", "code": "function validateUser(data) {\n  const errors = [];\n  if (!data.name || data.name.length < 2) {\n    errors.push('Name must be at least 2 characters');\n  }\n  if (!data.email || !data.email.includes('@')) {\n    errors.push('Email must be valid');\n  }\n  if (!data.password || data.password.length < 8) {\n    errors.push('Password must be at least 8 characters');\n  }\n  return errors;\n}" },
      "difficulty": "easy"
    }
  ]
});

// ===== TOPIC 11: Loading States & Caching =====
writeJSON(path.join(CONTENT_DIR, '11-loading-caching', 'quick.json'), {
  "topicId": "11-loading-caching",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "Why Loading States Matter",
      "body": "When your app fetches data, there's a delay. Without feedback, users think the app is broken. Loading states tell users 'I'm working on it!' — like a progress bar at a restaurant."
    },
    {
      "heading": "What is Caching?",
      "body": "Caching stores data temporarily so you don't have to fetch it again. Think of it like keeping frequently-used dishes on the counter instead of in the basement — faster to grab."
    },
    {
      "heading": "Common Loading Patterns",
      "body": "1. Spinner: Simple rotating icon for short waits\n2. Skeleton screen: Placeholder shapes matching the layout\n3. Progress bar: Shows percentage for long operations\n4. Optimistic updates: Show result immediately, reconcile later"
    }
  ],
  "jargon": [
    { "term": "Loading State", "definition": "Visual feedback shown while data is being fetched or processed." },
    { "term": "Cache", "definition": "Temporary storage of data to speed up future access." },
    { "term": "Skeleton Screen", "definition": "A placeholder UI that shows the layout shape while real data loads." },
    { "term": "Optimistic Update", "definition": "Showing the expected result immediately before the server confirms it." }
  ],
  "summary": "Loading states keep users informed. Caching speeds up repeat visits. Use spinners for short waits, skeleton screens for content-heavy loads."
});

writeJSON(path.join(CONTENT_DIR, '11-loading-caching', 'deep.json'), {
  "topicId": "11-loading-caching",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Implementing Loading States",
      "body": "Track loading status in your app:",
      "code": {
        "language": "javascript",
        "snippet": "let loading = false;\nlet data = null;\nlet error = null;\n\nasync function fetchData() {\n  loading = true;\n  error = null;\n  showSpinner();\n\n  try {\n    const res = await fetch('/api/data');\n    if (!res.ok) throw new Error('Failed to load');\n    data = await res.json();\n    renderData(data);\n  } catch (err) {\n    error = err.message;\n    showError(err.message);\n  } finally {\n    loading = false;\n    hideSpinner();\n  }\n}",
        "explanation": "Every async operation should have 3 states: loading (fetching), success (data loaded), error (something failed)."
      }
    },
    {
      "heading": "Browser Caching",
      "body": "The browser caches resources automatically:",
      "code": {
        "language": "javascript",
        "snippet": "// Server tells browser how to cache\napp.use(express.static('public', {\n  maxAge: '1d',  // Cache static files for 1 day\n  etag: true\n}));\n\n// Client-side caching with fetch\nasync function cachedFetch(url, ttl = 300000) {\n  const cached = sessionStorage.getItem(url);\n  if (cached) {\n    const { data, timestamp } = JSON.parse(cached);\n    if (Date.now() - timestamp < ttl) return data;\n  }\n  const res = await fetch(url);\n  const data = await res.json();\n  sessionStorage.setItem(url, JSON.stringify({ data, timestamp: Date.now() }));\n  return data;\n}",
        "explanation": "Cache-Control header tells the browser how long to keep resources. Client-side caching prevents redundant API calls."
      }
    }
  ],
  "summary": "Track loading/error states for every async operation. Use browser caching headers to speed up repeat visits. Implement skeleton screens for better perceived performance."
});

writeJSON(path.join(CONTENT_DIR, '11-loading-caching', 'comparison.json'), {
  "topicId": "11-loading-caching",
  "comparisons": [
    {
      "concept": "Async data fetching with loading state",
      "javascript": {
        "language": "javascript",
        "code": "let loading = true;\nlet data = null;\ntry {\n  const res = await fetch('/api/data');\n  data = await res.json();\n} catch (e) {\n  console.error(e);\n} finally {\n  loading = false;\n}"
      },
      "python": {
        "language": "python",
        "code": "loading = True\ndata = None\ntry:\n    res = requests.get('/api/data')\n    data = res.json()\nexcept Exception as e:\n    print(e)\nfinally:\n    loading = False"
      },
      "explanation": "The pattern is identical: set loading=true, try to fetch, handle errors, set loading=false in finally. The 3-state pattern is universal."
    }
  ],
  "keyInsight": "Loading states and caching are UNIVERSAL web concepts. The 3-state pattern (loading -> success/error) is the same everywhere."
});

writeJSON(path.join(CONTENT_DIR, '11-loading-caching', 'interview.json'), {
  "topicId": "11-loading-caching",
  "questions": [
    {
      "question": "What is the difference between cache-control and ETag?",
      "answer": "Cache-Control tells the browser to store a resource for a specific time (max-age=300 means 5 minutes). ETag is a content hash — the browser sends it back to check if the resource changed. If unchanged, the server returns 304 (Not Modified). Cache-Control = time-based; ETag = content-based.",
      "difficulty": "medium"
    },
    {
      "question": "What is an optimistic update?",
      "answer": "An optimistic update shows the expected result immediately (before the server confirms). For example, when a user likes a post, you instantly increment the like count, then send the request. If the request fails, you roll back. This makes the UI feel instant.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '11-loading-caching', 'exercises.json'), {
  "topicId": "11-loading-caching",
  "exercises": [
    {
      "title": "Build a Loading Spinner Component",
      "description": "Write a function that fetches data from an API and shows a loading spinner while waiting. Hide the spinner when data loads or when an error occurs.",
      "hints": ["Create a show/hide function for the spinner", "Use try/catch/finally to manage states", "Show error message on failure"],
      "solution": { "language": "javascript", "code": "async function loadData() {\n  const spinner = document.getElementById('spinner');\n  const content = document.getElementById('content');\n  const errorEl = document.getElementById('error');\n\n  spinner.style.display = 'block';\n  content.style.display = 'none';\n  errorEl.style.display = 'none';\n\n  try {\n    const res = await fetch('/api/data');\n    if (!res.ok) throw new Error('Failed');\n    const data = await res.json();\n    renderContent(data);\n    content.style.display = 'block';\n  } catch (e) {\n    errorEl.textContent = 'Something went wrong.';\n    errorEl.style.display = 'block';\n  } finally {\n    spinner.style.display = 'none';\n  }\n}" },
      "difficulty": "easy"
    }
  ]
});

// ===== TOPIC 12: Deployment =====
writeJSON(path.join(CONTENT_DIR, '12-deployment', 'quick.json'), {
  "topicId": "12-deployment",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "What is Deployment?",
      "body": "Deployment is making your app available on the internet. Right now your app runs on YOUR computer (localhost). Deployment puts it on a real server so anyone can access it via a URL."
    },
    {
      "heading": "Frontend vs Backend Deployment",
      "body": "They're deployed separately:\n- Frontend (HTML/CSS/JS): Static files hosted on Vercel, Netlify, or GitHub Pages\n- Backend (Node.js/Express): Server hosted on Render, Railway, or AWS\nThey communicate via API calls over the internet."
    },
    {
      "heading": "Free Hosting Options",
      "body": "You can deploy for free:\n- Vercel/Netlify: Best for frontend (static sites, React)\n- Render: Best for backend (Node.js, databases)\n- GitHub Pages: Simple static hosting"
    }
  ],
  "jargon": [
    { "term": "Deployment", "definition": "Making your application accessible on the internet." },
    { "term": "Static Hosting", "definition": "A server that serves HTML/CSS/JS files without running backend code." },
    { "term": "Environment Variables", "definition": "Secret configuration values (API keys, database URLs) stored separately from code." },
    { "term": "CI/CD", "definition": "Continuous Integration/Deployment — automatic testing and deployment when you push code." }
  ],
  "summary": "Deployment puts your app on the internet. Frontend goes to static hosts (Vercel), backend to server hosts (Render). Use environment variables for secrets."
});

writeJSON(path.join(CONTENT_DIR, '12-deployment', 'deep.json'), {
  "topicId": "12-deployment",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Frontend Deployment",
      "body": "Deploying to Vercel/Netlify:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  Step 1: Push code to GitHub\n  Step 2: Connect GitHub repo to Vercel/Netlify\n  Step 3: Configure build settings\n\n  After deployment:\n  - You get a URL like: https://your-app.vercel.app\n  - Every git push auto-deploys\n  - PR previews for testing\n*/",
        "explanation": "Static deployment is simple: push code, get URL. No server to manage."
      }
    },
    {
      "heading": "Backend Deployment",
      "body": "Deploying Node.js to Render:",
      "code": {
        "language": "javascript",
        "snippet": "// Render deployment steps:\n// 1. Push to GitHub\n// 2. Create new Web Service on Render\n// 3. Configure:\n//    - Build command: npm install\n//    - Start command: node server.js\n\n// Important: Use environment variables!\nconst PORT = process.env.PORT || 3000;\nconst JWT_SECRET = process.env.JWT_SECRET;\n\napp.listen(PORT, () => {\n  console.log('Server running on port ' + PORT);\n});",
        "explanation": "Always use environment variables for secrets — never commit .env files."
      }
    },
    {
      "heading": "Production Checklist",
      "body": "Before deploying:",
      "code": {
        "language": "javascript",
        "snippet": "/*\n  Security:\n  - Use environment variables\n  - Enable HTTPS\n  - Add rate limiting\n  - Validate all user input\n\n  Performance:\n  - Enable gzip compression\n  - Set cache headers\n  - Optimize images\n\n  Monitoring:\n  - Add error logging\n  - Monitor uptime\n*/",
        "explanation": "Focus on: environment variables, HTTPS, error handling, and a working README."
      }
    }
  ],
  "summary": "Frontend deploys to static hosts (Vercel/Netlify), backend to server hosts (Render). Use environment variables for secrets. Configure CORS to connect them."
});

writeJSON(path.join(CONTENT_DIR, '12-deployment', 'comparison.json'), {
  "topicId": "12-deployment",
  "comparisons": [
    {
      "concept": "Deployment platform differences",
      "javascript": {
        "language": "javascript",
        "code": "// JavaScript/Node.js\n// Frontend: Vercel\n// Backend: Render\n// Database: PostgreSQL on Render\n// git push -> auto deploy"
      },
      "python": {
        "language": "python",
        "code": "# Python\n# Frontend: Vercel or Netlify\n# Backend: Render (Python runtime)\n# Database: PostgreSQL on Render\n# Same git-push-to-deploy workflow"
      },
      "explanation": "Deployment is LANGUAGE-AGNOSTIC. The platforms support multiple languages. The workflow is the same: push code, build, deploy, get URL."
    }
  ],
  "keyInsight": "Deployment is a PROCESS, not a language feature. Whether you use JavaScript, Python, Go, or Java, the workflow is identical."
});

writeJSON(path.join(CONTENT_DIR, '12-deployment', 'interview.json'), {
  "topicId": "12-deployment",
  "questions": [
    {
      "question": "What is the difference between frontend and backend deployment?",
      "answer": "Frontend deployment hosts static files (HTML, CSS, JS) — no server needed. Backend deployment hosts a running server that processes requests, connects to databases, and runs business logic. They're deployed independently and communicate via API calls.",
      "difficulty": "easy"
    },
    {
      "question": "Why use environment variables instead of hardcoding secrets?",
      "answer": "Hardcoded secrets in code get committed to git — anyone with repo access sees them. Environment variables are set in the deployment platform, separate from code. They prevent secret exposure, allow different values for dev/staging/production, and enable easy secret rotation.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '12-deployment', 'exercises.json'), {
  "topicId": "12-deployment",
  "exercises": [
    {
      "title": "Create a Production Checklist",
      "description": "You're about to deploy a Node.js app. Write a checklist of 5 things you must do before deploying.",
      "hints": ["Think about secrets", "Think about security", "Think about monitoring"],
      "solution": { "language": "text", "code": "1. Move all secrets to environment variables\n2. Enable HTTPS\n3. Add rate limiting to prevent abuse\n4. Set up error logging\n5. Test all API endpoints" },
      "difficulty": "easy"
    }
  ]
});

// ===== TOPIC 13: Modern HTML & CSS =====
writeJSON(path.join(CONTENT_DIR, '13-modern-html-css', 'quick.json'), {
  "topicId": "13-modern-html-css",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "Modern CSS Layouts",
      "body": "Old CSS layouts used floats and hacks. Modern CSS gives you Flexbox and Grid — powerful tools that make layouts easy. Flexbox handles one-dimensional layouts (a row or column). Grid handles two-dimensional layouts (rows AND columns)."
    },
    {
      "heading": "CSS Variables",
      "body": "Variables let you reuse values across your stylesheet. Instead of writing '#3b82f6' everywhere, define it once as --primary-color and reference it everywhere."
    },
    {
      "heading": "Flexbox in 30 Seconds",
      "body": "Add display: flex to a container. Its children align in a row. Use justify-content for horizontal alignment, align-items for vertical. Use gap for spacing between items."
    }
  ],
  "jargon": [
    { "term": "Flexbox", "definition": "A CSS layout system for arranging items in a single row or column." },
    { "term": "Grid", "definition": "A CSS layout system for creating two-dimensional layouts (rows and columns)." },
    { "term": "CSS Variables", "definition": "Reusable values defined with --prefix that can be referenced throughout a stylesheet." }
  ],
  "summary": "Modern CSS uses Flexbox (1D) and Grid (2D) for layouts, CSS variables for reusability, and media queries for responsiveness."
});

writeJSON(path.join(CONTENT_DIR, '13-modern-html-css', 'deep.json'), {
  "topicId": "13-modern-html-css",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Flexbox Deep Dive",
      "body": "Flexbox controls layout in one direction:",
      "code": {
        "language": "css",
        "snippet": ".container {\n  display: flex;\n  flex-direction: row;     /* row | column */\n  justify-content: center;  /* main axis */\n  align-items: center;      /* cross axis */\n  flex-wrap: wrap;\n  gap: 16px;\n}\n\n.item {\n  flex-grow: 1;\n  flex-shrink: 0;\n  flex-basis: 200px;\n}\n\n/* Common patterns */\n.nav { display: flex; justify-content: space-between; }\n.center { display: flex; justify-content: center; align-items: center; }\n.sidebar-layout { display: flex; }\n.sidebar { width: 250px; }\n.main { flex: 1; }",
        "explanation": "justify-content = horizontal. align-items = vertical. flex: 1 means 'take all available space'."
      }
    },
    {
      "heading": "CSS Grid Deep Dive",
      "body": "Grid handles two-dimensional layouts:",
      "code": {
        "language": "css",
        "snippet": ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}\n\n/* Responsive grid (no media queries!) */\n.auto-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n}\n\n/* Named areas */\n.layout {\n  display: grid;\n  grid-template-areas:\n    'header header header'\n    'sidebar main   aside'\n    'footer footer footer';\n  grid-template-columns: 200px 1fr 200px;\n}",
        "explanation": "repeat(3, 1fr) creates 3 equal columns. auto-fit + minmax creates responsive grids automatically."
      }
    },
    {
      "heading": "CSS Variables",
      "body": "Define and reuse values:",
      "code": {
        "language": "css",
        "snippet": ":root {\n  --primary: #3b82f6;\n  --bg-dark: #0f172a;\n  --text: #f1f5f9;\n  --radius: 8px;\n}\n\n.button {\n  background: var(--primary);\n  color: var(--text);\n  border-radius: var(--radius);\n}\n\n/* Theme switching */\n[data-theme='dark'] {\n  --bg-dark: #0f172a;\n  --text: #f1f5f9;\n}\n\n[data-theme='light'] {\n  --bg-dark: #ffffff;\n  --text: #1e293b;\n}",
        "explanation": "Define variables in :root. Reference with var(--name). Change themes by overriding variables."
      }
    }
  ],
  "summary": "Flexbox for 1D layouts, Grid for 2D layouts. CSS variables for reusable values and theming. auto-fit + minmax creates responsive grids without media queries."
});

writeJSON(path.join(CONTENT_DIR, '13-modern-html-css', 'comparison.json'), {
  "topicId": "13-modern-html-css",
  "comparisons": [
    {
      "concept": "Layout systems",
      "javascript": {
        "language": "html",
        "code": "<!-- CSS Flexbox -->\n<div style='display: flex; gap: 10px;'>\n  <div>Item 1</div>\n  <div>Item 2</div>\n  <div>Item 3</div>\n</div>"
      },
      "python": {
        "language": "python",
        "code": "# Python (Tkinter GUI)\nimport tkinter as tk\nroot = tk.Tk()\nframe = tk.Frame(root)\nframe.pack()\nfor i in range(3):\n    tk.Label(frame, text=f'Item {i+1}').pack(side='left', padx=5)"
      },
      "explanation": "CSS Flexbox is for web layout only. The CONCEPT of flexible layout is universal; the implementation is platform-specific."
    }
  ],
  "keyInsight": "CSS Flexbox and Grid are WEB-SPECIFIC. But the CONCEPT of flexible layouts exists everywhere — Flutter has Flex widgets, Android has LinearLayout, iOS has StackView."
});

writeJSON(path.join(CONTENT_DIR, '13-modern-html-css', 'interview.json'), {
  "topicId": "13-modern-html-css",
  "questions": [
    {
      "question": "What is the difference between Flexbox and CSS Grid?",
      "answer": "Flexbox is one-dimensional — it handles layout in a single direction (row OR column). Grid is two-dimensional — it handles rows AND columns simultaneously. Use Flexbox for navbars, card rows, centering. Use Grid for page layouts, dashboards. They work great together.",
      "difficulty": "medium"
    },
    {
      "question": "What are CSS custom properties (variables)?",
      "answer": "CSS custom properties let you define reusable values with -- prefix in :root. Reference them with var(--name). Benefits: (1) Change a value once, update everywhere, (2) Theme switching, (3) Fallback values: var(--color, blue). Unlike preprocessors, CSS variables work in the browser.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '13-modern-html-css', 'exercises.json'), {
  "topicId": "13-modern-html-css",
  "exercises": [
    {
      "title": "Build a Flexbox Navbar",
      "description": "Create a navigation bar with Flexbox: logo on the left, nav links in the center, and a CTA button on the right.",
      "hints": ["Use display: flex on the nav", "Use justify-content: space-between"],
      "solution": { "language": "css", "code": "nav {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 16px 24px;\n  background: #1a1a2e;\n}\n\n.logo { font-size: 24px; font-weight: bold; color: white; }\n\n.nav-links {\n  display: flex;\n  gap: 20px;\n  list-style: none;\n}\n\n.cta-button {\n  background: #3b82f6;\n  color: white;\n  padding: 8px 16px;\n  border-radius: 6px;\n}" },
      "difficulty": "easy"
    },
    {
      "title": "Create a Responsive Card Grid",
      "description": "Build a grid of cards using CSS Grid that shows: 4 columns on wide screens, 2 on medium, 1 on small.",
      "hints": ["Use grid-template-columns with repeat/auto-fit", "Set minmax(250px, 1fr)"],
      "solution": { "language": "css", "code": ".card-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 20px;\n  padding: 20px;\n}\n\n.card {\n  background: white;\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}" },
      "difficulty": "medium"
    }
  ]
});

// ===== TOPIC 14: Modern JavaScript =====
writeJSON(path.join(CONTENT_DIR, '14-modern-javascript', 'quick.json'), {
  "topicId": "14-modern-javascript",
  "type": "quick",
  "estimatedMinutes": 5,
  "sections": [
    {
      "heading": "Modern JavaScript (ES6+)",
      "body": "ES6 (2015) was a massive update to JavaScript. It added features that make code shorter, cleaner, and easier to read. Think of it like upgrading from a typewriter to a modern word processor."
    },
    {
      "heading": "Key Features",
      "body": "The features you'll use every day:\n1. Arrow functions: () => {} — shorter function syntax\n2. const/let: better variables (no more var)\n3. Template literals: `Hello ${name}` — easy string mixing\n4. Destructuring: const {name} = user — extract values easily\n5. async/await: handle promises cleanly\n6. fetch: make API calls easily"
    },
    {
      "heading": "Arrow Functions",
      "body": "Shorter way to write functions:",
      "code": {
        "language": "javascript",
        "snippet": "// Old way\nfunction add(a, b) {\n  return a + b;\n}\n\n// Modern way\nconst add = (a, b) => a + b;\n\n// Even shorter for single params\nconst double = x => x * 2;",
        "explanation": "Arrow functions are shorter and don't have their own 'this'. Use them for callbacks and small functions."
      }
    }
  ],
  "jargon": [
    { "term": "ES6+", "definition": "ECMAScript 2015 and later versions — the modern standard for JavaScript." },
    { "term": "Arrow Function", "definition": "A concise function syntax using => instead of the function keyword." },
    { "term": "Destructuring", "definition": "Extracting values from objects/arrays into individual variables." },
    { "term": "Async/Await", "definition": "Modern syntax for handling asynchronous operations (Promises)." }
  ],
  "summary": "ES6+ modernizes JavaScript with arrow functions, const/let, template literals, destructuring, async/await, and fetch."
});

writeJSON(path.join(CONTENT_DIR, '14-modern-javascript', 'deep.json'), {
  "topicId": "14-modern-javascript",
  "type": "deep",
  "estimatedMinutes": 15,
  "sections": [
    {
      "heading": "Destructuring",
      "body": "Extract values from objects and arrays:",
      "code": {
        "language": "javascript",
        "snippet": "const user = { name: 'Raj', age: 25, email: 'raj@example.com' };\n\nconst { name, age, email } = user;\nconsole.log(name);  // Raj\n\nconst { name: userName, age: userAge } = user;\nconsole.log(userName);  // Raj\n\nconst { name, role = 'user' } = user;\nconsole.log(role);  // user (default)\n\nconst [first, second, ...rest] = [1, 2, 3, 4, 5];\nconsole.log(first);   // 1\nconsole.log(rest);    // [3, 4, 5]",
        "explanation": "Destructuring makes code shorter. Instead of accessing properties one by one, extract them in one line."
      }
    },
    {
      "heading": "Template Literals",
      "body": "Easy string building:",
      "code": {
        "language": "javascript",
        "snippet": "const name = 'Raj';\nconst age = 25;\n\nconst modern = `Hello ${name}, you are ${age} years old`;\n\nconst price = 100;\nconst tax = 0.1;\nconsole.log(`Total: $${price * (1 + tax)}`);  // Total: $110",
        "explanation": "Template literals use backticks and ${} for interpolation. Much cleaner than string concatenation."
      }
    },
    {
      "heading": "Async/Await",
      "body": "Clean asynchronous code:",
      "code": {
        "language": "javascript",
        "snippet": "// Promise chains (old way)\nfetch('/api/users')\n  .then(res => res.json())\n  .then(users => console.log(users))\n  .catch(err => console.error(err));\n\n// Async/await (modern way)\nasync function getUsers() {\n  try {\n    const res = await fetch('/api/users');\n    if (!res.ok) throw new Error('HTTP ' + res.status);\n    const users = await res.json();\n    console.log(users);\n  } catch (err) {\n    console.error(err);\n  }\n}",
        "explanation": "async/await makes async code look synchronous. Put async before function, await before Promises."
      }
    },
    {
      "heading": "Fetch API",
      "body": "The modern way to make HTTP requests:",
      "code": {
        "language": "javascript",
        "snippet": "// GET\nconst res = await fetch('https://api.example.com/users');\nconst users = await res.json();\n\n// POST\nconst res = await fetch('https://api.example.com/users', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ name: 'Raj' })\n});",
        "explanation": "fetch() returns a Promise. Always check res.ok before parsing JSON."
      }
    },
    {
      "heading": "Spread Operator",
      "body": "Flexible data handling:",
      "code": {
        "language": "javascript",
        "snippet": "const arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];  // [1, 2, 3, 4, 5]\n\nconst obj1 = { a: 1, b: 2 };\nconst obj2 = { ...obj1, c: 3 };  // { a: 1, b: 2, c: 3 }\n\nfunction sum(...numbers) {\n  return numbers.reduce((total, n) => total + n, 0);\n}\nconsole.log(sum(1, 2, 3, 4));  // 10",
        "explanation": "'...' is the Swiss Army knife of JavaScript. Spread expands, rest collects."
      }
    }
  ],
  "summary": "Modern JS: arrow functions, destructuring, template literals, async/await, fetch, spread/rest. These features make code shorter and more readable."
});

writeJSON(path.join(CONTENT_DIR, '14-modern-javascript', 'comparison.json'), {
  "topicId": "14-modern-javascript",
  "comparisons": [
    {
      "concept": "Arrow functions vs lambdas",
      "javascript": {
        "language": "javascript",
        "code": "const add = (a, b) => a + b;\n[1, 2, 3].map(x => x * 2);"
      },
      "python": {
        "language": "python",
        "code": "add = lambda a, b: a + b\nlist(map(lambda x: x * 2, [1, 2, 3]))"
      },
      "explanation": "Both languages have concise function syntax. Arrow in JS, lambda in Python. Same concept, different syntax."
    },
    {
      "concept": "Async/await",
      "javascript": {
        "language": "javascript",
        "code": "async function getData() {\n  try {\n    const res = await fetch('/api/data');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}"
      },
      "python": {
        "language": "python",
        "code": "import asyncio\nimport aiohttp\n\nasync def get_data():\n    try:\n        async with aiohttp.ClientSession() as session:\n            async with session.get('/api/data') as res:\n                data = await res.json()\n                return data\n    except Exception as e:\n        print(e)"
      },
      "explanation": "async/await is the same concept in both languages! The pattern (async function -> await -> try/catch) is universal."
    }
  ],
  "keyInsight": "Modern JavaScript features often have Python equivalents. Arrow functions ~ lambdas. Destructuring ~ unpacking. async/await is identical. The CONCEPTS are portable across languages."
});

writeJSON(path.join(CONTENT_DIR, '14-modern-javascript', 'interview.json'), {
  "topicId": "14-modern-javascript",
  "questions": [
    {
      "question": "What is the difference between var, let, and const?",
      "answer": "var is function-scoped and can be redeclared (causes bugs). let is block-scoped and can be reassigned but not redeclared. const is block-scoped and cannot be reassigned at all. Use const by default, let when you need to reassign, never use var.",
      "difficulty": "easy"
    },
    {
      "question": "What is destructuring and when would you use it?",
      "answer": "Destructuring extracts values from objects/arrays into variables in one line. Use it when: (1) Extracting API response fields, (2) Passing options objects to functions, (3) Working with nested data. It makes code shorter and more readable.",
      "difficulty": "easy"
    },
    {
      "question": "What is the difference between fetch and XMLHttpRequest?",
      "answer": "fetch is the modern API (ES6+) — it uses Promises, has a cleaner syntax, and supports async/await. XMLHttpRequest is the old way — callback-based, verbose, and harder to read. Always use fetch in modern code.",
      "difficulty": "medium"
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, '14-modern-javascript', 'exercises.json'), {
  "topicId": "14-modern-javascript",
  "exercises": [
    {
      "title": "Convert to Modern Syntax",
      "description": "Rewrite this old-style code using modern ES6+ features.",
      "hints": ["Use const instead of var", "Use template literals", "Use arrow functions"],
      "solution": { "language": "javascript", "code": "const name = 'Raj';\nconst age = 25;\n\nconst greet = ({ name, age }) => \n  `Hello ${name}, you are ${age} years old`;\n\nconst items = [1, 2, 3];\nconst doubled = items.map(x => x * 2);" },
      "difficulty": "easy"
    },
    {
      "title": "Build an API Client with Fetch",
      "description": "Create a reusable apiClient object with methods: get(url), post(url, data), put(url, data), delete(url).",
      "hints": ["Create a base function that handles common logic", "Use spread operator for headers", "Use async/await"],
      "solution": { "language": "javascript", "code": "const apiClient = {\n  async request(url, options = {}) {\n    const res = await fetch(url, {\n      ...options,\n      headers: { 'Content-Type': 'application/json', ...options.headers },\n      body: options.body ? JSON.stringify(options.body) : undefined\n    });\n    if (!res.ok) throw new Error('HTTP ' + res.status);\n    return res.json();\n  },\n  get(url) { return this.request(url); },\n  post(url, data) { return this.request(url, { method: 'POST', body: data }); },\n  put(url, data) { return this.request(url, { method: 'PUT', body: data }); },\n  delete(url) { return this.request(url, { method: 'DELETE' }); }\n};" },
      "difficulty": "medium"
    }
  ]
});

// ===== CAPSTONE =====
writeJSON(path.join(CONTENT_DIR, 'capstone', 'overview.json'), {
  "topicId": "capstone",
  "type": "capstone",
  "title": "DevBlog — A Developer Blog Platform",
  "description": "Build a complete blog application that ties together everything you've learned: HTML, CSS, JavaScript, REST APIs, authentication, databases, error handling, and deployment.",
  "sections": [
    {
      "heading": "What You'll Build",
      "body": "A simplified version of Medium or dev.to where users can:\n- Create an account and log in (authentication)\n- Write, edit, and delete blog posts (CRUD)\n- View other users' posts (routing, REST API)\n- Like posts (client interaction)\n- See loading states and handle errors gracefully"
    },
    {
      "heading": "Technologies Used",
      "body": "Everything from the course:\n- HTML: Semantic structure\n- CSS: Flexbox/Grid layouts, CSS variables, responsive design\n- JavaScript: ES6+, async/await, fetch, DOM manipulation\n- Backend: Node.js + Express\n- Database: JSON files (or SQLite)\n- Auth: JWT tokens\n- API: REST endpoints"
    },
    {
      "heading": "How It Works",
      "body": "Complete milestones in order. Each milestone builds on the previous one. By the end, you'll have a working full-stack application."
    }
  ]
});

writeJSON(path.join(CONTENT_DIR, 'capstone', 'milestones.json'), {
  "topicId": "capstone",
  "milestones": [
    {
      "index": 0,
      "title": "HTML Structure",
      "description": "Build the HTML foundation for DevBlog: header with navigation, main content area, sidebar, and footer.",
      "topics": ["01-html", "13-modern-html-css"],
      "acceptanceCriteria": ["Uses <header>, <nav>, <main>, <article>, <footer>", "Has a post list section", "Includes navigation bar"]
    },
    {
      "index": 1,
      "title": "CSS Styling",
      "description": "Style DevBlog with modern CSS: Flexbox/Grid, CSS variables, responsive design, dark theme.",
      "topics": ["02-css", "13-modern-html-css"],
      "acceptanceCriteria": ["Uses CSS Grid or Flexbox", "Has CSS variables", "Responsive on mobile", "Dark theme"]
    },
    {
      "index": 2,
      "title": "Client Interactivity",
      "description": "Add JavaScript: theme toggle, form validation, post creation modal.",
      "topics": ["03-javascript", "14-modern-javascript"],
      "acceptanceCriteria": ["Theme toggle works", "Form validates input", "Modal opens/closes"]
    },
    {
      "index": 3,
      "title": "REST API Backend",
      "description": "Build Express backend with REST endpoints for users and posts.",
      "topics": ["04-http-https", "06-routing-rest-graphql", "09-databases-crud"],
      "acceptanceCriteria": ["GET /api/posts returns all posts", "POST /api/posts creates a post", "PUT/DELETE work", "Proper status codes"]
    },
    {
      "index": 4,
      "title": "Authentication",
      "description": "Add JWT authentication: register, login, protected routes.",
      "topics": ["07-auth", "08-cookies-localstorage"],
      "acceptanceCriteria": ["Register creates account", "Login returns JWT", "Protected routes require token"]
    },
    {
      "index": 5,
      "title": "Loading & Error States",
      "description": "Add loading spinners, error messages, graceful error handling.",
      "topics": ["10-error-handling", "11-loading-caching"],
      "acceptanceCriteria": ["Spinner shows during API calls", "Error messages display", "Try/catch wraps async ops"]
    },
    {
      "index": 6,
      "title": "Polish & Deploy",
      "description": "Rate limiting, CORS, environment variables, deployment.",
      "topics": ["05-api-gateway", "12-deployment"],
      "acceptanceCriteria": ["Rate limiting on auth", "CORS configured", "Secrets in env vars", "Deployed"]
    }
  ]
});

console.log('\nAll content files generated successfully!');
