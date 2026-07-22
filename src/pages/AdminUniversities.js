import { useEffect, useState } from 'react';
import { getUniversities, saveUniversities } from '../data/universities';

export default function AdminUniversities() {
  const [universities, setUniversities] = useState([]);
  const [form, setForm] = useState({ name: '', city: '' });

  useEffect(() => {
    setUniversities(getUniversities());
  }, []);

  const handleAdd = event => {
    event.preventDefault();
    if (!form.name.trim() || !form.city.trim()) return;
    const next = [...universities, { id: crypto.randomUUID?.() || `${Date.now()}`, name: form.name.trim(), city: form.city.trim() }];
    setUniversities(next);
    saveUniversities(next);
    setForm({ name: '', city: '' });
  };

  const removeUniversity = id => {
    const next = universities.filter(item => item.id !== id);
    setUniversities(next);
    saveUniversities(next);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Gestion des universités</h1>
        <p className="mt-2 text-slate-500">Ajoutez ou supprimez les établissements disponibles dans le filtre des logements.</p>

        <form onSubmit={handleAdd} className="mt-8 grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 md:grid-cols-[1fr_1fr_auto]">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nom de l’université" className="rounded-2xl border border-slate-300 bg-white px-4 py-3" />
          <input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Ville" className="rounded-2xl border border-slate-300 bg-white px-4 py-3" />
          <button className="rounded-2xl bg-amber-400 px-5 py-3 font-semibold text-slate-950">Ajouter</button>
        </form>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {universities.map(item => (
            <div key={item.id} className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
              <div>
                <p className="font-semibold text-slate-950">{item.name}</p>
                <p className="text-sm text-slate-600">{item.city}</p>
              </div>
              <button onClick={() => removeUniversity(item.id)} className="rounded-full border border-red-500 px-3 py-2 text-sm text-red-400">Supprimer</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
