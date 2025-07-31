// Quiz Builder JavaScript

class QuizBuilder {
    constructor() {
        this.quiz = {
            name: '',
            description: '',
            topics: []
        };
        this.dragState = {
            draggedElement: null,
            draggedType: null, // 'topic' or 'question'
            draggedIndex: null,
            draggedTopicIndex: null,
            dropTarget: null
        };
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderEmptyState();
        this.updatePreview();
        this.updateStats();
    }

    bindEvents() {
        // Quiz info inputs
        document.getElementById('quiz-name').addEventListener('input', () => {
            this.quiz.name = document.getElementById('quiz-name').value;
            this.updatePreview();
            this.updateDownloadButton();
        });

        document.getElementById('quiz-description').addEventListener('input', () => {
            this.quiz.description = document.getElementById('quiz-description').value;
            this.updatePreview();
        });

        // Topic loading
        document.getElementById('load-topics-btn').addEventListener('click', () => {
            document.getElementById('topics-file-input').click();
        });

        document.getElementById('topics-file-input').addEventListener('change', (e) => {
            this.loadTopics(e.target.files);
        });

        // Quiz loading
        document.getElementById('load-quiz-btn').addEventListener('click', () => {
            document.getElementById('quiz-file-input').click();
        });

        document.getElementById('quiz-file-input').addEventListener('change', (e) => {
            this.loadQuiz(e.target.files[0]);
        });

        // Download quiz
        document.getElementById('download-quiz-btn').addEventListener('click', () => {
            this.downloadQuiz();
        });

        // Clear quiz
        document.getElementById('clear-quiz-btn').addEventListener('click', () => {
            this.clearQuiz();
        });

        // Drag and drop events
        this.bindDragEvents();
    }

    bindDragEvents() {
        document.addEventListener('dragstart', (e) => this.handleDragStart(e));
        document.addEventListener('dragover', (e) => this.handleDragOver(e));
        document.addEventListener('drop', (e) => this.handleDrop(e));
        document.addEventListener('dragend', (e) => this.handleDragEnd(e));
    }

    async loadTopics(files) {
        if (!files || files.length === 0) return;

        const loadingCount = files.length;
        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            try {
                const text = await file.text();
                const data = JSON.parse(text);

                // Validate topic structure
                if (!data.theme || !Array.isArray(data.questions)) {
                    throw new Error(`Neplatný formát souboru ${file.name}`);
                }

                // Add topic to quiz
                this.quiz.topics.push(data);
                successCount++;

            } catch (error) {
                console.error('Error loading topic:', error);
                errorCount++;
            }
        }

        // Clear file input
        document.getElementById('topics-file-input').value = '';

        // Show result message
        if (successCount > 0) {
            this.showMessage(`✅ Načteno ${successCount} témat`, 'success');
            this.renderTopics();
            this.updatePreview();
            this.updateStats();
            this.updateDownloadButton();
        }

