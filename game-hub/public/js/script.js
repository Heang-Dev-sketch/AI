        // Main script for functionality
        document.addEventListener('DOMContentLoaded', () => {
            // --- MODAL & TOOL LOGIC ---
            const modalContainer = document.getElementById('modal-container');
            let timerInterval; // For Pomodoro Timer
            
            const createModal = (title, content, onOpen = () => {}) => {
                const modal = `
                <div class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" id="modal-backdrop">
                    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg mx-auto transform transition-all" id="modal-box">
                        <div class="p-6 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 class="text-2xl font-semibold text-gray-900 dark:text-white">${title}</h3>
                            <button id="modal-close" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        <div class="p-6 max-h-[70vh] overflow-y-auto modal-scrollbar-hide">
                            ${content}
                        </div>
                    </div>
                </div>`;
                modalContainer.innerHTML = modal;
                onOpen();
            };
            
            modalContainer.addEventListener('click', (e) => {
                if(e.target.id === 'modal-backdrop' || e.target.closest('#modal-close')) {
                    clearInterval(timerInterval); // Clear timer if modal is closed
                    speechSynthesis.cancel(); // Stop any speech synthesis
                    modalContainer.innerHTML = '';
                }
            });

            function generatePassword(length, upper, numbers, symbols) {
                const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
                const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                const numberChars = '0123456789';
                const symbolChars = '!@#$%^&*()_+{}:"<>?|[];\',./`~';
                
                let allChars = lowerChars;
                if (upper) allChars += upperChars;
                if (numbers) allChars += numberChars;
                if (symbols) allChars += symbolChars;

                let password = '';
                for (let i = 0; i < length; i++) {
                    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
                }
                return password;
            }

            const toolImplementations = {
                'natural-reader': () => {
                    const title = 'Natural Reader (Text-to-Speech)';
                    const content = `
                        <textarea id="tts-text" class="w-full h-40 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600" placeholder="Enter text to speak..."></textarea>
                        <div class="mt-4">
                            <label for="tts-voices" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Voice:</label>
                            <select id="tts-voices" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></select>
                        </div>
                        <div class="flex space-x-2 mt-4">
                            <button id="tts-play" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg flex-1">Play</button>
                            <button id="tts-pause" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex-1">Pause</button>
                            <button id="tts-stop" class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex-1">Stop</button>
                        </div>
                    `;
                    createModal(title, content, () => {
                        const textInput = document.getElementById('tts-text');
                        const voiceSelect = document.getElementById('tts-voices');
                        const playBtn = document.getElementById('tts-play');
                        const pauseBtn = document.getElementById('tts-pause');
                        const stopBtn = document.getElementById('tts-stop');
                        let utterance = new SpeechSynthesisUtterance();
                        let voices = [];

                        function populateVoiceList() {
                            voices = speechSynthesis.getVoices();
                            voiceSelect.innerHTML = '';
                            voices.forEach(voice => {
                                let option = document.createElement('option');
                                option.textContent = `${voice.name} (${voice.lang})`;
                                option.setAttribute('data-lang', voice.lang);
                                option.setAttribute('data-name', voice.name);
                                voiceSelect.appendChild(option);
                            });
                        }
                        
                        populateVoiceList();
                        if (speechSynthesis.onvoiceschanged !== undefined) {
                            speechSynthesis.onvoiceschanged = populateVoiceList;
                        }

                        playBtn.addEventListener('click', () => {
                            if (speechSynthesis.paused) {
                                speechSynthesis.resume();
                            } else if (textInput.value !== '') {
                                utterance.text = textInput.value;
                                const selectedVoiceName = voiceSelect.selectedOptions[0].getAttribute('data-name');
                                utterance.voice = voices.find(voice => voice.name === selectedVoiceName);
                                speechSynthesis.cancel(); // Cancel any previous speech
                                speechSynthesis.speak(utterance);
                            }
                        });

                        pauseBtn.addEventListener('click', () => {
                            speechSynthesis.pause();
                        });

                        stopBtn.addEventListener('click', () => {
                            speechSynthesis.cancel();
                        });
                    });
                },
                'voice-recorder': () => {
                    const title = 'Online Voice Recorder';
                    const content = `
                        <div class="text-center">
                            <p id="vr-status" class="mb-4 text-gray-600 dark:text-gray-400">Press 'Record' to start.</p>
                            <div class="flex justify-center space-x-4 mb-4">
                                <button id="vr-record" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg">Record</button>
                                <button id="vr-stop" class="bg-gray-500 text-white font-bold py-3 px-8 rounded-lg cursor-not-allowed" disabled>Stop</button>
                            </div>
                            <audio id="vr-audio" controls class="w-full hidden"></audio>
                            <a id="vr-download" class="hidden mt-4 inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">Download Recording</a>
                        </div>
                    `;
                    createModal(title, content, () => {
                        const statusEl = document.getElementById('vr-status');
                        const recordBtn = document.getElementById('vr-record');
                        const stopBtn = document.getElementById('vr-stop');
                        const audioEl = document.getElementById('vr-audio');
                        const downloadLink = document.getElementById('vr-download');

                        let mediaRecorder;
                        let audioChunks = [];

                        navigator.mediaDevices.getUserMedia({ audio: true })
                            .then(stream => {
                                mediaRecorder = new MediaRecorder(stream);
                                
                                mediaRecorder.ondataavailable = event => {
                                    audioChunks.push(event.data);
                                };

                                mediaRecorder.onstop = () => {
                                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                                    const audioUrl = URL.createObjectURL(audioBlob);
                                    audioEl.src = audioUrl;
                                    audioEl.classList.remove('hidden');
                                    downloadLink.href = audioUrl;
                                    downloadLink.download = `recording-${Date.now()}.webm`;
                                    downloadLink.classList.remove('hidden');
                                    statusEl.textContent = 'Recording finished. Play or download.';
                                };

                                recordBtn.addEventListener('click', () => {
                                    audioChunks = [];
                                    mediaRecorder.start();
                                    statusEl.textContent = 'Recording...';
                                    recordBtn.disabled = true;
                                    recordBtn.classList.add('cursor-not-allowed', 'bg-gray-500');
                                    stopBtn.disabled = false;
                                    stopBtn.classList.remove('cursor-not-allowed', 'bg-gray-500');
                                    stopBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
                                    audioEl.classList.add('hidden');
                                    downloadLink.classList.add('hidden');
                                });

                                stopBtn.addEventListener('click', () => {
                                    mediaRecorder.stop();
                                    statusEl.textContent = 'Stopping...';
                                    recordBtn.disabled = false;
                                    recordBtn.classList.remove('cursor-not-allowed', 'bg-gray-500');
                                    stopBtn.disabled = true;
                                    stopBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                                    stopBtn.classList.add('cursor-not-allowed', 'bg-gray-500');
                                });
                            })
                            .catch(err => {
                                statusEl.textContent = 'Error: Microphone access denied.';
                                console.error("Error accessing microphone:", err);
                            });
                    });
                },
                'word-counter': () => {
                    const title = 'Word Counter';
                    const content = `
                        <textarea id="wc-input" class="w-full h-40 p-3 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Paste your text here..."></textarea>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
                            <div><div class="text-2xl font-bold text-blue-500" id="wc-words">0</div><div class="text-sm text-gray-500 dark:text-gray-400">Words</div></div>
                            <div><div class="text-2xl font-bold text-blue-500" id="wc-chars">0</div><div class="text-sm text-gray-500 dark:text-gray-400">Characters</div></div>
                            <div><div class="text-2xl font-bold text-blue-500" id="wc-sentences">0</div><div class="text-sm text-gray-500 dark:text-gray-400">Sentences</div></div>
                            <div><div class="text-2xl font-bold text-blue-500" id="wc-paragraphs">0</div><div class="text-sm text-gray-500 dark:text-gray-400">Paragraphs</div></div>
                        </div>
                    `;
                    createModal(title, content, () => {
                        const input = document.getElementById('wc-input');
                        input.addEventListener('input', () => {
                            const text = input.value;
                            document.getElementById('wc-chars').textContent = text.length;
                            document.getElementById('wc-words').textContent = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
                            document.getElementById('wc-sentences').textContent = (text.match(/[\w|\)][.?!](\s|$)/g) || []).length;
                            document.getElementById('wc-paragraphs').textContent = text.split(/\n+/).filter(p => p.trim().length > 0).length;
                        });
                    });
                },
                'case-converter': () => {
                    const title = 'Case Converter';
                    const content = `
                        <textarea id="cc-text" class="w-full h-48 p-3 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Type or paste text..."></textarea>
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            <button class="cc-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg" data-case="upper">UPPERCASE</button>
                            <button class="cc-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg" data-case="lower">lowercase</button>
                            <button class="cc-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg" data-case="sentence">Sentence case</button>
                            <button class="cc-btn bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg" data-case="title">Title Case</button>
                        </div>
                    `;
                    createModal(title, content, () => {
                        const textarea = document.getElementById('cc-text');
                        document.querySelectorAll('.cc-btn').forEach(button => {
                            button.addEventListener('click', () => {
                                let text = textarea.value;
                                switch(button.dataset.case) {
                                    case 'upper': text = text.toUpperCase(); break;
                                    case 'lower': text = text.toLowerCase(); break;
                                    case 'sentence': text = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()); break;
                                    case 'title': text = text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '); break;
                                }
                                textarea.value = text;
                            });
                        });
                    });
                },
                'password-generator': () => {
                    const title = 'Secure Password Generator';
                    const content = `
                        <div class="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                            <span id="pg-password" class="text-xl font-mono text-gray-800 dark:text-gray-100 break-all">Click Generate...</span>
                            <button id="pg-copy" class="ml-4 text-gray-500 hover:text-blue-500 flex-shrink-0"><svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg></button>
                        </div>
                         <div class="mt-4 space-y-3">
                            <div><label class="flex items-center justify-between"><span>Length: <span id="pg-length-val">16</span></span><input id="pg-length" type="range" min="8" max="32" value="16" class="w-1/2"></label></div>
                            <div><label class="flex items-center"><input id="pg-numbers" type="checkbox" class="h-4 w-4 text-blue-600" checked> <span class="ml-2">Include Numbers</span></label></div>
                            <div><label class="flex items-center"><input id="pg-symbols" type="checkbox" class="h-4 w-4 text-blue-600" checked> <span class="ml-2">Include Symbols</span></label></div>
                        </div>
                        <button id="pg-generate" class="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">Generate Password</button>
                    `;
                    createModal(title, content, () => {
                        const passEl = document.getElementById('pg-password');
                        const lengthEl = document.getElementById('pg-length');
                        const lengthValEl = document.getElementById('pg-length-val');
                        const numEl = document.getElementById('pg-numbers');
                        const symEl = document.getElementById('pg-symbols');
                        
                        lengthEl.addEventListener('input', (e) => lengthValEl.textContent = e.target.value);
                        
                        document.getElementById('pg-generate').addEventListener('click', () => {
                            const length = +lengthEl.value;
                            const hasNum = numEl.checked;
                            const hasSym = symEl.checked;
                            passEl.textContent = generatePassword(length, true, hasNum, hasSym);
                        });

                        document.getElementById('pg-copy').addEventListener('click', () => {
                            const password = passEl.textContent;
                            if(password && password !== 'Click Generate...') {
                               navigator.clipboard.writeText(password).then(() => {
                                   const copyBtn = document.getElementById('pg-copy');
                                   copyBtn.innerHTML = '<svg class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
                                   setTimeout(() => {
                                       copyBtn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>';
                                   }, 2000);
                               });
                            }
                        });
                    });
                },
                'qr-code-maker': () => {
                    const title = 'QR Code Maker';
                    const content = `
                        <input type="text" id="qr-input" class="w-full p-3 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Enter URL or text">
                        <button id="qr-generate" class="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">Generate QR Code</button>
                        <div id="qr-output" class="mt-6 flex justify-center items-center bg-white p-4 rounded-lg min-h-[256px] w-fit mx-auto"></div>
                    `;
                    createModal(title, content, () => {
                        const input = document.getElementById('qr-input');
                        const output = document.getElementById('qr-output');
                        const generateBtn = document.getElementById('qr-generate');
                        
                        const generateQR = () => {
                            const text = input.value.trim();
                            if (text) {
                                output.innerHTML = '';
                                new QRCode(output, {
                                    text: text,
                                    width: 256,
                                    height: 256,
                                    colorDark : "#000000",
                                    colorLight : "#ffffff",
                                    correctLevel : QRCode.CorrectLevel.H
                                });
                            }
                        };

                        generateBtn.addEventListener('click', generateQR);
                        input.addEventListener('keypress', (e) => { if(e.key === 'Enter') generateQR(); });
                    });
                },
                'pomodoro-timer': () => {
                    const title = 'Pomodoro Timer';
                    const content = `
                        <div class="text-center">
                            <div class="flex justify-center space-x-2 mb-6">
                                <button data-mode="pomodoro" class="pomodoro-mode-btn bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg">Pomodoro</button>
                                <button data-mode="shortBreak" class="pomodoro-mode-btn bg-gray-300 dark:bg-gray-600 py-2 px-4 rounded-lg">Short Break</button>
                                <button data-mode="longBreak" class="pomodoro-mode-btn bg-gray-300 dark:bg-gray-600 py-2 px-4 rounded-lg">Long Break</button>
                            </div>
                            <div id="pomodoro-time" class="text-8xl font-bold mb-6">25:00</div>
                            <div class="flex justify-center space-x-4">
                                <button id="pomodoro-start" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-xl">Start</button>
                                <button id="pomodoro-reset" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-xl">Reset</button>
                            </div>
                        </div>
                    `;
                    createModal(title, content, () => {
                        let timeLeft, isRunning = false, currentMode = 'pomodoro';
                        const timeDisplay = document.getElementById('pomodoro-time');
                        const startBtn = document.getElementById('pomodoro-start');
                        const resetBtn = document.getElementById('pomodoro-reset');
                        const modeBtns = document.querySelectorAll('.pomodoro-mode-btn');
                        const modes = { pomodoro: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
                        
                        function updateDisplay() {
                            const minutes = Math.floor(timeLeft / 60);
                            const seconds = timeLeft % 60;
                            timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                        }

                        function setMode(mode) {
                            clearInterval(timerInterval);
                            isRunning = false;
                            startBtn.textContent = 'Start';
                            currentMode = mode;
                            timeLeft = modes[mode];
                            updateDisplay();
                            modeBtns.forEach(btn => {
                                btn.classList.remove('bg-yellow-500', 'text-white');
                                btn.classList.add('bg-gray-300', 'dark:bg-gray-600');
                            });
                            document.querySelector(`[data-mode="${mode}"]`).classList.add('bg-yellow-500', 'text-white');
                        }

                        function tick() {
                            timeLeft--;
                            updateDisplay();
                            if (timeLeft <= 0) {
                                clearInterval(timerInterval);
                                isRunning = false;
                                startBtn.textContent = 'Start';
                                alert(`${currentMode} session finished!`);
                            }
                        }

                        startBtn.addEventListener('click', () => {
                            isRunning = !isRunning;
                            if (isRunning) {
                                startBtn.textContent = 'Pause';
                                timerInterval = setInterval(tick, 1000);
                            } else {
                                startBtn.textContent = 'Start';
                                clearInterval(timerInterval);
                            }
                        });

                        resetBtn.addEventListener('click', () => setMode(currentMode));
                        modeBtns.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
                        
                        setMode('pomodoro'); // Initial setup
                    });
                },
                'grade-calculator': () => {
                    const title = 'Grade Calculator';
                    const content = `
                        <div id="gc-rows" class="space-y-3 mb-4">
                            <div class="flex items-center space-x-2 gc-row">
                                <input type="text" placeholder="Assignment" class="gc-name w-1/2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                                <input type="number" placeholder="Score" class="gc-score w-1/4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                                <input type="number" placeholder="Weight (%)" class="gc-weight w-1/4 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                            </div>
                        </div>
                        <button id="gc-add-row" class="w-full mb-4 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 py-2 rounded-lg">+ Add Assignment</button>
                        <button id="gc-calculate" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">Calculate Grade</button>
                        <div id="gc-result" class="mt-6 text-center bg-gray-100 dark:bg-gray-700 p-4 rounded-lg hidden">
                           <h4 class="text-lg font-semibold">Your Final Grade:</h4>
                           <p class="text-4xl font-bold text-blue-500" id="gc-final-grade">-</p>
                           <p class="text-xl font-medium" id="gc-letter-grade">-</p>
                        </div>
                    `;
                    createModal(title, content, () => {
                        const rowsContainer = document.getElementById('gc-rows');
                        const addBtn = document.getElementById('gc-add-row');
                        const calcBtn = document.getElementById('gc-calculate');
                        const resultBox = document.getElementById('gc-result');
                        const finalGradeEl = document.getElementById('gc-final-grade');
                        const letterGradeEl = document.getElementById('gc-letter-grade');

                        const rowTemplate = rowsContainer.children[0].cloneNode(true);
                        
                        addBtn.addEventListener('click', () => {
                            const newRow = rowTemplate.cloneNode(true);
                            newRow.querySelectorAll('input').forEach(input => input.value = '');
                            rowsContainer.appendChild(newRow);
                        });

                        calcBtn.addEventListener('click', () => {
                            let totalWeightedScore = 0;
                            let totalWeight = 0;
                            
                            document.querySelectorAll('.gc-row').forEach(row => {
                                const score = parseFloat(row.querySelector('.gc-score').value);
                                const weight = parseFloat(row.querySelector('.gc-weight').value);

                                if (!isNaN(score) && !isNaN(weight) && weight > 0) {
                                    totalWeightedScore += score * weight;
                                    totalWeight += weight;
                                }
                            });

                            if (totalWeight === 0) {
                                alert('Please enter valid scores and weights.');
                                return;
                            }

                            const finalGrade = totalWeightedScore / totalWeight;
                            finalGradeEl.textContent = `${finalGrade.toFixed(2)}%`;
                            letterGradeEl.textContent = getLetterGrade(finalGrade);
                            resultBox.classList.remove('hidden');
                        });
                        
                        function getLetterGrade(grade) {
                            if (grade >= 90) return 'A'; if (grade >= 80) return 'B';
                            if (grade >= 70) return 'C'; if (grade >= 60) return 'D';
                            return 'F';
                        }
                    });
                },
                'todo-list': () => {
                     const title = 'To-Do List';
                     const content = `
                        <div class="flex space-x-2 mb-4">
                            <input type="text" id="todo-input" class="w-full p-3 bg-gray-100 dark:bg-gray-700 border dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Add a new task...">
                            <button id="todo-add" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-5 rounded-lg">Add</button>
                        </div>
                        <ul id="todo-list-items" class="space-y-2"></ul>
                     `;
                     createModal(title, content, () => {
                        const input = document.getElementById('todo-input');
                        const addBtn = document.getElementById('todo-add');
                        const list = document.getElementById('todo-list-items');

                        const addTask = () => {
                            const taskText = input.value.trim();
                            if (taskText === '') return;
                            
                            const li = document.createElement('li');
                            li.className = 'todo-item flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg';
                            li.innerHTML = `
                                <span class="cursor-pointer flex-grow">${taskText}</span>
                                <button class="todo-delete text-red-500 hover:text-red-700 ml-4">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            `;
                            list.appendChild(li);
                            input.value = '';
                            input.focus();
                        };

                        addBtn.addEventListener('click', addTask);
                        input.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter') addTask();
                        });

                        list.addEventListener('click', (e) => {
                            const target = e.target;
                            if (target.tagName === 'SPAN') {
                                target.parentElement.classList.toggle('completed');
                            }
                            if (target.closest('.todo-delete')) {
                                target.closest('.todo-item').remove();
                            }
                        });
                     });
                }
            };
            
            document.body.addEventListener('click', (e) => {
                const toolTarget = e.target.closest('[data-tool]');
                if (toolTarget) {
                    e.preventDefault();
                    const toolName = toolTarget.dataset.tool;
                    if (toolImplementations[toolName]) {
                        toolImplementations[toolName]();
                    }
                }
            });
            
            // --- THEME & LANGUAGE SCRIPTS ---
            const themeToggleBtn = document.getElementById('theme-toggle');
            const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
            const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
            const langToggleBtn = document.getElementById('lang-toggle');
            const htmlEl = document.documentElement;

            const currentTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

            if (currentTheme === 'dark') {
                htmlEl.classList.add('dark');
                themeToggleLightIcon.classList.remove('hidden');
            } else {
                themeToggleDarkIcon.classList.remove('hidden');
            }

            themeToggleBtn.addEventListener('click', () => {
                htmlEl.classList.toggle('dark');
                const isDark = htmlEl.classList.contains('dark');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                themeToggleDarkIcon.classList.toggle('hidden', isDark);
                themeToggleLightIcon.classList.toggle('hidden', !isDark);
            });
            
            const translations = {
                en: {
                    title: "Awesome Online Tools", nav_voice: "Voice Tools", nav_ocr: "OCR Tools", nav_pdf: "PDF Tools", nav_lang: "Language", nav_prod: "Productivity", hero_title: "Your Digital Toolbox, Reimagined.", hero_subtitle: "A curated collection of 105 free and easy-to-use online utilities to boost your productivity and simplify your tasks.", cat_1_title: "Text to Speech / Voice Tools", tool_1_1_name: "Natural Reader", tool_1_1_desc: "Convert text into natural-sounding speech. Perfect for listening to articles or proofreading.", tool_1_2_name: "Online Voice Recorder", tool_1_2_desc: "A simple, browser-based voice recorder. No installation required. Save recordings as MP3.", tool_1_3_name: "Speech-to-Text Pro", tool_1_3_desc: "Dictate notes, emails, or documents with high accuracy. Supports multiple languages.", tool_1_4_name: "Audio Cutter", tool_1_4_desc: "Trim or cut audio files online without installing any software. Simple and fast.", tool_1_5_name: "Audio Joiner", tool_1_5_desc: "Merge multiple audio tracks into a single file. Supports various formats like MP3, WAV.", tool_1_6_name: "Voice Changer", tool_1_6_desc: "Apply fun effects to your voice recordings. Sound like a robot, a chipmunk, and more.", tool_1_7_name: "Pitch Shifter", tool_1_7_desc: "Change the pitch of your audio files without affecting the tempo. Great for musicians.", tool_1_8_name: "Vocal Remover", tool_1_8_desc: "Isolate vocals from music to create karaoke or instrumental tracks using AI.", tool_1_9_name: "MP3 Converter", tool_1_9_desc: "Convert various audio and video formats to MP3 files quickly and easily.", tool_1_10_name: "Pronunciation Checker", tool_1_10_desc: "Listen to the correct pronunciation of words in different accents and languages.", tool_1_11_name: "Audio Equalizer", tool_1_11_desc: "Fine-tune the frequency bands of your audio files with a graphic equalizer.", tool_1_12_name: "Noise Remover", tool_1_12_desc: "Clean up audio recordings by removing background noise and hiss.", cat_2_title: "Image to Text / OCR Tools", tool_2_1_name: "Easy OCR Scanner", tool_2_1_desc: "Extract text from images and scanned documents. Supports JPG, PNG, and PDF files.", tool_2_2_name: "Table Extractor", tool_2_2_desc: "Convert image-based tables into editable Excel or CSV formats with a single click.", tool_2_3_name: "Handwriting Reader", tool_2_3_desc: "Digitize your handwritten notes. Works best with clear, legible handwriting.", tool_2_4_name: "Screenshot to Text", tool_2_4_desc: "Instantly grab text from any screenshot on your screen without retyping.", tool_2_5_name: "PDF to Text", tool_2_5_desc: "Extract all text content from a PDF file, making it searchable and editable.", tool_2_6_name: "Math Equation Solver", tool_2_6_desc: "Scan a math problem with your camera and get a step-by-step solution.", tool_2_7_name: "Business Card Scanner", tool_2_7_desc: "Digitize contact info from business cards and save it directly to your contacts.", tool_2_8_name: "Receipt Scanner", tool_2_8_desc: "Extract data from receipts for easy expense tracking and management.", tool_2_9_name: "Image Text Translator", tool_2_9_desc: "Translate text directly from an image. Point your camera at signs, menus, and more.", tool_2_10_name: "Document Scanner", tool_2_10_desc: "Turn your phone into a portable document scanner. Creates high-quality PDF scans.", tool_2_11_name: "Passport/ID Scanner", tool_2_11_desc: "Quickly extract information from passports, ID cards, and driver's licenses.", tool_2_12_name: "Menu Scanner", tool_2_12_desc: "Scan restaurant menus to view them online, check ingredients, or translate dishes.", cat_3_title: "PDF & Document Tools", tool_3_1_name: "PDF Merge & Split", tool_3_1_desc: "Combine PDFs into one, or split a large PDF into separate pages or files.", tool_3_2_name: "PDF Compressor", tool_3_2_desc: "Reduce the file size of your PDFs for easy sharing without losing quality.", tool_3_3_name: "Word to PDF Converter", tool_3_3_desc: "Convert Microsoft Word documents to high-quality, professional PDFs.", tool_3_4_name: "PDF to Word", tool_3_4_desc: "Convert PDFs back to editable Word documents with accurate formatting.", tool_3_5_name: "PDF to Excel", tool_3_5_desc: "Extract tables from PDFs and convert them into editable Excel spreadsheets.", tool_3_6_name: "PDF to JPG", tool_3_6_desc: "Convert each page of a PDF into a high-quality JPG image file.", tool_3_7_name: "JPG to PDF", tool_3_7_desc: "Combine multiple JPG images into a single, easy-to-share PDF document.", tool_3_8_name: "eSign PDF", tool_3_8_desc: "Sign documents electronically and request signatures from others securely.", tool_3_9_name: "Unlock PDF", tool_3_9_desc: "Remove passwords and restrictions from PDF files (if you have the rights).", tool_3_10_name: "Protect PDF", tool_3_10_desc: "Add a password to your PDF files to prevent unauthorized access.", tool_3_11_name: "Organize PDF Pages", tool_3_11_desc: "Rotate, reorder, or delete pages within your PDF document with ease.", tool_3_12_name: "Add Watermark to PDF", tool_3_12_desc: "Stamp your PDFs with a text or image watermark for branding or security.", tool_3_13_name: "CSV to JSON Converter", tool_3_13_desc: "Convert CSV data files to JSON format for use in web applications.", tool_3_14_name: "Document Compare", tool_3_14_desc: "Compare two versions of a document to see the differences highlighted.", tool_3_15_name: "Add Page Numbers", tool_3_15_desc: "Easily insert page numbers into your PDF documents in various positions.", cat_4_title: "Translation & Language Tools", tool_4_1_name: "Quick Translate", tool_4_1_desc: "Instant translation for over 100 languages. Supports text and documents.", tool_4_2_name: "Grammar Check Pro", tool_4_2_desc: "Check writing for grammar, spelling, and punctuation errors in real-time.", tool_4_3_name: "Language Detector", tool_4_3_desc: "Automatically identify the language of any given text. Useful for unknown sources.", tool_4_4_name: "Document Translator", tool_4_4_desc: "Translate entire documents (PDF, Word, etc.) while preserving the original layout.", tool_4_5_name: "Online Thesaurus", tool_4_5_desc: "Find synonyms and antonyms to improve your vocabulary and writing style.", tool_4_6_name: "Word Counter", tool_4_6_desc: "Count words, characters, sentences, and paragraphs in your text instantly.", tool_4_7_name: "Case Converter", tool_4_7_desc: "Change text to uppercase, lowercase, sentence case, or title case automatically.", tool_4_8_name: "Lorem Ipsum Generator", tool_4_8_desc: "Generate placeholder text for your design mockups and layouts.", tool_4_9_name: "Rhyming Dictionary", tool_4_9_desc: "Find words that rhyme. A great tool for poets, songwriters, and writers.", tool_4_10_name: "Slang Dictionary", tool_4_10_desc: "Look up the meaning of modern slang, internet acronyms, and urban phrases.", tool_4_11_name: "Crossword Solver", tool_4_11_desc: "Find answers to tricky crossword puzzle clues by entering known letters.", tool_4_12_name: "Idiom Finder", tool_4_12_desc: "Discover the meaning and origin of common idioms and expressions.", cat_5_title: "Learning & Productivity Tools", tool_5_1_name: "Focus Timer (Pomodoro)", tool_5_1_desc: "Boost productivity with the Pomodoro Technique. Customizable work intervals.", tool_5_2_name: "Flashcard Maker", tool_5_2_desc: "Create, study, and share digital flashcards for any subject. Great for students.", tool_5_3_name: "Mind Map Online", tool_5_3_desc: "Visually organize thoughts and brainstorm ideas with an intuitive mind mapping tool.", tool_5_4_name: "Online Whiteboard", tool_5_4_desc: "A collaborative digital whiteboard for brainstorming, teaching, and presentations.", tool_5_5_name: "Resume Builder", tool_5_5_desc: "Create a professional resume in minutes with easy-to-use templates.", tool_5_6_name: "Flowchart Maker", tool_5_6_desc: "Build flowcharts and diagrams online with a simple drag-and-drop interface.", tool_5_7_name: "Gantt Chart Maker", tool_5_7_desc: "Plan and schedule projects with an online Gantt chart creator.", tool_5_8_name: "Checklist Maker", tool_5_8_desc: "Create simple, shareable checklists for any task or project.", tool_5_9_name: "Habit Tracker", tool_5_9_desc: "Track your daily habits and goals to build positive routines and stay motivated.", tool_5_10_name: "Timezone Converter", tool_5_10_desc: "Easily convert times between different timezones around the world.", tool_5_11_name: "Decision Wheel", tool_5_11_desc: "Can't decide? Let the wheel make a random choice for you. Fun and simple.", tool_5_12_name: "Study Planner", tool_5_12_desc: "Organize your study schedule, track subjects, and set reminders for exams.", tool_5_13_name: "Grade Calculator", tool_5_13_desc: "Calculate your course grade or GPA based on assignments and weights.", tool_5_14_name: "To-Do List", tool_5_14_desc: "A simple to-do list to keep track of your daily tasks.", tool_5_15_name: "Presentation Maker", tool_5_15_desc: "Create beautiful and engaging presentations online with various templates.", cat_6_title: "Misc / Conversion & Utility", tool_6_1_name: "Universal Unit Converter", tool_6_1_desc: "A comprehensive converter for length, weight, temperature, volume, and more.", tool_6_2_name: "Secure Password Gen", tool_6_2_desc: "Create strong, random passwords with customizable length and characters.", tool_6_3_name: "QR Code Maker", tool_6_3_desc: "Generate QR codes for URLs, text, Wi-Fi access, and more. Simple and fast.", tool_6_4_name: "Image Compressor", tool_6_4_desc: "Reduce the file size of your images (JPG, PNG) without losing quality.", tool_6_5_name: "Image Resizer", tool_6_5_desc: "Resize images to specific dimensions or percentages for web and social media.", tool_6_6_name: "Color Picker", tool_6_6_desc: "Pick colors from an image or a color wheel and get HEX, RGB, and HSL codes.", tool_6_7_name: "URL Shortener", tool_6_7_desc: "Create short, manageable links from long URLs for easy sharing.", tool_6_8_name: "File Converter", tool_6_8_desc: "Convert between various file formats for documents, images, audio, and video.", tool_6_9_name: "Archive Extractor", tool_6_9_desc: "Unzip files online. Supports ZIP, RAR, 7z, and other compressed formats.", tool_6_10_name: "What Is My IP?", tool_6_10_desc: "Quickly find your public IP address and location information.", tool_6_11_name: "Internet Speed Test", tool_6_11_desc: "Check your download and upload speeds with a simple one-click test.", tool_6_12_name: "Random Name Picker", tool_6_12_desc: "Enter a list of names and randomly select a winner. Great for giveaways.", tool_6_13_name: "MD5 Hash Generator", tool_6_13_desc: "Generate the MD5 hash of any string for data integrity checks.", tool_6_14_name: "Favicon Generator", tool_6_14_desc: "Create a favicon.ico file for your website from any image.", tool_6_15_name: "Morse Code Translator", tool_6_15_desc: "Translate text to Morse code and vice versa. Includes audio playback.", tool_6_16_name: "Age Calculator", tool_6_16_desc: "Find out your exact age in years, months, days, and even seconds.", tool_6_17_name: "Date Calculator", tool_6_17_desc: "Add or subtract days, weeks, months, and years from a given date.", tool_6_18_name: "BMI Calculator", tool_6_18_desc: "Calculate your Body Mass Index (BMI) to check if you are in a healthy weight range.", tool_6_19_name: "HEX to RGB Converter", tool_6_19_desc: "Convert color codes between HEX and RGB formats for web design and development.", tool_6_20_name: "Binary Converter", tool_6_20_desc: "Convert text to binary code and binary code back to text.", tool_6_21_name: "Image to Base64", tool_6_21_desc: "Encode your images into Base64 strings for embedding in HTML or CSS.", tool_6_22_name: "YT Thumbnail Downloader", tool_6_22_desc: "Download high-quality YouTube video thumbnails by pasting the video URL.", tool_6_23_name: "Countdown Timer", tool_6_23_desc: "Set a timer that counts down from a specified time. Includes an alarm.", tool_6_24_name: "Stopwatch", tool_6_24_desc: "A simple online stopwatch to measure elapsed time with lap functionality.", tool_6_25_name: "Random Number Generator", tool_6_25_desc: "Generate one or more random numbers within a specified range (min/max).", tool_6_26_name: "Image Cropper", tool_6_26_desc: "Crop and cut images online to a specific size with a simple visual editor.", tool_6_27_name: "Watermark an Image", tool_6_27_desc: "Add a text or image watermark to your photos for protection or branding.", tool_6_28_name: "ICO Converter", tool_6_28_desc: "Convert PNG, JPG, or GIF images to the .ico format for website favicons.", tool_6_29_name: "Screen Recorder", tool_6_29_desc: "Record your screen online without installing any software. Great for tutorials.", tool_6_30_name: "Webcam Test", tool_6_30_desc: "Quickly check if your webcam is working correctly directly in your browser.", tool_6_31_name: "Microphone Test", tool_6_31_desc: "Test your microphone to ensure it's working and picking up sound.", tool_6_32_name: "Text Repeater", tool_6_32_desc: "Repeat a piece of text a specified number of times. Fun for social media.", tool_6_33_name: "JSON Formatter", tool_6_33_desc: "Validate and format your JSON data to make it readable and pretty.", tool_6_34_name: "XML Formatter", tool_6_34_desc: "Validate and format your XML data for better readability and structure.", tool_6_35_name: "CSS Minifier", tool_6_35_desc: "Minify your CSS code to reduce file size and improve website loading speed.", tool_6_36_name: "JS Minifier", tool_6_36_desc: "Minify JavaScript code to optimize your website's performance and speed.", tool_6_37_name: "HTML Minifier", tool_6_37_desc: "Compress your HTML code by removing unnecessary characters and spaces.", tool_6_38_name: "Credit Card Validator", tool_6_38_desc: "Check if a credit card number is valid using the Luhn algorithm.", tool_6_39_name: "Barcode Generator", tool_6_39_desc: "Create various types of barcodes, such as UPC, EAN, and Code 128.", footer_copyright: "© 2024 Awesome Online Tools. All Rights Reserved.", footer_subtitle: "Designed to make your digital life easier.",
                },
                km: {
                    title: "ឧបករណ៍អនឡាញដ៏អស្ចារ្យ", nav_voice: "ឧបករណ៍សំឡេង", nav_ocr: "ឧបករណ៍ OCR", nav_pdf: "ឧបករណ៍ PDF", nav_lang: "ភាសា", nav_prod: "ផលិតភាព", hero_title: "ប្រអប់ឧបករណ៍ឌីជីថលរបស់អ្នក, រៀបចំឡើងវិញ។", hero_subtitle: "បណ្តុំនៃឧបករណ៍ប្រើប្រាស់អនឡាញឥតគិតថ្លៃចំនួន ១០៥ ដែលងាយស្រួលប្រើ ដើម្បីបង្កើនផលិតភាពរបស់អ្នក និងសម្រួលកិច្ចការរបស់អ្នក។", cat_1_title: "អត្ថបទទៅការនិយាយ / ឧបករណ៍សំឡេង", tool_1_1_name: "អ្នកអានធម្មជាតិ", tool_1_1_desc: "បំប្លែងអត្ថបទទៅជាការនិយាយបែបធម្មជាតិ។ ល្អឥតខ្ចោះសម្រាប់ការស្តាប់អត្ថបទ ឬពិនិត្យអក្ខរាវិរុទ្ធ។", tool_1_2_name: "ថតសំឡេងអនឡាញ", tool_1_2_desc: "កម្មវិធីថតសំឡេងតាម browser ដ៏សាមញ្ញ។ មិនចាំបាច់ដំឡើងទេ។ រក្សាទុកជាឯកសារ MP3។", tool_1_3_name: "និយាយទៅអត្ថបទ ប្រូ", tool_1_3_desc: "សរសេរកំណត់ចំណាំ អ៊ីមែល ឬឯកសារដោយភាពត្រឹមត្រូវខ្ពស់។ គាំទ្រច្រើនភាសា។", tool_1_4_name: "កាត់សំឡេង", tool_1_4_desc: "កាត់ត ឬកាត់ឯកសារអូឌីយ៉ូតាមអ៊ីនធឺណិតដោយមិនចាំបាច់ដំឡើងកម្មវិធី។ សាមញ្ញ និងលឿន។", tool_1_5_name: "ភ្ជាប់សំឡេង", tool_1_5_desc: "បញ្ចូលបទអូឌីយ៉ូច្រើនទៅក្នុងឯកសារតែមួយ។ គាំទ្រទ្រង់ទ្រាយផ្សេងៗដូចជា MP3, WAV ។", tool_1_6_name: "ប្តូរសំឡេង", tool_1_6_desc: "អនុវត្តបែបផែនរីករាយចំពោះការថតសំឡេងរបស់អ្នក។ ស្តាប់ទៅដូចជាមនុស្សយន្ត កំប្រុក និងច្រើនទៀត។", tool_1_7_name: "ប្តូរកម្រិតសំឡេង", tool_1_7_desc: "ផ្លាស់ប្តូរកម្រិតសំឡេងនៃឯកសារអូឌីយ៉ូរបស់អ្នកដោយមិនប៉ះពាល់ដល់ល្បឿន។ ល្អសម្រាប់តន្រ្តីករ។", tool_1_8_name: "ដកសំឡេងច្រៀង", tool_1_8_desc: "ញែកសំឡេងច្រៀងចេញពីតន្ត្រីដើម្បីបង្កើតខារ៉ាអូខេ ឬបទភ្លេងដោយប្រើ AI ។", tool_1_9_name: "កម្មវិធីបម្លែង MP3", tool_1_9_desc: "បំប្លែងទ្រង់ទ្រាយអូឌីយ៉ូ និងវីដេអូផ្សេងៗទៅជាឯកសារ MP3 បានយ៉ាងឆាប់រហ័ស និងងាយស្រួល។", tool_1_10_name: "ពិនិត្យការបញ្ចេញសំឡេង", tool_1_10_desc: "ស្តាប់ការបញ្ចេញសំឡេងត្រឹមត្រូវនៃពាក្យក្នុងសំនៀង និងភាសាផ្សេងៗគ្នា។", tool_1_11_name: "ឧបករណ៍ปรับแต่งเสียง", tool_1_11_desc: "ปรับแต่งย่านความถี่ของไฟล์เสียงของคุณอย่างละเอียดด้วยอีควอไลเซอร์กราฟิก", tool_1_12_name: "លុបសំឡេងរំខាន", tool_1_12_desc: "សម្អាតការថតសំឡេងដោយលុបសំឡេងរំខានខាងក្រោយ និងសំឡេងហ៊ោកញ្ជ្រៀវ។", cat_2_title: "រូបភាពទៅអត្ថបទ / ឧបករណ៍ OCR", tool_2_1_name: "ម៉ាស៊ីនស្កេន OCR ងាយស្រួល", tool_2_1_desc: "ដកស្រង់អត្ថបទពីរូបភាព និងឯកសារដែលបានស្កេន។ គាំទ្រឯកសារ JPG, PNG និង PDF ។", tool_2_2_name: "ដកស្រង់តារាង", tool_2_2_desc: "បំប្លែងតារាងពីរូបភាពទៅជាទ្រង់ទ្រាយ Excel ឬ CSV ដែលអាចកែសម្រួលបានដោយចុចតែម្តង។", tool_2_3_name: "អ្នកអានការសរសេរដោយដៃ", tool_2_3_desc: "ធ្វើឌីជីថលកំណត់ចំណាំដែលសរសេរដោយដៃរបស់អ្នក។ ដំណើរការល្អបំផុតជាមួយការសរសេរដោយដៃច្បាស់លាស់។", tool_2_4_name: "រូបថតអេក្រង់ទៅអត្ថបទ", tool_2_4_desc: "ចាប់យកអត្ថបទពីរូបថតអេក្រង់ណាមួយភ្លាមៗដោយមិនចាំបាច់វាយឡើងវិញ។", tool_2_5_name: "PDF ទៅអត្ថបទ", tool_2_5_desc: "ដកស្រង់មាតិកាអត្ថបទទាំងអស់ពីឯកសារ PDF ធ្វើឱ្យវាអាចស្វែងរក និងកែសម្រួលបាន។", tool_2_6_name: "អ្នកដោះស្រាយសមីការគណិតវិទ្យា", tool_2_6_desc: "វិភាគបញ្ហាគណិតវិទ្យាដោយប្រើកាមេរ៉ារបស់អ្នក ហើយទទួលបានដំណោះស្រាយមួយជំហានម្តងៗ។", tool_2_7_name: "ម៉ាស៊ីនស្កេននាមប័ណ្ណ", tool_2_7_desc: "ធ្វើឌីជីថលព័ត៌មានទំនាក់ទំនងពីនាមប័ណ្ណ ហើយរក្សាទុកវាដោយផ្ទាល់ទៅក្នុងទំនាក់ទំនងរបស់អ្នក។", tool_2_8_name: "ម៉ាស៊ីនស្កេនវិក័យប័ត្រ", tool_2_8_desc: "ដកស្រង់ទិន្នន័យពីវិក័យប័ត្រសម្រាប់ការតាមដាន និងគ្រប់គ្រងការចំណាយបានយ៉ាងងាយស្រួល។", tool_2_9_name: "អ្នកបកប្រែអត្ថបទរូបភាព", tool_2_9_desc: "បកប្រែអត្ថបទដោយផ្ទាល់ពីរូបភាព។ ចង្អុលកាមេរ៉ារបស់អ្នកទៅកាន់ផ្លាកសញ្ញា ម៉ឺនុយ និងច្រើនទៀត។", tool_2_10_name: "ម៉ាស៊ីនស្កេនឯកសារ", tool_2_10_desc: "បង្វែរទូរស័ព្ទរបស់អ្នកទៅជាម៉ាស៊ីនស្កេនឯកសារចល័ត។ បង្កើតការស្កេន PDF ដែលមានគុណភាពខ្ពស់។", tool_2_11_name: "ម៉ាស៊ីនស្កេនអត្តសញ្ញាណប័ណ្ណ/លិខិតឆ្លងដែន", tool_2_11_desc: "ដកស្រង់ព័ត៌មានយ៉ាងរហ័សពីលិខិតឆ្លងដែន អត្តសញ្ញាណប័ណ្ណ និងប័ណ្ណបើកបរ។", tool_2_12_name: "ម៉ាស៊ីនស្កេនម៉ឺនុយ", tool_2_12_desc: "ស្កេនម៉ឺនុយភោជនីយដ្ឋានដើម្បីមើលវាតាមអ៊ីនធឺណិត ពិនិត្យគ្រឿងផ្សំ ឬបកប្រែចាន។", cat_3_title: "ឧបករណ៍ PDF និងឯកសារ", tool_3_1_name: "ការបញ្ចូល និងបំបែក PDF", tool_3_1_desc: "បូកបញ្ចូលឯកសារ PDF ច្រើនចូលជាមួយគ្នា ឬបំបែកឯកសារ PDF ធំមួយទៅជាទំព័រ ឬឯកសារផ្សេងៗ។", tool_3_2_name: "ការបង្ហាប់ PDF", tool_3_2_desc: "កាត់បន្ថយទំហំឯកសារ PDF របស់អ្នក ដើម្បីងាយស្រួលក្នុងការចែករំលែក និងរក្សាទុកដោយមិនបាត់បង់គុណភាព។", tool_3_3_name: "កម្មវិធីបម្លែង Word ទៅ PDF", tool_3_3_desc: "បម្លែងឯកសារ Microsoft Word ទៅជាឯកសារ PDF ដែលមានគុណភាពខ្ពស់ និងប្រកបដោយវិជ្ជាជីវៈ។", tool_3_4_name: "PDF ទៅ Word", tool_3_4_desc: "បម្លែងឯកសារ PDF ត្រឡប់ទៅជាឯកសារ Word ដែលអាចកែសម្រួលបានជាមួយនឹងការរក្សាទម្រង់ដើម។", tool_3_5_name: "PDF ទៅ Excel", tool_3_5_desc: "ដកស្រង់តារាងពីឯកសារ PDF ហើយបម្លែងវាទៅជាសៀវភៅការងារ Excel ដែលអាចកែសម្រួលបាន។", tool_3_6_name: "PDF ទៅ JPG", tool_3_6_desc: "បម្លែងទំព័រនីមួយៗនៃឯកសារ PDF ទៅជាឯកសាររូបភាព JPG ដែលមានគុណភាពខ្ពស់។", tool_3_7_name: "JPG ទៅ PDF", tool_3_7_desc: "បូកបញ្ចូលរូបភាព JPG ច្រើនចូលទៅក្នុងឯកសារ PDF តែមួយដែលងាយស្រួលចែករំលែក។", tool_3_8_name: "ចុះហត្ថលេខាអេឡិចត្រូនិកលើ PDF", tool_3_8_desc: "ចុះហត្ថលេខាលើឯកសារដោយអេឡិចត្រូនិក និងស្នើសុំហត្ថលេខាពីអ្នកដទៃដោយសុវត្ថិភាព។", tool_3_9_name: "ដោះសោ PDF", tool_3_9_desc: "ដកពាក្យសម្ងាត់ និងការរឹតបន្តឹងចេញពីឯកសារ PDF (ប្រសិនបើអ្នកមានសិទ្ធិ)។", tool_3_10_name: "ការពារ PDF", tool_3_10_desc: "បន្ថែមពាក្យសម្ងាត់ទៅឯកសារ PDF របស់អ្នកដើម្បីការពារការចូលប្រើដោយគ្មានការអនុញ្ញាត។", tool_3_11_name: "រៀបចំទំព័រ PDF", tool_3_11_desc: "បង្វិល រៀបចំលំដាប់ឡើងវិញ ឬលុបទំព័រនៅក្នុងឯកសារ PDF របស់អ្នកដោយងាយស្រួល។", tool_3_12_name: "បន្ថែម Watermark ទៅ PDF", tool_3_12_desc: "បោះត្រា PDF របស់អ្នកជាមួយអត្ថបទ ឬរូបភាព Watermark សម្រាប់ម៉ាកយីហោ ឬសុវត្ថិភាព។", tool_3_13_name: "កម្មវិធីបម្លែង CSV ទៅ JSON", tool_3_13_desc: "បម្លែងឯកសារទិន្នន័យ CSV ទៅជាទម្រង់ JSON សម្រាប់ប្រើក្នុងកម្មវិធីគេហទំព័រ។", tool_3_14_name: "ប្រៀបធៀបឯកសារ", tool_3_14_desc: "ប្រៀបធៀបឯកសារពីរជំនាន់ដើម្បីមើលភាពខុសគ្នាដែលបានបន្លិច។", tool_3_15_name: "បន្ថែមលេខទំព័រ", tool_3_15_desc: "បញ្ចូលលេខទំព័រទៅក្នុងឯកសារ PDF របស់អ្នកយ៉ាងងាយស្រួលនៅទីតាំងផ្សេងៗ។", cat_4_title: "ឧបករណ៍បកប្រែ និងភាសា", tool_4_1_name: "បកប្រែរហ័ស", tool_4_1_desc: "ការបកប្រែភ្លាមៗសម្រាប់ជាង 100 ភាសា។ គាំទ្រអត្ថបទ និងឯកសារ។", tool_4_2_name: "ពិនិត្យវេយ្យាករណ៍ ប្រូ", tool_4_2_desc: "ពិនិត្យការសរសេររកកំហុសវេយ្យាករណ៍ អក្ខរាវិរុទ្ធ និងវណ្ណយុត្តិក្នុងពេលវេលាជាក់ស្តែង។", tool_4_3_name: "ឧបករណ៍ចាប់ភាសា", tool_4_3_desc: "កំណត់ភាសានៃអត្ថបទណាមួយដោយស្វ័យប្រវត្តិ។ មានប្រយោជន៍សម្រាប់ប្រភពមិនស្គាល់។", tool_4_4_name: "អ្នកបកប្រែឯកសារ", tool_4_4_desc: "បកប្រែឯកសារទាំងមូល (PDF, Word, ។ល។) ខណៈពេលដែលរក្សាទ្រង់ទ្រាយដើម។", tool_4_5_name: "វចនានុក្រមសទិសន័យអនឡាញ", tool_4_5_desc: "ស្វែងរកសទិសន័យ និងពាក្យផ្ទុយដើម្បីកែលម្អវាក្យសព្ទ និងរចនាប័ទ្មសរសេររបស់អ្នក។", tool_4_6_name: "ឧបករណ៍រាប់ពាក្យ", tool_4_6_desc: "រាប់ពាក្យ តួអក្សរ ប្រយោគ និងកថាខណ្ឌក្នុងអត្ថបទរបស់អ្នកភ្លាមៗ។", tool_4_7_name: "កម្មវិធីបម្លែងតួអក្សរ", tool_4_7_desc: "ប្តូរអត្ថបទទៅជាអក្សរធំ អក្សរតូច ទម្រង់ប្រយោគ ឬទម្រង់ចំណងជើងដោយស្វ័យប្រវត្តិ។", tool_4_8_name: "កម្មវិធីបង្កើត Lorem Ipsum", tool_4_8_desc: "បង្កើតអត្ថបទបំពេញទីតាំងសម្រាប់គំរូរចនា និងប្លង់របស់អ្នក។", tool_4_9_name: "វចនានុក្រមពាក្យជួន", tool_4_9_desc: "ស្វែងរកពាក្យដែលមានសំឡេងជួនគ្នា។ ជាឧបករណ៍ដ៏ល្អសម្រាប់កវី អ្នកនិពន្ធបទចម្រៀង និងអ្នកនិពន្ធ។", tool_4_10_name: "វចនានុក្រមពាក្យស្លែង", tool_4_10_desc: "រកមើលអត្ថន័យនៃពាក្យស្លែងទំនើប អក្សរកាត់អ៊ីនធឺណិត និងឃ្លាទីក្រុង។", tool_4_11_name: "អ្នកដោះស្រាយពាក្យខ្វែង", tool_4_11_desc: "ស្វែងរកចម្លើយចំពោះតម្រុយពាក្យខ្វែងដ៏លំបាកដោយបញ្ចូលអក្សរដែលស្គាល់។", tool_4_12_name: "អ្នកស្វែងរកកន្សោមពាក្យ", tool_4_12_desc: "ស្វែងយល់ពីអត្ថន័យ និងប្រភពដើមនៃកន្សោមពាក្យ និងឃ្លាទូទៅ។", cat_5_title: "ឧបករណ៍សិក្សា និងផលិតភាព", tool_5_1_name: "កម្មវិធីកំណត់ម៉ោងផ្ដោត (Pomodoro)", tool_5_1_desc: "បង្កើនផលិតភាពជាមួយបច្ចេកទេស Pomodoro។ ចន្លោះពេលការងារអាចប្ដូរតាមបំណងបាន។", tool_5_2_name: "អ្នកបង្កើតបណ្ណបង្ហាញ", tool_5_2_desc: "បង្កើត សិក្សា និងចែករំលែកបណ្ណបង្ហាញឌីជីថលសម្រាប់មុខវិជ្ជាណាមួយ។ ល្អសម្រាប់សិស្ស។", tool_5_3_name: "ផែនទីគំនិតអនឡាញ", tool_5_3_desc: "រៀបចំគំនិត និងបំផុសគំនិតដោយមើលឃើញជាមួយឧបករណ៍ផែនទីគំនិតที่ងាយស្រួលប្រើ។", tool_5_4_name: "ក្តារខៀនអនឡាញ", tool_5_4_desc: "ក្តារខៀនឌីជីថលសម្រាប់សហការគ្នាដើម្បីបំផុសគំនិត ការបង្រៀន និងការបង្ហាញ។", tool_5_5_name: "អ្នកបង្កើតប្រវត្តិរូបសង្ខេប", tool_5_5_desc: "បង្កើតប្រវត្តិរូបសង្ខេបប្រកបដោយវិជ្ជាជីវៈក្នុងរយៈពេលប៉ុន្មាននាទីជាមួយគំរូที่ងាយស្រួលប្រើ។", tool_5_6_name: "អ្នកបង្កើតគំនូសបំព្រួញ", tool_5_6_desc: "បង្កើតគំនូសបំព្រួញและไดอะแกรมออนไลน์ด้วยอินเทอร์เฟซลากและวางที่เรียบง่าย។", tool_5_7_name: "អ្នកបង្កើតគំនូសតាង Gantt", tool_5_7_desc: "រៀបចំផែនការ និងកាលវិភាគគម្រោងជាមួយអ្នកបង្កើតគំនូសតាង Gantt ออนไลน์។", tool_5_8_name: "អ្នកបង្កើតបញ្ជីត្រួតពិនិត្យ", tool_5_8_desc: "បង្កើតបញ្ជីត្រួតពិនិត្យที่เรียบง่ายและแชร์ได้สำหรับงานหรือโครงการใดๆ។", tool_5_9_name: "កម្មវិធីតាមដានទម្លាប់", tool_5_9_desc: "ติดตามទម្លាប់และเป้าหมายประจำวันของคุณเพื่อสร้างกิจวัตรที่ดีและสร้างแรงบันดาลใจ។", tool_5_10_name: "កម្មវិធីបម្លែងតំបន់ពេលវេលា", tool_5_10_desc: "បម្លែងเวลาระหว่างតំបន់ពេលវេលាต่างๆ ทั่วโลกได้อย่างง่ายดาย។", tool_5_11_name: "កង់សម្រេចចិត្ត", tool_5_11_desc: "សម្រេចចិត្តមិនបានមែនទេ? ឲ្យកង់សម្រេចចិត្តให้คุณ។ สนุกและเรียบง่าย។", tool_5_12_name: "អ្នករៀបចំផែនការសិក្សា", tool_5_12_desc: "រៀបចំកាលវិភាគសិក្សា ติดตามวิชา และตั้งការแจ้งเตือนសម្រាប់ការสอบ។", tool_5_13_name: "ម៉ាស៊ីនគិតលេខ", tool_5_13_desc: "គណនាពិន្ទុមុខវិជ្ជា ឬ GPA របស់អ្នកដោយផ្អែកលើកិច្ចការ និងទម្ងន់។", tool_5_14_name: "បញ្ជី​ការងារ​ត្រូវ​ធ្វើ", tool_5_14_desc: "បញ្ជីការងារត្រូវធ្វើធម្មតា ដើម្បីតាមដានការងារប្រចាំថ្ងៃរបស់អ្នក។", tool_5_15_name: "អ្នកបង្កើតបទបង្ហាញ", tool_5_15_desc: "បង្កើតបទបង្ហាញที่สวยงามและน่าสนใจออนไลน์ด้วยเทมเพลตต่างๆ។", cat_6_title: "ផ្សេងៗ / ការបំប្លែង និងឧបករណ៍ប្រើប្រាស់", tool_6_1_name: "កម្មវិធីបម្លែងឯកតាគ្រប់ជ្រុងជ្រោយ", tool_6_1_desc: "កម្មវិធីបម្លែងគ្រប់ជ្រុងជ្រោយសម្រាប់ប្រវែង ទម្ងន់ อุณหภูมิ ปริมาตร และอื่นๆ។", tool_6_2_name: "កម្មវិធីបង្កើតពាក្យសម្ងាត់សុវត្ថិភាព", tool_6_2_desc: "បង្កើតពាក្យសម្ងាត់ที่รัดกุม สุ่ม และปลอดภัยด้วยความยาวและชุดอักขระที่ปรับแต่งได้។", tool_6_3_name: "អ្នកបង្កើត QR Code", tool_6_3_desc: "បង្កើតรหัส QR สำหรับ URL ข้อความ การเข้าถึง Wi-Fi และอื่นๆ ง่ายและรวดเร็ว។", tool_6_4_name: "កម្មវិធីបង្ហាប់រូបភាព", tool_6_4_desc: "ลดขนาดไฟล์รูปภาพของคุณ (JPG, PNG) โดยไม่สูญเสียคุณภาพ។", tool_6_5_name: "កម្មវិធីปรับទំហំរូបភាព", tool_6_5_desc: "ปรับขนาดรูปภาพตามขนาดหรือเปอร์เซ็นต์ที่ต้องการสำหรับเว็บและโซเชียลมีเดีย។", tool_6_6_name: "ឧបករណ៍ជ្រើសរើសពណ៌", tool_6_6_desc: "เลือกสีจากรูปภาพหรือวงล้อสีและรับรหัส HEX, RGB และ HSL។", tool_6_7_name: "កម្មវិធីបង្រួម URL", tool_6_7_desc: "สร้างลิงก์ที่สั้นและจัดการได้จาก URL ที่ยาวเพื่อให้แชร์ได้ง่าย។", tool_6_8_name: "កម្មវិធីបម្លែងឯកសារ", tool_6_8_desc: "แปลงระหว่างรูปแบบไฟล์ต่างๆ สำหรับเอกสาร รูปภาพ เสียง และวิดโอ។", tool_6_9_name: "កម្មវិធីពន្លាឯកសារ", tool_6_9_desc: "แตกไฟล์ออนไลน์ รองรับ ZIP, RAR, 7z และรูปแบบบีบอัดอื่นๆ។", tool_6_10_name: "IP របស់ខ្ញុំແມ່ນអ្វី?", tool_6_10_desc: "ค้นหาที่อยู่ IP สาธารณะและข้อมูลตำแหน่งของคุณอย่างรวดเร็ว។", tool_6_11_name: "តេស្តល្បឿនអ៊ីនធឺណិត", tool_6_11_desc: "ตรวจสอบความเร็วในการดาวน์โหลดและอัปโหลดของคุณด้วยการทดสอบเพียงคลิกเดียว។", tool_6_12_name: "កម្មវិធីជ្រើសរើសឈ្មោះចៃដន្យ", tool_6_12_desc: "ป้อนรายชื่อและสุ่มเลือกผู้ชนะ เหมาะสำหรับของรางวัล។", tool_6_13_name: "កម្មវិធីបង្កើត MD5 Hash", tool_6_13_desc: "สร้างแฮช MD5 ของสตริงใดๆ สำหรับการตรวจสอบความสมบูรณ์ของข้อมูล។", tool_6_14_name: "កម្មវិធីបង្កើត Favicon", tool_6_14_desc: "สร้างไฟล์ favicon.ico สำหรับเว็บไซต์ของคุณจากรูปภาพใดๆ។", tool_6_15_name: "អ្នកបកប្រែລະຫັດ Morse", tool_6_15_desc: "แปลข้อความเป็นรหัสมอร์สและในทางกลับกัน รวมถึงการเล่นเสียง។", tool_6_16_name: "ម៉ាស៊ីនគិតអាយុ", tool_6_16_desc: "ค้นหาอายุที่แน่นอนของคุณเป็นปี เดือน วัน และแม้แต่วินาที។", tool_6_17_name: "ម៉ាស៊ីនគិតថ្ងៃ", tool_6_17_desc: "บวกหรือลบวัน สัปดาห์ เดือน และปีจากวันที่กำหนด។", tool_6_18_name: "ម៉ាស៊ីនគិត BMI", tool_6_18_desc: "คำนวณดัชนีมวลกาย (BMI) ของคุณเพื่อตรวจสอบว่าคุณอยู่ในเกณฑ์น้ำหนักที่ดีต่อสุขภาพหรือไม่។", tool_6_19_name: "កម្មវិធីបម្លែង HEX ទៅ RGB", tool_6_19_desc: "แปลงรหัสสีระหว่างรูปแบบ HEX และ RGB สำหรับการออกแบบและพัฒนาเว็บ។", tool_6_20_name: "កម្មវិធីបម្លែង बाइनरी", tool_6_20_desc: "แปลงข้อความเป็นรหัสไบนารีและรหัสไบนารีกลับเป็นข้อความ។", tool_6_21_name: "រូបភាពទៅ Base64", tool_6_21_desc: "เข้ารหัสรูปภาพของคุณเป็นสตริง Base64 สำหรับการฝังใน HTML หรือ CSS។", tool_6_22_name: "អ្នកទាញយករូបភាពតូចរបស់ YT", tool_6_22_desc: "ดาวน์โหลดภาพขนาดย่อของวิดีโอ YouTube คุณภาพสูงโดยวาง URL ของวิดีโอ។", tool_6_23_name: "កម្មវិធីកំណត់ម៉ោងរាប់ថយក្រោយ", tool_6_23_desc: "ตั้งเวลาที่นับถอยหลังจากเวลาที่กำหนด รวมถึงการปลุก។", tool_6_24_name: "นาฬิกาจับเวลา", tool_6_24_desc: "นาฬิกาจับเวลาออนไลน์อย่างง่ายเพื่อวัดเวลาที่ผ่านไปพร้อมฟังก์ชันรอบ។", tool_6_25_name: "កម្មវិធីបង្កើតលេខចៃដន្យ", tool_6_25_desc: "สร้างตัวเลขสุ่มหนึ่งตัวหรือมากกว่าภายในช่วงที่กำหนด (ต่ำสุด/สูงสุด)។", tool_6_26_name: "កម្មវិធីកាត់រូបភាព", tool_6_26_desc: "ครอบตัดและตัดรูปภาพออนไลน์ตามขนาดที่ต้องการด้วยโปรแกรมแก้ไขภาพที่เรียบง่าย។", tool_6_27_name: "ដាក់ Watermark លើរូបភាព", tool_6_27_desc: "เพิ่มลายน้ำข้อความหรือรูปภาพลงในรูปภาพของคุณเพื่อการป้องกันหรือการสร้างแบรนด์។", tool_6_28_name: "កម្មវិធីបម្លែង ICO", tool_6_28_desc: "แปลงรูปภาพ PNG, JPG หรือ GIF เป็นรูปแบบ .ico สำหรับไอคอนเว็บไซต์។", tool_6_29_name: "កម្មវិធីថតអេក្រង់", tool_6_29_desc: "บันทึกหน้าจอของคุณออนไลน์โดยไม่ต้องติดตั้งซอฟต์แวร์ใดๆ เหมาะสำหรับบทช่วยสอน។", tool_6_30_name: "តេស្តเว็บแคม", tool_6_30_desc: "ตรวจสอบอย่างรวดเร็วว่าเว็บแคมของคุณทำงานอย่างถูกต้องโดยตรงในเบราว์เซอร์ของคุณหรือไม่។", tool_6_31_name: "តេស្តไมโครហ្វូន", tool_6_31_desc: "ทดสอบไมโครโฟนของคุณเพื่อให้แน่ใจว่าทำงานและรับเสียงได้។", tool_6_32_name: "កម្មវិធីធ្វើซ้ำអត្ថបទ", tool_6_32_desc: "ทำซ้ำข้อความตามจำนวนครั้งที่กำหนด สนุกสำหรับโซเชียลมีเดีย។", tool_6_33_name: "កម្មវិធីធ្វើទ្រង់ទ្រាយ JSON", tool_6_33_desc: "ตรวจสอบและจัดรูปแบบข้อมูล JSON ของคุณเพื่อให้สามารถอ่านได้และสวยงาม។", tool_6_34_name: "កម្មវិធីធ្វើទ្រង់ទ្រាយ XML", tool_6_34_desc: "ตรวจสอบและจัดรูปแบบข้อมูล XML ของคุณเพื่อการอ่านและโครงสร้างที่ดีขึ้น។", tool_6_35_name: "កម្មវិធីបង្រួម CSS", tool_6_35_desc: "ย่อขนาดโค้ด CSS ของคุณเพื่อลดขนาดไฟล์และปรับปรุงความเร็วในการโหลดเว็บไซต์។", tool_6_36_name: "កម្មវិធីបង្រួម JS", tool_6_36_desc: "ย่อขนาดโค้ด JavaScript เพื่อเพิ่มประสิทธิภาพและความเร็วของเว็บไซต์ของคุณ។", tool_6_37_name: "កម្មវិធីបង្រួម HTML", tool_6_37_desc: "บีบอัดโค้ด HTML ของคุณโดยการลบอักขระและช่องว่างที่ไม่จำเป็นออก។", tool_6_38_name: "អ្នកตรวจสอบកាតឥណទាន", tool_6_38_desc: "ตรวจสอบว่าหมายเลขบัตรเครดิตถูกต้องหรือไม่โดยใช้อัลกอริทึม Luhn។", tool_6_39_name: "កម្មវិធីបង្កើតបាកូដ", tool_6_39_desc: "สร้างบาร์โค้ดประเภทต่างๆ เช่น UPC, EAN และ Code 128។", footer_copyright: "© ២០២៤ ឧបករណ៍អនឡាញដ៏អស្ចារ្យ។ រក្សាសិទ្ធិគ្រប់យ៉ាង។", footer_subtitle: "រចនាឡើងដើម្បីធ្វើឱ្យជីវិតឌីជីថលរបស់អ្នកកាន់តែងាយស្រួល។",
                }
            };
            
            const setLanguage = (lang) => {
                htmlEl.setAttribute('lang', lang);
                document.querySelectorAll('[data-lang]').forEach(el => {
                    const key = el.getAttribute('data-lang');
                    if(translations[lang] && translations[lang][key]) {
                       el.textContent = translations[lang][key];
                    }
                });
                localStorage.setItem('language', lang);
            };

            langToggleBtn.addEventListener('click', () => {
                const currentLang = htmlEl.getAttribute('lang') || 'en';
                const newLang = currentLang === 'en' ? 'km' : 'en';
                setLanguage(newLang);
            });

            // Set initial language from storage or default to 'en'
            const savedLang = localStorage.getItem('language') || 'en';
            setLanguage(savedLang);
        });