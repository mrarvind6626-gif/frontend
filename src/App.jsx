import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getSuggestedQuestions, sendChatMessage } from './services/api.js';
import styles from './App.module.css';

/* ─── One stable session ID per page load ─── */
const SESSION_ID = crypto.randomUUID();

/* ─── i18n translations ─── */
const I18N = {
  en: {
    langCode: 'en-IN',
    pageTitle: 'ACPC Admission Assistant',
    pageSubtitle: 'Ask any question about ACPC admissions — courses, eligibility, registration, and more.',
    welcome:
      'Jai Jai Garvi Gujarat! 🙏 I am the ACPC Admission Assistant. I can help you with queries about admissions, eligibility, important dates, and the registration process. How may I assist you today?',
    placeholder: 'Type your admission query here…',
    send: 'Send',
    suggestionsTitle: 'Suggested questions',
    recording: 'Recording… Click the stop button when done.',
    micDeny: 'Microphone access denied. Please allow microphone permissions.',
    footer:
      'Admission Building, L. D. College of Engineering Campus, Navrangpura, Ahmedabad – 380 015 | acpc.gujarat.gov.in',
  },
  hi: {
    langCode: 'hi-IN',
    pageTitle: 'ACPC प्रवेश सहायक',
    pageSubtitle: 'ACPC प्रवेश के बारे में कोई भी प्रश्न पूछें — पाठ्यक्रम, पात्रता, पंजीकरण आदि।',
    welcome:
      'जय जय गर्वी गुजरात! 🙏 मैं ACPC प्रवेश सहायक हूँ। प्रवेश, पात्रता, महत्वपूर्ण तिथियों और पंजीकरण से संबंधित प्रश्नों में आपकी सहायता कर सकता हूँ। आज मैं आपकी कैसे मदद कर सकता हूँ?',
    placeholder: 'अपना प्रश्न यहाँ लिखें…',
    send: 'भेजें',
    suggestionsTitle: 'सुझाए गए प्रश्न',
    recording: 'रिकॉर्डिंग… समाप्त होने पर स्टॉप बटन दबाएं।',
    micDeny: 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया माइक्रोफ़ोन की अनुमति दें।',
    footer:
      'प्रवेश भवन, एल.डी. इंजीनियरिंग कॉलेज कैंपस, नवरंगपुरा, अहमदाबाद – 380 015 | acpc.gujarat.gov.in',
  },
  gu: {
    langCode: 'gu-IN',
    pageTitle: 'ACPC પ્રવેશ સહાયક',
    pageSubtitle: 'ACPC પ્રવેશ વિશે કોઈ પણ પ્રશ્ન પૂછો — અભ્યાસક્રમ, પાત્રતા, નોંધણી અને વધુ.',
    welcome:
      'જય જય ગર્વી ગુજરાત! 🙏 હું ACPC પ્રવેશ સહાયક છું. પ્રવેશ, પાત્રતા, મહત્વની તારીખો અને નોંધણી પ્રક્રિયા અંગે તમારી સહાય કરી શકું છું. આજે હું તમારી કેવી રીતે મદદ કરી શકું?',
    placeholder: 'તમારો પ્રવેશ પ્રશ્ન અહીં લખો…',
    send: 'મોકલો',
    suggestionsTitle: 'સૂચવેલ પ્રશ્નો',
    recording: 'રેકોર્ડિંગ… સમાપ્ત થાય ત્યારે સ્ટૉપ બટન દબાવો.',
    micDeny: 'માઇક્રોફોન ઍક્સેસ નામંજૂર. કૃપા કરીને માઇક્રોફોન પરવાનગી આપો.',
    footer:
      'પ્રવેશ ભવન, એલ.ડી. એન્જિનિયરિંગ કૉલેજ કેમ્પસ, નવરંગપુરા, અમદાવાદ – 380 015 | acpc.gujarat.gov.in',
  },
};

