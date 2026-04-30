import { useState } from "react";
import drumImage from "@assets/9946127551a4804eff6e171a867a6ff8_1777541378461.jpg";

const tags = ["#bateria", "#percussão", "#barulho", "#tambores", "#rock", "#banda"];

const curriculum = [
  {
    id: 1,
    title: "1. Rudimentos",
    duration: "1h16",
    expanded: true,
    lessons: [
      { id: 1, title: "Ritmo", duration: "0:16", completed: true, current: false },
      { id: 2, title: "Single stroke roll e five stroke roll", duration: "0:30", completed: true, current: false },
      { id: 3, title: "Rulos, diddles, flams e drags", duration: "0:15", completed: false, current: true },
      { id: 4, title: "Introdução sobre viradas (drum fills)", duration: "0:15", completed: false, current: false },
    ],
  },
  {
    id: 2,
    title: "2. Drum Fills",
    duration: "2h10",
    expanded: false,
    lessons: [
      { id: 5, title: "Metrônomo a tempo", duration: "0:10", completed: false, current: false },
      { id: 6, title: "Técnica com uso do bumbo", duration: "0:30", completed: false, current: false },
      { id: 7, title: "3 compassos com virada simples", duration: "0:45", completed: false, current: false },
      { id: 8, title: "Conheça a virada na virada", duration: "0:45", completed: false, current: false },
    ],
  },
  {
    id: 3,
    title: "3. Pedais",
    duration: "3h56",
    expanded: false,
    lessons: [
      { id: 9, title: "Posicionamento correto dos pedais", duration: "0:16", completed: false, current: false },
      { id: 10, title: "Bumbo e chimbal (HiHat)", duration: "0:40", completed: false, current: false },
      { id: 11, title: "Pedais duplos", duration: "0:15", completed: false, current: false },
      { id: 12, title: "Posicionamento correto do kit", duration: "0:15", completed: false, current: false },
      { id: 13, title: "Técnica do Heel Up e Heel Down", duration: "0:30", completed: false, current: false },
      { id: 14, title: "Exemplos: John Bonham", duration: "0:15", completed: false, current: false },
      { id: 15, title: "Open HiHat e Closed HiHat", duration: "0:15", completed: false, current: false },
      { id: 16, title: "Exercícios, pt.1", duration: "0:15", completed: false, current: false },
      { id: 17, title: "Exercícios, pt.2", duration: "0:15", completed: false, current: false },
    ],
  },
];

const comments = [
  {
    id: 1,
    name: "Dave Grohl",
    time: "2 dias atrás",
    text: "Meu Deus do céu, você é demais Taylor Hawkins, você é demais!!!",
    likes: 1,
    color: "from-blue-400 to-cyan-400",
    initials: "DG",
  },
  {
    id: 2,
    name: "Kurt Cobain",
    time: "4 dias atrás",
    text: "Muito boa sua aula, parabéns!! Eu fiquei com um pouco de dúvida sobre a questão do grip das baquetas, tipo, parece que um pouco de movimentação diferente do esperado ou a força que eu coloco na pegada eu já posso gerar um som diferente no meu kit, sabe?",
    likes: 0,
    color: "from-purple-400 to-blue-400",
    initials: "KC",
  },
  {
    id: 3,
    name: "Leo Gamalho",
    time: "8 dias atrás",
    text: "Cara, eu que sou jogador de futebol e sempre fui muito mais do esporte do que da música, desde que conheci esse curso consegui tocar várias músicas e me divertir demais!! Acho que não tem nada mais relaxante e gostoso do que tocar um som e escutar que eu to conseguindo desenvolver algo gostoso de ouvir... Sem contar que por estar me desstressando e relaxando com o meu som, eu consegui ficar muito relaxado pras partidas e realmente esvaziar a cabeça... Parabéns mano, muito bom",
    likes: 0,
    color: "from-teal-400 to-cyan-500",
    initials: "LG",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} className={s <= rating ? "star-filled" : "star-empty"} width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function CheckIcon({ filled, current }: { filled: boolean; current: boolean }) {
  if (filled) {
    return (
      <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#3b9fd4,#5bc8f5)" }}>
        <svg width="10" height="10" fill="white" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </span>
    );
  }
  if (current) {
    return (
      <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: "#3b9fd4", background: "rgba(59,159,212,0.15)" }}>
        <span className="w-2 h-2 rounded-full" style={{ background: "#3b9fd4" }} />
      </span>
    );
  }
  return (
    <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: "rgba(100,160,210,0.4)" }}>
      <svg width="9" height="9" fill="none" viewBox="0 0 20 20" stroke="rgba(80,140,200,0.6)" strokeWidth="2">
        <polygon points="5,3 19,10 5,17" />
      </svg>
    </span>
  );
}

