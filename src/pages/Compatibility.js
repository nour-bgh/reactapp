import { useState } from 'react';
import KeysBackground from '../components/KeysBackground';

const questions = [
  { key: 'clean', label: 'Niveau de propreté', options: ['Relax', 'Equilibré', 'Très propre'] },
  { key: 'social', label: 'Sociabilité', options: ['Discret', 'Ouvert', 'Fêtard'] },
  { key: 'schedule', label: 'Horaires', options: ['Tôt', 'Standard', 'Nocturne'] },
  { key: 'study', label: 'Étude', options: ['Espaces calmes', 'Flexible', 'Partage des espaces'] },
  { key: 'guest', label: 'Invités', options: ['Rares', 'Occasionnels', 'Fréquents'] },
];

export default function Compatibility() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = Object.values(answers).filter(Boolean).length;

  return (
    <div className="relative min-h-screen bg-white dark:bg-slate-950">
      <KeysBackground />
      <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-2xl shadow-slate-300/10 dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-bold text-slate-950 dark:text-slate-100">Questionnaire de compatibilité</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Décrivez votre style de vie pour trouver des colocataires qui partagent vos attentes.</p>
          <form className="mt-10 space-y-8" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
            {questions.map(question => (
              <div key={question.key} className="rounded-3xl bg-slate-50 p-6 dark:bg-slate-800">
                <p className="text-lg font-semibold text-slate-950 dark:text-slate-100">{question.label}</p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {question.options.map(option => (
                    <button key={option} type="button" onClick={() => setAnswers({ ...answers, [question.key]: option })} className={`rounded-2xl border px-4 py-3 text-sm transition ${answers[question.key] === option ? 'border-amber-300 bg-amber-400/10 text-amber-200' : 'border-slate-300 bg-slate-50 text-slate-600 hover:border-amber-300 hover:text-slate-950 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:text-slate-100'}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <button type="submit" className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300">Voir le résultat</button>
          </form>
          {submitted && (
            <div className="mt-10 rounded-[1.75rem] bg-slate-50 p-6 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <h2 className="text-2xl font-semibold text-slate-950 dark:text-slate-100">Résultat</h2>
              <p className="mt-3 text-slate-600 dark:text-slate-400">Votre profil est complété à {score}/{questions.length} réponses. Plus vos réponses sont précises, plus vous pourrez trouver la bonne coloc.</p>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
                {questions.map(question => (
                  <div key={question.key} className="rounded-3xl bg-white/80 p-4 dark:bg-slate-900/80">
                    <p className="font-semibold text-slate-950 dark:text-slate-100">{question.label}</p>
                    <p>{answers[question.key] || 'Non répondu'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}