/* ─── Typing indicator ─── */
function TypingIndicator() {
  return (
    <div className={styles.msgRow}>
      <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}

/* ─── Collapsible sources panel ─── */
function CollapsibleSources({ sources }) {
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);

  const count = sources.length;

  return (
    <div className={styles.sources}>
      <button
        className={`${styles.sourcesToggle} ${open ? styles.sourcesToggleOpen : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Document icon */}
        <svg className={styles.sourcesIcon} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <span>
          {open ? 'Hide' : 'View'} {count} source{count !== 1 ? 's' : ''}
        </span>
        <svg
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={styles.sourcesList}
        ref={listRef}
        style={{
          maxHeight: open ? `${listRef.current?.scrollHeight ?? 1000}px` : '0px',
        }}
      >
        {sources.map((s, i) => (
          <div key={i} className={styles.sourceCard}>
            <div className={styles.sourceCardHeader}>
              <svg className={styles.sourceCardIcon} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <a href={s.url || '#'} target="_blank" rel="noreferrer" className={styles.sourceLink}>
                {s.file_name || s.url || 'Source'}
              </a>
            </div>
            {s.text_preview && (
              <p className={styles.sourcePreview}>{s.text_preview}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Single message bubble ─── */
function Message({ msg, onPlay, playingMsgId, isAudioPaused }) {
  const isUser = msg.role === 'user';
  const isThisPlaying = playingMsgId === msg.id;
  const isThisPaused = isThisPlaying && isAudioPaused;

  return (
    <div className={`${styles.msgRow} ${isUser ? styles.msgRowUser : ''}`}>
      {!isUser && (
        <div className={styles.botAvatar} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="#1B2D6E" />
            <text x="16" y="21" textAnchor="middle" fill="#F5A623" fontSize="10" fontWeight="700" fontFamily="Inter,sans-serif">AI</text>
          </svg>
        </div>
      )}

      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        {isUser ? (
          <p className={styles.bubbleText}>{msg.content}</p>
        ) : (
          <div className={styles.markdown}>
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}

        {!isUser && msg.sources && msg.sources.length > 0 && (
          <CollapsibleSources sources={msg.sources} />
        )}

        {!isUser && msg.audioBase64 && (
          <button
            className={`${styles.playBtn} ${isThisPlaying && !isThisPaused ? styles.playBtnActive : ''}`}
            onClick={() => onPlay(msg.id, msg.audioBase64)}
            title={isThisPlaying && !isThisPaused ? 'Pause audio' : 'Play audio response'}
          >
            {isThisPlaying && !isThisPaused ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {isThisPlaying && !isThisPaused ? 'Pause' : 'Play'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState('en');
  const t = I18N[lang];

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'assistant',
      content: I18N.en.welcome,
      sources: [],
      audioBase64: null,
    },
  ]);
  const [allSuggestions, setAllSuggestions] = useState({ en: [], hi: [], gu: [] });
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [receiveAudio, setReceiveAudio] = useState(false);
  const [error, setError] = useState(null);
  const [playingMsgId, setPlayingMsgId] = useState(null);
  const [isAudioPaused, setIsAudioPaused] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  /* Single audio instance — stops previous before playing new */
  const currentAudioRef = useRef(null);

  const stopAndCleanupAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      if (currentAudioRef.current._blobUrl) {
        URL.revokeObjectURL(currentAudioRef.current._blobUrl);
      }
      currentAudioRef.current = null;
    }
    setPlayingMsgId(null);
    setIsAudioPaused(false);
  };

  const playAudioBase64 = (msgId, audioBase64) => {
    // If same message is currently playing — toggle pause/resume
    if (currentAudioRef.current && playingMsgId === msgId) {
      if (isAudioPaused) {
        currentAudioRef.current.play().catch(() => {});
        setIsAudioPaused(false);
      } else {
        currentAudioRef.current.pause();
        setIsAudioPaused(true);
      }
      return;
    }

    // Stop any other audio before starting new playback
    stopAndCleanupAudio();
    if (!audioBase64) return;

    const binary = atob(audioBase64);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio._blobUrl = url;
    currentAudioRef.current = audio;
    setPlayingMsgId(msgId);
    setIsAudioPaused(false);
    audio.play().catch(() => {});
    audio.onended = () => {
      URL.revokeObjectURL(url);
      if (currentAudioRef.current === audio) {
        currentAudioRef.current = null;
        setPlayingMsgId(null);
        setIsAudioPaused(false);
      }
    };
  };

  /* Fetch all language sets of suggested questions once on mount */
  useEffect(() => {
    getSuggestedQuestions()
      .then(setAllSuggestions)
      .catch(() => { /* silently ignore — chips just won't show */ });
  }, []);

  /* Update welcome message when language changes */
  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === 'welcome' ? { ...msg, content: I18N[lang].welcome } : msg
      )
    );
  }, [lang]);

  /* Auto-scroll on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  /**
   * Send text or audio to the orchestrator.
   *
   * langCode: pass the Sarvam language code ONLY for FAQ chip queries so the
   * TTS response uses the selected language. For typed text and voice input,
   * leave undefined — Sarvam auto-detects and the LLM replies in kind.
   *
   * autoPlayAudio: true when the query was spoken (voice input) so the
   * bot's audio response plays automatically.
   */
  const dispatchMessage = async ({ textQuery, audioBlob }, langCode, autoPlayAudio = false) => {
    const userText = textQuery || '🎙️ Voice message';
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: userText, sources: [], audioBase64: null },
    ]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await sendChatMessage({
        sessionId: SESSION_ID,
        textQuery,
        audioBlob,
        language: langCode,   // undefined for non-FAQ paths
        receiveAudio,
      });

      const botMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          role: 'assistant',
          content: data.answer,
          sources: data.sources ?? [],
          audioBase64: data.audio_base64 ?? null,
        },
      ]);

      // Auto-play audio when the query came from the microphone
      if (autoPlayAudio && data.audio_base64) {
        playAudioBase64(botMsgId, data.audio_base64);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  /* Typed query — no language override, no auto-play */
  const handleSend = () => {
    const query = inputValue.trim();
    if (!query || isLoading) return;
    setInputValue('');
    dispatchMessage({ textQuery: query }, undefined, false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* FAQ chip — pass selected language so TTS responds in that language */
  const handleSuggested = (q) => {
    if (isLoading) return;
    dispatchMessage({ textQuery: q }, t.langCode, false);
  };

  /* ── Microphone recording ── */
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((trk) => trk.stop());
        // Voice query — no language override, auto-play the response
        dispatchMessage({ audioBlob: blob }, undefined, true);
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch {
      setError(t.micDeny);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const toggleMic = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* ── Page title strip ── */}
        <div className={styles.pageTitleStrip}>
          <div className={styles.pageTitleRow}>
            <div>
              <h1 className={styles.pageTitle}>{t.pageTitle}</h1>
              <p className={styles.pageSubtitle}>{t.pageSubtitle}</p>
            </div>
            <div className={styles.langSelector} role="group" aria-label="Select language">
              {[
                { key: 'en', label: 'EN' },
                { key: 'hi', label: 'हिं' },
                { key: 'gu', label: 'ગુ' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  className={`${styles.langBtn} ${lang === key ? styles.langBtnActive : ''}`}
                  onClick={() => setLang(key)}
                  aria-pressed={lang === key}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Chat card ── */}
        <div className={styles.chatCard}>

          {/* ── Messages ── */}
          <div className={styles.messagesArea} role="log" aria-live="polite">
            {messages.map((msg) => (
              <Message key={msg.id} msg={msg} onPlay={playAudioBase64} playingMsgId={playingMsgId} isAudioPaused={isAudioPaused} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Error banner ── */}
          {error && (
            <div className={styles.errorBanner} role="alert">
              <span>{error}</span>
              <button className={styles.errorClose} onClick={() => setError(null)}>✕</button>
            </div>
          )}

          {/* ── Suggested questions ── */}
          {(allSuggestions[lang] ?? []).length > 0 && (
            <div className={styles.suggestionsRow} aria-label={t.suggestionsTitle}>
              {(allSuggestions[lang] ?? []).map((q) => (
                <button
                  key={q}
                  className={styles.suggestionChip}
                  onClick={() => handleSuggested(q)}
                  disabled={isLoading}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Input bar ── */}
          <div className={styles.inputBar}>
            <textarea
              ref={inputRef}
              className={styles.inputField}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.placeholder}
              rows={1}
              disabled={isLoading || isRecording}
              aria-label="Chat input"
            />

            {/* Audio toggle button */}
            <button
              className={`${styles.audioToggleBtn} ${receiveAudio ? styles.audioToggleBtnActive : ''}`}
              onClick={() => setReceiveAudio((prev) => !prev)}
              title={receiveAudio ? 'Disable audio responses' : 'Enable audio responses'}
              aria-label={receiveAudio ? 'Disable audio responses' : 'Enable audio responses'}
              aria-pressed={receiveAudio}
            >
              {receiveAudio ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 8.14v7.72A4.49 4.49 0 0 0 16.5 12zM14 3.23v2.06a6.51 6.51 0 0 1 0 13.42v2.06A8.51 8.51 0 0 0 14 3.23z" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 12A4.5 4.5 0 0 0 14 8.14v2.12l2.45 2.45c.03-.23.05-.47.05-.71zm2.5 0c0 .93-.21 1.82-.58 2.62l1.49 1.49A8.44 8.44 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.46 8.46 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              )}
            </button>

            {/* Mic button */}
            <button
              className={`${styles.micBtn} ${isRecording ? styles.micBtnActive : ''}`}
              onClick={toggleMic}
              disabled={isLoading}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
            >
              {isRecording ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="6" width="12" height="12" rx="2" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v6a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zM6.3 10.5a.75.75 0 0 1 .75.75 5 5 0 0 0 9.9 0 .75.75 0 0 1 1.5 0 6.5 6.5 0 0 1-5.7 6.45V20h2.25a.75.75 0 0 1 0 1.5h-6a.75.75 0 0 1 0-1.5H11v-2.3A6.5 6.5 0 0 1 5.55 11.25a.75.75 0 0 1 .75-.75z" />
                </svg>
              )}
            </button>

            {/* Send button */}
            <button
              className={styles.sendBtn}
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <span className={styles.spinner} />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              )}
              <span>{t.send}</span>
            </button>
          </div>

          {isRecording && (
            <p className={styles.recordingHint}>
              <span className={styles.recDot} /> {t.recording}
            </p>
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}
