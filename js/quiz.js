// Quiz Application Main Logic with New Flow
class QuizApp {
    constructor() {
        this.topics = [];
        this.currentTopicIndex = 0;
        this.currentQuestionIndex = 0;
        this.totalQuestionsAnswered = 0;
        this.timer = null;
        this.timerDuration = 90; // default duration in seconds
        this.currentRound = 1; // Track current round
        
        // Custom starting position flag
        this.isCustomStart = false;
        this.customStartTopicIndex = 0;
        
        // Drag and drop state
        this.draggedElement = null;
        this.draggedIndex = null;
        
        // Track topics for answer display
        this.topicsToShowAnswers = [];
        this.currentAnswerTopicIndex = 0;
        this.currentAnswerQuestionIndex = 0;
        
        // Screen elements
        this.screens = {
            landing: document.getElementById('landing-screen'),
            quizSetup: document.getElementById('quiz-setup-screen'),
            start: document.getElementById('start-screen'),
            roundIndicator: document.getElementById('round-indicator-screen'),
            topicIntro: document.getElementById('topic-intro-screen'),
            question: document.getElementById('question-screen'),
            timesUp: document.getElementById('times-up-screen'),
            topicFinish: document.getElementById('topic-finish-screen'),
            answersIntro: document.getElementById('answers-intro-screen'),
            answerDisplay: document.getElementById('answer-display-screen'),
            complete: document.getElementById('complete-screen'),
            thankYou: document.getElementById('thank-you-screen')
        };
        
        // Initialize event listeners
        this.initializeEventListeners();
        
        // Initialize the application
        this.initializeApp();
    }
    
    async initializeApp() {
        // Wait for config to be loaded
        await window.configLoader.loadConfig();
        
        // Set up branding
        this.setupBranding();
    }
    
    initializeEventListeners() {
        // File upload
        document.getElementById('json-upload').addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Landing screen buttons
        document.getElementById('ready-btn').addEventListener('click', () => this.showQuizSetup());
        
        // Quiz setup screen buttons
        document.getElementById('back-to-landing-btn').addEventListener('click', () => this.backToLanding());
        document.getElementById('start-quiz-btn').addEventListener('click', () => this.showStartScreen());
        document.getElementById('topic-selector').addEventListener('change', () => this.updateQuestionSelector());
        
        // Other buttons
        document.getElementById('start-btn').addEventListener('click', () => this.startQuiz());
        document.getElementById('start-round-btn').addEventListener('click', () => this.continueToNextTopic());
        document.getElementById('start-topic-btn').addEventListener('click', () => this.startTopic());
        document.getElementById('next-from-timeout-btn').addEventListener('click', () => this.nextQuestionAfterTimeout());
        document.getElementById('continue-btn').addEventListener('click', () => this.continueAfterTopic());
        document.getElementById('show-answers-btn').addEventListener('click', () => this.showAnswers());
        document.getElementById('next-answer-btn').addEventListener('click', () => this.nextAnswer());
        document.getElementById('continue-to-thanks-btn').addEventListener('click', () => this.showThankYou());
    }
    
