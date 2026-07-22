import { useState } from 'react';
import { reviews as baseReviews } from '../data/reviews';

export default function AdminReviews() {
  const [reviews, setReviews] = useState(baseReviews);

  const approveReview = id => {
    setReviews(current => current.map(item => item.id === id ? { ...item, status: 'approuvé' } : item));
  };

  const deleteReview = id => {
    setReviews(current => current.map(item => item.id === id ? { ...item, status: 'supprimé' } : item));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl shadow-slate-300/10">
        <h1 className="text-3xl font-bold text-slate-950">Modération des avis</h1>
        <p className="mt-2 text-slate-500">Approuvez ou supprimez les commentaires laissés sur les logements et propriétaires.</p>

        <div className="mt-8 grid gap-6">
          {reviews.map(review => (
            <div key={review.id} className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-950">{review.authorName}</p>
                  <p className="text-sm text-slate-500">{review.createdAt}</p>
                </div>
                <span className={`rounded-full px-3 py-2 text-xs ${review.status === 'approuvé' ? 'bg-emerald-500/10 text-emerald-400' : review.status === 'supprimé' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {review.status}
                </span>
              </div>
              <p className="mt-4 text-slate-600">{review.content}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {review.status !== 'approuvé' && <button onClick={() => approveReview(review.id)} className="rounded-full border border-emerald-500 px-4 py-2 text-sm text-emerald-400">Approuver</button>}
                {review.status !== 'supprimé' && <button onClick={() => deleteReview(review.id)} className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-400">Supprimer</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
