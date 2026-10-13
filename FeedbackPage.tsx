import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, MessageSquare, ThumbsUp, CheckCircle, UserCheck } from 'lucide-react';

export const FeedbackPage: React.FC = () => {
  const { feedbacks, complaints, openComplaintDetails } = useApp();

  const totalReviews = feedbacks.length;
  const averageRating =
    totalReviews > 0
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
      : '5.0';

  const ratingCounts = [5, 4, 3, 2, 1].map((r) => {
    const count = feedbacks.filter((f) => f.rating === r).length;
    const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { rating: r, count, pct };
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Student Satisfaction & Service Feedback</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Reviews and quality ratings submitted by hostel residents following ticket completion
        </p>
      </div>

      {/* Aggregate Score Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs flex flex-col items-center justify-center text-center space-y-2">
          <div className="text-4xl font-extrabold text-slate-900 font-mono tabular-nums">
            {averageRating}
          </div>
          <div className="flex text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${
                  star <= Math.round(Number(averageRating))
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-slate-200'
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-slate-500">Based on {totalReviews} student reviews</p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-2.5">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Rating Distribution
          </h3>
          {ratingCounts.map(({ rating, count, pct }) => (
            <div key={rating} className="flex items-center gap-3 text-xs">
              <span className="w-12 font-medium text-slate-600 flex items-center gap-1">
                <span>{rating}</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
              <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-12 text-right font-mono tabular-nums text-slate-400 text-[11px]">
                {count} ({pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feedback Feed */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Recent Student Reviews</h2>

        {feedbacks.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            No feedback entries yet. Ratings appear here after student sign-off.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {feedbacks.map((f) => {
              const matchedComplaint = complaints.find((c) => c.complaint_id === f.complaint_id);

              return (
                <div
                  key={f.feedback_id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= f.rating ? 'fill-amber-400' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                        {new Date(f.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 leading-relaxed italic">
                      "{f.comments}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <div>
                      <span className="font-semibold text-slate-800">{f.student_name}</span>
                      {matchedComplaint && (
                        <span> · {matchedComplaint.hostel_block} ({matchedComplaint.room_number})</span>
                      )}
                    </div>

                    {matchedComplaint && (
                      <button
                        onClick={() => openComplaintDetails(matchedComplaint.complaint_id)}
                        className="font-mono font-medium text-blue-600 hover:underline"
                      >
                        {matchedComplaint.complaint_id}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
