
import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout';
import ToolCard from './components/ToolCard';
import { TOOLS_DATA } from './constants';
import { askGemini } from './services/geminiService';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState('definition');
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await askGemini(userMessage);
      setChatHistory(prev => [...prev, { role: 'ai', content: response || "Désolé, je n'ai pas pu générer de réponse." }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'ai', content: "Une erreur est survenue lors de la communication avec l'IA." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const chartData = [
    { name: 'CI/CD', value: 30, color: '#3b82f6' },
    { name: 'Monitoring', value: 20, color: '#10b981' },
    { name: 'Cloud/IaC', value: 25, color: '#6366f1' },
    { name: 'Securité', value: 25, color: '#f59e0b' },
  ];

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      
      {/* SECTION: DEFINITION */}
      {activeSection === 'definition' && (
        <section className="animate-in fade-in duration-500">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Qu'est-ce que le DevOps ?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Bien plus qu'une simple liste d'outils, le DevOps est un mouvement culturel et une approche de l'ingénierie logicielle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-2xl font-bold mb-4 text-blue-600 flex items-center gap-2">
                <i className="fas fa-brain"></i> La Philosophie
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                Le terme "DevOps" est la contraction de <strong>Development</strong> (Développement) et <strong>Operations</strong> (Exploitation). C'est une culture qui vise à supprimer les silos entre ces deux mondes traditionnellement séparés.
              </p>
              <ul className="space-y-3 text-slate-700">
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span><strong>Collaboration :</strong> Partage des responsabilités du début à la fin.</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span><strong>Automatisation :</strong> Réduire les erreurs humaines et accélérer les cycles.</span>
                </li>
                <li className="flex items-start gap-3">
                  <i className="fas fa-check-circle text-green-500 mt-1"></i>
                  <span><strong>Amélioration Continue :</strong> Cycles de feedback rapides (Fail fast, learn fast).</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-center items-center text-center">
              <div className="text-5xl mb-6">
                <i className="fas fa-infinity animate-pulse text-blue-400"></i>
              </div>
              <h3 className="text-2xl font-bold mb-4">La Boucle Infinie</h3>
              <p className="text-blue-100 italic">
                Plan &rarr; Code &rarr; Build &rarr; Test &rarr; Release &rarr; Deploy &rarr; Operate &rarr; Monitor
              </p>
              <div className="mt-8 grid grid-cols-2 gap-4 w-full text-sm">
                <div className="bg-blue-800/50 p-3 rounded-lg">Cycle de vie unifié</div>
                <div className="bg-blue-800/50 p-3 rounded-lg">Feedback constant</div>
                <div className="bg-blue-800/50 p-3 rounded-lg">Déploiement agile</div>
                <div className="bg-blue-800/50 p-3 rounded-lg">Qualité intégrée</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-2xl font-bold mb-6 text-slate-800">Les Objectifs Principaux</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Vitesse", desc: "Augmenter la fréquence des déploiements.", icon: "fa-bolt", color: "text-yellow-500" },
                { title: "Fiabilité", desc: "Assurer la qualité et la stabilité des services.", icon: "fa-shield-halved", color: "text-blue-500" },
                { title: "Évolutivité", desc: "Gérer l'infrastructure à grande échelle.", icon: "fa-up-right-and-down-left-from-center", color: "text-purple-500" },
                { title: "Sécurité", desc: "Intégrer la sécurité dès le départ (DevSecOps).", icon: "fa-lock", color: "text-red-500" },
              ].map((obj, i) => (
                <div key={i} className="text-center p-4">
                  <div className={`${obj.color} text-3xl mb-3`}>
                    <i className={`fas ${obj.icon}`}></i>
                  </div>
                  <h4 className="font-bold text-slate-900 mb-1">{obj.title}</h4>
                  <p className="text-sm text-slate-500">{obj.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION: ROLE */}
      {activeSection === 'role' && (
        <section className="animate-in slide-in-from-bottom-4 duration-500">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">L'Ingénieur DevOps</h2>
            <p className="text-xl text-slate-600">Un pont stratégique entre la création de valeur et la stabilité opérationnelle.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold mb-4 text-indigo-600">Responsabilités Clés</h3>
                <div className="space-y-4">
                  {[
                    { t: "Automatisation des Pipelines", d: "Conception et maintenance des chaînes CI/CD pour automatiser le cycle de vie applicatif." },
                    { t: "Gestion de l'Infrastructure", d: "Utilisation d'outils IaC pour provisionner et gérer les serveurs et services cloud." },
                    { t: "Optimisation de la Performance", d: "Monitorer les systèmes pour garantir une latence minimale et une disponibilité maximale." },
                    { t: "Culture de Partage", d: "Former les développeurs aux bonnes pratiques Ops et vice-versa." }
                  ].map((res, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="bg-indigo-50 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{res.t}</h4>
                        <p className="text-slate-600">{res.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
                <h3 className="text-2xl font-bold mb-4 text-emerald-600">Impact Organisationnel</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2">Pour les Devs</h4>
                    <p className="text-sm text-emerald-700">Plus d'autonomie, moins d'attente pour les déploiements, focus sur le code métier.</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2">Pour les Ops</h4>
                    <p className="text-sm text-blue-700">Moins de tâches manuelles répétitives, meilleure visibilité, infrastructure stable et reproductible.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold mb-6 text-slate-900 text-center">Focus des Activités</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-4 text-sm text-slate-500 text-center italic">
                Répartition type du temps de travail d'un expert DevOps.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: TOOLS */}
      {activeSection === 'tools' && (
        <section className="animate-in fade-in duration-500">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">L'Écosystème DevOps</h2>
            <p className="text-xl text-slate-600">Les meilleurs outils pour chaque étape du cycle de vie.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS_DATA.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-center text-white">
            <h3 className="text-2xl font-bold mb-4">Comment choisir son outil ?</h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">Le choix dépend de votre stack technique, de la taille de votre équipe et de votre budget. Priorisez toujours l'interopérabilité et le support communautaire.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">Open-source first</span>
              <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">Scalabilité</span>
              <span className="bg-slate-800 px-4 py-2 rounded-full text-sm border border-slate-700">Documentation</span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION: ASSISTANT IA */}
      {activeSection === 'assistant' && (
        <section className="animate-in zoom-in-95 duration-500 h-[calc(100vh-140px)] flex flex-col">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900">Assistant DevOps IA</h2>
              <p className="text-slate-600">Posez vos questions techniques sur Docker, K8s, CI/CD, etc.</p>
            </div>
            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
              <i className="fas fa-sparkles"></i> Propulsé par Gemini
            </div>
          </div>

          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col mb-4">
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatHistory.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                  <i className="fas fa-robot text-6xl text-slate-300"></i>
                  <p className="text-slate-500 max-w-sm">Je suis prêt à vous aider. Demandez-moi par exemple : "Explique-moi la différence entre Terraform et Ansible".</p>
                </div>
              )}
              {chatHistory.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-100 text-slate-800 rounded-tl-none prose prose-sm max-w-none'
                  }`}>
                    {msg.role === 'ai' ? (
                      <div dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br/>') }} />
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-slate-50 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Votre question DevOps..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>Envoyer</span>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </section>
      )}

    </Layout>
  );
};

export default App;
