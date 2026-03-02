# Retell AI Integration Setup Guide

## Environment Configuration

### Backend (.env file)

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Existing variables (should already be configured)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development

# NEW: Retell AI Configuration
RETELL_API_KEY=key_51459c096bd9305f455ad4382dde
```

### Frontend Configuration

No additional environment variables needed for the frontend. The SDK is initialized with the agent ID directly in the VoiceChatModal component.

## Implementation Summary

### What Was Added

#### Backend:
1. **New Controller** (`Backend/controllers/retellController.js`)
   - `generateConversationToken()` - Creates secure tokens for frontend conversations

2. **New Route** (`Backend/routes/retell.js`)
   - `POST /api/retell/generate-token` - Generates auth token for voice conversations

3. **Dependencies Added**
   - `axios` - For making API calls to Retell AI

#### Frontend:
1. **New API Function** (`src/api/retell.api.js`)
   - `generateToken()` - Fetches conversation token from backend

2. **New Modal Component** (`src/modules/dashboard/components/VoiceChatModal.jsx`)
   - Voice chat interface with microphone controls
   - Real-time status indicators (listening, speaking, processing)
   - Start/stop call functionality
   - Error handling and permission requests
   - No transcript display (as requested)

3. **Updated Components**:
   - **DashboardPage.jsx** - Added "Talk with AI" button on dashboard
   - **Layout.jsx** - Added voice chat modal at layout level for global access
   - **Sidebar.jsx** - Added "Talk with AI" button in navigation menu

4. **Dependencies Added**
   - `retell-client-js-sdk` - Retell AI SDK for web-based voice conversations

## How It Works

### User Flow:
1. User clicks "Talk with AI" button (Dashboard or Sidebar)
2. VoiceChatModal opens and requests a conversation token
3. Frontend calls `/api/retell/generate-token` endpoint
4. Backend generates a secure token using Retell API
5. Frontend initializes Retell SDK with the token
6. Real-time voice conversation begins
7. User can start/stop/mute microphone
8. Close modal to end conversation

### Key Features:
- ✅ Real-time voice conversation with Retell AI agent
- ✅ Microphone permission handling
- ✅ Status indicators (Listening, Speaking, Processing)
- ✅ Mute/Unmute controls
- ✅ End call button
- ✅ Error handling with user-friendly messages
- ✅ No transcript display
- ✅ Available from Dashboard or Sidebar

## Testing

1. Ensure backend is running:
   ```bash
   cd Backend
   npm run dev
   ```

2. Ensure frontend is running:
   ```bash
   cd Frontend
   npm run dev
   ```

3. Try the flow:
   - Login to the app
   - Click "Talk with AI" button (Dashboard or Sidebar)
   - Grant microphone permissions if prompted
   - Start speaking to the AI agent
   - Use mute button to pause/resume
   - Click hang up to end conversation

## Troubleshooting

### "Failed to generate conversation token"
- Check that `RETELL_API_KEY` is set in Backend `.env`
- Verify backend is running on port 5000

### "Microphone error"
- Check browser permissions for microphone access
- Ensure no other app is using the microphone
- Try a different browser if the issue persists

### Connection keeps dropping
- Check internet connection
- Ensure agent ID is correct: `agent_53e53999bf4e084d11d4d4d68c`
- Check Retell AI dashboard for agent status

## Files Modified/Created

### New Files:
- `Backend/controllers/retellController.js`
- `Backend/routes/retell.js`
- `Frontend/src/api/retell.api.js`
- `Frontend/src/modules/dashboard/components/VoiceChatModal.jsx`

### Modified Files:
- `Backend/index.js` - Added retell routes
- `Frontend/src/modules/dashboard/pages/DashboardPage.jsx` - Added Talk with AI button
- `Frontend/src/modules/dashboard/components/Layout.jsx` - Added voice chat modal
- `Frontend/src/modules/dashboard/components/Sidebar.jsx` - Added Talk with AI button
- `Backend/package.json` - Added axios dependency
- `Frontend/package.json` - Added retell-client-js-sdk dependency
