class VoiceService {
  constructor() {
    // Log browser info for debugging
    console.log('🎙️ Initializing VoiceService...');
    console.log('Browser:', {
      userAgent: navigator.userAgent,
      hasWebkitSpeechRecognition: !!window.webkitSpeechRecognition,
      hasSpeechRecognition: !!window.SpeechRecognition,
      hasSpeechSynthesis: !!window.speechSynthesis,
      hasMicrophone: !!navigator.mediaDevices?.getUserMedia
    });

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error('❌ Speech Recognition API not supported in this browser');
      console.error('Supported browsers: Chrome, Edge, Firefox, Safari (Safari 14.1+), Opera');
      this.recognition = null;
      this.supported = false;
      this.isListening = false;
      this.isSpeaking = false;
      return;
    }
    
    try {
      this.recognition = new SpeechRecognition();
      this.supported = true;
      this.isListening = false;
      this.isSpeaking = false;
      this.silenceTimeout = null;
      this.recognitionTimeout = null;
      this.silenceThreshold = 2000; // 2 seconds of silence
      this.finalTranscript = '';
      
      // Configure recognition settings
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';
      this.recognition.maxAlternatives = 1;
      
      this.onTranscriptCallback = null;
      this.onCompleteCallback = null;
      this.onErrorCallback = null;
      this.onSilenceCallback = null;
      
      console.log('✅ Speech Recognition API ready');
      this.setupRecognitionListeners();
    } catch (err) {
      console.error('❌ Failed to initialize Speech Recognition:', err);
      this.recognition = null;
      this.supported = false;
    }
  }

  setupRecognitionListeners() {
    if (!this.recognition) {
      console.warn('Cannot setup recognition listeners - Recognition API not available');
      return;
    }

    this.recognition.onstart = () => {
      this.isListening = true;
      this.clearSilenceTimeout();
      console.log('🎤 Speech recognition started - listening...');
    };

    this.recognition.onresult = (event) => {
      console.log('📝 Speech recognition result:', { 
        resultIndex: event.resultIndex, 
        resultsLength: event.results.length,
        isFinal: event.results[event.results.length - 1]?.isFinal 
      });

      let interimTranscript = '';
      let newFinalTranscript = '';

      // ONLY process results from the current result index onwards
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        console.log(`  Result ${i}: "${transcript}" (isFinal: ${event.results[i].isFinal})`);
        
        if (event.results[i].isFinal) {
          // Only set final transcript for NEW final results, don't accumulate
          newFinalTranscript = transcript.trim(); // Replace, don't append
        } else {
          interimTranscript += transcript;
        }
      }

      // UPDATE final transcript (only for new final results)
      if (newFinalTranscript) {
        // Only accept new final if it's different from what we already have
        if (newFinalTranscript !== this.finalTranscript) {
          this.finalTranscript = newFinalTranscript;
          console.log('✅ Final transcript set to:', this.finalTranscript);
        }
      }

      // Reset silence timer when we get results
      if (newFinalTranscript || interimTranscript) {
        this.resetSilenceTimeout();
      }

      // Callback with current state
      if (this.onTranscriptCallback) {
        this.onTranscriptCallback({
          interim: interimTranscript,
          final: this.finalTranscript,
          isFinal: newFinalTranscript.length > 0
        });
      }
    };

    this.recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error);
      
      // Map error codes to user-friendly messages with solutions
      const errorMap = {
        'no-speech': 'No speech was detected. Please try speaking again.',
        'audio-capture': 'Microphone not found. Please check your device settings.',
        'not-allowed': 'Microphone permission denied. Please allow access in your browser settings.',
        'network': 'Network error. Check your internet connection.',
        'bad-grammar': 'Grammar error in recognition. Please try again.',
        'service-not-allowed': 'Speech recognition service not allowed. Check browser settings.',
        'remote-closed': 'Connection closed. Please try again.',
      };

      const message = errorMap[event.error] || `Speech recognition error: ${event.error}`;
      console.error('Error details:', message);
      
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error, message);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      this.clearSilenceTimeout();
      console.log('🛑 Speech recognition ended');
    };

    this.recognition.onabort = () => {
      console.warn('⚠️ Speech recognition aborted');
      this.isListening = false;
    };
  }

  startListening(onTranscript, onComplete, onError, onSilence) {
    if (!this.recognition) {
      const error = 'Speech Recognition not supported in your browser';
      console.error('❌', error);
      if (onError) {
        onError('not-supported', error);
      }
      return;
    }

    if (this.isListening) {
      console.warn('⚠️ Already listening, ignoring start request');
      return;
    }

    this.onTranscriptCallback = onTranscript;
    this.onCompleteCallback = onComplete;
    this.onErrorCallback = onError;
    this.onSilenceCallback = onSilence;
    this.finalTranscript = '';
    
    console.log('🎙️ Attempting to start speech recognition...');
    
    // Request microphone permission if not already granted
    if (navigator.mediaDevices?.getUserMedia) {
      console.log('📱 Requesting microphone permission...');
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
          console.log('✅ Microphone permission granted - stream active:', stream.active);
          // Stop the stream right away - we just needed the permission
          stream.getTracks().forEach(track => track.stop());
          
          try {
            this.recognition.start();
            console.log('✅ Speech recognition started successfully');
            // Log audio track availability
            navigator.mediaDevices.enumerateDevices().then(devices => {
              const audioDevices = devices.filter(d => d.kind === 'audioinput');
              console.log(`📋 Available audio input devices: ${audioDevices.length}`);
              audioDevices.forEach((d, i) => console.log(`  ${i + 1}. ${d.label || 'Unknown device'}`));
            });
          } catch (err) {
            console.error('❌ Error starting recognition after permission:', err);
            if (onError) {
              onError('start-failed', err.message);
            }
          }
        })
        .catch((err) => {
          console.error('❌ Microphone permission denied:', err);
          console.error('   Error name:', err.name);
          console.error('   Error message:', err.message);
          if (onError) {
            if (err.name === 'NotAllowedError') {
              onError('not-allowed', 'Microphone permission denied. Please enable microphone access and reload the page.');
            } else if (err.name === 'NotFoundError') {
              onError('audio-capture', 'No microphone found. Please check your device has a microphone.');
            } else {
              onError('audio-capture', `Microphone error: ${err.message}`);
            }
          }
        });
    } else {
      // Fallback: try to start without explicit permission request
      console.log('⚠️ No getUserMedia available, attempting to start recognition directly...');
      try {
        this.recognition.start();
        console.log('✅ Speech recognition started (no explicit microphone permission available)');
      } catch (err) {
        console.error('❌ Error starting recognition:', err);
        if (onError) {
          onError('start-failed', err.message);
        }
      }
    }
  }

  stopListening() {
    if (!this.recognition) {
      console.warn('Recognition not available');
      return;
    }

    try {
      this.recognition.stop();
    } catch (err) {
      console.warn('Error stopping recognition:', err);
    }
    this.clearSilenceTimeout();
  }

  resetSilenceTimeout() {
    this.clearSilenceTimeout();
    this.silenceTimeout = setTimeout(() => {
      if (this.isListening && this.onSilenceCallback) {
        this.onSilenceCallback();
        this.stopListening();
        if (this.onCompleteCallback) {
          this.onCompleteCallback();
        }
      }
    }, this.silenceThreshold);
  }

  clearSilenceTimeout() {
    if (this.silenceTimeout) {
      clearTimeout(this.silenceTimeout);
      this.silenceTimeout = null;
    }
  }

  speak(text) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = 'en-US';

      utterance.onstart = () => {
        this.isSpeaking = true;
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        resolve();
      };

      utterance.onerror = (error) => {
        this.isSpeaking = false;
        console.error('Speech synthesis error:', error);
        reject(error);
      };

      window.speechSynthesis.cancel(); // Cancel any previous speech
      window.speechSynthesis.speak(utterance);
    });
  }

  stopSpeaking() {
    window.speechSynthesis.cancel();
    this.isSpeaking = false;
  }

  resumeListeningDuringSpeech() {
    // This allows simultaneous listening and speaking
    if (!this.isListening && !this.isSpeaking && this.recognition) {
      try {
        this.recognition.start();
      } catch (err) {
        console.warn('Could not resume listening:', err);
      }
    }
  }

  getIsListening() {
    return this.isListening;
  }

  getIsSpeaking() {
    return this.isSpeaking;
  }
}

export const voiceService = new VoiceService();
