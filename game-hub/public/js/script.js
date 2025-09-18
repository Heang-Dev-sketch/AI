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
                const previewIframeWrapper = document.getElementById('preview-iframe-wrapper');
                const previewIframe = document.getElementById('preview-iframe');
                const closePreviewBtn = document.getElementById('close-preview-btn');
                const promptEnhancerBtn = document.getElementById('prompt-enhancer-btn');

                let uploadedImageData = null;
                let uploadedImageType = null;
                let currentAiMode = 'chat'; // 'chat', 'image', 'code'

                const API_KEY = "AIzaSyCGeAhRrYpYR3K_GxCIOu0oMm7dk5Q84W0"; 
                const CONVERSATION_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
                const IMAGE_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image-preview:generateContent?key=${API_KEY}`;
                let conversationHistory = [];
                
                window.setAiMode = (mode) => {
                    currentAiMode = mode;
                    const buttons = document.querySelectorAll('.ai-mode-btn');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    const activeBtn = document.querySelector(`.ai-mode-btn[onclick="setAiMode('${mode}')"]`);
                    if(activeBtn) activeBtn.classList.add('active');

                    if(mode === 'chat') {
                        userInput.placeholder = "វាយសាររបស់អ្នកនៅទីនេះ...";
                    } else if (mode === 'image') {
                        userInput.placeholder = "ពិពណ៌នារូបភាពដែលអ្នកចង់បាន...";
                    } else if (mode === 'code') {
                         userInput.placeholder = "ពិពណ៌នាកូដដែលអ្នកចង់បាន...";
                    }
                }

                window.openPreviewModal = (code) => {
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

                window.setPreviewSize = (size) => {
                    const wrapper = document.getElementById('preview-iframe-wrapper');
                    const buttons = document.querySelectorAll('.responsive-btn');
                    wrapper.className = ' ';
                    wrapper.classList.add(`preview-${size}`, 'transition-all', 'duration-300', 'ease-in-out', 'mx-auto', 'border-4', 'border-gray-700', 'rounded-lg', 'shadow-xl', 'h-full');
                    
                    buttons.forEach(btn => btn.classList.remove('active'));
                    document.querySelector(`.responsive-btn[onclick="setPreviewSize('${size}')"]`).classList.add('active');
                }

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

                const createAiMessageBubble = (message) => {
                    const bubbleWrapper = document.createElement('div');
                    bubbleWrapper.className = 'flex w-full mt-2 space-x-3 max-w-full';
                    
                    const bubble = document.createElement('div');
                    bubble.className = 'chat-message p-3 rounded-lg ai-message';
                    
                    const codeRegex = /```html\n([\s\S]*?)\n```/;
                    const codeMatch = message.match(codeRegex);

                    if (codeMatch && codeMatch[1]) {
                        const code = codeMatch[1];
                        const preMessage = message.substring(0, codeMatch.index);
                        
                        const messageSpan = document.createElement('span');
                        messageSpan.textContent = preMessage;
                        bubble.appendChild(messageSpan);
                        
                        const codeBlock = document.createElement('pre');
                        codeBlock.className = 'chat-code-block';
                        const codeElement = document.createElement('code');
                        codeElement.textContent = code;
                        codeBlock.appendChild(codeElement);
                        bubble.appendChild(codeBlock);

                        const buttonGroup = document.createElement('div');
                        buttonGroup.className = 'flex space-x-2 mt-3';
                        buttonGroup.innerHTML = `
                            <button class="btn-action text-xs bg-gray-600 text-white font-bold py-1 px-3 rounded-md hover:bg-gray-700" onclick="toggleCode(this)">💻 មើលកូដ</button>
                            <button class="btn-action text-xs bg-blue-600 text-white font-bold py-1 px-3 rounded-md hover:bg-blue-700" onclick="openPreviewModal(this.dataset.code)">👁️ មើលផ្ទាល់</button>
                            <button class="btn-action text-xs bg-green-500 text-white font-bold py-1 px-3 rounded-md hover:bg-green-600" onclick="copyCode(this)">📋 ចម្លងកូដ</button>
                        `;
                        buttonGroup.querySelector('[onclick*="openPreviewModal"]').dataset.code = code;
                        bubble.appendChild(buttonGroup);

                    } else {
                        const messageSpan = document.createElement('span');
                        messageSpan.textContent = message;
                        bubble.appendChild(messageSpan);
                    }
                    
                    bubbleWrapper.appendChild(bubble);
                    return bubbleWrapper;
                };

                window.toggleCode = (btn) => {
                    const codeBlock = btn.parentElement.previousElementSibling;
                    const isHidden = codeBlock.style.display === 'none' || codeBlock.style.display === '';
                    codeBlock.style.display = isHidden ? 'block' : 'none';
                    btn.textContent = isHidden ? '💻 លាក់កូដ' : '💻 មើលកូដ';
                }

                window.copyCode = (btn) => {
                    const codeBlock = btn.parentElement.previousElementSibling;
                    const codeToCopy = codeBlock.querySelector('code').textContent;

                    navigator.clipboard.writeText(codeToCopy).then(() => {
                        btn.textContent = '✅ បានចម្លង!';
                        setTimeout(() => { btn.textContent = '📋 ចម្លងកូដ'; }, 2000);
                    }).catch(err => {
                        console.warn('Could not copy text using navigator.clipboard, trying fallback.', err);
                        const textArea = document.createElement("textarea");
                        textArea.value = codeToCopy;
                        textArea.style.position = "fixed";
                        textArea.style.top = "-9999px";
                        textArea.style.left = "-9999px";
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        try {
                            const successful = document.execCommand('copy');
                            if (successful) {
                                btn.textContent = '✅ បានចម្លង!';
                                setTimeout(() => { btn.textContent = '📋 ចម្លងកូដ'; }, 2000);
                            } else {
                                btn.textContent = '❌ បរាជ័យ';
                                setTimeout(() => { btn.textContent = '📋 ចម្លងកូដ'; }, 2000);
                            }
                        } catch (e) {
                             console.error('Fallback copy failed', e);
                             btn.textContent = '❌ បរាជ័យ';
                             setTimeout(() => { btn.textContent = '📋 ចម្លងកូដ'; }, 2000);
                        }
                        document.body.removeChild(textArea);
                    });
                }
                
                const showImageLoadingBubble = () => {
                    const bubbleWrapper = document.createElement('div');
                    bubbleWrapper.id = 'image-loading-bubble';
                    bubbleWrapper.className = 'flex w-full mt-2 space-x-3 max-w-full';
                    bubbleWrapper.innerHTML = `
                        <div class="chat-message p-3 rounded-lg ai-message">
                            <div class="flex items-center space-x-2">
                                <svg class="animate-spin h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                <span>កំពុងបង្កើតរូបភាព...</span>
                            </div>
                        </div>
                    `;
                    chatbox.appendChild(bubbleWrapper);
                    chatbox.scrollTop = chatbox.scrollHeight;
                }

                const createImageBubble = (imageUrl) => {
                     const bubbleWrapper = document.createElement('div');
                     bubbleWrapper.className = `flex w-full mt-2 space-x-3 max-w-full`;
                     const bubble = document.createElement('div');
                     bubble.className = `chat-message p-2 rounded-lg ai-message bg-gray-800`;
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

                const setInputState = (disabled) => {
                    userInput.disabled = disabled;
                    sendBtn.disabled = disabled;
                    promptEnhancerBtn.disabled = disabled;
                };

                const generateImage = async (prompt) => {
                    showImageLoadingBubble();
                    setInputState(true);
                    try {
                        const payload = {
                            contents: [{
                                parts: [{ text: prompt }]
                            }],
                            generationConfig: {
                                responseModalities: ['IMAGE']
                            },
                        };
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
                        const base64Data = result?.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

                        if (base64Data) {
                            const imageUrl = `data:image/png;base64,${base64Data}`;
                            const loadingBubble = document.getElementById('image-loading-bubble');
                            if (loadingBubble) loadingBubble.replaceWith(createImageBubble(imageUrl));
                        } else {
                            const textResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;
                            const errorMessage = textResponse || "No image data received from API.";
                            throw new Error(errorMessage);
                        }
                    } catch (error) {
                        console.error("Image Generation Error:", error);
                        let errorMessage = `សូមអភ័យទោស, មានបញ្ហាក្នុងការបង្កើតរូបភាព: ${error.message}`;

                        if (error.message.includes("Quota exceeded")) {
                            const retryMatch = error.message.match(/Please retry in ([\d\.]+)s/);
                            if (retryMatch && retryMatch[1]) {
                                const retrySeconds = parseFloat(retryMatch[1]);
                                const now = new Date();
                                now.setSeconds(now.getSeconds() + retrySeconds);
                                const retryTime = now.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true
                                });
                                errorMessage = `សូមអភ័យទោស!\nដែនកំណត់បង្កើតរូបភាពដោយឥតគិតថ្លៃសម្រាប់ថ្ងៃនេះបានពេញហើយ។\n\n🕒 អ្នកអាចសាកល្បងម្តងទៀតនៅម៉ោងប្រហែល ${retryTime}។\n\nℹ️ ចំណាំ៖ សេវាកម្មឥតគិតថ្លៃមានដែនកំណត់ក្នុងការបង្កើតរូបភាពក្នុងមួយថ្ងៃ។`;
                            } else {
                                errorMessage = `សូមអភ័យទោស!\nដែនកំណត់បង្កើតរូបភាពដោយឥតគិតថ្លៃសម្រាប់ថ្ងៃនេះបានពេញហើយ។ សូមព្យាយាមម្តងទៀតនៅថ្ងៃស្អែក។\n\nℹ️ ចំណាំ៖ សេវាកម្មឥតគិតថ្លៃមានដែនកំណត់ក្នុងការបង្កើតរូបភាពក្នុងមួយថ្ងៃ។`;
                            }
                        }

                        const loadingBubble = document.getElementById('image-loading-bubble');
                        if (loadingBubble) loadingBubble.replaceWith(createAiMessageBubble(errorMessage));
                    } finally {
                        setInputState(false);
                        userInput.focus();
                        chatbox.scrollTop = chatbox.scrollHeight;
                    }
                };
                
                const generateText = async (parts) => {
                    conversationHistory.push({ role: "user", parts: parts });
                    showTypingIndicator();
                    setInputState(true);
                    try {
                        let systemText = "You are 'AI Tools ខ្មែរ', a helpful AI assistant for general conversation in Khmer.";
                        if (currentAiMode === 'code') {
                            systemText = "You are an expert web developer AI. Your task is to write complete, single-file HTML code based on the user's request. You MUST include all necessary HTML, CSS (using Tailwind CSS classes inside `<style>` tags if necessary), and JavaScript (inside `<script>` tags). The code must be runnable and responsive. Assume Tailwind CSS is available via CDN. Respond ONLY with the markdown code block ```html\n...\n```."
                        } else if (currentAiMode === 'image') {
                             systemText = "You are an expert AI image prompt engineer. You will receive a request for an image and your job is to create a detailed, high-quality prompt in English for an AI image generator based on that request. Then, respond ONLY with the generated image prompt prefixed by the phrase 'បង្កើតរូបភាព: '.";
                        }
                        
                        const systemInstruction = { parts: [{ text: systemText }] };
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
                        let aiResponse = result.candidates?.[0]?.content?.parts?.[0]?.text;

                        if (aiResponse) {
                             if (aiResponse.startsWith('បង្កើតរូបភាព: ')) {
                                hideTypingIndicator();
                                const imagePrompt = aiResponse.replace('បង្កើតរូបភាព: ', '').trim();
                                generateImage(imagePrompt); // Hand off to the image generator
                                return; // Stop further processing in this function
                            }

                            chatbox.appendChild(createAiMessageBubble(aiResponse));
                            conversationHistory.push({ role: "model", parts: [{ text: aiResponse }] });
                        } else {
                            chatbox.appendChild(createAiMessageBubble("សូមអភ័យទោស, ខ្ញុំមិនទទួលបានការឆ្លើយតបទេ។"));
                        }
                    } catch (error) {
                        console.error("Chatbot API Error:", error);
                        chatbox.appendChild(createAiMessageBubble(`សូមអភ័យទោស, មានបញ្ហា: ${error.message}`));
                    } finally {
                        hideTypingIndicator();
                        setInputState(false);
                        userInput.focus();
                        chatbox.scrollTop = chatbox.scrollHeight;
                    }
                }

                const enhancePrompt = async () => {
                    const simplePrompt = userInput.value.trim();
                    if (!simplePrompt) return;

                    setInputState(true);
                    promptEnhancerBtn.innerHTML = `<svg class="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
                    
                    try {
                        const systemInstruction = { parts: [{ text: "You are a creative prompt engineer. Take the user's simple idea and expand it into a detailed, descriptive prompt suitable for an AI image generator. The prompt should be in English. Respond ONLY with the enhanced prompt, without any conversational text or explanations." }] };
                        const payload = { contents: [{parts: [{text: simplePrompt}]}], systemInstruction };
                        const response = await fetch(CONVERSATION_API_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(payload)
                        });
                        if (!response.ok) throw new Error('Failed to enhance prompt.');
                        
                        const result = await response.json();
                        const enhancedPrompt = result.candidates?.[0]?.content?.parts?.[0]?.text;
                        
                        if(enhancedPrompt) {
                            userInput.value = enhancedPrompt;
                        }
                    } catch(error) {
                        console.error("Prompt Enhancement Error:", error);
                        userInput.value = simplePrompt + " (enhancement failed)";
                    } finally {
                        setInputState(false);
                        promptEnhancerBtn.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>`;
                        userInput.focus();
                    }
                }
                
                const sendMessage = async () => {
                    let message = userInput.value.trim();
                    if (!message && !uploadedImageData) return;
                    
                    const imageUrlForBubble = uploadedImageData ? `data:${uploadedImageType};base64,${uploadedImageData}` : null;
                    chatbox.appendChild(createUserMessageBubble(message, imageUrlForBubble)); // Show original message
                    userInput.value = '';

                    const parts = [];
                    if (message) parts.push({ text: message });
                    if (uploadedImageData) {
                        parts.push({ inlineData: { mimeType: uploadedImageType, data: uploadedImageData } });
                    }
                    generateText(parts);
                    
                    window.removeImagePreview();
                    chatbox.scrollTop = chatbox.scrollHeight;
                };

                if(sendBtn) sendBtn.addEventListener('click', sendMessage);
                if(userInput) userInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if(!userInput.disabled) sendMessage();
                    }
                });
                if(promptEnhancerBtn) promptEnhancerBtn.addEventListener('click', enhancePrompt);
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
             // --- On-scroll Animation Logic ---
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1
            });

            const elementsToAnimate = document.querySelectorAll('.scroll-animate');
            elementsToAnimate.forEach(el => observer.observe(el));
        });
