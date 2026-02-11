import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useVoiceSynthesis } from '../hooks/useVoiceSynthesis';
import { useConversation } from '../hooks/useConversation';
import { MicrophoneButton } from './MicrophoneButton';
import { Waveform } from './Waveform';
import { TranscriptDisplay } from './TranscriptDisplay';
import { ResponseDisplay } from './ResponseDisplay';
import { Header } from './Header';
import { ConversationHistory } from './ConversationHistory';
import { useThemeMode } from '../hooks/useThemeMode';
import { AlertCircle } from 'lucide-react';

export const ChatInterface = () => {
  const { isDark, toggleTheme } = useThemeMode();
  const sessionId = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)[0];
  
  const voiceRecognition = useVoiceRecognition();
  const voiceSynthesis = useVoiceSynthesis();
  const conversation = useConversation(sessionId);
  
  const [showSidebar, setShowSidebar] = useState(false);
  const [lastSentMessage, setLastSentMessage] = useState('');
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [lastResponseText, setLastResponseText] = useState('');
  const [manualStop, setManualStop] = useState(false);
  const [pendingMessage, setPendingMessage] = useState('');
  const conversationEndRef = useRef(null);
  
  // Threshold for "too long" message (chars)
  const MESSAGE_LENGTH_THRESHOLD = 400;

  // Start listening on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!manualStop) {
        console.log('🎤 Starting initial listening on mount...');
        voiceRecognition.startListening();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.history]);

  // Get the last response from history
  const lastResponse = conversation.history && conversation.history.length > 0
    ? conversation.history[conversation.history.length - 1]
    : null;

  // Auto-send message when speech is completed (only if it's different from last sent and from last response)
  useEffect(() => {
    const message = voiceRecognition.completedText?.trim();
    if (message && !voiceRecognition.isListening && message !== lastSentMessage) {
      // Check if this message is different from the last response to avoid echoing
      if (!lastResponse || lastResponse.role !== 'user' || lastResponse.content !== message) {
        setPendingMessage(message);
        
        // Auto-send only if message is within normal length threshold
        if (message.length <= MESSAGE_LENGTH_THRESHOLD) {
          setLastSentMessage(message);
          handleSendMessage(message);
          setPendingMessage('');
          // Reset voice recognition to clear completed text for next message
          voiceRecognition.reset();
        }
        // If too long, keep pending so user can manually send
      }
    }
  }, [voiceRecognition.completedText, voiceRecognition.isListening, lastSentMessage, lastResponse]);

  // Auto-speak response when we have a new assistant message (skip if duplicate)
  useEffect(() => {
    if (lastResponse && lastResponse.role === 'assistant' && !voiceSynthesis.isSpeaking) {
      // VOICE OUTPUT DISABLED - Only log but don't speak
      if (lastResponse.content !== lastResponseText) {
        console.log('Response received (voice disabled):', lastResponse.content.substring(0, 50));
        setLastResponseText(lastResponse.content);
        // voiceSynthesis.speak(lastResponse.content); // DISABLED
      }
    }
  }, [lastResponse, lastResponseText, voiceSynthesis]);

  // Auto-restart listening after message is sent and response received - CONTINUOUS LISTENING
  useEffect(() => {
    // Restart listening after response is received (not loading) and not manually stopped
    if (!voiceRecognition.isListening && !conversation.isLoading && !manualStop) {
      // Only restart if we've already had at least one conversation exchange
      if (conversation.history.length > 0) {
        const timer = setTimeout(() => {
          if (!voiceRecognition.isListening && !conversation.isLoading && !manualStop) {
            console.log('🎤 Auto-restarting continuous listening after response...');
            voiceRecognition.startListening();
          }
        }, 800); // Delay to ensure message was fully processed
        return () => clearTimeout(timer);
      }
    }
  }, [voiceRecognition.isListening, conversation.isLoading, manualStop, conversation.history.length]);

  const handleSendMessage = useCallback(async (message) => {
    if (!message?.trim() || conversation.isLoading) {
      console.log('Message send blocked:', { message: message?.trim(), isLoading: conversation.isLoading });
      return;
    }

    try {
      console.log('Sending message:', message);
      const response = await conversation.sendMessage(message);
      console.log('Received response:', response);
      setPendingMessage(''); // Clear pending when sent
      setLastSentMessage(message);
      // Don't call reset() - just clear the completed text to allow continuous listening
      // voiceRecognition.reset() would stop listening
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [conversation]);

  const handleManualSend = useCallback(() => {
    if (pendingMessage?.trim()) {
      handleSendMessage(pendingMessage);
    }
  }, [pendingMessage, handleSendMessage]);

  const handleMicrophoneClick = useCallback(() => {
    if (voiceRecognition.isListening) {
      voiceRecognition.stopListening();
      setManualStop(true);
    } else {
      if (voiceSynthesis.isSpeaking) {
        voiceSynthesis.stop();
      }
      setManualStop(false);
      voiceRecognition.startListening();
    }
  }, [voiceRecognition, voiceSynthesis]);

  return (
    <div className={`flex h-screen ${isDark ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
      {/* Sidebar - Mobile Toggle */}
      {showSidebar && (
        <div className="md:hidden w-full sm:w-64 border-r border-gray-700">
          <ConversationHistory 
            history={conversation.history}
            onClear={conversation.clearHistory}
            isDark={isDark}
            onSelectItem={setSelectedHistoryItem}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-col md:w-64 border-r border-gray-700">
          <ConversationHistory 
            history={conversation.history}
            onClear={conversation.clearHistory}
            isDark={isDark}
            onSelectItem={setSelectedHistoryItem}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden pb-12 md:pb-32">
          <Header isDark={isDark} onThemeToggle={toggleTheme} />

          {/* Center Content Area - Split into Center Modal and Bottom Voice Controls */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-10 md:pb-28">
            {/* Center Modal/Response View */}
            <div className="flex-1 flex flex-col p-0 overflow-y-auto min-h-0">
              {selectedHistoryItem ? (
                <div className="w-full h-full glass rounded-lg border border-gray-600 border-opacity-50 flex flex-col overflow-hidden">
                  {/* Modal Header with Close Button */}
                  <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-600 border-opacity-50 flex-shrink-0">
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-blue-300 mb-1">Question:</div>
                      <div className="text-white text-sm md:text-base font-medium">{selectedHistoryItem.question}</div>
                    </div>
                    <button
                      onClick={() => setSelectedHistoryItem(null)}
                      className="ml-4 text-gray-400 hover:text-red-400 transition-colors flex-shrink-0"
                      title="Close response"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Modal Body - Response Display with Scrolling */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    <div className="text-xs font-semibold text-green-300 mb-3">Response:</div>
                    <div className="text-gray-100 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words break-all">
                      {selectedHistoryItem.answer}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col overflow-hidden">
                  {conversation.history.length > 0 ? (
                    <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-purple-900 to-purple-800 rounded-none">
                      {/* Center Output Header */}
                      <div className="px-2 md:px-4 py-2 md:py-2.5 border-b border-gray-500 border-opacity-60 flex-shrink-0">
                        <h2 className="text-white text-xs md:text-base font-semibold\">Live Conversation</h2>
                      </div>
                      
                      {/* Center Output - Scrollable Conversation */}
                      <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 md:px-4 py-1.5 md:py-2.5 space-y-1 md:space-y-2 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent min-h-0\">
                        {conversation.history.map((msg, idx) => (
                          <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`w-full ${
                              msg.role === 'user'
                                ? 'bg-blue-600 bg-opacity-50 border border-blue-400 border-opacity-60 text-white rounded-xl rounded-tr-sm'
                                : 'bg-green-600 bg-opacity-50 border border-green-400 border-opacity-60 text-white rounded-xl rounded-tl-sm'
                            } p-1.5 md:p-3`}>
                              <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap break-words\">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={conversationEndRef} />
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 flex flex-col justify-center h-full">
                      <p className="text-lg font-semibold mb-2">🎤 Ready to chat</p>
                      <p className="text-sm">Click the microphone to start speaking</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Voice Control Section - Floating */}
            <div className="fixed bottom-0 left-0 right-0 flex-shrink-0 px-0.5 md:px-3 py-0.5 md:py-1.5 bg-gradient-to-t from-purple-900 via-purple-900 to-transparent border-t border-gray-600 border-opacity-30 z-50">
              {/* Error Display with Health Check */}
              {(voiceRecognition.error || conversation.error || voiceSynthesis.error) && (
                <div className="glass p-2 rounded border border-red-500 border-opacity-50 flex items-start gap-1 mb-1 justify-between">
                  <div className="flex items-start gap-1 flex-1 min-w-0">
                    <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-red-200 text-xs break-words">
                      {voiceRecognition.error || conversation.error || voiceSynthesis.error}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-1 flex-shrink-0">
                    {conversation.error && (
                      <button
                        onClick={() => {
                          // Check API health
                          import('../services/aiService').then(m => {
                            m.aiService.checkHealth().then(health => {
                              if (health.status === 'OK') {
                                alert('✓ Backend is online! Try sending a message again.');
                              } else {
                                alert('✗ Backend is not responding.\n\nTroubleshooting:\n1. Check VITE_API_URL environment variable\n2. Ensure backend service is running\n3. Check browser console (F12) for more details');
                              }
                            });
                          });
                        }}
                        className="text-xs text-blue-300 hover:text-blue-100 hover:bg-blue-500 hover:bg-opacity-20 px-1 py-0.5 rounded transition-colors whitespace-nowrap"
                      >
                        Check Server
                      </button>
                    )}
                    {voiceRecognition.error && (
                      <button
                        onClick={() => voiceRecognition.reset()}
                        className="text-xs text-red-300 hover:text-red-100 hover:bg-red-500 hover:bg-opacity-20 px-1 py-0.5 rounded transition-colors whitespace-nowrap"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Transcript Display */}
              <TranscriptDisplay
                transcript={voiceRecognition.transcript}
                interimTranscript={voiceRecognition.interimTranscript}
                isListening={voiceRecognition.isListening}
                isLoading={conversation.isLoading}
              />

              {/* Microphone and Waveform */}
              <div className="flex flex-col items-center gap-1">
                <Waveform isActive={voiceRecognition.isListening} />
                <div className="flex items-center gap-2">
                  <MicrophoneButton
                    isListening={voiceRecognition.isListening}
                    isSpeaking={voiceSynthesis.isSpeaking}
                    onClick={handleMicrophoneClick}
                    disabled={conversation.isLoading}
                    hasError={!!voiceRecognition.error}
                  />
                  {pendingMessage && (
                    <button
                      onClick={handleManualSend}
                      disabled={conversation.isLoading}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white rounded-full p-2 transition-colors flex items-center justify-center"
                      title="Send message"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile History Toggle */}
          <div className="md:hidden p-1.5 border-t border-gray-600 border-opacity-50 flex-shrink-0">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="w-full glass px-2 py-1 rounded-lg text-xs transition-colors hover:bg-opacity-30"
            >
              {showSidebar ? 'Hide' : 'Show'} History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
