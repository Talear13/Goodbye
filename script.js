const homeScreen = document.getElementById('home-screen');
const logo = document.getElementById('logo');
const terminalScreen = document.getElementById('terminal-screen');
const terminalOutput = document.getElementById('terminal-output');

let cursorElem = null;

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
    terminalOutput.append(text[i]);
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
  terminalOutput.innerHTML = '';

  await typeWithCursor(">>I'LL MISS YOU. IM SORRY, I WILL NEVER FORGET YOU", 90);
  await sleep(1000);
  terminalOutput.append('\n');
  await typeWithCursor(">>WILL YOU SAY SOMETHING OR ATLEAST SAY GOODBYE ONE LAST TIME", 90);
  terminalOutput.append('\n>>[');

  const inputSpan = document.createElement('span');
  inputSpan.id = 'user-input';
  terminalOutput.appendChild(inputSpan);

  terminalOutput.append(']');
  createCursor();

  // 🔥 CREATE & FOCUS HIDDEN INPUT
  const hiddenInput = document.createElement('input');
  hiddenInput.type = 'text';
  hiddenInput.autocapitalize = 'off';
  hiddenInput.autocorrect = 'off';
  hiddenInput.spellcheck = false;
  hiddenInput.style.position = 'absolute';
  hiddenInput.style.opacity = '0';
  hiddenInput.style.height = '0';
  hiddenInput.style.fontSize = '16px'; // prevent iOS zoom
  document.body.appendChild(hiddenInput);
  hiddenInput.focus();

  // 🔁 KEEP FOCUS (iOS / Android safety)
  setInterval(() => {
    if (document.activeElement !== hiddenInput) hiddenInput.focus();
  }, 1000);

  let answer = '';

  hiddenInput.addEventListener('input', () => {
    answer = hiddenInput.value;
    const inputSpan = document.getElementById('user-input');
    if (inputSpan) inputSpan.textContent = answer.toUpperCase();
  });

  hiddenInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      hiddenInput.remove();
      if (cursorElem) cursorElem.remove();
      terminalOutput.append('\n');

      const input = answer.toLowerCase();
      const loveWords = ['love', 'ily', 'i love you', 'i love u', 'i forgive', 'ilyt', 'i like you', 'luv', 'lab'];
      const hateWords = ['never', "don't", "dont", 'wont', 'won’t', 'hate', "can't", 'no', "won't"];
      const goodbyeWords = ['goodbye', 'bye', 'farewell'];

      if (loveWords.some(word => input.includes(word))) {
        typeWithCursor(">>I LOVE YOU", 90, 'cursor-heart', '<3');
      } else if (hateWords.some(word => input.includes(word))) {
        typeWithCursor(">>I'LL STILL LOVE YOU ANYWAY", 90);
      } else if (goodbyeWords.some(word => input.includes(word))) {
        typeWithCursor(">>PLEASE LIVE YOUR LIFE TO THE FULLEST. DONT LET PEOPLE LIKE ME STAND IN YOUR WAY OF BEING HAPPY.", 34, 'cursor-heart', '<3');
      } else {
        createCursor();
      }

      setTimeout(async () => {
        await sleep(2500);
        glitchOut();
      }, 1500);
    }
  });
});

async function glitchOut() {
  terminalOutput.innerHTML = '';
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
          downloadFile("remembrance.txt", "i love you so much, please dont forget me, and please dont let me forget you.\n\n<?>");
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
