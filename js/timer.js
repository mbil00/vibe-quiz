// Timer functionality
class QuizTimer {
    constructor(duration = 90, onComplete) {
        this.duration = duration; // in seconds
        this.remaining = duration;
        this.interval = null;
        this.onComplete = onComplete;
        this.isPaused = false;
        
        // DOM elements
        this.timerText = document.getElementById('timer-text');
        this.timerCircle = document.getElementById('timer-circle');
        
        // Calculate circumference for SVG circle animation
        this.circumference = 2 * Math.PI * 45; // radius is 45
    }
    
    start() {
        this.remaining = this.duration;
        this.isPaused = false;
        this.updateDisplay();
        this.updateCircle();
        
        // Reset circle color
        this.timerCircle.style.stroke = '#667eea';
        
        this.interval = setInterval(() => {
            if (!this.isPaused) {
                if (this.remaining > 0) {
                    this.remaining--;
                    this.updateDisplay();
                    this.updateCircle();
                    
                    // Add warning state when time is running low (adjust thresholds based on duration)
                    const warningTime = Math.min(30, Math.floor(this.duration * 0.25));
                    const dangerTime = Math.min(10, Math.floor(this.duration * 0.08));
                    
                    if (this.remaining === warningTime) {
                        this.timerCircle.style.stroke = '#ed8936'; // warning color
                    } else if (this.remaining === dangerTime) {
                        this.timerCircle.style.stroke = '#f56565'; // danger color
                        this.addPulseAnimation();
                    }
                } else {
                    // Timer has reached 0 - show 0:00 briefly before completing
                    this.updateDisplay();
                    this.updateCircle();
                    this.stop();
                    
                    // Show 0:00 for a brief moment before calling completion
                    setTimeout(() => {
                        if (this.onComplete) {
                            this.onComplete();
                        }
                    }, 500);
                }
            }
        }, 1000);
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
    }
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        this.removePulseAnimation();
    }
    
    complete() {
        this.stop();
        if (this.onComplete) {
            this.onComplete();
        }
    }
    
    updateDisplay() {
        // Ensure remaining time never goes below 0
        const timeRemaining = Math.max(0, this.remaining);
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        this.timerText.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updateCircle() {
        const percentage = this.remaining / this.duration;
        const offset = this.circumference - (percentage * this.circumference);
        this.timerCircle.style.strokeDashoffset = offset;
    }
    
    addPulseAnimation() {
        this.timerText.style.animation = 'pulse 1s ease-in-out infinite';
    }
    
    removePulseAnimation() {
        this.timerText.style.animation = '';
        this.timerCircle.style.stroke = '#667eea'; // Reset to primary color
    }
    
    reset() {
        this.stop();
        this.remaining = this.duration;
        this.updateDisplay();
        this.updateCircle();
        this.removePulseAnimation();
    }
}

// Add pulse animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: translate(-50%, -50%) scale(1);
        }
        50% {
            transform: translate(-50%, -50%) scale(1.1);
        }
    }
`;
document.head.appendChild(style);