const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

/**
 * POST /v1/chat
 *
 * @param {object} params
 * @param {string}  params.sessionId
 * @param {string}  [params.textQuery]
 * @param {Blob}    [params.audioBlob]   - recorded audio (webm)
 * @param {string}  [params.language]    - Sarvam TTS code: "en-IN" | "hi-IN" | "gu-IN"
 * @returns {Promise<object>}
 */
export async function sendChatMessage({ sessionId, textQuery, audioBlob, language, receiveAudio = false }) {
  const formData = new FormData();
  formData.append('sessionId', sessionId);

  if (textQuery)  formData.append('text_query', textQuery);
  if (audioBlob)  formData.append('audio_file', audioBlob, 'recording.webm');
  if (language)   formData.append('language', language);
  formData.append('receive_audio', receiveAudio.toString());

  const response = await fetch(`${BASE_URL}/v1/chat`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let detail = `Server error ${response.status}`;
    try { detail = (await response.json()).detail ?? detail; } catch { /* ignore */ }
    throw new Error(detail);
  }

  return response.json();
}

/**
 * GET /v1/suggested-questions
 * Returns FAQ-backed quick-reply chips for all three languages at once.
 *
 * @returns {Promise<{en: string[], hi: string[], gu: string[]}>}
 */
export async function getSuggestedQuestions() {
  const response = await fetch(`${BASE_URL}/v1/suggested-questions`);
  if (!response.ok) throw new Error('Failed to load suggested questions');
  const data = await response.json();
  return {
    en: data.en ?? [],
    hi: data.hi ?? [],
    gu: data.gu ?? [],
  };
}
