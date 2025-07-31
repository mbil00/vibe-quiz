# Quiz Application

An interactive quiz application with customizable themes, topics, and builder tools.

## 📁 Project Structure

```
quiz/
├── index.html              # Main application entry point
├── .gitignore              # Git ignore configuration
├── README.md               # This file
│
├── 📁 js/                  # JavaScript files
│   ├── quiz.js             # Main quiz logic
│   ├── config-loader.js    # Configuration management
│   ├── timer.js            # Timer functionality  
│   ├── quiz-builder.js     # Quiz builder tool
│   ├── topic-builder.js    # Topic builder tool
│   ├── settings.js         # Settings management
│   ├── theme-designer.js   # Theme designer tool
│   └── prompt-generator.js # AI prompt generator
│
├── 📁 css/                 # Stylesheets
│   ├── styles.css          # Main application styles
│   ├── theme.css           # Theme definitions
│   ├── quiz-builder.css    # Quiz builder styles
│   ├── topic-builder.css   # Topic builder styles
│   ├── settings.css        # Settings page styles
│   └── theme-designer.css  # Theme designer styles
│
├── 📁 html/                # Builder tools HTML files
│   ├── quiz-builder.html   # Quiz builder interface
│   ├── topic-builder.html  # Topic builder interface
│   ├── settings.html       # Settings interface
│   ├── theme-designer.html # Theme designer interface
│   └── prompt-generator.html # Prompt generator interface
│
├── 📁 docs/                # Documentation
│   ├── CONFIG_README.md    # Configuration guide
│   └── MEDIA_FEATURES.md   # Media features guide
│
├── 📁 themes/              # Theme files (content excluded from git)
│   └── .gitkeep           # Maintains folder structure
│
├── 📁 topics/              # Topic JSON files (content excluded from git)
│   └── .gitkeep           # Maintains folder structure
│
├── 📁 audio/               # Audio files (content excluded from git)
│   └── .gitkeep           # Maintains folder structure
│
├── 📁 images/              # Image files (content excluded from git)
│   └── .gitkeep           # Maintains folder structure
│
├── 📁 quizzes/             # Quiz files (content excluded from git)
│   └── .gitkeep           # Maintains folder structure
│
├── test-media-local.json   # Test media configuration (local)
└── test-media.json         # Test media configuration
```

## 🚀 Getting Started

1. Open `index.html` in your web browser
2. The application works with the `file://` protocol - no server required
3. Use the builder tools in the `html/` folder to create content

## 🔧 Builder Tools

- **Topic Builder** (`html/topic-builder.html`) - Create quiz topics with questions
- **Quiz Builder** (`html/quiz-builder.html`) - Combine topics into complete quizzes  
- **Settings** (`html/settings.html`) - Configure application settings
- **Theme Designer** (`html/theme-designer.html`) - Customize visual themes
- **Prompt Generator** (`html/prompt-generator.html`) - Generate AI prompts for content creation

## 📝 Content Management

- Add topic JSON files to `topics/` folder
- Add quiz JSON files to `quizzes/` folder  
- Add images to `images/` folder
- Add audio files to `audio/` folder
- Add custom themes to `themes/` folder

## 🎨 Customization

See `docs/CONFIG_README.md` for configuration options and `docs/MEDIA_FEATURES.md` for media feature documentation.

## 📋 Development Notes

- Primary language: Czech (CS)
- No server dependencies - works offline
- Modular architecture with separate builder tools
- Responsive design for various screen sizes