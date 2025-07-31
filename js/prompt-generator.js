// Split number function (copied from splitNumber.js for static HTML compatibility)
function splitNumber(total) {
    // Calculate exact values for 20%-60%-20%
    const exactHard = total * 0.2;
    const exactMedium = total * 0.6;
    const exactEasy = total * 0.2;
    
    // Get integer parts
    let hard = Math.floor(exactHard);
    let medium = Math.floor(exactMedium);
    let easy = Math.floor(exactEasy);
    
    // Calculate remainders
    const remainderHard = exactHard - hard;
    const remainderMedium = exactMedium - medium;
    const remainderEasy = exactEasy - easy;
    
    // Calculate units to distribute
    const currentSum = hard + medium + easy;
    const unitsToDistribute = total - currentSum;
    
    // Distribute extra units based on remainders, with hard taking priority over easy in ties
    const candidates = [
        { category: 'medium', remainder: remainderMedium },
        { category: 'hard', remainder: remainderHard },
        { category: 'easy', remainder: remainderEasy }
    ];
    
    // Sort by remainder (descending), hard beats easy in ties due to order
    candidates.sort((a, b) => {
        if (Math.abs(a.remainder - b.remainder) < 0.0001) {
            // In ties, hard (index 1) beats easy (index 2)
            if (a.category === 'hard' && b.category === 'easy') return -1;
            if (a.category === 'easy' && b.category === 'hard') return 1;
            return 0;
        }
        return b.remainder - a.remainder;
    });
    
    // Add extra units
    for (let i = 0; i < unitsToDistribute; i++) {
        const category = candidates[i].category;
        if (category === 'hard') hard++;
        else if (category === 'medium') medium++;
        else if (category === 'easy') easy++;
    }
    
    return {
        hard: hard,
        medium: medium,
        easy: easy
    };
}

// Prompt template based on prompt.txt
const PROMPT_TEMPLATE = `ÚKOL: Vytvoření kvízu na téma [TÉMA]
Vytvoř kvíz obsahující [POČET_OTÁZEK] otázek na téma [TÉMA]. Výstup musí být ve formátu JSON podle níže uvedeného schématu.
ROZLOŽENÍ OBTÍŽNOSTI:

[POČET_VELMI_LEHKÝCH] otázek (20%) - velmi lehké (90% lidí zná odpověď)
[POČET_STŘEDNÍCH] otázek (60%) - střední obtížnost (60% lidí zná odpověď)
[POČET_VELMI_TĚŽKÝCH] otázek (20%) - velmi těžké (10% lidí zná odpověď)

POŽADAVKY NA OTÁZKY:

Každá otázka musí být unikátní a nesmí se opakovat ani být podobná jiným otázkám
Otázky musí pokrývat různé aspekty tématu
Formulace otázek musí být jasná a jednoznačná
Každá otázka musí mít fakticky správnou odpověď podloženou spolehlivými zdroji
Otázky rozděluj rovnoměrně napříč různými podtématy

POŽADAVKY NA ODPOVĚDI:

Odpovědi musí být krátké: ideálně 1-3 slova
Výjimky: názvy, jména, pojmenování (mohou být delší)
Odpovědi nesmí být ve formě vět
Každá odpověď musí být jednoznačná a ověřitelná

HODNOTY PRO POLE "difficulty":

"velmi lehká" - pro otázky, které zná 90% lidí
"střední" - pro otázky, které zná 60% lidí
"velmi těžká" - pro otázky, které zná 10% lidí

JSON SCHÉMA PRO VÝSTUP:
\`\`\`json
{
  "type": "object",
  "properties": {
    "theme": {
      "type": "string"
    },
    "questions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "question": {
            "type": "string"
          },
          "answer": {
            "type": "string"
          },
          "explanation": {
            "type": "string"
          },
          "source": {
            "type": "string"
          },
          "difficulty": {
            "type": "string"
          }
        },
        "required": ["question", "answer", "explanation", "source", "difficulty"]
      }
    }
  },
  "required": ["theme", "questions"]
}
\`\`\`
PŘÍKLAD VÝSTUPU (pro téma "Česká republika" s 5 otázkami):
\`\`\`json
{
  "theme": "Česká republika",
  "questions": [
    {
      "question": "Jaké je hlavní město České republiky?",
      "answer": "Praha",
      "explanation": "Praha je hlavním a největším městem České republiky, leží na řece Vltavě.",
      "source": "Český statistický úřad",
      "difficulty": "velmi lehká"
    },
    {
      "question": "Kolik obyvatel má Česká republika?",
      "answer": "10,5 milionu",
      "explanation": "Podle posledního sčítání lidu má ČR přibližně 10,5 milionu obyvatel.",
      "source": "Český statistický úřad, 2021",
      "difficulty": "střední"
    },
    {
      "question": "Ve kterém roce byla založena Karlova univerzita?",
      "answer": "1348",
      "explanation": "Karlova univerzita byla založena Karlem IV. jako první univerzita ve střední Evropě.",
      "source": "Archiv Karlovy univerzity",
      "difficulty": "velmi těžká"
    }
  ]
}
\`\`\`
Vytvoř kvíz ve formátu JSON podle výše uvedeného schématu. Začni vytvářením otázek od nejlehčích po nejtěžší.`;

