// Configuration Loader for Quiz Application
// Configuration is embedded directly to work with file:// protocol

// CONFIGURATION DATA - Edit this object to customize your quiz
const EMBEDDED_CONFIG = {
  "app": {
    "name": "Vibe Kvíz",
    "subtitle": "Otestujte své znalosti napříč různými tématy",
    "title": "Vibe Kvíz - Otestujte své znalosti",
    "organizer": "Organizátor"
  },
  "branding": {
    "enabled": true,
    "logoUrl": "path-to-image.jpg",
    "organizationName": "TBD",
    "website": "example.com",
    "textColor": "var(--text-secondary)"
  },
  "ui": {
    "landing": {
      "topicSelection": "Vyberte témata",
      "uploadButton": "Nahrát JSON s tématy",
      "createTopicButton": "Vytvořit nové téma",
      "buildQuizButton": "Sestavit kvíz",
      "readyButton": "Připraveno"
    },
    "quizSetup": {
      "title": "Nastavení kvízu",
      "subtitle": "Vyberte výchozí bod pro spuštění kvízu",
      "topicLabel": "Začít od tématu:",
      "questionLabel": "Začít od otázky:",
      "timerLabel": "Čas na otázku (sekundy):",
      "backButton": "Zpět",
      "startButton": "Začít kvíz"
    },
    "quiz": {
      "topicInfo": "Připravte se na 5 otázek!",
      "topicContinueInfo": "Pokračování od otázky {questionNumber}. Zbývá {remainingQuestions} otázek.",
      "startTopicButton": "Začít téma",
      "startButton": "Začít",
      "continueButton": "Pokračovat",
      "nextQuestionButton": "Další otázka",
      "nextAnswerButton": "Další odpověď",
      "showAnswersButton": "Zobrazit odpovědi",
      "restartButton": "Nový kvíz",
      "skipButton": "Přeskočit otázku"
    },
    "screens": {
      "timesUp": {
        "title": "Čas vypršel!",
        "message": "Čas na tuto otázku vypršel."
      },
      "topicFinish": {
        "title": "Téma dokončeno!",
        "message": "Dokončili jste všech 5 otázek v tomto tématu."
      },
      "answersIntro": {
        "label": "Odpovědi k tématu",
        "info": "Zde jsou správné odpovědi"
      },
      "answerDisplay": {
        "questionLabel": "Otázka:",
        "answerLabel": "Správná odpověď:",
        "explanationLabel": "Vysvětlení:"
      },
      "complete": {
        "title": "Kvíz dokončen!",
        "message": "Gratulujeme k dokončení všech témat!",
        "questionsLabel": "Dokončené otázky",
        "topicsLabel": "Zvládnutá témata",
        "trophy": "🏆",
        "continueButton": "Pokračovat"
      },
      "thankYou": {
        "title": "Děkujeme za účast!",
        "message": "Děkujeme všem účastníkům za účast v kvízu. Doufáme, že jste si to užili!",
        "subtitle": "Kvíz můžete nyní zavřít."
      }
    },
    "rounds": [
      "První Kolo",
      "Druhé Kolo",
      "Třetí Kolo",
      "Čtvrté Kolo",
      "Páté Kolo",
      "Šesté Kolo",
      "Sedmé Kolo",
      "Osmé Kolo",
      "Deváté Kolo",
      "Desáté Kolo"
    ],
    "roundFallback": "Kolo",
    "rounds[0]": "První Kolo",
    "rounds[1]": "Druhé Kolo",
    "rounds[2]": "Třetí Kolo",
    "rounds[3]": "Čtvrté Kolo",
    "rounds[4]": "Páté Kolo",
    "rounds[5]": "Šesté Kolo",
    "rounds[6]": "Sedmé Kolo",
    "rounds[7]": "Osmé Kolo",
    "rounds[8]": "Deváté Kolo",
    "rounds[9]": "Desáté Kolo"
  },
  "messages": {
    "success": {
      "quizLoaded": "Úspěšně načten kvíz \"{name}\" s {count} tématy ze souboru {file}",
      "topicsLoaded": "Úspěšně načteno {count} témat ze souboru {file}",
      "fileDownloaded": "Soubor byl úspěšně stažen!",
      "fileLoaded": "Soubor byl úspěšně načten!",
      "quizDownloaded": "Kvíz byl úspěšně stažen!",
      "quizLoadedBuilder": "Kvíz byl úspěšně načten!",
      "topicsLoadedBuilder": "Načteno {count} témat",
      "itemMoved": "Položka byla přesunuta",
      "dataCleared": "Všechna data byla vymazána",
      "quizCleared": "Kvíz byl vymazán",
      "topicRemoved": "Téma bylo odstraněno",
      "questionRemoved": "Otázka byla odstraněna",
      "topicsReordered": "Pořadí témat bylo změněno"
    },
    "error": {
      "invalidJson": "Neplatná struktura JSON. Prosím zkontrolujte formát souboru.",
      "noValidTopics": "Žádná platná témata nebyla nalezena v souboru. Zkontrolujte formát JSON.",
      "jsonProcessingError": "Chyba při zpracování JSON souboru: {error}",
      "fileLoadError": "Chyba při načítání souboru: {error}",
      "quizLoadError": "Chyba při načítání kvízu: {error}",
      "filesLoadError": "{count} souborů se nepodařilo načíst",
      "minQuestionsRequired": "Téma musí mít alespoň 5 otázek"
    },
    "validation": {
      "enterThemeName": "Prosím zadejte název tématu",
      "addOneQuestion": "Prosím přidejte alespoň jednu otázku",
      "fillAllFields": "Prosím vyplňte všechna povinná pole (otázka, odpověď, vysvětlení) u všech otázek",
      "addOneTopic": "Prosím přidejte alespoň jedno téma",
      "addOneQuestionToTopic": "Prosím přidejte alespoň jednu otázku do některého tématu"
    }
  },
  "builders": {
    "topicBuilder": {
      "title": "Tvořič Témat",
      "subtitle": "Vytvořte vlastní kvízové téma s otázkami",
      "pageTitle": "Tvořič Témat - Kvízový Mistr",
      "sections": {
        "themeName": "Název tématu",
        "questions": "Otázky",
        "actions": "Akce",
        "preview": "Náhled JSON"
      },
      "buttons": {
        "addQuestion": "Přidat otázku",
        "download": "Stáhnout JSON",
        "load": "Načíst existující",
        "clear": "Vymazat vše",
        "buildQuiz": "Sestavit kvíz",
        "backToQuiz": "Zpět na kvíz"
      },
      "placeholders": {
        "themeName": "Zadejte název tématu..."
      }
    },
    "quizBuilder": {
      "title": "Stavitel Kvízů",
      "subtitle": "Vytvořte kompletní kvíz s více tématy",
      "pageTitle": "Stavitel Kvízů - Kvízový Mistr",
      "sections": {
        "quizInfo": "Informace o kvízu",
        "topics": "Témata kvízu",
        "actions": "Akce",
        "preview": "Náhled JSON kvízu"
      },
      "labels": {
        "quizName": "Název kvízu:",
        "description": "Popis:",
        "topicsCount": "témat",
        "questionsCount": "otázek celkem"
      },
      "buttons": {
        "loadTopics": "Načíst témata",
        "downloadQuiz": "Stáhnout kvíz",
        "loadQuiz": "Načíst kvíz",
        "clearQuiz": "Vymazat vše",
        "createTopic": "Vytvořit téma",
        "backToQuiz": "Zpět na kvíz"
      },
      "placeholders": {
        "quizName": "Zadejte název kvízu...",
        "description": "Krátký popis kvízu..."
      }
    }
  },
  "sample": {
    "questionTemplate": "Ukázková otázka {number} o tématu {theme}?",
    "answerTemplate": "Toto je odpověď na otázku {number}",
    "explanationTemplate": "Toto vysvětlení poskytuje kontext a dodatečné informace o tom, proč je tato odpověď správná.",
    "sourceTemplate": "Referenční kniha o tématu {theme}, Kapitola {number}",
    "imageQuestion": "Co je zobrazeno na tomto obrázku?",
    "audioQuestion": "Co slyšíte v této nahrávce?",
    "themes": [
      "Věda",
      "Historie",
      "Zeměpis",
      "Literatura",
      "Technologie"
    ],
    "themes[0]": "Věda",
    "themes[1]": "Historie",
    "themes[2]": "Zeměpis",
    "themes[3]": "Literatura",
    "themes[4]": "Technologie"
  }
};

