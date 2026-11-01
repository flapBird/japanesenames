"use client";

import { useEffect, useRef, useState } from "react";
import { StopIcon, VolumeIcon } from "@/components/icons";
import { trackEvent } from "@/lib/analytics";

export function PronunciationButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [supported, setSupported] = useState(false);
  const [playing, setPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    setSupported(
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    );

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function togglePlayback() {
    if (!supported) return;

    const speech = window.speechSynthesis;
    if (playing) {
      speech.cancel();
      utteranceRef.current = null;
      setPlaying(false);
      return;
    }

    speech.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const japaneseVoice = speech
      .getVoices()
      .find((voice) => voice.lang.toLowerCase().startsWith("ja"));

    utterance.lang = "ja-JP";
    utterance.rate = 0.86;
    if (japaneseVoice) utterance.voice = japaneseVoice;
    utterance.onstart = () => setPlaying(true);
    utterance.onend = () => {
      utteranceRef.current = null;
      setPlaying(false);
    };
    utterance.onerror = () => {
      utteranceRef.current = null;
      setPlaying(false);
    };

    utteranceRef.current = utterance;
    setPlaying(true);
    speech.speak(utterance);
    trackEvent("play_pronunciation", { label, reading: text });
  }

  const actionLabel = playing
    ? `Stop pronunciation of ${label}`
    : `Play pronunciation of ${label}`;

  return (
    <button
      aria-label={actionLabel}
      aria-pressed={playing}
      className={`button-quiet !size-10 !min-h-10 !shrink-0 !border !p-0 ${
        playing
          ? "!border-[#9eb8a8] !bg-(--moss-soft) !text-(--moss)"
          : "!border-(--line) !bg-(--surface) !text-(--muted) hover:!border-(--moss)"
      }`}
      disabled={!supported}
      onClick={togglePlayback}
      title={
        supported
          ? actionLabel
          : "Pronunciation is not supported in this browser"
      }
      type="button"
    >
      {playing ? <StopIcon /> : <VolumeIcon />}
      <span aria-live="polite" className="sr-only">
        {playing ? `Playing ${label}` : ""}
      </span>
    </button>
  );
}
