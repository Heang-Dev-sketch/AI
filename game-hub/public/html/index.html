 // --- Page Navigation & Setup ---
        document.addEventListener('DOMContentLoaded', () => {
            const pages = document.querySelectorAll('.page-content');
            const navLinks = document.querySelectorAll('.nav-link');
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');

            window.showPage = (pageId) => {
                document.querySelector('main').classList.toggle('p-0', pageId === 'smart-ai');
                document.querySelector('main').classList.toggle('container', pageId !== 'smart-ai');
                document.querySelector('main').classList.toggle('mx-auto', pageId !== 'smart-ai');
                document.querySelector('main').classList.toggle('px-4', pageId !== 'smart-ai');
                document.querySelector('main').classList.toggle('sm:px-6', pageId !== 'smart-ai');
                document.querySelector('main').classList.toggle('lg:px-8', pageId !== 'smart-ai');
                document.querySelector('main').classList.toggle('py-8', pageId !== 'smart-ai');
                document.querySelector('main').classList.toggle('md:py-12', pageId !== 'smart-ai');

                pages.forEach(page => page.classList.remove('active'));
                const targetPage = document.getElementById(pageId);
                if (targetPage) targetPage.classList.add('active');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('onclick').includes(`'${pageId}'`)) {
                        link.classList.add('active');
                    }
                });
                if(mobileMenu) mobileMenu.classList.add('hidden');
                if (pageId !== 'categories') {
                    window.scrollTo(0, 0);
                }
            }
            
            if(mobileMenuButton) mobileMenuButton.addEventListener('click', () => {
                if(mobileMenu) mobileMenu.classList.toggle('hidden');
            });
        
            showPage('home');
            const currentYearEl = document.getElementById('current-year');
            if(currentYearEl) currentYearEl.textContent = new Date().getFullYear();
        });

        // --- All Tooling Logic ---
        document.addEventListener('DOMContentLoaded', () => {
            
            // --- Smart AI Chatbot Logic ---
            const smartAiPage = document.getElementById('smart-ai');
            if (smartAiPage) {
                const chatbox = document.getElementById('smart-ai-chatbox');
                const userInput = document.getElementById('smart-ai-input');
                const sendBtn = document.getElementById('smart-ai-send-btn');
                const imageUploadInput = document.getElementById('smart-ai-image-upload');
                const imagePreviewContainer = document.getElementById('image-preview-container');
                const codePreviewModal = document.getElementById('code-preview-modal');
                const previewIframe = document.getElementById('preview-iframe');
                const closePreviewBtn = document.getElementById('close-preview-btn');
                let uploadedImageData = null;
                let uploadedImageType = null;

                const API_KEY = "AIzaSyCGeAhRrYpYR3K_GxCIOu0oMm7dk5Q84W0"; 
                const CONVERSATION_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
                const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${API_KEY}`;
                let conversationHistory = [];

                const openPreviewModal = (code) => {
                    previewIframe.srcdoc = code;
                    codePreviewModal.classList.remove('hidden');
                    codePreviewModal.classList.add('flex');
                };
                const closePreviewModal = () => {
                    codePreviewModal.classList.add('hidden');
                    codePreviewModal.classList.remove('flex');
                    previewIframe.srcdoc = '';
                };
                if(closePreviewBtn) closePreviewBtn.addEventListener('click', closePreviewModal);

                if(imageUploadInput) imageUploadInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64String = event.target.result.split(',')[1];
                        uploadedImageData = base64String;
                        uploadedImageType = file.type;
                        imagePreviewContainer.innerHTML = `<div class="relative inline-block"><img src="${event.target.result}" class="h-16 w-16 object-cover rounded-md"><button onclick="removeImagePreview()" class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs">&times;</button></div>`;
                    };
                    reader.readAsDataURL(file);
                    imageUploadInput.value = '';
                });

                window.removeImagePreview = () => {
                    uploadedImageData = null;
                    uploadedImageType = null;
                    imagePreviewContainer.innerHTML = '';
                };

                const createChatBubble = (message, sender) => {
                    const bubbleWrapper = document.createElement('div');
                    bubbleWrapper.className = `flex w-full mt-2 space-x-3 max-w-full ${sender === 'user' ? 'user-message-wrapper' : ''}`;
                    const bubble = document.createElement('div');
                    bubble.className = `chat-message p-3 rounded-lg ${sender === 'user' ? 'user-message' : 'ai-message'}`;
                    const messageSpan = document.createElement('span');
                    messageSpan.textContent = message;
                    bubble.appendChild(messageSpan);
                    const codeRegex = /```html\n([\s\S]*?)\n```/;
                    const codeMatch = message.match(codeRegex);
                    if (codeMatch && codeMatch[1]) {
                        const code = codeMatch[1];
                        const previewButton = document.createElement('button');
                        previewButton.textContent = 'Run Preview';
                        previewButton.className = 'btn-action mt-3 w-full bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800';
                        previewButton.onclick = () => openPreviewModal(code);
                        bubble.appendChild(previewButton);
                    }
                    bubbleWrapper.appendChild(bubble);
                    return bubbleWrapper;
                };
                
                const createImageBubble = (imageUrl) => {
                    const bubbleWrapper = document.createElement('div');
                    bubbleWrapper.className = `flex w-full mt-2 space-x-3 max-w-full`;
                    const bubble = document.createElement('div');
                    bubble.className = `chat-message p-2 rounded-lg ai-message`;
                    const img = document.createElement('img');
                    img.src = imageUrl;
                    img.className = 'rounded-md max-w-xs';
                    bubble.appendChild(img);
                    bubbleWrapper.appendChild(bubble);
                    return bubbleWrapper;
                }

                const createUserMessageBubble = (message, imageUrl) => {
                    const bubbleWrapper = document.createElement('div');
                    bubbleWrapper.className = 'flex w-full mt-2 space-x-3 max-w-full justify-end';
                    const bubble = document.createElement('div');
                    bubble.className = 'chat-message p-3 rounded-lg user-message flex flex-col items-end';
                    if (imageUrl) {
                        const img = document.createElement('img');
                        img.src = imageUrl;
                        img.className = 'rounded-md max-w-xs mb-2';
                        bubble.appendChild(img);
                    }
                    if (message) {
                        const messageSpan = document.createElement('span');
                        messageSpan.textContent = message;
                        bubble.appendChild(messageSpan);
                    }
                    bubbleWrapper.appendChild(bubble);
                    return bubbleWrapper;
                };
                
                const showTypingIndicator = () => {
                    const indicator = document.createElement('div');
                    indicator.id = 'typing-indicator';
                    indicator.className = 'flex typing-indicator p-3';
                    indicator.innerHTML = '<span></span><span></span><span></span>';
                    chatbox.appendChild(indicator);
                    chatbox.scrollTop = chatbox.scrollHeight;
                };

                const hideTypingIndicator = () => {
                    const indicator = document.getElementById('typing-indicator');
                    if (indicator) indicator.remove();
                };

                const generateImage = async (prompt) => {
                    showTypingIndicator();
                    try {
                        const payload = { instances: [{ prompt }], parameters: { "sampleCount": 1 } };
                        const response = await fetch(IMAGE_API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error?.message || 'Error generating image.');
                        }
                        const result = await response.json();
                        const base64Data = result.predictions?.[0]?.bytesBase64Encoded;
                        if (base64Data) {
                            const imageUrl = `data:image/png;base64,${base64Data}`;
                            chatbox.appendChild(createImageBubble(imageUrl));
                        } else {
                            throw new Error("No image data received from API.");
                        }
                    } catch (error) {
                        console.error("Image Generation Error:", error);
                        chatbox.appendChild(createChatBubble(`សូមអភ័យទោស, មានបញ្ហាក្នុងការបង្កើតរូបភាព: ${error.message}`, 'ai'));
                    } finally {
                        hideTypingIndicator();
                        chatbox.scrollTop = chatbox.scrollHeight;
                    }
                };
                
                const generateText = async (parts) => {
                    conversationHistory.push({ role: "user", parts: parts });
                    showTypingIndicator();
                    try {
                        const systemInstruction = { 
                            parts: [{ 
                                text: "You are 'AI Tools ខ្មែរ', a helpful AI assistant. Your capabilities include answering questions, generating images, and writing code. When asked to generate code, always provide a complete, runnable HTML file within a single markdown block like ```html\n...\n```. You MUST include all necessary HTML, CSS (using <style> tags or Tailwind CSS classes), and JavaScript (using <script> tags) in that single block. Assume Tailwind CSS is available. Make the designs modern and responsive." 
                            }] 
                        };
                        const payload = { contents: conversationHistory, systemInstruction };
                        const response = await fetch(CONVERSATION_API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.error?.message || 'An unknown error occurred.');
                        }
                        const result = await response.json();
                        const aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
                        if (aiResponse) {
                            chatbox.appendChild(createChatBubble(aiResponse, 'ai'));
                            conversationHistory.push({ role: "model", parts: [{ text: aiResponse }] });
                        } else {
                            chatbox.appendChild(createChatBubble("សូមអភ័យទោស, ខ្ញុំមិនទទួលបានការឆ្លើយតបទេ។", 'ai'));
                        }
                    } catch (error) {
                        console.error("Chatbot API Error:", error);
                        chatbox.appendChild(createChatBubble(`សូមអភ័យទោស, មានបញ្ហា: ${error.message}`, 'ai'));
                    } finally {
                        hideTypingIndicator();
                        chatbox.scrollTop = chatbox.scrollHeight;
                    }
                }
                
                const sendMessage = async () => {
                    const message = userInput.value.trim();
                    if (!message && !uploadedImageData) return;
                    const imageUrlForBubble = uploadedImageData ? `data:${uploadedImageType};base64,${uploadedImageData}` : null;
                    chatbox.appendChild(createUserMessageBubble(message, imageUrlForBubble));
                    userInput.value = '';
                    const imageGenKeywords = ['generate image', 'create a picture', 'draw a picture', 'គូររូប', 'បង្កើតរូបភាព'];
                    const isImageGenRequest = imageGenKeywords.some(keyword => message.toLowerCase().includes(keyword));
                    if (isImageGenRequest && !uploadedImageData) {
                        generateImage(message);
                    } else {
                        const parts = [];
                        if (message) parts.push({ text: message });
                        if (uploadedImageData) {
                            parts.push({ inlineData: { mimeType: uploadedImageType, data: uploadedImageData } });
                        }
                        generateText(parts);
                    }
                    window.removeImagePreview();
                    chatbox.scrollTop = chatbox.scrollHeight;
                };

                if(sendBtn) sendBtn.addEventListener('click', sendMessage);
                if(userInput) userInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                    }
                });
            }

            // --- Code Editor Logic ---
            const codeEditorPage = document.getElementById('code-editor');
            if (codeEditorPage) {
                const runCodeBtn = document.getElementById('run-code-btn');
                const htmlCode = document.getElementById('html-code');
                const cssCode = document.getElementById('css-code');
                const jsCode = document.getElementById('js-code');
                const previewPane = document.getElementById('code-editor-preview');

                window.showEditorTab = (tabName) => {
                    document.querySelectorAll('.editor-tab-panel').forEach(panel => panel.classList.remove('active'));
                    document.querySelectorAll('.editor-tab-btn').forEach(btn => btn.classList.remove('active'));
                    let panelToShow = (tabName === 'output') ? document.getElementById('output-panel') : document.getElementById(`${tabName}-code`);
                    if(panelToShow) panelToShow.classList.add('active');
                    const buttonToActivate = document.querySelector(`.editor-tab-btn[onclick="showEditorTab('${tabName}')"]`);
                    if(buttonToActivate) buttonToActivate.classList.add('active');
                }

                const runCode = () => {
                    const html = htmlCode.value;
                    const css = cssCode.value;
                    const js = jsCode.value;
                    const combinedCode = `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"><\/script><style>${css}</style></head><body class="bg-gray-100">${html}<script>${js}<\/script></body></html>`;
                    previewPane.srcdoc = combinedCode;
                };

                runCodeBtn.addEventListener('click', () => {
                    runCode();
                    showEditorTab('output');
                });
                runCode();
                showEditorTab('html');
            }

            // --- Original Tools Logic ---
            function downloadTextFile(filename, text) {
                const element = document.createElement('a');
                element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                element.setAttribute('download', filename);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }

            function copyToClipboard(text, statusElement, successMessage) {
                if (!navigator.clipboard) {
                    const textArea = document.createElement("textarea");
                    textArea.value = text;
                    textArea.style.position="fixed";
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    try {
                        document.execCommand('copy');
                        if (statusElement) {
                            statusElement.textContent = successMessage;
                            setTimeout(() => { statusElement.textContent = ''; }, 2000);
                        }
                    } catch (err) { console.error('Fallback copy failed', err); }
                    document.body.removeChild(textArea);
                    return;
                }
                navigator.clipboard.writeText(text).then(() => {
                    if (statusElement) {
                        statusElement.textContent = successMessage;
                        setTimeout(() => { statusElement.textContent = ''; }, 2000);
                    }
                }).catch(err => console.error('Clipboard copy failed', err));
            }
            
            const ocrButton = document.getElementById('ocr-button');
            if (ocrButton) {
                const ocrUpload = document.getElementById('ocr-upload');
                const ocrResult = document.getElementById('ocr-result');
                const ocrStatus = document.getElementById('ocr-status');
                const ocrSpinner = document.getElementById('ocr-spinner');
                const ocrBtnText = document.getElementById('ocr-btn-text');
                const ocrDownloadBtn = document.getElementById('ocr-download-btn');
                ocrButton.addEventListener('click', async () => {
                    const file = ocrUpload.files[0];
                    if (!file) { ocrStatus.textContent = 'សូមជ្រើសរើសរូបភាពជាមុនសិន។'; return; }
                    ocrStatus.textContent = 'កំពុងដំណើរការ...';
                    ocrResult.value = '';
                    ocrButton.disabled = true;
                    ocrDownloadBtn.disabled = true;
                    ocrSpinner.classList.remove('hidden');
                    ocrBtnText.textContent = 'កំពុងបម្លែង';
                    try {
                        const { data: { text } } = await Tesseract.recognize(file, 'eng+khm', { logger: m => { ocrStatus.textContent = `${m.status} (${(m.progress * 100).toFixed(0)}%)`; }});
                        ocrResult.value = text;
                        ocrStatus.textContent = 'ការបំប្លែងបានជោគជ័យ!';
                        if(text) ocrDownloadBtn.disabled = false;
                    } catch (error) {
                        ocrStatus.textContent = 'មានបញ្ហាក្នុងការបំប្លែងរូបភាព។';
                        console.error("OCR Error:", error);
                    } finally {
                        ocrButton.disabled = false;
                        ocrSpinner.classList.add('hidden');
                        ocrBtnText.textContent = 'បំប្លែង';
                    }
                });
                ocrDownloadBtn.addEventListener('click', () => downloadTextFile('image-to-text-result.txt', ocrResult.value));
            }
            
            const ttsButton = document.getElementById('tts-button');
            if(ttsButton) {
                const ttsInput = document.getElementById('tts-input');
                const getSpeechVoices = () => new Promise(resolve => {
                    let voices = window.speechSynthesis.getVoices();
                    if (voices.length) return resolve(voices);
                    window.speechSynthesis.onvoiceschanged = () => resolve(window.speechSynthesis.getVoices());
                });
                ttsButton.addEventListener('click', async () => {
                    const text = ttsInput.value.trim();
                    if (!text) return;
                    if (window.speechSynthesis.speaking) window.speechSynthesis.cancel();
                    const voices = await getSpeechVoices();
                    const khmerVoice = voices.find(voice => voice.lang.toLowerCase() === 'km-kh');
                    const utterance = new SpeechSynthesisUtterance(text);
                    utterance.lang = 'km-KH';
                    if (khmerVoice) utterance.voice = khmerVoice;
                    window.speechSynthesis.speak(utterance);
                });
            }

            const startRecordBtn = document.getElementById('start-record-btn');
            if (startRecordBtn) {
                const stopRecordBtn = document.getElementById('stop-record-btn');
                const playBtn = document.getElementById('play-btn');
                const pitchSlider = document.getElementById('pitch-slider');
                const pitchValue = document.getElementById('pitch-value');
                const voiceChangerStatus = document.getElementById('voice-changer-status');
                const audioPlayback = document.getElementById('audio-playback');
                const voiceUpload = document.getElementById('voice-upload');
                const voiceDownloadBtn = document.getElementById('voice-download-btn');
                let mediaRecorder, audioChunks = [], audioUrl;

                function setAudioReady(url) {
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                    audioUrl = url;
                    audioPlayback.src = url;
                    playBtn.disabled = false;
                    voiceDownloadBtn.disabled = false;
                }
                voiceUpload.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    setAudioReady(URL.createObjectURL(file));
                    startRecordBtn.disabled = true;
                    stopRecordBtn.disabled = true;
                    voiceChangerStatus.textContent = "ឯកសារបានផ្ទុក! ចុច Play។";
                });
                startRecordBtn.addEventListener('click', async () => {
                    voiceUpload.value = '';
                    if (audioUrl) URL.revokeObjectURL(audioUrl);
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                        const supportedMimeType = ['audio/webm', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported(t));
                        if (!supportedMimeType) { voiceChangerStatus.textContent = "Browser មិនគាំទ្រការថតសំឡេងទេ។"; return; }
                        mediaRecorder = new MediaRecorder(stream, { mimeType: supportedMimeType });
                        mediaRecorder.start();
                        audioChunks = [];
                        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
                        mediaRecorder.onstop = () => {
                            const audioBlob = new Blob(audioChunks, { type: supportedMimeType });
                            setAudioReady(URL.createObjectURL(audioBlob));
                            voiceChangerStatus.textContent = "ថតបានสำเร็จ!";
                        };
                        startRecordBtn.disabled = true;
                        stopRecordBtn.disabled = false;
                        playBtn.disabled = true;
                        voiceDownloadBtn.disabled = true;
                        voiceChangerStatus.textContent = "កំពុងថត... 🎤";
                    } catch (err) {
                        voiceChangerStatus.textContent = "មិនអាចចូលប្រើមីក្រូហ្វូនបានទេ។";
                        console.error("Microphone Error:", err);
                    }
                });
                stopRecordBtn.addEventListener('click', () => {
                    if (mediaRecorder?.state !== 'inactive') mediaRecorder.stop();
                    startRecordBtn.disabled = false;
                    stopRecordBtn.disabled = true;
                });
                pitchSlider.addEventListener('input', () => pitchValue.textContent = pitchSlider.value);
                playBtn.addEventListener('click', () => { if (audioPlayback.src) { audioPlayback.playbackRate = pitchSlider.value; audioPlayback.play(); } });
                voiceDownloadBtn.addEventListener('click', () => {
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = audioUrl;
                    a.download = 'voice-changer-audio.webm';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                });
            }

            const qrButton = document.getElementById('qr-button');
            if (qrButton) {
                const qrInput = document.getElementById('qr-input');
                const qrcodeDiv = document.getElementById('qrcode');
                const qrDownloadBtn = document.getElementById('qr-download-btn');
                const generateQR = () => {
                    const text = qrInput.value.trim();
                    qrcodeDiv.innerHTML = ''; 
                    qrDownloadBtn.disabled = true;
                    if (!text) return;
                    new QRCode(qrcodeDiv, { text, width: 180, height: 180 });
                    qrDownloadBtn.disabled = false;
                }
                qrButton.addEventListener('click', generateQR);
                qrDownloadBtn.addEventListener('click', () => {
                    const img = qrcodeDiv.querySelector('img');
                    if (!img) return;
                    const a = document.createElement('a');
                    a.href = img.src;
                    a.download = 'qrcode.png';
                    a.click();
                });
                generateQR();
            }

            const qrReaderUpload = document.getElementById('qr-reader-upload');
            if (qrReaderUpload) {
                const qrReaderResult = document.getElementById('qr-reader-result');
                const qrReaderStatus = document.getElementById('qr-reader-status');
                const qrCopyBtn = document.getElementById('qr-copy-btn');
                const qrCanvas = document.createElement('canvas');
                const qrCanvasCtx = qrCanvas.getContext('2d');
                qrReaderUpload.addEventListener('change', (event) => {
                    const file = event.target.files[0];
                    if (!file) return;
                    qrReaderStatus.textContent = 'កំពុងអានរូបភាព...';
                    qrReaderResult.value = '';
                    qrCopyBtn.disabled = true;
                    const reader = new FileReader();
                    reader.onload = e => {
                        const img = new Image();
                        img.onload = () => {
                            qrCanvas.width = img.width;
                            qrCanvas.height = img.height;
                            qrCanvasCtx.drawImage(img, 0, 0, img.width, img.height);
                            const imageData = qrCanvasCtx.getImageData(0, 0, img.width, img.height);
                            qrReaderStatus.textContent = 'កំពុងវិភាគ...';
                            const code = jsQR(imageData.data, imageData.width, imageData.height);
                            if (code) {
                                qrReaderResult.value = code.data;
                                qrReaderStatus.textContent = 'រកឃើញដោយជោគជ័យ!';
                                qrCopyBtn.disabled = false;
                            } else {
                                qrReaderStatus.textContent = 'រកមិនឃើញកូដ QR ទេ។';
                            }
                        };
                        img.src = e.target.result;
                    };
                    reader.readAsDataURL(file);
                });
                qrCopyBtn.addEventListener('click', () => { copyToClipboard(qrReaderResult.value, qrReaderStatus, 'បានចម្លងទៅ Clipboard!'); });
            }
            
            const colorPicker = document.getElementById('color-picker');
            if (colorPicker) {
                const colorDisplay = document.getElementById('color-display');
                const colorHexSpan = document.getElementById('color-hex');
                const colorRgbSpan = document.getElementById('color-rgb');
                const colorHslSpan = document.getElementById('color-hsl');
                const copyHexBtn = document.getElementById('copy-hex');
                const copyRgbBtn = document.getElementById('copy-rgb');
                const copyHslBtn = document.getElementById('copy-hsl');
                const colorCopyStatus = document.getElementById('color-copy-status');
                const hexToRgb = (hex) => {
                    let r = 0, g = 0, b = 0;
                    if (hex.length == 4) { r = "0x" + hex[1] + hex[1]; g = "0x" + hex[2] + hex[2]; b = "0x" + hex[3] + hex[3]; }
                    else if (hex.length == 7) { r = "0x" + hex[1] + hex[2]; g = "0x" + hex[3] + hex[4]; b = "0x" + hex[5] + hex[6]; }
                    return `rgb(${+r}, ${+g}, ${+b})`;
                }
                const hexToHsl = (H) => {
                    let r = 0, g = 0, b = 0;
                    if (H.length == 4) { r = "0x" + H[1] + H[1]; g = "0x" + H[2] + H[2]; b = "0x" + H[3] + H[3]; }
                    else if (H.length == 7) { r = "0x" + H[1] + H[2]; g = "0x" + H[3] + H[4]; b = "0x" + H[5] + H[6]; }
                    r /= 255; g /= 255; b /= 255;
                    let cmin = Math.min(r,g,b), cmax = Math.max(r,g,b), delta = cmax - cmin, h = 0, s = 0, l = 0;
                    if (delta == 0) h = 0; else if (cmax == r) h = ((g - b) / delta) % 6; else if (cmax == g) h = (b - r) / delta + 2; else h = (r - g) / delta + 4;
                    h = Math.round(h * 60);
                    if (h < 0) h += 360;
                    l = (cmax + cmin) / 2;
                    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
                    s = +(s * 100).toFixed(1);
                    l = +(l * 100).toFixed(1);
                    return `hsl(${h}, ${s}%, ${l}%)`;
                }
                const updateColorValues = (hex) => {
                    const rgb = hexToRgb(hex);
                    const hsl = hexToHsl(hex);
                    colorDisplay.style.backgroundColor = hex;
                    colorHexSpan.textContent = hex;
                    colorRgbSpan.textContent = rgb;
                    colorHslSpan.textContent = hsl;
                }
                colorPicker.addEventListener('input', (e) => updateColorValues(e.target.value));
                copyHexBtn.addEventListener('click', () => copyToClipboard(colorHexSpan.textContent, colorCopyStatus, `បានចម្លង ${colorHexSpan.textContent}!`));
                copyRgbBtn.addEventListener('click', () => copyToClipboard(colorRgbSpan.textContent, colorCopyStatus, `បានចម្លង ${colorRgbSpan.textContent}!`));
                copyHslBtn.addEventListener('click', () => copyToClipboard(colorHslSpan.textContent, colorCopyStatus, `បានចម្លង ${colorHslSpan.textContent}!`));
                updateColorValues('#2563eb');
            }

            const pdfButton = document.getElementById('pdf-button');
            if (pdfButton) {
                const pdfUpload = document.getElementById('pdf-upload');
                const pdfResult = document.getElementById('pdf-result');
                const pdfStatus = document.getElementById('pdf-status');
                const pdfSpinner = document.getElementById('pdf-spinner');
                const pdfBtnText = document.getElementById('pdf-btn-text');
                const pdfDownloadBtn = document.getElementById('pdf-download-btn');
                pdfButton.addEventListener('click', () => {
                    const file = pdfUpload.files[0];
                    if (!file) { pdfStatus.textContent = 'សូមជ្រើសរើសឯកសារ PDF ជាមុនសិន។'; return; }
                    pdfStatus.textContent = 'កំពុងរៀបចំ...';
                    pdfResult.value = '';
                    pdfButton.disabled = true;
                    pdfDownloadBtn.disabled = true;
                    pdfSpinner.classList.remove('hidden');
                    pdfBtnText.textContent = 'កំពុងបម្លែង';
                    const fileReader = new FileReader();
                    fileReader.onload = async function() {
                        pdfStatus.textContent = 'កំពុងអានឯកសារ...';
                        try {
                            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.102/pdf.worker.min.js`;
                            const pdf = await pdfjsLib.getDocument(new Uint8Array(this.result)).promise;
                            let fullText = '';
                            for (let i = 1; i <= pdf.numPages; i++) {
                                const page = await pdf.getPage(i);
                                const textContent = await page.getTextContent();
                                fullText += textContent.items.map(s => s.str).join(' ') + '\n';
                                pdfStatus.textContent = `កំពុងដកស្រង់ទំព័រ ${i}/${pdf.numPages}...`;
                            }
                            pdfResult.value = fullText;
                            pdfStatus.textContent = 'ការបំប្លែងបានជោគជ័យ!';
                            if(fullText) pdfDownloadBtn.disabled = false;
                        } catch (error) {
                            pdfStatus.textContent = 'មានបញ្ហាក្នុងការបំប្លែង PDF។';
                            console.error("PDF to Text Error:", error);
                        } finally {
                            pdfButton.disabled = false;
                            pdfSpinner.classList.add('hidden');
                            pdfBtnText.textContent = 'បំប្លែង';
                        }
                    };
                    fileReader.readAsArrayBuffer(file);
                });
                pdfDownloadBtn.addEventListener('click', () => downloadTextFile('pdf-to-text-result.txt', pdfResult.value));
            }
            
            const textToPdfButton = document.getElementById('text-to-pdf-button');
            if (textToPdfButton) {
                const textToPdfInput = document.getElementById('text-to-pdf-input');
                textToPdfButton.addEventListener('click', () => {
                    const text = textToPdfInput.value.trim();
                    if (!text) return;
                    try {
                        const { jsPDF } = window.jspdf;
                        const doc = new jsPDF();
                        const splitText = doc.splitTextToSize(text, 180);
                        doc.text(splitText, 15, 20);
                        doc.save('document.pdf');
                    } catch(e) { 
                        console.error("Error generating PDF:", e); 
                    }
                });
            }
        });
