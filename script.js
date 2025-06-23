const homeScreen = document.getElementById('home-screen');
const logo = document.getElementById('logo');
const terminalScreen = document.getElementById('terminal-screen');
const terminalOutput = document.getElementById('terminal-output');

let cursorElem = null;
let hiddenInput = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function createCursor(blinkingClass = 'cursor', cursorText = '<?>') {
  if (cursorElem) cursorElem.remove();
  cursorElem = document.createElement('span');
  cursorElem.textContent = cursorText;
  cursorElem.classList.add(blinkingClass);
  terminalOutput.appendChild(cursorElem);
}

async function typeWithCursor(text, speed = 90, cursorClass = 'cursor', cursorText = '<?>') {
  if (cursorElem) cursorElem.remove();
  for (let i = 0; i < text.length; i++) {
    terminalOutput.textContent += text[i];
    await sleep(speed);
  }
  createCursor(cursorClass, cursorText);
}

function downloadFile(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

let clicked = false;
logo.addEventListener('click', async () => {
  if (clicked) return;
  clicked = true;

  homeScreen.classList.add('hidden');
  terminalScreen.classList.remove('hidden');
  terminalOutput.textContent = '';

  await typeWithCursor(">> Hello Layla Gardner. Goodbye Layla Gardner.", 90, 'cursor');
  await sleep(1000);
  terminalOutput.textContent += '\n';
  await typeWithCursor(">> Tell me you love me.", 90, 'cursor');
  terminalOutput.textContent += '\n>>';

  // Create input box setup
  const inputContainer = document.createElement('span');
  inputContainer.style.cursor = 'pointer';

  const openBracket = document.createElement('span');
  openBracket.textContent = '[';

  const inputSpan = document.createElement('span');
  inputSpan.id = 'user-input';

  const closeBracket = document.createElement('span');
  closeBracket.textContent = ']';

  hiddenInput = document.createElement('input');
  hiddenInput.type = 'text';
  hiddenInput.style.position = 'absolute';
  hiddenInput.style.opacity = 0;
  hiddenInput.style.height = 0;
  hiddenInput.style.width = 0;
  hiddenInput.autocapitalize = 'off';
  hiddenInput.autocomplete = 'off';
  hiddenInput.autocorrect = 'off';
  document.body.appendChild(hiddenInput);

  // Sync text as user types
  hiddenInput.addEventListener('input', () => {
    inputSpan.textContent = hiddenInput.value.toUpperCase();
  });

  // Make the [input] box clickable to trigger keyboard
  [inputContainer, openBracket, inputSpan, closeBracket].forEach(el => {
    el.addEventListener('click', () => hiddenInput.focus());
  });

  inputContainer.appendChild(openBracket);
  inputContainer.appendChild(inputSpan);
  inputContainer.appendChild(closeBracket);
  terminalOutput.appendChild(inputContainer);
  createCursor();

  let answer = '';
  function onUserType(e) {
    if (e.key === 'Enter') {
      window.removeEventListener('keydown', onUserType);
      if (cursorElem) cursorElem.remove();
      terminalOutput.textContent += '\n';

      answer = hiddenInput.value || answer;
      const input = answer.toLowerCase();
      const loveWords = ['love', 'ily', 'i love you', 'i love u', 'i forgive', 'ilyt', 'i like you', 'luv', 'lab'];
      const hateWords = ['never', "don't", "dont", 'wont', 'won’t', 'hate', "can't", 'no', "won't"];
      const goodbyeWords = ['goodbye', 'bye', 'farewell'];

      if (loveWords.some(word => input.includes(word))) {
        typeWithCursor(">> I Love you too", 90, 'cursor-heart', '<3');
      } else if (hateWords.some(word => input.includes(word))) {
        typeWithCursor(">> I'LL STILL LOVE YOU ANYWAY", 90, 'cursor');
      } else if (goodbyeWords.some(word => input.includes(word))) {
        typeWithCursor(">> THANK YOU.", 34, 'cursor-heart', '<3');
      } else {
        createCursor();
      }

      setTimeout(async () => {
        await sleep(2000);
        glitchOut();
      }, 1500);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      answer = answer.slice(0, -1);
      inputSpan.textContent = answer.toUpperCase();
      hiddenInput.value = answer;
    } else if (e.key.length === 1) {
      answer += e.key;
      inputSpan.textContent = answer.toUpperCase();
      hiddenInput.value = answer;
    }
  }

  window.addEventListener('keydown', onUserType);
  hiddenInput.focus(); // auto-focus for mobile
});

async function glitchOut() {
  terminalOutput.textContent = '';
  await typeWithCursor("GOODBYE.", 630);

  const glitchText = "GOODBYE.";
  for (let i = 0; i < 30; i++) {
    terminalOutput.textContent = '';
    let glitched = '';
    for (let j = 0; j < glitchText.length; j++) {
      if (Math.random() < 0.3) {
        const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94));
        glitched += randomChar;
      } else {
        glitched += glitchText[j];
      }
    }
    terminalOutput.textContent = glitched;
    await sleep(60);
  }
  terminalOutput.textContent = glitchText;

  await sleep(1500);

  let floodCount = 0;
  const floodMax = 300;

  return new Promise(async (resolve) => {
    const interval = setInterval(() => {
      if (floodCount >= floodMax) {
        clearInterval(interval);
        setTimeout(async () => {
          terminalOutput.innerHTML = '';
          await typeWithCursor("THIS DOMAIN HAS BEEN SEIZED BY THE NATIONAL CYBERCRIME BUREAU.\n\nALL LOGS HAVE BEEN ARCHIVED AND REMOVED FOR INVESTIGATION.", 40);
          downloadFile("GOODBYE.txt", "i love you so much, please dont forget me, and please dont let me forget you.\n\n<?>\n\n- Your needy little nerd.");
          resolve();
        }, 500);
        return;
      }
      const bin = Array.from({ length: 130 }, () => Math.round(Math.random())).join('');
      terminalOutput.textContent += bin + '\n';
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
      floodCount++;
    }, 20);
  });
}
