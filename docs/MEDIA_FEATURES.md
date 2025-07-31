# Media Support in Quiz Application

The quiz application now supports images and audio files in questions, including both online URLs and local files! This document explains how to use these features.

## New Question Properties

### Image Support
- **Property**: `image` (optional string)
- **Description**: URL to an image file OR path to a local image file that will be displayed below the question text
- **Formats**: Any web-compatible image format (JPG, PNG, GIF, WebP, etc.)
- **Behavior**: Timer continues to run normally for image questions

### Audio Support  
- **Property**: `audio` (optional string)
- **Description**: URL to an audio file OR path to a local audio file that will be played using HTML5 audio controls
- **Formats**: Any web-compatible audio format (MP3, WAV, OGG, etc.)
- **Behavior**: **Timer does NOT run** for audio questions - presenter controls when to move to next question

## Local File Support

### Important: File Path Requirements
Due to browser security restrictions, local files must be properly referenced:

**✅ Correct file paths (use forward slashes /):**
- `./images/image.jpg` (recommended - relative path to subdirectory)
- `./audio/sound.mp3` (recommended - relative path to subdirectory)
- `./media/file.jpg` (alternative - combined media directory)
- `file:///C:/Users/YourName/Desktop/quiz/image.jpg` (Windows absolute)
- `file:///Users/YourName/Desktop/quiz/image.jpg` (Mac/Linux absolute)