class PromptGenerator {
    constructor() {
        this.initializeElements();
        this.attachEventListeners();
        // Ensure initial calculation happens after elements are ready
        setTimeout(() => {
            this.calculateSplit();
            this.updateCalculations();
        }, 100);
    }

    initializeElements() {
        this.topicInput = document.getElementById('topic-input');
        this.questionCountInput = document.getElementById('question-count-input');
        this.easyInput = document.getElementById('easy-input');
        this.mediumInput = document.getElementById('medium-input');
        this.hardInput = document.getElementById('hard-input');
        this.totalQuestionsDisplay = document.getElementById('total-questions');
        this.sumDisplay = document.getElementById('sum-display');
        this.splitValidation = document.getElementById('split-validation');
        this.generatePromptBtn = document.getElementById('generate-prompt-btn');
        this.generatedPrompt = document.getElementById('generated-prompt');
        this.copyPromptBtn = document.getElementById('copy-prompt-btn');
        this.resetFormBtn = document.getElementById('reset-form-btn');

        // Check if all elements were found
        const elements = {
            topicInput: this.topicInput,
            questionCountInput: this.questionCountInput,
            easyInput: this.easyInput,
            mediumInput: this.mediumInput,
            hardInput: this.hardInput,
            totalQuestionsDisplay: this.totalQuestionsDisplay,
            sumDisplay: this.sumDisplay,
            splitValidation: this.splitValidation,
            generatePromptBtn: this.generatePromptBtn,
            generatedPrompt: this.generatedPrompt,
            copyPromptBtn: this.copyPromptBtn,
            resetFormBtn: this.resetFormBtn
        };

        for (const [name, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Element not found: ${name}`);
            }
        }
    }

    attachEventListeners() {
        // Auto-calculate split when question count changes
        this.questionCountInput.addEventListener('input', () => {
            this.calculateSplit();
            this.updateCalculations();
        });

        // Also listen for change and keyup events for better responsiveness
        this.questionCountInput.addEventListener('change', () => {
            this.calculateSplit();
            this.updateCalculations();
        });

        this.questionCountInput.addEventListener('keyup', () => {
            this.calculateSplit();
            this.updateCalculations();
        });

        // Update calculations when individual split values change
        [this.easyInput, this.mediumInput, this.hardInput].forEach(input => {
            input.addEventListener('input', () => {
                this.updateCalculations();
            });
            
            input.addEventListener('change', () => {
                this.updateCalculations();
            });
        });

        // Generate prompt
        this.generatePromptBtn.addEventListener('click', () => {
            this.generatePrompt();
        });

        // Copy to clipboard
        this.copyPromptBtn.addEventListener('click', () => {
            this.copyToClipboard();
        });

        // Reset form
        this.resetFormBtn.addEventListener('click', () => {
            this.resetForm();
        });

        // Enable generate button when topic is entered
        this.topicInput.addEventListener('input', () => {
            this.updateGenerateButtonState();
        });
    }

    calculateSplit() {
        if (!this.questionCountInput) {
            console.error('questionCountInput not found');
            return;
        }

        const total = parseInt(this.questionCountInput.value) || 0;
        
        if (total < 1) {
            if (this.easyInput) this.easyInput.value = 0;
            if (this.mediumInput) this.mediumInput.value = 0;
            if (this.hardInput) this.hardInput.value = 0;
            return;
        }

        // Use the splitNumber function
        const split = splitNumber(total);
        
        if (this.easyInput && this.mediumInput && this.hardInput) {
            this.easyInput.value = split.easy;
            this.mediumInput.value = split.medium;
            this.hardInput.value = split.hard;
        } else {
            console.error('One or more split input elements not found');
        }
    }

    updateCalculations() {
        const total = parseInt(this.questionCountInput.value) || 0;
        const easy = parseInt(this.easyInput.value) || 0;
        const medium = parseInt(this.mediumInput.value) || 0;
        const hard = parseInt(this.hardInput.value) || 0;
        const sum = easy + medium + hard;

        this.totalQuestionsDisplay.textContent = total;
        this.sumDisplay.textContent = sum;

        // Update validation styling
        if (sum === total && total > 0) {
            this.splitValidation.className = 'split-validation valid';
        } else if (sum !== total && total > 0) {
            this.splitValidation.className = 'split-validation invalid';
        } else {
            this.splitValidation.className = 'split-validation';
        }

        this.updateGenerateButtonState();
    }

    updateGenerateButtonState() {
        const topic = this.topicInput.value.trim();
        const total = parseInt(this.questionCountInput.value) || 0;
        const easy = parseInt(this.easyInput.value) || 0;
        const medium = parseInt(this.mediumInput.value) || 0;
        const hard = parseInt(this.hardInput.value) || 0;
        const sum = easy + medium + hard;

        const isValid = topic && total > 0 && sum === total;
        this.generatePromptBtn.disabled = !isValid;
    }

    generatePrompt() {
        const topic = this.topicInput.value.trim();
        const total = parseInt(this.questionCountInput.value) || 0;
        const easy = parseInt(this.easyInput.value) || 0;
        const medium = parseInt(this.mediumInput.value) || 0;
        const hard = parseInt(this.hardInput.value) || 0;

        if (!topic || total <= 0) {
            alert('Prosím vyplňte téma a počet otázek.');
            return;
        }

        const sum = easy + medium + hard;
        if (sum !== total) {
            alert('Součet obtížností se musí rovnat celkovému počtu otázek.');
            return;
        }

        // Replace placeholders in template
        const generatedPrompt = PROMPT_TEMPLATE
            .replace(/\[TÉMA\]/g, topic)
            .replace(/\[POČET_OTÁZEK\]/g, total.toString())
            .replace(/\[POČET_VELMI_LEHKÝCH\]/g, easy.toString())
            .replace(/\[POČET_STŘEDNÍCH\]/g, medium.toString())
            .replace(/\[POČET_VELMI_TĚŽKÝCH\]/g, hard.toString());

        this.generatedPrompt.value = generatedPrompt;
        this.copyPromptBtn.disabled = false;

        // Auto-scroll to the prompt
        this.generatedPrompt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.generatedPrompt.value);
            
            // Visual feedback
            const originalText = this.copyPromptBtn.innerHTML;
            this.copyPromptBtn.innerHTML = '✅ Zkopírováno!';
            this.copyPromptBtn.disabled = true;
            
            setTimeout(() => {
                this.copyPromptBtn.innerHTML = originalText;
                this.copyPromptBtn.disabled = false;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            
            // Fallback for older browsers
            this.generatedPrompt.select();
            document.execCommand('copy');
            
            const originalText = this.copyPromptBtn.innerHTML;
            this.copyPromptBtn.innerHTML = '✅ Zkopírováno!';
            setTimeout(() => {
                this.copyPromptBtn.innerHTML = originalText;
            }, 2000);
        }
    }

    resetForm() {
        if (confirm('Opravdu chcete vymazat všechny údaje?')) {
            this.topicInput.value = '';
            this.questionCountInput.value = '10';
            this.calculateSplit();
            this.updateCalculations();
            this.generatedPrompt.value = '';
            this.copyPromptBtn.disabled = true;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PromptGenerator();
}); 