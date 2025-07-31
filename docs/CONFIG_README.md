# Konfigurace Kvízové Aplikace

Tato aplikace nyní podporuje konfiguraci prostřednictvím embedded konfigurace v souboru `config-loader.js`, který umožňuje přizpůsobit texty, názvy a zprávy bez nutnosti HTTP serveru.

## Jak používat konfiguraci

### Úprava konfigurace

Konfigurace je uložena přímo v souboru `config-loader.js` v objektu `EMBEDDED_CONFIG`. Pro změnu nastavení:

1. Otevřete soubor `config-loader.js` v textovém editoru
2. Najděte objekt `EMBEDDED_CONFIG` na začátku souboru
3. Upravte požadované hodnoty
4. Uložte soubor a obnovte stránku v prohlížeči

### 1. Základní nastavení aplikace

V sekci `app` můžete nastavit:

```javascript
const EMBEDDED_CONFIG = {
  "app": {
    "name": "Mega Kvíz",
    "subtitle": "Otestujte své znalosti napříč různými tématy", 
    "title": "Mega Kvíz - Otestujte své znalosti",
    "organizer": "Martin Bil"
  }
  // ... zbytek konfigurace
}
```

- `name`: Hlavní název aplikace zobrazený na úvodní obrazovce
- `subtitle`: Podtitul pod hlavním názvem
- `title`: Název v záložce prohlížeče
- `organizer`: Pokud je vyplněno, přidá se k hlavnímu názvu (např. "Mega Kvíz - Martin Bil")

### 2. Texty uživatelského rozhraní

Všechny texty tlačítek, popisků a zpráv lze upravit v sekci `ui`:

```javascript
"ui": {
  "landing": {
    "topicSelection": "Vyberte témata",
    "uploadButton": "Nahrát JSON s tématy",
    "readyButton": "Připraveno"
  },
  "quiz": {
    "startButton": "Začít",
    "continueButton": "Pokračovat"
  }
}
```

### 3. Názvy kol

Můžete přizpůsobit názvy kol kvízu:

```javascript
"ui": {
  "rounds": [
    "První Kolo",
    "Druhé Kolo", 
    "Třetí Kolo"
  ],
  "roundFallback": "Kolo"
}
```

### 4. Systémové zprávy

Všechny zprávy o úspěchu, chybách a validaci:

```javascript
"messages": {
  "success": {
    "quizLoaded": "Úspěšně načten kvíz \"{name}\" s {count} tématy ze souboru {file}"
  },
  "error": {
    "invalidJson": "Neplatná struktura JSON. Prosím zkontrolujte formát souboru."
  }
}
```

Zprávy podporují placeholdery jako `{name}`, `{count}`, `{file}` atd.

### 5. Texty pro nástroje na tvorbu

Konfigurace pro Topic Builder a Quiz Builder:

```javascript
"builders": {
  "topicBuilder": {
    "title": "Tvořič Témat",
    "subtitle": "Vytvořte vlastní kvízové téma s otázkami"
  },
  "quizBuilder": {
    "title": "Stavitel Kvízů", 
    "subtitle": "Vytvořte kompletní kvíz s více tématy"
  }
}
```

## Příklady použití

### Přizpůsobení pro školu

Upravte objekt `EMBEDDED_CONFIG` v souboru `config-loader.js`:

```javascript
const EMBEDDED_CONFIG = {
  "app": {
    "name": "Školní Kvíz",
    "organizer": "ZŠ Masarykova",
    "subtitle": "Ověřte si své znalosti z různých předmětů"
  },
  "ui": {
    "rounds": [
      "Český jazyk",
      "Matematika", 
      "Přírodověda",
      "Dějepis",
      "Zeměpis"
    ]
  }
  // ... zbytek konfigurace zůstává stejný
}
```

### Přizpůsobení pro firemní školení

```javascript
const EMBEDDED_CONFIG = {
  "app": {
    "name": "Firemní Školení",
    "organizer": "ABC s.r.o.",
    "subtitle": "Test znalostí z bezpečnosti práce"
  },
  "ui": {
    "quiz": {
      "startButton": "Zahájit test",
      "restartButton": "Opakovat test"
    }
  }
  // ... zbytek konfigurace
}
```

## Technické detaily

- Konfigurace je uložena přímo v JavaScript souboru, takže funguje i s `file://` protokolem
- Změny v konfiguraci se projeví po obnovení stránky
- Všechny HTML elementy s atributem `data-config` se automaticky aktualizují podle konfigurace
- Není potřeba HTTP server - aplikace funguje přímo z lokálních souborů

## Struktura souborů

```
quiz/
├── config-loader.js      # Obsahuje konfiguraci v objektu EMBEDDED_CONFIG
├── index.html           # Hlavní kvízová aplikace
├── topic-builder.html   # Nástroj pro tvorbu témat
├── quiz-builder.html    # Nástroj pro tvorbu kvízů
└── ...
```

## Rychlá změna konfigurace

Pro rychlou změnu základních nastavení:

1. Otevřete `config-loader.js`
2. Najděte řádky:
   ```javascript
   "name": "Mega Kvíz",
   "organizer": "Martin Bil",
   ```
3. Změňte na požadované hodnoty
4. Uložte a obnovte stránku

Nyní můžete snadno přizpůsobit aplikaci pro různé účely a organizace pouze úpravou souboru `config-loader.js`! 