**❌ Incorrect paths that won't work:**
- `.\images\image.jpg` (Windows backslashes - will be auto-corrected)
- `C:\Users\YourName\Desktop\image.jpg` (Windows path without file://)
- `images\image.jpg` (backslashes without ./ prefix)
- Just the filename without path

**🔧 Auto-correction:** The Topic Builder now automatically converts Windows-style backslashes (`\`) to forward slashes (`/`) and adds proper prefixes.

### Topic Builder File Selection
- Click **"📁 Vybrat soubor"** button next to URL inputs
- Select local image or audio files from your computer
- **The tool will suggest a file path, but you may need to edit it**
- A detailed modal will show you path options
- Preview functionality works immediately for testing

### Recommended Workflow
1. **Organize your files first:**
   ```
   quiz/
   ├── index.html
   ├── quiz.js
   ├── my-topic.json
   ├── images/
   │   ├── image1.jpg
   │   └── image2.png
   └── audio/
       ├── audio1.mp3
       └── audio2.wav
   ```

2. **Use the file selector to get the filename**
3. **Edit the path to match your file organization**
4. **Test the quiz locally to ensure files load**

### File Organization
For offline quizzes, organize your files like this:
```
quiz/
├── index.html
├── quiz.js
├── topic-builder.html
├── my-topic.json
├── image1.jpg          # Same directory: file:///image1.jpg
├── image2.png          # Same directory: file:///image2.png
├── images/             # Subdirectory approach
│   ├── photo1.jpg      # Path: ./images/photo1.jpg
│   └── photo2.png      # Path: ./images/photo2.png
├── audio/              # Subdirectory approach
│   ├── sound1.mp3      # Path: ./audio/sound1.mp3
│   └── sound2.wav      # Path: ./audio/sound2.wav
└── media/              # Combined subdirectory
    ├── image.jpg       # Path: ./media/image.jpg
    └── audio.mp3       # Path: ./media/audio.mp3
```

## Question JSON Structure

### Basic Question (no media)
```json
{
  "question": "What is the capital of France?",
  "answer": "Paris",
  "explanation": "Paris is the capital and largest city of France.",
  "source": "Geography textbook",
  "difficulty": "střední"
}
```

### Image Question (URL)
```json
{
  "question": "What do you see in this image?",
  "answer": "A blue placeholder image",
  "explanation": "This demonstrates image functionality in quiz questions.",
  "source": "Test source",
  "difficulty": "střední",
  "image": "https://via.placeholder.com/400x300/4f46e5/ffffff?text=Sample+Image"
}
```

### Image Question (Local File)
```json
{
  "question": "What do you see in this image?",
  "answer": "A local image file",
  "explanation": "This demonstrates local image functionality in quiz questions.",
  "source": "Test source",
  "difficulty": "střední",
  "image": "./images/sample-image.jpg"
}
```

### Audio Question (Local File)
```json
{
  "question": "What do you hear in this audio clip?",
  "answer": "Cantina Band music",
  "explanation": "This demonstrates local audio functionality. Note that timer doesn't run.",
  "source": "Test source",
  "difficulty": "střední",
  "audio": "./audio/sample.mp3"
}
```

### Combined Image + Audio Question
```json
{
  "question": "Describe what you see and hear?",
  "answer": "Visual and audio elements",
  "explanation": "Questions can include both image and audio elements.",
  "source": "Test source",
  "difficulty": "střední",
  "image": "./images/sample.jpg",
  "audio": "./audio/sample.mp3"
}
```

## Behavior Differences

### Regular Questions
- Timer runs for the configured duration (default 90 seconds)
- Question moves to "Time's Up" screen when timer expires
- No media elements displayed

### Image Questions  
- Timer runs normally (same as regular questions)
- Image is displayed below the question text
- Image has responsive sizing (max-width: 100%, max-height: 400px)
- Error handling for broken image links or missing local files

### Audio Questions
- **Timer does NOT start automatically**
- Audio player with controls is displayed below question text  
- **"Continue to Next Question" button appears BELOW the audio player**
- Presenter decides when to move to next question
- Error handling for broken audio links or missing local files
- **Questions are properly counted in final statistics**

### Combined Image + Audio Questions
- Follows audio question behavior (no automatic timer)
- Image displayed first, then audio player
- Manual "Continue" button appears below the audio player
- Manual presenter control required

## Using in Topic Builder

The Topic Builder now includes:
- **URL Input Fields**: Enter URLs or local file paths manually
- **File Selection Buttons**: Click "📁 Vybrat soubor" to browse for local files
- **Preview**: See image thumbnails and audio players for both URLs and local files
- **Help text**: Explains the behavior of each media type
- **Responsive design**: Works on mobile devices

### Local File Workflow
1. Create your quiz topic
2. For media questions, click the file selection button
3. Choose your local image or audio file
4. The path will automatically populate in the URL field
5. Preview appears immediately
6. Download the JSON and place media files in the same directory

## Using in Quiz Builder

- Questions with media show indicators (🖼️ for images, 🔊 for audio)
- Media details are visible when questions are expanded
- Drag and drop functionality works normally with media questions
- Local file paths are shown as clickable links (though they open relative to the quiz location)

## Technical Notes

### Image Display
- Images are styled with rounded corners and shadows
- Responsive sizing maintains aspect ratio
- Error states show user-friendly messages
- Images in answers are smaller (max-height: 300px)
- Local files work when quiz is run from the same directory

### Audio Player
- Uses HTML5 `<audio>` element with controls
- Full width up to 400px maximum
- Error handling for unsupported formats or missing files
- Audio in answers uses same player
- **Improved Layout**: Continue button now appears below the audio player

### Timer Integration
- Timer automatically detects audio questions
- Timer element is hidden for audio questions
- Manual next button appears dynamically after audio player
- Regular questions don't show manual button and display timer normally
- **All questions are counted correctly regardless of timer usage**

### Error Handling
- Broken images show error message instead of broken image icon
- Broken audio shows error message below audio label
- Invalid URLs are handled gracefully
- Missing local files show appropriate error messages
- Validation in topic builder prevents malformed data

### Local File Considerations
- Files must be in the same directory or subdirectory as the quiz
- Use relative paths starting with `./` for portability
- Organize files in subdirectories (e.g., `./images/`, `./audio/`)
- Test locally before deploying for offline use

### Troubleshooting File Loading Issues

**Problem: Files don't load in the quiz**
- ✅ Check file path format (use `file:///` for absolute paths)
- ✅ Verify file is in correct location relative to quiz
- ✅ Test by opening the file path directly in browser
- ✅ Ensure file names match exactly (case-sensitive)

**Problem: Preview works but quiz doesn't**
- ✅ Preview uses blob URLs, quiz uses file paths
- ✅ Copy the exact file path from preview to quiz
- ✅ Make sure quiz HTML file is in same directory as media

**Problem: Works locally but not when shared**
- ✅ Use relative paths (`./images/file.jpg`) instead of absolute
- ✅ Include all media files when sharing quiz folder
- ✅ Maintain folder structure when copying

**Testing checklist:**
1. Open quiz in browser using file:// protocol
2. Load a topic with media questions
3. Verify images display correctly
4. Verify audio players work
5. Test on different computers/browsers

## File Organization

Modified files:
- `quiz.js` - Improved button placement for audio questions, added notification system
- `topic-builder.js` - Added local file selection functionality
- `topic-builder.css` - Styles for file selection buttons, wide-screen two-column layout
- `topic-builder.html` - Updated to use two-column layout similar to quiz builder
- `index.html` - Removed static manual button placement

Existing files:
- `quiz-builder.js` - Media indicators and preview
- `quiz-builder.css` - Styles for media indicators
- `test-media.json` - Example topic with all media types
- `MEDIA_FEATURES.md` - This updated documentation

## Browser Compatibility

- Images: All modern browsers, file:// protocol support
- Audio: HTML5 compatible browsers (IE 9+, all modern browsers)  
- Local files: Work with file:// protocol in most browsers
- File selection: Modern browsers with File API support
- Responsive design works on mobile devices
- Error handling degrades gracefully on older browsers

## Offline Usage

Perfect for:
- Corporate training environments without internet
- Educational settings with restricted connectivity  
- Local presentations and workshops
- Quiz competitions with custom media content
- Situations requiring data privacy (no external requests)

### User Interface Enhancements
- Media indicators in quiz builder for easy identification
- Help text explaining media behavior differences
- Visual previews in topic builder
- Styled media containers with borders and shadows
- Mobile-responsive design
- **Smooth notification system** - replaced disruptive alert popups with elegant slide-in notifications
- **Wide-screen layout** - topic builder now uses a two-column layout similar to quiz builder for better use of screen space 