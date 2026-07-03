"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

const playfair = "'Playfair Display', serif";
const dmSans = "'DM Sans', sans-serif";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export function ProductReviews({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEligible, setIsEligible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchReviews = () => {
    setIsLoading(true);
    fetch(`/api/products/${slug}/reviews`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setReviews(json.data.reviews);
          setIsEligible(json.data.isEligible);
        }
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReviews();
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/products/${slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment })
      });

      if (res.ok) {
        setComment("");
        setRating(5);
        fetchReviews(); // Re-fetch to get new review
      } else {
        const err = await res.json();
        alert(err.message || "Failed to submit review");
      }
    } catch (e) {
      alert("Error submitting review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-24 pt-16 border-t border-outline-variant/30" id="reviews">
      <h2 className="mb-12 text-center" style={{ fontFamily: playfair, fontSize: "36px" }}>Customer Reviews</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Reviews List */}
        <div className="lg:col-span-8 space-y-8">
          {isLoading ? (
            <p className="text-on-surface-variant">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-on-surface-variant italic" style={{ fontFamily: dmSans }}>
              No reviews yet. Be the first to review this product!
            </p>
          ) : (
            reviews.map(review => (
              <div key={review.id} className="border-b border-outline-variant/30 pb-8">
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex text-secondary">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-[16px] ${i < review.rating ? 'text-[#1b1c1c]' : 'text-outline-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-on-surface-variant text-sm font-medium" style={{ fontFamily: dmSans }}>
                    {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
                <h4 className="font-semibold mb-2" style={{ fontFamily: dmSans }}>{review.userName}</h4>
                <p className="text-on-surface-variant leading-relaxed" style={{ fontFamily: dmSans }}>
                  {review.comment}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Review Form / Prompt */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-xl border border-outline-variant/30 shadow-sm sticky top-32">
            <h3 className="uppercase tracking-widest font-semibold text-xs mb-6 text-on-surface" style={{ fontFamily: dmSans }}>Write a Review</h3>
            
            {!isEligible ? (
              <p className="text-on-surface-variant text-sm leading-relaxed" style={{ fontFamily: dmSans }}>
                You can only write a review for products you have purchased and received. Log in with an account that has completed an order for this item.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2" style={{ fontFamily: dmSans }}>Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`material-symbols-outlined text-2xl hover:scale-110 transition-transform ${star <= rating ? 'text-[#1b1c1c]' : 'text-outline-variant'}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-on-surface-variant mb-2" style={{ fontFamily: dmSans }}>Your Review</label>
                  <textarea 
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 bg-transparent border border-outline-variant rounded-lg outline-none focus:border-primary text-sm"
                    style={{ fontFamily: dmSans }}
                    placeholder="What did you like about this product?"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#1b1c1c] text-white py-3 rounded-lg uppercase tracking-widest font-semibold text-xs hover:bg-[#343534] transition-colors disabled:opacity-50"
                  style={{ fontFamily: dmSans }}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
