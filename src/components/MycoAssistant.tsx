import React, { useState } from "react";
import { Sparkles, Loader2, Copy, Check, ArrowRightLeft } from "lucide-react";

interface MycoAssistantProps {
  authToken: string;
  onResultAccepted: (text: string) => void;
}

export default function MycoAssistant({ authToken, onResultAccepted }: MycoAssistantProps) {
  const [promptInput, setPromptInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const presetTemplates = [
    {
      label: "Spawning Copy",
      prompt: "Draft an attractive, professional bio-tech description for dynamic Pearl Oyster Mushroom Grain Spawn grown on local Tunisian grain, emphasizing heavy clusters and local adaptability.",
    },
    {
      label: "French Technical Spec",
      prompt: "Rédiger une fiche technique professionnelle en français pour le mycélium sur grains d'orge tunisienne (Mycelium spawn) destiné aux agriculteurs de Béja. Expliquer les conditions d'incubation stériles.",
    },
    {
      label: "Tunisian Pitch (Deriya)",
      prompt: "Write a friendly informational marketing post in Tunisian Arabic (Derja using Latin characters / letters) explaining the massive circular economy benefits of upcycling olive mill pomace (Zabara) for substrate blocks instead of burning it.",
    },
    {
      label: "Bio-packaging Pitch",
      prompt: "Draft a concise carbon-negative sales copy for MycoPack Bio-packaging to pitch to organic olive oil suppliers in Sfax, explaining why compostable mycelium packaging beats styrofoam.",
    },
  ];

  const handleGenerate = async (finalPrompt: string) => {
    if (!finalPrompt.trim()) return;
    setIsLoading(true);
    setErrorMessage("");
    setGeneratedResult("");

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setGeneratedResult(data.text);
      } else {
        setErrorMessage(data.error || "Failed to contact Gemini engine.");
      }
    } catch (err: any) {
      setErrorMessage("Network error occurred while fetching Gemini API.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-br from-emerald-950 to-stone-900 text-stone-100 rounded-2xl p-6 shadow-xl border border-emerald-800">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-medium text-lg text-white">Myco AI Copy Assistant</h3>
          <p className="text-xs text-stone-300">Produce instant bio-tech specifications and localized copy powered by Gemini 2.5 Flash</p>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="mb-4">
        <span className="text-xs text-stone-400 block mb-2 font-mono">Quick Copywriting Presets:</span>
        <div className="flex flex-wrap gap-2">
          {presetTemplates.map((tmpl, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setPromptInput(tmpl.prompt);
                handleGenerate(tmpl.prompt);
              }}
              className="px-2.5 py-1.5 bg-stone-800 hover:bg-emerald-900 border border-stone-700 hover:border-emerald-700 text-xs text-stone-200 hover:text-white rounded-lg transition-all font-light"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleGenerate(promptInput);
        }}
        className="space-y-3"
      >
        <textarea
          rows={3}
          value={promptInput}
          onChange={(e) => setPromptInput(e.target.value)}
          placeholder="Ask Gemini to draft descriptions, translate mycelial parameters, or formulate emails for local organic growers..."
          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2.5 text-sm text-stone-200 placeholder-stone-500 focus:outline-hidden focus:border-emerald-500 transition-all font-light"
        />

        <div className="flex justify-between items-center gap-4">
          {errorMessage && <p className="text-xs text-rose-400 font-mono flex-1">{errorMessage}</p>}
          {!errorMessage && <span className="text-[10px] text-stone-500 font-mono">No keys sent to browser (Secured)</span>}
          
          <button
            type="submit"
            disabled={isLoading || !promptInput.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 disabled:opacity-40 rounded-xl text-xs font-semibold tracking-wide transition-all ml-auto shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Generate Copy
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generation Results View */}
      {generatedResult && (
        <div className="mt-5 pt-5 border-t border-stone-800/80 space-y-3">
          <div className="flex justify-between items-center bg-stone-950 px-3 py-1.5 rounded-lg border border-stone-800">
            <span className="text-xs font-semibold text-emerald-400 font-display">Gemini Copy Offer:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-white transition-colors"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={() => onResultAccepted(generatedResult)}
                className="flex items-center gap-1 text-[11px] px-2 py-0.5 bg-emerald-900/40 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 hover:text-emerald-100 rounded-md transition-colors"
                title="Insert directly into editing form"
              >
                <ArrowRightLeft className="w-3 h-3" />
                <span>Use Copy</span>
              </button>
            </div>
          </div>
          
          <div className="bg-stone-950 rounded-xl p-4 border border-stone-900 max-h-64 overflow-y-auto text-sm leading-relaxed text-stone-300 font-light whitespace-pre-wrap">
            {generatedResult}
          </div>
        </div>
      )}
    </div>
  );
}