    handleFileUpload(event) {
        const files = event.target.files;
        
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Check format and extract topics accordingly
                    let topicsToProcess = [];
                    let quizMetadata = null;
                    
                    if (data.quiz && data.quiz.topics && Array.isArray(data.quiz.topics)) {
                        // Handle quiz format with metadata wrapper
                        topicsToProcess = data.quiz.topics;
                        quizMetadata = {
                            name: data.quiz.name || 'Unnamed Quiz',
                            description: data.quiz.description || ''
                        };
                    } else if (Array.isArray(data)) {
                        // Handle multiple topics format (existing)
                        topicsToProcess = data;
                    } else if (data.theme && data.questions) {
                        // Handle single topic format (existing)
                        topicsToProcess = [data];
                    } else {
                        alert(window.configLoader.getMessage('error', 'invalidJson'));
                        return;
                    }
                    
                    // Process the topics
                    let validTopicsCount = 0;
                    topicsToProcess.forEach(topicData => {
                        if (this.validateTopicData(topicData)) {
                            this.topics.push(topicData);
                            validTopicsCount++;
                        } else {
                            console.warn('Neplatné téma přeskočeno:', topicData);
                        }
                    });
                    
                    if (validTopicsCount > 0) {
                        this.updateTopicDisplay();
                        document.getElementById('ready-btn').disabled = false;
                        
                        // Show appropriate success message
                        if (quizMetadata) {
                            this.showMessage(window.configLoader.getMessage('success', 'quizLoaded', {
                                name: quizMetadata.name,
                                count: validTopicsCount,
                                file: file.name
                            }), 'success');
                        } else {
                            this.showMessage(window.configLoader.getMessage('success', 'topicsLoaded', {
                                count: validTopicsCount,
                                file: file.name
                            }), 'success');
                        }
                    } else {
                        this.showMessage(window.configLoader.getMessage('error', 'noValidTopics'), 'error');
                    }
                } catch (error) {
                    this.showMessage(window.configLoader.getMessage('error', 'jsonProcessingError', {
                        error: error.message
                    }), 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        // Clear the input to allow re-uploading the same file
        event.target.value = '';
    }
    
    validateTopicData(data) {
        return data.hasOwnProperty('theme') && 
               data.hasOwnProperty('questions') && 
               Array.isArray(data.questions) &&
               data.questions.length > 0 &&
               data.questions.every(q => 
                   q.hasOwnProperty('question') &&
                   q.hasOwnProperty('answer') &&
                   q.hasOwnProperty('explanation') &&
                   q.hasOwnProperty('source') &&
                   q.hasOwnProperty('difficulty') &&
                   // Optional image and audio properties
                   (!q.hasOwnProperty('image') || typeof q.image === 'string') &&
                   (!q.hasOwnProperty('audio') || typeof q.audio === 'string')
               );
    }
    
    updateTopicDisplay() {
        const container = document.getElementById('selected-topics');
        container.innerHTML = '';
        
        this.topics.forEach((topic, index) => {
            const chip = document.createElement('div');
            chip.className = 'topic-chip';
            chip.draggable = true;
            chip.dataset.topicIndex = index;
            
            // Add drag handle
            const dragHandle = document.createElement('div');
            dragHandle.className = 'drag-handle';
            dragHandle.innerHTML = '⋮⋮';
            chip.appendChild(dragHandle);
            
            // Add content container
            const content = document.createElement('div');
            content.className = 'topic-content';
            
            const topicName = document.createElement('div');
            topicName.className = 'topic-name';
            topicName.textContent = topic.theme;
            
            const topicMeta = document.createElement('div');
            topicMeta.className = 'topic-meta';
            topicMeta.textContent = `${topic.questions.length} otázek`;
            
            content.appendChild(topicName);
            content.appendChild(topicMeta);
            chip.appendChild(content);
            
            // Add order indicator
            const orderIndicator = document.createElement('div');
            orderIndicator.className = 'topic-order';
            orderIndicator.textContent = `${index + 1}.`;
            chip.appendChild(orderIndicator);
            
            // Add drag event listeners
            chip.addEventListener('dragstart', (e) => this.handleDragStart(e));
            chip.addEventListener('dragend', (e) => this.handleDragEnd(e));
            chip.addEventListener('dragover', (e) => this.handleDragOver(e));
            chip.addEventListener('drop', (e) => this.handleDrop(e));
            chip.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            chip.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            
            container.appendChild(chip);
        });
        
        // Add container drag events
        container.addEventListener('dragover', (e) => this.handleContainerDragOver(e));
        container.addEventListener('drop', (e) => this.handleContainerDrop(e));
    }
    
    handleDragStart(e) {
        this.draggedElement = e.currentTarget; // Use currentTarget for the whole card
        this.draggedIndex = parseInt(e.currentTarget.dataset.topicIndex);
        e.currentTarget.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    }
    
    handleDragEnd(e) {
        e.currentTarget.classList.remove('dragging');
        // Remove drag-over class from all chips
        document.querySelectorAll('.topic-chip').forEach(chip => {
            chip.classList.remove('drag-over');
        });
        document.getElementById('selected-topics').classList.remove('drag-over');
        this.draggedElement = null;
        this.draggedIndex = null;
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        const targetCard = e.target.closest('.topic-chip');
        if (targetCard && targetCard !== this.draggedElement) {
            // Remove drag-over from other cards first
            document.querySelectorAll('.topic-chip').forEach(chip => {
                if (chip !== targetCard) {
                    chip.classList.remove('drag-over');
                }
            });
            targetCard.classList.add('drag-over');
        }
    }
    
    handleDragLeave(e) {
        const targetCard = e.target.closest('.topic-chip');
        if (targetCard) {
            // Only remove if we're actually leaving the card
            const rect = targetCard.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                targetCard.classList.remove('drag-over');
            }
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        const targetCard = e.target.closest('.topic-chip');
        if (targetCard && targetCard !== this.draggedElement) {
            const targetIndex = parseInt(targetCard.dataset.topicIndex);
            this.reorderTopics(this.draggedIndex, targetIndex);
        }
        
        // Clean up all drag-over classes
        document.querySelectorAll('.topic-chip').forEach(chip => {
            chip.classList.remove('drag-over');
        });
    }
    
    handleContainerDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        e.currentTarget.classList.add('drag-over');
    }
    