class ConfigLoader {
    constructor() {
        this.config = null;
        this.loaded = false;
    }

    async loadConfig() {
        if (this.loaded) return this.config;
        
        // Use embedded configuration directly
        this.config = EMBEDDED_CONFIG;
        this.loaded = true;
        
        // Apply configuration to the page immediately
        this.applyPageConfig();
        
        return this.config;
    }

    applyPageConfig() {
        if (!this.config) return;

        // Update page title
        const titleElement = document.querySelector('title');
        if (titleElement) {
            titleElement.textContent = this.config.app.title;
        }

        // Update main title and subtitle if they exist
        const mainTitle = document.querySelector('.main-title');
        if (mainTitle) {
            let titleText = this.config.app.name;
            if (this.config.app.organizer) {
                titleText += ` - ${this.config.app.organizer}`;
            }
            mainTitle.textContent = titleText;
        }

        const subtitle = document.querySelector('.subtitle');
        if (subtitle) {
            subtitle.textContent = this.config.app.subtitle;
        }

        // Update all elements with data-config attributes
        this.updateConfigElements();
    }

    updateConfigElements() {
        const configElements = document.querySelectorAll('[data-config]');
        configElements.forEach(element => {
            const configPath = element.getAttribute('data-config');
            const configValue = this.get(configPath);
            if (configValue) {
                element.textContent = configValue;
            }
        });
    }

    get(path, fallback = '') {
        if (!this.config) return fallback;
        
        const keys = path.split('.');
        let current = this.config;
        
        for (const key of keys) {
            if (current && typeof current === 'object' && key in current) {
                current = current[key];
            } else {
                return fallback;
            }
        }
        
        return current;
    }

    getMessage(category, key, replacements = {}) {
        const message = this.get(`messages.${category}.${key}`, key);
        
        // Replace placeholders in the message
        let result = message;
        for (const [placeholder, value] of Object.entries(replacements)) {
            result = result.replace(new RegExp(`\\{${placeholder}\\}`, 'g'), value);
        }
        
        return result;
    }

    getRoundName(roundNumber) {
        const rounds = this.get('ui.rounds', []);
        const fallback = this.get('ui.roundFallback', 'Kolo');
        
        if (roundNumber <= rounds.length) {
            return rounds[roundNumber - 1];
        } else {
            return `${fallback} ${roundNumber}`;
        }
    }

    getDefaultConfig() {
        // Return the embedded configuration as default
        return EMBEDDED_CONFIG;
    }
}

// Create global instance
window.configLoader = new ConfigLoader();

// Auto-load configuration when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    await window.configLoader.loadConfig();
}); 