export default function CoursePage() {
  const [sections, setSections] = useState(curriculum);
  const [activeTab, setActiveTab] = useState("Comentários");
  const [activeTag, setActiveTag] = useState("#bateria");
  const [commentText, setCommentText] = useState("");
  const [playing, setPlaying] = useState(false);

  const toggleSection = (id: number) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s))
    );
  };

  const tabs = ["Transcrição", "Comentários", "Anexos", "Dúvidas", "Relacionados"];

  return (
    <div className="relative min-h-screen" style={{ position: "relative" }}>
      {/* Water orbs */}
      <div className="water-orb-1" />
      <div className="water-orb-2" />
      <div className="water-orb-3" />

      {/* NAVBAR */}
      <nav className="glass-nav sticky top-0 z-50">
        <div className="max-w-screen-2xl mx-auto px-6 h-14 flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center justify-center w-8 h-8 rounded-lg mr-2" style={{ background: "linear-gradient(135deg,#3b9fd4,#1a6fa8)" }}>
            <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Nav links */}
          {["Home", "Cursos", "Ferramentas", "Progresso", "Certificados"].map((link) => (
            <button
              key={link}
              className={`text-sm font-medium transition-colors px-1 pb-0.5 ${link === "Cursos" ? "text-blue-700 border-b-2 border-blue-500" : "text-blue-900/60 hover:text-blue-800"}`}
            >
              {link}
            </button>
          ))}

          {/* Search */}
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <input
                className="glass-input rounded-full text-sm px-4 py-1.5 pr-9 w-56 text-blue-900/80 placeholder:text-blue-900/35"
                placeholder="Digite aqui para realizar uma pesquisa"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500/70" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </div>
            <button className="glass-btn w-8 h-8 rounded-lg flex items-center justify-center text-blue-700/70">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
            <button className="glass-btn w-8 h-8 rounded-lg flex items-center justify-center text-blue-700/70">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden glass border-2 border-white/50 flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-400 text-white text-xs font-bold">
              TH
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="max-w-screen-2xl mx-auto px-6 py-5 relative z-10">
        {/* Back + Tags row */}
        <div className="flex items-center gap-3 mb-4">
          <button className="flex items-center gap-1.5 text-sm text-blue-800/70 hover:text-blue-900 transition-colors">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
          <div className="flex gap-2 flex-wrap">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`glass-tag ${activeTag === tag ? "active" : ""}`}
                onClick={() => setActiveTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-5">
          {/* LEFT COLUMN */}
          <div className="flex-1 min-w-0">
            {/* Video Player */}
            <div className="glass-card rounded-xl overflow-hidden mb-4">
              <div className="video-container">
                <img src={drumImage} alt="Drum lesson" className="w-full h-full object-cover" />
                <div className="play-overlay">
                  <button
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                    style={{ background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)", border: "2px solid rgba(255,255,255,0.45)" }}
                    onClick={() => setPlaying(!playing)}
                  >
                    {playing ? (
                      <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="22" height="22" fill="white" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </button>
                </div>
                {/* Subtitle */}
                <div className="absolute bottom-14 left-0 right-0 flex justify-center">
                  <span className="text-white text-sm px-3 py-1 rounded" style={{ background: "rgba(0,20,60,0.6)", backdropFilter: "blur(6px)" }}>
                    É justamente isso que a gente vai ver hoje aqui
                  </span>
                </div>
                {/* Controls */}
                <div className="video-controls">
                  <button className="text-white/90 hover:text-white" onClick={() => setPlaying(!playing)}>
                    {playing ? (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="6" y="4" width="4" height="16" rx="1" />
                        <rect x="14" y="4" width="4" height="16" rx="1" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </button>
                  {/* Skip icons */}
                  <button className="text-white/80 hover:text-white">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 20L9 12l10-8v16zM5 4h2v16H5z" />
                    </svg>
                  </button>
                  <button className="text-white/80 hover:text-white">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M5 4l10 8-10 8V4zm14 0h-2v16h2z" />
                    </svg>
                  </button>
                  <span className="text-white/80 text-xs">1:26 / 15:16</span>
                  {/* Progress bar */}
                  <div className="flex-1 h-1 rounded-full mx-1" style={{ background: "rgba(255,255,255,0.2)" }}>
                    <div className="h-1 rounded-full" style={{ width: "9%", background: "linear-gradient(90deg,#5bc8f5,#3b9fd4)" }} />
                  </div>
                  <div className="flex gap-2 ml-auto">
                    <button className="text-white/80 hover:text-white">
                      <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                    </button>
                    <button className="text-white/80 hover:text-white">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polygon points="11,5 6,9 2,9 2,15 6,15 11,19 11,5" />
                        <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" />
                      </svg>
                    </button>
                    <button className="text-white/80 hover:text-white">
                      <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Title + Rating */}
            <div className="glass-card rounded-xl px-5 py-4 mb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-blue-950/90 mb-1">Rulos, diddles, flams e drags</h1>
                  <p className="text-xs text-blue-800/50">12.365 visualizações · 4 de ago. de 2021</p>
                </div>
                <StarRating rating={5} />
              </div>
              {/* Action row */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-white/30">
                <button className="flex items-center gap-1.5 text-xs text-blue-800/65 hover:text-blue-900 transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" /><polyline points="16,6 12,2 8,6" /><line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Compartilhar aula
                </button>
                <button className="flex items-center gap-1.5 text-xs text-blue-800/65 hover:text-blue-900 transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  Adicionar à playlist
                </button>
                <button className="flex items-center gap-1.5 text-xs text-blue-800/65 hover:text-blue-900 transition-colors">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                  </svg>
                  Assistir mais tarde
                </button>
                <div className="ml-auto">
                  <button className="glass-btn-primary rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1.5">
                    Próxima aula
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Instructor row */}
            <div className="glass-card rounded-xl px-5 py-4 mb-4">
              <div className="flex gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#3b9fd4,#1a6fa8)" }}>TH</div>
                  <div>
                    <p className="text-xs text-blue-800/50 font-medium uppercase tracking-wide">Professor:</p>
                    <p className="text-sm font-semibold text-blue-950/85">Taylor Hawkins</p>
                  </div>
                </div>
                <div className="w-px bg-white/30" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#5bc8f5,#2090c0)" }}>BG</div>
                  <div>
                    <p className="text-xs text-blue-800/50 font-medium uppercase tracking-wide">Especialidade:</p>
                    <p className="text-sm font-semibold text-blue-950/85">Bateria / Guitarra</p>
                  </div>
                </div>
                <div className="w-px bg-white/30" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "linear-gradient(135deg,#7dd8f0,#3bb0d4)" }}>32</div>
                  <div>
                    <p className="text-xs text-blue-800/50 font-medium uppercase tracking-wide">Cursos:</p>
                    <p className="text-sm font-semibold text-blue-950/85">32</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 text-sm text-blue-900/70 leading-relaxed">
                Nessa aula eu preparei um conteúdo muito fundamental para o seu desenvolvimento de coordenação motora nos rudimentos, são eles os rulos, diddles, flams e drags. Esses rudimentos são movimentos básicos e necessários para que consigamos desenvolver um bom som; nessa aula eu apresento as frases básicas do instrumento e{" "}
                <button className="text-blue-600 font-medium hover:underline">Continuar lendo...</button>
              </p>
            </div>

            {/* Tabs */}
            <div className="glass-card rounded-xl overflow-hidden mb-4">
              <div className="flex border-b border-white/25">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-3 text-sm font-medium transition-all ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Comments panel */}
              {activeTab === "Comentários" && (
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-blue-800/70 font-medium">253 comentários</span>
                    <button className="flex items-center gap-1 text-xs text-blue-700/60 hover:text-blue-800 transition-colors">
                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" />
                        <line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
                      </svg>
                      Mais recentes
                    </button>
                  </div>

                  {/* Comment input */}
                  <div className="flex gap-3 mb-6">
                    <div className="comment-avatar bg-gradient-to-br from-blue-400 to-cyan-500 text-white">VC</div>
                    <div className="flex-1 relative">
                      <input
                        className="glass-input rounded-xl w-full px-4 py-2.5 text-sm text-blue-900/80 placeholder:text-blue-900/35 pr-10"
                        placeholder="Faça um comentário público digitando aqui..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500/60 hover:text-blue-600">
                        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22,2 15,22 11,13 2,9" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Comment list */}
                  <div className="flex flex-col gap-5">
                    {comments.map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className={`comment-avatar bg-gradient-to-br ${c.color} text-white`}>{c.initials}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-blue-950/85">{c.name}</span>
                            <span className="text-xs text-blue-800/40">{c.time}</span>
                          </div>
                          <p className="text-sm text-blue-900/65 leading-relaxed">{c.text}</p>
                          <div className="flex gap-4 mt-2">
                            <button className="flex items-center gap-1 text-xs text-blue-800/50 hover:text-blue-700">
                              <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
                                <path d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
                              </svg>
                              {c.likes}
                            </button>
                            <button className="text-xs text-blue-700 font-medium hover:underline">RESPONDER</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab !== "Comentários" && (
                <div className="p-8 text-center text-blue-800/40 text-sm">
                  Conteúdo de {activeTab} aqui
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="w-80 flex-shrink-0">
            <div className="glass-sidebar rounded-xl p-4 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scroll-custom">
              <h2 className="text-base font-bold text-blue-950/85 mb-1">Bateria: Conceitos Básicos</h2>
              <p className="text-xs text-blue-800/50 mb-3">Seu progresso</p>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-blue-900/80">22% completado</span>
                  <span className="text-xs text-blue-800/50 flex items-center gap-1">
                    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" />
                    </svg>
                    6h13
                  </span>
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: "rgba(150,200,240,0.25)" }}>
                  <div className="progress-bar-water h-2" style={{ width: "22%" }} />
                </div>
              </div>

              {/* Curriculum sections */}
              <div className="flex flex-col gap-2">
                {sections.map((section) => (
                  <div key={section.id}>
                    <button
                      className="section-header w-full flex items-center justify-between text-left"
                      onClick={() => toggleSection(section.id)}
                    >
                      <span className="text-sm font-semibold text-blue-950/80">{section.title}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-800/50">{section.duration}</span>
                        <svg
                          width="14" height="14"
                          fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                          className="transition-transform text-blue-700/50"
                          style={{ transform: section.expanded ? "rotate(180deg)" : "rotate(0deg)" }}
                        >
                          <polyline points="6,9 12,15 18,9" />
                        </svg>
                      </div>
                    </button>

                    {section.expanded && (
                      <div className="mt-1.5 flex flex-col gap-0.5">
                        {/* Section description for first section */}
                        {section.id === 1 && (
                          <p className="text-xs text-blue-800/55 px-1 py-1.5 leading-relaxed">
                            No primeiro módulo desse curso, estudaremos os rudimentos, que são pequenas combinações de sons padronizadas, que formam padrões <button className="text-blue-600">Ver mais...</button>
                          </p>
                        )}
                        {section.id === 2 && (
                          <p className="text-xs text-blue-800/55 px-1 py-1.5 leading-relaxed">
                            As viradas de bateria têm um papel fundamental para alcançar uma boa musicalidade. Elas são as pontes ou transições e são marcadas <button className="text-blue-600">Ver mais...</button>
                          </p>
                        )}
                        {section.id === 3 && (
                          <p className="text-xs text-blue-800/55 px-1 py-1.5 leading-relaxed">
                            Chegou a hora de aprendermos mais sobre pedais, que serão utilizados para você tocar em ritmo acelerado ou compor subdivisões mais complexas <button className="text-blue-600">Ver mais...</button>
                          </p>
                        )}
                        {section.lessons.map((lesson) => (
                          <div
                            key={lesson.id}
                            className={`glass-lesson-item rounded-lg px-3 py-2 flex items-center gap-2.5 cursor-pointer ${lesson.current ? "active" : ""}`}
                          >
                            <CheckIcon filled={lesson.completed} current={lesson.current} />
                            <span className={`text-xs flex-1 ${lesson.current ? "font-semibold text-blue-900/90" : "text-blue-900/65"}`}>
                              {lesson.title}
                            </span>
                            <span className="text-xs text-blue-800/40 flex-shrink-0">{lesson.duration}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