    handleContainerDrop(e) {
        e.preventDefault();
        e.currentTarget.classList.remove('drag-over');
        
        // If dropped on empty area, do nothing (keep current order)
        if (!e.target.classList.contains('topic-chip')) {
            return;
        }
    }
    
    reorderTopics(fromIndex, toIndex) {
        if (fromIndex === toIndex) return;
        
        // Move the topic in the array
        const movedTopic = this.topics.splice(fromIndex, 1)[0];
        this.topics.splice(toIndex, 0, movedTopic);
        
        // Update the display
        this.updateTopicDisplay();
        
        // Show success message
        this.showMessage(window.configLoader.getMessage('success', 'topicsReordered'), 'success');
    }
    
    switchScreen(screenName) {
        // Hide all screens
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show/hide branding header based on screen
        if (screenName === 'landing') {
            this.hideBrandingHeader();
        } else {
            // Show branding header on all quiz screens
            this.showBrandingHeader();
        }
        
        // Show the requested screen
        setTimeout(() => {
            this.screens[screenName].classList.add('active');
        }, 300);
    }
    
    showStartScreen() {
        if (this.topics.length === 0) return;
        
        // Get timer duration from setup screen input
        const timerInput = document.getElementById('setup-timer-duration');
        this.timerDuration = parseInt(timerInput.value) || 90;
        
        // Ensure timer duration is within reasonable bounds
        if (this.timerDuration < 10) this.timerDuration = 10;
        if (this.timerDuration > 300) this.timerDuration = 300;
        
        // Update input to show corrected value
        timerInput.value = this.timerDuration;
        
        // Get selected starting position to calculate correct round
        const topicSelector = document.getElementById('topic-selector');
        const questionSelector = document.getElementById('question-selector');
        
        const selectedTopicIndex = parseInt(topicSelector.value) || 0;
        const selectedQuestionIndex = parseInt(questionSelector.value) || 0;
        
        // Set the current indices
        this.currentTopicIndex = selectedTopicIndex;
        this.currentQuestionIndex = selectedQuestionIndex;
        
        // Track if this is a custom start position
        this.isCustomStart = selectedTopicIndex > 0 || selectedQuestionIndex > 0;
        this.customStartTopicIndex = selectedTopicIndex;
        
        // Calculate the correct round based on selected topic
        this.currentRound = Math.floor(this.currentTopicIndex / 2) + 1;
        
        // Update round title based on current round
        document.getElementById('round-title').textContent = window.configLoader.getRoundName(this.currentRound);
        
        this.switchScreen('start');
    }
    
    showQuizSetup() {
        if (this.topics.length === 0) return;
        
        // Set default timer value on setup screen
        const setupTimer = document.getElementById('setup-timer-duration');
        setupTimer.value = this.timerDuration; // Use current default value
        
        // Populate topic selector
        this.populateTopicSelector();
        
        this.switchScreen('quizSetup');
    }
    