        if (errorCount > 0) {
            this.showMessage(`❌ ${errorCount} souborů se nepodařilo načíst`, 'error');
        }
    }

    renderTopics() {
        const container = document.getElementById('topics-container');
        
        if (this.quiz.topics.length === 0) {
            this.renderEmptyState();
            return;
        }

        container.innerHTML = '';

        this.quiz.topics.forEach((topic, index) => {
            const topicElement = this.createTopicElement(topic, index);
            container.appendChild(topicElement);
        });
    }

    createTopicElement(topic, index) {
        const div = document.createElement('div');
        div.className = 'topic-item drop-zone';
        div.draggable = true;
        div.dataset.topicIndex = index;
        div.dataset.dragType = 'topic';

        div.innerHTML = `
            <div class="topic-header" onclick="quizBuilder.toggleTopic(${index})">
                <div class="topic-info">
                    <div class="topic-drag-handle" draggable="true" onclick="event.stopPropagation()">
                        ⋮⋮
                    </div>
                    <span class="topic-number">${index + 1}</span>
                    <h3 class="topic-title">${this.escapeHtml(topic.theme)}</h3>
                    <div class="topic-meta">
                        <span>${topic.questions.length} otázek</span>
                    </div>
                </div>
                <div class="topic-actions">
                    <button class="topic-expand-btn" onclick="event.stopPropagation(); quizBuilder.toggleTopic(${index})">
                        ▼
                    </button>
                    <button class="remove-topic-btn" onclick="event.stopPropagation(); quizBuilder.removeTopic(${index})">
                        🗑️ Odstranit
                    </button>
                </div>
            </div>
            <div class="topic-content">
                <div class="questions-list">
                    ${this.renderQuestions(topic.questions, index)}
                </div>
            </div>
        `;

        return div;
    }

    renderQuestions(questions, topicIndex) {
        if (questions.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">❓</div>
                    <div class="empty-state-text">Toto téma nemá žádné otázky</div>
                </div>
            `;
        }

        return questions.map((question, index) => `
            <div class="question-item drop-zone" draggable="true" 
                 data-topic-index="${topicIndex}" 
                 data-question-index="${index}" 
                 data-drag-type="question">
                <div class="question-header" onclick="quizBuilder.toggleQuestion(${topicIndex}, ${index})">
                    <div class="question-drag-handle" draggable="true" onclick="event.stopPropagation()">
                        ⋮
                    </div>
                    <p class="question-text-preview">${this.escapeHtml(question.question)}</p>
                    <div class="question-header-actions">
                        <div class="media-indicators">
                            ${question.image ? '<span class="media-indicator image-indicator" title="Obsahuje obrázek">🖼️</span>' : ''}
                            ${question.audio ? '<span class="media-indicator audio-indicator" title="Obsahuje zvuk">🔊</span>' : ''}
                        </div>
                        <button class="question-expand-btn" onclick="event.stopPropagation(); quizBuilder.toggleQuestion(${topicIndex}, ${index})">
                            ▼
                        </button>
                        <button class="remove-question-btn" onclick="event.stopPropagation(); quizBuilder.removeQuestion(${topicIndex}, ${index})" 
                                title="Odstranit otázku" ${questions.length <= 5 ? 'disabled' : ''}>
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="question-details">
                    <div class="question-detail-item">
                        <div class="question-detail-label">Odpověď:</div>
                        <p class="question-detail-text">${this.escapeHtml(question.answer)}</p>
                    </div>
                    <div class="question-detail-item">
                        <div class="question-detail-label">Vysvětlení:</div>
                        <p class="question-detail-text">${this.escapeHtml(question.explanation)}</p>
                    </div>
                    <div class="question-detail-item">
                        <div class="question-detail-label">Zdroj:</div>
                        <p class="question-detail-text">${this.escapeHtml(question.source)}</p>
                    </div>
                    <div class="question-detail-item">
                        <div class="question-detail-label">Obtížnost:</div>
                        <span class="difficulty-badge ${question.difficulty.replace(/\s+/g, '-').replace(/ě/g, 'e').replace(/í/g, 'i').replace(/á/g, 'a').replace(/ž/g, 'z')}">${question.difficulty}</span>
                    </div>
                    ${question.image || question.audio ? `
                        <div class="question-detail-item">
                            <div class="question-detail-label">Média:</div>
                            <div class="media-details">
                                ${question.image ? `
                                    <div class="media-item">
                                        <span class="media-type">🖼️ Obrázek:</span>
                                        <a href="${question.image}" target="_blank" class="media-link">${question.image.length > 50 ? question.image.substring(0, 50) + '...' : question.image}</a>
                                    </div>
                                ` : ''}
                                ${question.audio ? `
                                    <div class="media-item">
                                        <span class="media-type">🔊 Audio:</span>
                                        <a href="${question.audio}" target="_blank" class="media-link">${question.audio.length > 50 ? question.audio.substring(0, 50) + '...' : question.audio}</a>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    toggleTopic(index) {
        const topicElement = document.querySelector(`[data-topic-index="${index}"][data-drag-type="topic"]`);
        const header = topicElement.querySelector('.topic-header');
        const content = topicElement.querySelector('.topic-content');
        const expandBtn = topicElement.querySelector('.topic-expand-btn');

        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            content.classList.remove('expanded');
            header.classList.remove('expanded');
            expandBtn.classList.remove('expanded');
        } else {
            content.classList.add('expanded');
            header.classList.add('expanded');
            expandBtn.classList.add('expanded');
        }
    }

    toggleQuestion(topicIndex, questionIndex) {
        // First, ensure the topic is expanded
        const topicElement = document.querySelector(`[data-topic-index="${topicIndex}"][data-drag-type="topic"]`);
        const topicContent = topicElement.querySelector('.topic-content');
        const topicHeader = topicElement.querySelector('.topic-header');
        const topicExpandBtn = topicElement.querySelector('.topic-expand-btn');
        
        if (!topicContent.classList.contains('expanded')) {
            topicContent.classList.add('expanded');
            topicHeader.classList.add('expanded');
            topicExpandBtn.classList.add('expanded');
        }

        // Then toggle the question
        const questionElement = document.querySelector(`[data-topic-index="${topicIndex}"][data-question-index="${questionIndex}"]`);
        const details = questionElement.querySelector('.question-details');
        const expandBtn = questionElement.querySelector('.question-expand-btn');

        const isExpanded = details.classList.contains('expanded');
        
        if (isExpanded) {
            details.classList.remove('expanded');
            expandBtn.classList.remove('expanded');
            questionElement.classList.remove('expanded');
        } else {
            details.classList.add('expanded');
            expandBtn.classList.add('expanded');
            questionElement.classList.add('expanded');
        }
    }

    // Drag and Drop functionality
    handleDragStart(e) {
        const element = e.target.closest('[data-drag-type]');
        if (!element) return;

        this.dragState.draggedElement = element;
        this.dragState.draggedType = element.dataset.dragType;

        if (this.dragState.draggedType === 'topic') {
            this.dragState.draggedIndex = parseInt(element.dataset.topicIndex);
            element.classList.add('dragging');
        } else if (this.dragState.draggedType === 'question') {
            this.dragState.draggedTopicIndex = parseInt(element.dataset.topicIndex);
            this.dragState.draggedIndex = parseInt(element.dataset.questionIndex);
            element.classList.add('dragging');
        }

        e.dataTransfer.effectAllowed = 'move';
    }

    handleDragOver(e) {
        e.preventDefault();
        
        const dropZone = e.target.closest('.drop-zone');
        if (!dropZone || dropZone === this.dragState.draggedElement) return;

        // Remove previous drag-over effects
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

        // Only allow dropping questions within the same topic
        if (this.dragState.draggedType === 'question') {
            const targetTopicIndex = parseInt(dropZone.dataset.topicIndex);
            if (targetTopicIndex !== this.dragState.draggedTopicIndex) {
                e.dataTransfer.dropEffect = 'none';
                return;
            }
        }

        e.dataTransfer.dropEffect = 'move';
        dropZone.classList.add('drag-over');
        this.dragState.dropTarget = dropZone;
    }

    handleDrop(e) {
        e.preventDefault();
        
        if (!this.dragState.dropTarget || !this.dragState.draggedElement) return;

        const dropZone = this.dragState.dropTarget;
        let moveSuccessful = false;

        // Store expanded states before re-rendering
        const expandedTopics = this.getExpandedStates();

        if (this.dragState.draggedType === 'topic') {
            moveSuccessful = this.handleTopicDrop(dropZone);
        } else if (this.dragState.draggedType === 'question') {
            moveSuccessful = this.handleQuestionDrop(dropZone);
        }

        if (moveSuccessful) {
            this.renderTopics();
            this.restoreExpandedStates(expandedTopics);
            this.updatePreview();
            this.showMessage('✅ Položka byla přesunuta', 'success');
        }
    }

    getExpandedStates() {
        const states = {
            topics: [],
            questions: []
        };

        // Get expanded topics
        document.querySelectorAll('[data-drag-type="topic"]').forEach((topic, index) => {
            const content = topic.querySelector('.topic-content');
            states.topics[index] = content && content.classList.contains('expanded');
        });

        // Get expanded questions
        document.querySelectorAll('[data-drag-type="question"]').forEach(question => {
            const topicIndex = parseInt(question.dataset.topicIndex);
            const questionIndex = parseInt(question.dataset.questionIndex);
            const details = question.querySelector('.question-details');
            
            if (!states.questions[topicIndex]) {
                states.questions[topicIndex] = [];
            }
            states.questions[topicIndex][questionIndex] = details && details.classList.contains('expanded');
        });

        return states;
    }

    restoreExpandedStates(states) {
        // Restore topic states
        states.topics.forEach((isExpanded, index) => {
            if (isExpanded) {
                const topicElement = document.querySelector(`[data-topic-index="${index}"][data-drag-type="topic"]`);
                if (topicElement) {
                    const header = topicElement.querySelector('.topic-header');
                    const content = topicElement.querySelector('.topic-content');
                    const expandBtn = topicElement.querySelector('.topic-expand-btn');
                    
                    content.classList.add('expanded');
                    header.classList.add('expanded');
                    expandBtn.classList.add('expanded');
                }
            }
        });

        // Restore question states
        states.questions.forEach((questions, topicIndex) => {
            if (questions) {
                questions.forEach((isExpanded, questionIndex) => {
                    if (isExpanded) {
                        const questionElement = document.querySelector(`[data-topic-index="${topicIndex}"][data-question-index="${questionIndex}"]`);
                        if (questionElement) {
                            const details = questionElement.querySelector('.question-details');
                            const expandBtn = questionElement.querySelector('.question-expand-btn');
                            
                            details.classList.add('expanded');
                            expandBtn.classList.add('expanded');
                            questionElement.classList.add('expanded');
                        }
                    }
                });
            }
        });
    }

    handleTopicDrop(dropZone) {
        const targetIndex = parseInt(dropZone.dataset.topicIndex);
        const sourceIndex = this.dragState.draggedIndex;

        if (sourceIndex === targetIndex) return false;

        // Move topic
        const topic = this.quiz.topics.splice(sourceIndex, 1)[0];
        this.quiz.topics.splice(targetIndex, 0, topic);
        return true;
    }

    handleQuestionDrop(dropZone) {
        const targetTopicIndex = parseInt(dropZone.dataset.topicIndex);
        const targetQuestionIndex = parseInt(dropZone.dataset.questionIndex || 0);
        const sourceTopicIndex = this.dragState.draggedTopicIndex;
        const sourceQuestionIndex = this.dragState.draggedIndex;

        if (sourceTopicIndex !== targetTopicIndex) return false; // Prevent cross-topic moves

        if (sourceQuestionIndex === targetQuestionIndex) return false;

        // Move question within topic
        const topic = this.quiz.topics[sourceTopicIndex];
        const question = topic.questions.splice(sourceQuestionIndex, 1)[0];
        topic.questions.splice(targetQuestionIndex, 0, question);
        return true;
    }

    handleDragEnd(e) {
        // Clean up drag state
        document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
        document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
        
        this.dragState = {
            draggedElement: null,
            draggedType: null,
            draggedIndex: null,
            draggedTopicIndex: null,
            dropTarget: null
        };
    }

    renderEmptyState() {
        const container = document.getElementById('topics-container');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <div class="empty-state-text">Zatím nemáte žádná témata v kvízu</div>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem; text-align: center;">
                    Načtěte existující témata nebo vytvořte nová v Tvořiči témat
                </p>
                <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 1rem;">
                    <button class="btn-secondary" onclick="document.getElementById('topics-file-input').click()">
                        📁 Načíst témata
                    </button>
                    <a href="topic-builder.html" class="btn-secondary" style="text-decoration: none; display: inline-block;">
                        ✏️ Vytvořit téma
                    </a>
                </div>
            </div>
        `;
    }

    updateStats() {
        const topicsCount = this.quiz.topics.length;
        const questionsCount = this.quiz.topics.reduce((total, topic) => total + topic.questions.length, 0);

        document.getElementById('topics-count').textContent = topicsCount;
        document.getElementById('questions-count').textContent = questionsCount;
    }

    updatePreview() {
        const preview = document.getElementById('json-preview');
        
        // Create final quiz structure
        const quizData = {
            quiz: {
                name: this.quiz.name || 'Nový kvíz',
                description: this.quiz.description || '',
                topics: this.quiz.topics
            }
        };

        preview.textContent = JSON.stringify(quizData, null, 2);
    }

    updateDownloadButton() {
        const downloadBtn = document.getElementById('download-quiz-btn');
        const hasTopics = this.quiz.topics.length > 0;
        const hasQuestions = this.quiz.topics.some(topic => topic.questions.length > 0);

        downloadBtn.disabled = !hasTopics || !hasQuestions;
    }

    downloadQuiz() {
        if (this.quiz.topics.length === 0) {
            alert('Prosím přidejte alespoň jedno téma');
            return;
        }

        const hasQuestions = this.quiz.topics.some(topic => topic.questions.length > 0);
        if (!hasQuestions) {
            alert('Prosím přidejte alespoň jednu otázku do některého tématu');
            return;
        }

        const quizData = {
            quiz: {
                name: this.quiz.name || 'Nový kvíz',
                description: this.quiz.description || '',
                topics: this.quiz.topics
            }
        };

        const jsonString = JSON.stringify(quizData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${(this.quiz.name || 'novy-kviz').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('✅ Kvíz byl úspěšně stažen!', 'success');
    }

    async loadQuiz(file) {
        if (!file) return;

        try {
            const text = await file.text();
            const data = JSON.parse(text);

            // Validate quiz structure
            if (!data.quiz || !data.quiz.topics || !Array.isArray(data.quiz.topics)) {
                throw new Error('Neplatný formát kvízu');
            }

            // Load quiz data
            this.quiz.name = data.quiz.name || '';
            this.quiz.description = data.quiz.description || '';
            this.quiz.topics = data.quiz.topics;

            // Update UI
            document.getElementById('quiz-name').value = this.quiz.name;
            document.getElementById('quiz-description').value = this.quiz.description;

            this.renderTopics();
            this.updatePreview();
            this.updateStats();
            this.updateDownloadButton();

            this.showMessage('✅ Kvíz byl úspěšně načten!', 'success');

        } catch (error) {
            console.error('Error loading quiz:', error);
            this.showMessage('❌ Chyba při načítání kvízu: ' + error.message, 'error');
        }

        // Clear file input
        document.getElementById('quiz-file-input').value = '';
    }

    clearQuiz() {
        if (this.quiz.topics.length === 0 && !this.quiz.name && !this.quiz.description) {
            return;
        }

        if (confirm('Opravdu chcete vymazat celý kvíz? Tato akce je nevratná.')) {
            this.quiz = {
                name: '',
                description: '',
                topics: []
            };

            document.getElementById('quiz-name').value = '';
            document.getElementById('quiz-description').value = '';

            this.renderEmptyState();
            this.updatePreview();
            this.updateStats();
            this.updateDownloadButton();

            this.showMessage('🗑️ Kvíz byl vymazán', 'info');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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

    removeTopic(index) {
        if (confirm(`Opravdu chcete odstranit téma "${this.quiz.topics[index].theme}"?`)) {
            this.quiz.topics.splice(index, 1);
            this.renderTopics();
            this.updatePreview();
            this.updateStats();
            this.updateDownloadButton();

            this.showMessage('🗑️ Téma bylo odstraněno', 'info');
        }
    }

    removeQuestion(topicIndex, questionIndex) {
        const topic = this.quiz.topics[topicIndex];
        
        if (topic.questions.length <= 5) {
            this.showMessage('❌ Téma musí mít alespoň 5 otázek', 'error');
            return;
        }

        const question = topic.questions[questionIndex];
        const questionPreview = question.question.substring(0, 50) + (question.question.length > 50 ? '...' : '');
        
        if (confirm(`Opravdu chcete odstranit otázku: "${questionPreview}"?`)) {
            // Store expanded states before re-rendering
            const expandedStates = this.getExpandedStates();
            
            topic.questions.splice(questionIndex, 1);
            this.renderTopics();
            this.restoreExpandedStates(expandedStates);
            this.updatePreview();
            this.updateStats();
            this.updateDownloadButton();

            this.showMessage('🗑️ Otázka byla odstraněna', 'info');
        }
    }
}

// Initialize the quiz builder
const quizBuilder = new QuizBuilder();

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to download
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (!document.getElementById('download-quiz-btn').disabled) {
            quizBuilder.downloadQuiz();
        }
    }
    
    // Ctrl/Cmd + O to load topics
    if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        document.getElementById('topics-file-input').click();
    }
});

// Auto-save functionality
function autoSave() {
    const data = {
        quiz: quizBuilder.quiz,
        timestamp: Date.now()
    };
    
    try {
        localStorage.setItem('quizBuilder_autosave', JSON.stringify(data));
    } catch (e) {
        console.warn('Could not save to localStorage:', e);
    }
}

// Auto-save every 30 seconds
setInterval(autoSave, 30000);

// Load autosave on page load
window.addEventListener('load', () => {
    try {
        const autosave = localStorage.getItem('quizBuilder_autosave');
        if (autosave) {
            const data = JSON.parse(autosave);
            const timeDiff = Date.now() - data.timestamp;
            
            // Only restore if autosave is less than 24 hours old
            if (timeDiff < 24 * 60 * 60 * 1000) {
                if (data.quiz.topics.length > 0 || data.quiz.name || data.quiz.description) {
                    if (confirm('Byla nalezena automaticky uložená data kvízu. Chcete je obnovit?')) {
                        quizBuilder.quiz = data.quiz;
                        document.getElementById('quiz-name').value = data.quiz.name || '';
                        document.getElementById('quiz-description').value = data.quiz.description || '';
                        quizBuilder.renderTopics();
                        quizBuilder.updatePreview();
                        quizBuilder.updateStats();
                        quizBuilder.updateDownloadButton();
                    }
                }
            }
        }
    } catch (e) {
        console.warn('Could not load autosave:', e);
    }
});

// Clear autosave when leaving page
window.addEventListener('beforeunload', () => {
    try {
        localStorage.removeItem('quizBuilder_autosave');
    } catch (e) {
        console.warn('Could not clear autosave:', e);
    }
}); 