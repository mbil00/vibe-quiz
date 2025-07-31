# 🎨 Theme Designer - Návrhář Témat

Kompletní návod pro přizpůsobení vzhledu kvízové aplikace.

## 📋 Obsah

1. [Přehled](#přehled)
2. [Jak začít](#jak-začít)
3. [Použití návrháře témat](#použití-návrháře-témat)
4. [Ukládání a načítání témat](#ukládání-a-načítání-témat)
5. [Ručním způsobem - úprava CSS](#ručním-způsobem---úprava-css)
6. [Předvolená témata](#předvolená-témata)
7. [Technické detaily](#technické-detaily)

## 📖 Přehled

Theme Designer je nástroj, který umožňuje snadno přizpůsobit vzhled kvízové aplikace bez nutnosti znalosti programování. Všechny barvy, fonty a styly můžete upravit pomocí intuitivního rozhraní.

### Klíčové funkce:
- 🎨 **Vizuální editor** - Přizpůsobte barvy pomocí color pickerů
- 👀 **Živý náhled** - Vidíte změny okamžitě
- 💾 **Ukládání témat** - Exportujte a importujte vlastní témata
- 🎯 **Předvolby** - 6 připravených témat k okamžitému použití
- 📱 **Responsivní** - Funguje na všech zařízeních
- 🔄 **Offline** - Funguje bez internetového připojení
- 🏷️ **Kompletní integrace** - Ovlivňuje všechny prvky včetně branding hlavičky

## 🚀 Jak začít

### 1. Otevření návrháře témat

Máte několik možností:

**A) Z hlavní stránky:**
1. Otevřete `index.html` v prohlížeči
2. Klikněte na tlačítko "🎨 Návrhář témat"

**B) Přímo:**
1. Otevřete `theme-designer.html` v prohlížeči

### 2. První kroky

1. **Vyberte předvolbu** - Začněte s jedním z připravených témat
2. **Upravte barvy** - Použijte color pickery pro změnu barev
3. **Zkontrolujte náhled** - Prohlédněte si změny v reálném čase
4. **Uložte téma** - Stáhněte si .css soubor s vaším tématem

## 🎨 Použití návrháře témat

### Ovládací panel (levá strana)

#### 📝 Informace o tématu
- **Název tématu**: Pojmenujte si své téma
- **Autor**: Vaše jméno nebo název organizace
- **Popis**: Krátký popis tématu

#### 🎨 Hlavní barvy
- **Primární barva**: Hlavní barva aplikace (tlačítka, odkazy)
- **Sekundární barva**: Doplňková barva (gradienty, zvýraznění)

#### 🎯 Stavové barvy
- **Úspěch**: Barva pro úspěšné akce (zelená)
- **Nebezpečí**: Barva pro chyby a odstranění (červená)
- **Varování**: Barva pro upozornění (oranžová)

#### 🌗 Pozadí a texty
- **Tmavé pozadí**: Hlavní barva pozadí
- **Světlé pozadí**: Světlejší odstín pozadí
- **Hlavní text**: Barva pro nadpisy a důležitý text
- **Vedlejší text**: Barva pro popisky a pomocný text
- **Ohraničení**: Barva pro rámečky a oddělovače

#### ⚙️ Předvolby
Rychlé přepínání mezi připravenými tématy:
- 🌙 **Výchozí tmavé** - Původní modrý design
- ☀️ **Světlé** - Světlý režim pro lepší čitelnost
- 🌊 **Oceán** - Oceánské modré tóny
- 🌲 **Les** - Přírodní zelené barvy
- 🌅 **Západ slunce** - Teplé oranžové barvy
- 🌌 **Půlnoc** - Temné téma s fialovou

### Náhled (pravá strana)

#### 👀 Živý náhled
Ukazuje, jak bude aplikace vypadat s vašimi změnami:
- Ukázka hlavní stránky
- Příklad otázky
- Ukázka všech typů tlačítek

#### 📄 Generovaný CSS
Zobrazuje kompletní CSS kód vašeho tématu, který můžete zkopírovat.

## 💾 Ukládání a načítání témat

### Uložení tématu

1. **Automatické ukládání**: Všechny změny se automaticky ukládají do prohlížeče
2. **Export do souboru**: Klikněte na "💾 Uložit téma" - stáhne se .css soubor

### Načtení tématu

1. Klikněte na "📁 Načíst téma"
2. Vyberte .css soubor s tématem
3. Téma se automaticky načte a aplikuje

### Použití tématu v aplikaci

1. **Automaticky**: Téma se použije okamžitě pro aktuální relaci
2. **Trvale**: Nahraďte soubor `theme.css` svým exportovaným souborem

## ✏️ Ručním způsobem - úprava CSS

Pro pokročilé uživatele je možné upravovat téma přímo:

### 1. Úprava theme.css

```css
:root {
    /* Vaše vlastní barvy */
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --success-color: #48bb78;
    /* ... další proměnné */
}
```

### 2. Vytvoření nového tématu

```css
/* Theme Variables - Moje téma */
/* Author: Vaše jméno */
/* Description: Popis tématu */
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    /* ... další barvy */
}
```

### 3. Náhrada souboru

1. Vytvořte nový .css soubor s tématem
2. Nahraďte `theme.css` svým souborem
3. Obnovte stránku

## 🎨 Předvolená témata

### 🌙 Výchozí tmavé
- **Primární**: #667eea (modrá)
- **Pozadí**: #1a202c → #2d3748 (tmavě šedá)
- **Použití**: Univerzální tmavý design

### ☀️ Světlé
- **Primární**: #4299e1 (světle modrá)
- **Pozadí**: #f7fafc → #edf2f7 (světle šedá)
- **Použití**: Pro lepší čitelnost v světlém prostředí

### 🌊 Oceán
- **Primární**: #0ea5e9 (oceánská modrá)
- **Pozadí**: #0c4a6e → #075985 (tmavě modrá)
- **Použití**: Profesionální modrý design

### 🌲 Les
- **Primární**: #059669 (zelená)
- **Pozadí**: #064e3b → #065f46 (tmavě zelená)
- **Použití**: Přírodní, uklidňující design

### 🌅 Západ slunce
- **Primární**: #f59e0b (oranžová)
- **Pozadí**: #7c2d12 → #9a3412 (tmavě oranžová)
- **Použití**: Teplý, energický design

### 🌌 Půlnoc
- **Primární**: #8b5cf6 (fialová)
- **Pozadí**: #1e1b4b → #312e81 (tmavě fialová)
- **Použití**: Elegantní, moderní design

## 🔧 Technické detaily

### Struktura souborů

```
/
├── theme.css              # Aktuální téma
├── theme-designer.html    # Návrhář témat
├── theme-designer.css     # Styly návrháře
├── theme-designer.js      # Logika návrháře
├── themes/               # Složka s ukázkovými tématy
│   └── ocean-blue.css    # Příklad tématu
├── styles.css            # Hlavní styly aplikace
└── index.html            # Hlavní stránka
```

### CSS proměnné

Aplikace používá CSS Custom Properties (proměnné):

```css
:root {
    --primary-color: #667eea;      /* Hlavní barva */
    --secondary-color: #764ba2;    /* Vedlejší barva */
    --success-color: #48bb78;      /* Úspěch */
    --danger-color: #f56565;       /* Nebezpečí */
    --warning-color: #ed8936;      /* Varování */
    --dark-bg: #1a202c;            /* Tmavé pozadí */
    --light-bg: #2d3748;           /* Světlé pozadí */
    --text-primary: #ffffff;       /* Hlavní text */
    --text-secondary: #a0aec0;     /* Vedlejší text */
    --border-color: #4a5568;       /* Ohraničení */
}
```

### Kompatibilita

- ✅ **Chrome/Edge**: Plná podpora
- ✅ **Firefox**: Plná podpora  
- ✅ **Safari**: Plná podpora
- ✅ **Mobilní prohlížeče**: Plná podpora
- ⚠️ **Internet Explorer**: Nepodporováno (CSS proměnné)

### Lokální úložiště

Návrhář témat ukládá nastavení do `localStorage`:
```javascript
// Klíč v localStorage
'customTheme'

// Struktura dat
{
    "primary-color": "#667eea",
    "secondary-color": "#764ba2",
    // ... další nastavení
}
```

### Klávesové zkratky

- **Ctrl+S**: Uložit téma
- **Ctrl+R**: Obnovit výchozí téma

## 🔍 Řešení problémů

### Téma se nenačítá
1. Zkontrolujte, že `theme.css` existuje
2. Ověřte správnost CSS syntaxe
3. Obnovte stránku (F5)

### Barvy se nezobrazují správně
1. Zkontrolujte formát barev (#RRGGBB)
2. Ověřte, že proměnné jsou správně definované
3. Zkuste obnovit výchozí téma

### Návrhář nefunguje
1. Zkontrolujte, že JavaScript je povolen
2. Otevřete konzoli prohlížeče (F12) a zkontrolujte chyby
3. Ověřte, že všechny soubory jsou dostupné

## 💡 Tipy a triky

1. **Začněte s předvolbou** blízkou vašemu cíli
2. **Upravujte postupně** - začněte hlavními barvami
3. **Kontrolujte kontrast** - text musí být čitelný
4. **Testujte na mobilu** - návrhář je responzivní
5. **Zálohujte témata** - exportujte před velkými změnami
6. **Používejte metadata** - pojmenujte a popište svá témata

## 📞 Podpora

Pro další pomoc nebo nahlášení chyb kontaktujte autora aplikace.

---

**Vytvořeno s ❤️ pro Kvízový Mistr** 