    populateTopicSelector() {
        const topicSelector = document.getElementById('topic-selector');
        topicSelector.innerHTML = '';
        
        this.topics.forEach((topic, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${index + 1}. ${topic.theme}`;
            topicSelector.appendChild(option);
        });
        
        // Initialize question selector for first topic
        this.updateQuestionSelector();
    }
    
    updateQuestionSelector() {
        const topicSelector = document.getElementById('topic-selector');
        const questionSelector = document.getElementById('question-selector');
        const selectedTopicIndex = parseInt(topicSelector.value);
        
        questionSelector.innerHTML = '';
        
        if (selectedTopicIndex >= 0 && selectedTopicIndex < this.topics.length) {
            const topic = this.topics[selectedTopicIndex];
            topic.questions.forEach((question, index) => {
                const option = document.createElement('option');
                option.value = index;
                // Truncate question text for display
                const questionText = question.question.length > 50 
                    ? question.question.substring(0, 50) + '...' 
                    : question.question;
                option.textContent = `${index + 1}. ${questionText}`;
                questionSelector.appendChild(option);
            });
        }
    }
    
    backToLanding() {
        this.switchScreen('landing');
    }
    
    startQuiz() {
        // Indices are already set in showStartScreen, just initialize other state
        this.totalQuestionsAnswered = 0;
        this.topicsToShowAnswers = [];
        
        this.showTopicIntro();
    }
    
    showTopicIntro() {
        const topic = this.topics[this.currentTopicIndex];
        document.getElementById('topic-name').textContent = topic.theme;
        
        // Update topic info to show which question we're starting from
        const topicInfoElement = document.querySelector('.topic-info');
        if (this.currentQuestionIndex === 0) {
            topicInfoElement.textContent = window.configLoader.get('ui.quiz.topicInfo', 'Připravte se na 5 otázek!');
        } else {
            const remainingQuestions = topic.questions.length - this.currentQuestionIndex;
            const message = window.configLoader.get('ui.quiz.topicContinueInfo', 'Pokračování od otázky {questionNumber}. Zbývá {remainingQuestions} otázek.');
            topicInfoElement.textContent = message
                .replace('{questionNumber}', this.currentQuestionIndex + 1)
                .replace('{remainingQuestions}', remainingQuestions);
        }
        
        this.switchScreen('topicIntro');
    }
    
    startTopic() {
        // Don't reset currentQuestionIndex - use the one set from the selector
        this.showQuestion();
    }
    
    showQuestion() {
        const topic = this.topics[this.currentTopicIndex];
        const question = topic.questions[this.currentQuestionIndex];
        
        // Update UI
        document.getElementById('current-topic').textContent = topic.theme;
        document.getElementById('question-progress').textContent = 
            `Otázka ${this.currentQuestionIndex + 1} z ${topic.questions.length}`;
        document.getElementById('question-text').textContent = question.question;
        
        // Handle media elements
        this.renderMediaElements(question);
        
        this.switchScreen('question');
        
        // Start timer with configured duration, but not for audio questions
        if (this.timer) {
            this.timer.stop();
        }
        
        // Don't start timer for audio questions - presenter will control it
        if (!question.audio) {
            this.timer = new QuizTimer(this.timerDuration, () => this.onTimerComplete());
            this.timer.start();
            // Show timer
            document.getElementById('timer').style.display = 'block';
        } else {
            // Hide timer for audio questions
            document.getElementById('timer').style.display = 'none';
        }
    }
    
    renderMediaElements(question) {
        const questionContainer = document.querySelector('.question-container');
        
        // Remove any existing media elements and buttons
        const existingMedia = questionContainer.querySelectorAll('.media-element, .manual-next-btn, .skip-next-btn');
        existingMedia.forEach(el => el.remove());
        
        let hasMedia = false;
        
        // Add image if present
        if (question.image) {
            hasMedia = true;
            const imageContainer = document.createElement('div');
            imageContainer.className = 'media-element image-container';
            
            const img = document.createElement('img');
            img.src = question.image;
            img.alt = 'Obrázek k otázce';
            img.className = 'question-image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '400px';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            
            // Handle image load errors
            img.onerror = function() {
                this.style.display = 'none';
                const errorMsg = document.createElement('div');
                errorMsg.textContent = 'Chyba při načítání obrázku';
                errorMsg.style.color = 'var(--danger-color, #f56565)';
                errorMsg.style.textAlign = 'center';
                errorMsg.style.padding = '1rem';
                errorMsg.style.backgroundColor = 'rgba(245, 101, 101, 0.1)';
                errorMsg.style.borderRadius = '8px';
                errorMsg.style.marginTop = '1rem';
                imageContainer.appendChild(errorMsg);
            };
            
            imageContainer.appendChild(img);
            questionContainer.appendChild(imageContainer);
        }
        
        // Add audio if present
        if (question.audio) {
            hasMedia = true;
            const audioContainer = document.createElement('div');
            audioContainer.className = 'media-element audio-container';
            
            const audioLabel = document.createElement('div');
            audioLabel.textContent = 'Poslechněte si nahrávku:';
            audioLabel.style.marginBottom = '0.5rem';
            audioLabel.style.fontWeight = '600';
            audioLabel.style.color = 'var(--text-primary)';
            audioLabel.style.textAlign = 'center';
            
            const audio = document.createElement('audio');
            audio.src = question.audio;
            audio.controls = true;
            audio.className = 'question-audio';
            audio.style.width = '100%';
            audio.style.maxWidth = '400px';
            
            // Handle audio load errors
            audio.onerror = function() {
                this.style.display = 'none';
                const errorMsg = document.createElement('div');
                errorMsg.textContent = 'Chyba při načítání zvukového souboru';
                errorMsg.style.color = 'var(--danger-color, #f56565)';
                errorMsg.style.textAlign = 'center';
                errorMsg.style.padding = '1rem';
                errorMsg.style.backgroundColor = 'rgba(245, 101, 101, 0.1)';
                errorMsg.style.borderRadius = '8px';
                audioContainer.appendChild(errorMsg);
            };
            
            audioContainer.appendChild(audioLabel);
            audioContainer.appendChild(audio);
            questionContainer.appendChild(audioContainer);
            
            // Add manual next button for audio questions (timer is hidden for audio)
            const manualButton = document.createElement('button');
            manualButton.id = 'manual-next-btn';
            manualButton.className = 'btn-primary manual-next-btn';
            manualButton.textContent = window.configLoader.get('ui.quiz.continueButton', 'Pokračovat na další otázku');
            manualButton.addEventListener('click', () => this.manualNext());
            questionContainer.appendChild(manualButton);
        } else {
            // Add skip button for text and image questions (timer keeps running)
            const skipButton = document.createElement('button');
            skipButton.id = 'skip-next-btn';
            skipButton.className = 'skip-next-btn';
            skipButton.textContent = window.configLoader.get('ui.quiz.skipButton', 'Přeskočit otázku');
            skipButton.addEventListener('click', () => this.skipQuestion());
            questionContainer.appendChild(skipButton);
        }
    }
    
    onTimerComplete() {
        this.totalQuestionsAnswered++;
        this.switchScreen('timesUp');
    }
    
    nextQuestionAfterTimeout() {
        if (this.currentQuestionIndex < this.topics[this.currentTopicIndex].questions.length - 1) {
            // More questions in current topic
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            // Topic finished
            this.showTopicFinish();
        }
    }
    
    showTopicFinish() {
        this.switchScreen('topicFinish');
    }
    
    continueAfterTopic() {
        // Add current topic to answer queue
        this.topicsToShowAnswers.push(this.currentTopicIndex);
        
        // Check if we should show answers (after every 2 topics)
        if (this.topicsToShowAnswers.length === 2 || 
            (this.currentTopicIndex === this.topics.length - 1 && this.topicsToShowAnswers.length > 0)) {
            // Show answers for accumulated topics
            this.currentAnswerTopicIndex = 0;
            this.currentAnswerQuestionIndex = 0;
            this.showAnswersIntro();
        } else if (this.currentTopicIndex < this.topics.length - 1) {
            // Continue to next topic
            this.currentTopicIndex++;
            // Reset question index for the new topic (custom start only applies to the initial topic)
            this.currentQuestionIndex = 0;
            this.showTopicIntro();
        } else {
            // All done
            this.showComplete();
        }
    }
    
    showAnswersIntro() {
        const topicIndex = this.topicsToShowAnswers[this.currentAnswerTopicIndex];
        const topic = this.topics[topicIndex];
        document.getElementById('answers-topic-name').textContent = topic.theme;
        this.switchScreen('answersIntro');
    }
    
    showAnswers() {
        this.currentAnswerQuestionIndex = 0;
        this.showAnswer();
    }
    
    showAnswer() {
        const topicIndex = this.topicsToShowAnswers[this.currentAnswerTopicIndex];
        const topic = this.topics[topicIndex];
        const question = topic.questions[this.currentAnswerQuestionIndex];
        
        // Update UI
        document.getElementById('answer-topic').textContent = topic.theme;
        document.getElementById('answer-progress').textContent = 
            `Odpověď ${this.currentAnswerQuestionIndex + 1} z ${topic.questions.length}`;
        
        // Display question and answer
        document.getElementById('recap-question').textContent = question.question;
        document.getElementById('answer-text').textContent = question.answer;
        document.getElementById('explanation-text').textContent = question.explanation;
        // Source removed from display - kept in data for admin verification only
        
        // Handle media elements in answer display
        this.renderAnswerMediaElements(question);
        
        this.switchScreen('answerDisplay');
    }
    
    renderAnswerMediaElements(question) {
        const answerDisplayContent = document.querySelector('.answer-display-content');
        
        // Remove any existing media elements
        const existingMedia = answerDisplayContent.querySelectorAll('.media-element');
        existingMedia.forEach(el => el.remove());
        
        // Add media elements after the question recap but before the answer
        const questionRecap = answerDisplayContent.querySelector('.question-recap');
        
        // Add image if present
        if (question.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'media-element image-container';
            
            const img = document.createElement('img');
            img.src = question.image;
            img.alt = 'Obrázek k otázce';
            img.className = 'answer-image';
            img.style.maxWidth = '100%';
            img.style.maxHeight = '300px';
            img.style.objectFit = 'contain';
            img.style.borderRadius = '8px';
            img.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            
            // Handle image load errors
            img.onerror = function() {
                this.style.display = 'none';
                const errorMsg = document.createElement('div');
                errorMsg.textContent = 'Chyba při načítání obrázku';
                errorMsg.style.color = 'var(--danger-color, #f56565)';
                errorMsg.style.textAlign = 'center';
                errorMsg.style.padding = '0.5rem';
                errorMsg.style.backgroundColor = 'rgba(245, 101, 101, 0.1)';
                errorMsg.style.borderRadius = '8px';
                imageContainer.appendChild(errorMsg);
            };
            
            imageContainer.appendChild(img);
            questionRecap.insertAdjacentElement('afterend', imageContainer);
        }
        
        // Add audio if present
        if (question.audio) {
            const audioContainer = document.createElement('div');
            audioContainer.className = 'media-element audio-container';
            
            const audioLabel = document.createElement('div');
            audioLabel.textContent = 'Nahrávka k otázce:';
            audioLabel.style.marginBottom = '0.5rem';
            audioLabel.style.fontWeight = '600';
            audioLabel.style.color = 'var(--text-primary)';
            audioLabel.style.textAlign = 'center';
            
            const audio = document.createElement('audio');
            audio.src = question.audio;
            audio.controls = true;
            audio.className = 'answer-audio';
            audio.style.width = '100%';
            audio.style.maxWidth = '400px';
            
            // Handle audio load errors
            audio.onerror = function() {
                this.style.display = 'none';
                const errorMsg = document.createElement('div');
                errorMsg.textContent = 'Chyba při načítání zvukového souboru';
                errorMsg.style.color = 'var(--danger-color, #f56565)';
                errorMsg.style.textAlign = 'center';
                errorMsg.style.padding = '0.5rem';
                errorMsg.style.backgroundColor = 'rgba(245, 101, 101, 0.1)';
                errorMsg.style.borderRadius = '8px';
                audioContainer.appendChild(errorMsg);
            };
            
            audioContainer.appendChild(audioLabel);
            audioContainer.appendChild(audio);
            
            // Insert after image if present, otherwise after question recap
            const insertAfter = question.image ? 
                answerDisplayContent.querySelector('.image-container') : questionRecap;
            insertAfter.insertAdjacentElement('afterend', audioContainer);
        }
    }
    
    nextAnswer() {
        const topicIndex = this.topicsToShowAnswers[this.currentAnswerTopicIndex];
        const topic = this.topics[topicIndex];
        
        if (this.currentAnswerQuestionIndex < topic.questions.length - 1) {
            // More answers in current topic
            this.currentAnswerQuestionIndex++;
            this.showAnswer();
        } else if (this.currentAnswerTopicIndex < this.topicsToShowAnswers.length - 1) {
            // Next topic's answers
            this.currentAnswerTopicIndex++;
            this.showAnswersIntro();
        } else {
            // Done with this batch of answers
            this.topicsToShowAnswers = [];
            
            if (this.currentTopicIndex < this.topics.length - 1) {
                // More topics to go - show round indicator for next round
                this.currentTopicIndex++;
                // Reset question index for new topic
                this.currentQuestionIndex = 0;
                this.currentRound++;
                this.showRoundIndicator();
            } else {
                // Quiz complete
                this.showComplete();
            }
        }
    }
    
    showRoundIndicator() {
        document.getElementById('next-round-title').textContent = window.configLoader.getRoundName(this.currentRound);
        this.switchScreen('roundIndicator');
    }
    
    showComplete() {
        // Display organizer info if available
        const organizerInfo = document.getElementById('organizer-info');
        const organizer = window.configLoader.get('app.organizer', '');
        if (organizer && organizerInfo) {
            organizerInfo.textContent = `Organizátor: ${organizer}`;
        }
        
        this.switchScreen('complete');
    }
    
    showThankYou() {
        // Display organizer info if available
        const thankYouOrganizerInfo = document.getElementById('thank-you-organizer-info');
        const organizer = window.configLoader.get('app.organizer', '');
        if (organizer && thankYouOrganizerInfo) {
            thankYouOrganizerInfo.textContent = `Organizátor: ${organizer}`;
        }
        
        this.switchScreen('thankYou');
    }
    
    restart() {
        this.topics = [];
        this.currentTopicIndex = 0;
        this.currentQuestionIndex = 0;
        this.totalQuestionsAnswered = 0;
        this.topicsToShowAnswers = [];
        this.currentRound = 1;
        
        // Reset UI
        document.getElementById('selected-topics').innerHTML = '';
        document.getElementById('ready-btn').disabled = true;
        
        this.switchScreen('landing');
    }
    
    continueToNextTopic() {
        // When moving to a new topic, reset question index unless it's the custom start topic
        if (this.currentTopicIndex !== this.customStartTopicIndex) {
            this.currentQuestionIndex = 0;
        }
        this.showTopicIntro();
    }
    
    manualNext() {
        // Increment counter for audio questions (since they don't use timer)
        this.totalQuestionsAnswered++;
        
        if (this.currentQuestionIndex < this.topics[this.currentTopicIndex].questions.length - 1) {
            // More questions in current topic
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            // Topic finished
            this.showTopicFinish();
        }
    }

    skipQuestion() {
        // Stop the timer if it's running
        if (this.timer) {
            this.timer.stop();
        }
        
        // Increment counter for skipped questions
        this.totalQuestionsAnswered++;
        
        if (this.currentQuestionIndex < this.topics[this.currentTopicIndex].questions.length - 1) {
            // More questions in current topic
            this.currentQuestionIndex++;
            this.showQuestion();
        } else {
            // Topic finished
            this.showTopicFinish();
        }
    }

    showMessage(message, type = 'info') {
        // Create message element
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // Style the message
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            zIndex: '10000',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });

        // Set background color based on type
        switch (type) {
            case 'success':
                messageEl.style.background = 'var(--success-color, #48bb78)';
                break;
            case 'error':
                messageEl.style.background = 'var(--danger-color, #f56565)';
                break;
            case 'info':
            default:
                messageEl.style.background = 'var(--primary-color, #667eea)';
                break;
        }

        document.body.appendChild(messageEl);

        // Animate in
        setTimeout(() => {
            messageEl.style.opacity = '1';
            messageEl.style.transform = 'translateX(0)';
        }, 100);

        // Animate out and remove
        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 3000);
    }

    setupBranding() {
        const branding = window.configLoader.get('branding', {});
        
        if (!branding.enabled) return;
        
        const header = document.getElementById('branding-header');
        if (!header) return;
        
        const leftSection = header.querySelector('.branding-left');
        const centerSection = header.querySelector('.branding-center');
        const rightSection = header.querySelector('.branding-right');
        
        // Clear existing content
        leftSection.innerHTML = '';
        centerSection.innerHTML = '';
        rightSection.innerHTML = '';
        
        // Add logo to left section
        if (branding.logoUrl) {
            const logo = document.createElement('img');
            logo.src = branding.logoUrl;
            logo.className = 'branding-logo';
            logo.alt = 'Organization Logo';
            logo.onerror = function() {
                this.style.display = 'none';
            };
            leftSection.appendChild(logo);
        }
        
        // Add quiz name to center section
        const quizName = window.configLoader.get('app.name', 'Kvíz');
        if (quizName) {
            const nameElement = document.createElement('div');
            nameElement.className = 'quiz-name';
            nameElement.textContent = quizName;
            centerSection.appendChild(nameElement);
        }
        
        // Add organizer info to right section
        if (branding.organizationName) {
            const orgContainer = document.createElement('div');
            
            const orgName = document.createElement('div');
            orgName.className = 'organizer-name';
            orgName.textContent = branding.organizationName;
            orgContainer.appendChild(orgName);
            
            // Add website link if provided
            if (branding.website) {
                const website = document.createElement('a');
                website.href = branding.website.startsWith('http') ? branding.website : `https://${branding.website}`;
                website.className = 'organizer-website';
                website.textContent = branding.website.replace(/^https?:\/\//, '');
                website.target = '_blank';
                website.rel = 'noopener noreferrer';
                orgContainer.appendChild(website);
            }
            
            rightSection.appendChild(orgContainer);
        }
        
        // Set custom background and text colors if provided
        if (branding.backgroundColor) {
            header.style.background = branding.backgroundColor;
        }
        if (branding.textColor) {
            header.style.color = branding.textColor;
        }
    }
    
    showBrandingHeader() {
        const branding = window.configLoader.get('branding', {});
        if (branding.enabled) {
            const header = document.getElementById('branding-header');
            if (header) {
                header.classList.add('visible');
            }
        }
    }
    
    hideBrandingHeader() {
        const header = document.getElementById('branding-header');
        if (header) {
            header.classList.remove('visible');
        }
    }
}

// Sample data generator for testing
function generateSampleTopic(theme) {
    const difficulties = ['Easy', 'Medium', 'Hard'];
    const questions = [];
    
    for (let i = 0; i < 5; i++) {
        const question = {
            question: window.configLoader.get('sample.questionTemplate', 'Ukázková otázka {number} o tématu {theme}?')
                .replace('{number}', i + 1).replace('{theme}', theme),
            answer: window.configLoader.get('sample.answerTemplate', 'Toto je odpověď na otázku {number}')
                .replace('{number}', i + 1),
            explanation: window.configLoader.get('sample.explanationTemplate', 'Toto vysvětlení poskytuje kontext a dodatečné informace o tom, proč je tato odpověď správná.'),
            source: window.configLoader.get('sample.sourceTemplate', 'Referenční kniha o tématu {theme}, Kapitola {number}')
                .replace('{theme}', theme).replace('{number}', i + 1),
            difficulty: difficulties[Math.floor(Math.random() * difficulties.length)]
        };
        
        // Add sample media to some questions for demonstration
        if (i === 1) {
            question.image = 'https://via.placeholder.com/400x300/4f46e5/ffffff?text=Ukázkový+Obrázek';
            question.question = window.configLoader.get('sample.imageQuestion', 'Co je zobrazeno na tomto obrázku?');
        }
        
        if (i === 3) {
            question.audio = 'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav';
            question.question = window.configLoader.get('sample.audioQuestion', 'Co slyšíte v této nahrávce?');
        }
        
        questions.push(question);
    }
    
    return {
        theme: theme,
        questions: questions
    };
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new QuizApp();
});