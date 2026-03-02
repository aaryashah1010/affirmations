import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Phone } from 'lucide-react';
import { retellAPI } from '../../../api/retell.api';
import Button from '../../../shared/components/Button';

const AGENT_ID = 'agent_53e53999bf4e084d11d4d4d68c';

export default function VoiceChatModal({ isOpen, onClose }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const webrtcRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const initiateCall = async () => {
      try {
        setIsConnecting(true);
        setError(null);

        // Get conversation token from backend
        const { token } = await retellAPI.generateToken(AGENT_ID);

        // Import and initialize Retell SDK
        const { RetellWebClient } = await import('retell-client-js-sdk');
        const client = new RetellWebClient();

        // Set up event listeners
        client.on('connected', () => {
          console.log('Connected to Retell AI');
          setIsConnecting(false);
          setIsListening(true);
        });

        client.on('disconnected', () => {
          console.log('Disconnected from Retell AI');
          setIsListening(false);
          setIsSpeaking(false);
        });

        client.on('error', (error) => {
          console.error('Retell error:', error);
          setError('Connection error. Please try again.');
          setIsConnecting(false);
          setIsListening(false);
        });

        client.on('audio', (audio) => {
          // Agent is speaking
          setIsSpeaking(true);
        });

        client.on('transcript', (message) => {
          // User's speech detected
          if (message.role === 'user') {
            setIsListening(true);
            setIsSpeaking(false);
          }
        });

        // Start the call
        await client.startCall({
          accessToken: token,
        });

        webrtcRef.current = client;
      } catch (err) {
        console.error('Failed to start call:', err);
        setError(err.message || 'Failed to start call. Please try again.');
        setIsConnecting(false);
      }
    };

    initiateCall();

    return () => {
      if (webrtcRef.current) {
        webrtcRef.current.stopCall();
      }
    };
  }, [isOpen]);

  const handleStopCall = async () => {
    try {
      if (webrtcRef.current) {
        await webrtcRef.current.stopCall();
      }
      setIsListening(false);
      setIsSpeaking(false);
      onClose();
    } catch (err) {
      console.error('Error stopping call:', err);
      setError('Failed to end call');
    }
  };

  const handleToggleMicrophone = async () => {
    try {
      if (webrtcRef.current) {
        if (isListening) {
          webrtcRef.current.pauseInboundAudio?.();
          setIsListening(false);
        } else {
          webrtcRef.current.resumeInboundAudio?.();
          setIsListening(true);
        }
      }
    } catch (err) {
      console.error('Error toggling microphone:', err);
      setError('Failed to toggle microphone');
    }
  };

  const getStatusText = () => {
    if (isConnecting) return 'Connecting...';
    if (isSpeaking) return 'Agent Speaking';
    if (isListening) return 'Listening...';
    return 'Ready to talk';
  };

  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isSpeaking) return 'text-blue-500';
    if (isListening) return 'text-green-500';
    return 'text-gray-500';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md mx-4 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Talk with AI</h2>
          <button
            onClick={handleStopCall}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Status Section */}
        <div className="flex flex-col items-center mb-8">
          {/* Animated Microphone Icon */}
          <div className={`mb-4 ${isListening ? 'animate-pulse' : ''}`}>
            {isListening ? (
              <Mic className="w-16 h-16 text-green-500" />
            ) : (
              <Mic className="w-16 h-16 text-gray-400" />
            )}
          </div>

          {/* Status Text */}
          <p className={`text-lg font-semibold ${getStatusColor()}`}>
            {getStatusText()}
          </p>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex gap-4 justify-center mb-6">
          {/* Microphone Toggle */}
          <button
            onClick={handleToggleMicrophone}
            disabled={isConnecting || error}
            className={`p-4 rounded-full transition ${
              isListening
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            title={isListening ? 'Mute' : 'Unmute'}
          >
            {isListening ? (
              <Mic className="w-6 h-6" />
            ) : (
              <MicOff className="w-6 h-6" />
            )}
          </button>

          {/* End Call */}
          <button
            onClick={handleStopCall}
            className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
            title="End call"
          >
            <Phone className="w-6 h-6 rotate-[225deg]" />
          </button>
        </div>

        {/* Info Text */}
        <div className="text-center text-sm text-gray-600">
          {isConnecting ? (
            <p>Connecting you to the AI assistant...</p>
          ) : isListening ? (
            <p>Go ahead, I'm listening. Tell me what's on your mind.</p>
          ) : (
            <p>Click the microphone to start talking</p>
          )}
        </div>
      </div>
    </div>
  );
}
