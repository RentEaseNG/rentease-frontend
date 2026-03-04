import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

const ReviewForm = ({ onReviewAdded, editingReview, onCancelEdit }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const { user, token } = useAuth();
    const { id } = useParams();

    const isEditMode = Boolean(editingReview);

    // Pre-fill form when entering edit mode
    useEffect(() => {
        if (editingReview) {
            setComment(editingReview.comment || '');
            setRating(editingReview.rating || 0);
            setHoveredRating(0);
            setError('');
        } else {
            setComment('');
            setRating(0);
            setHoveredRating(0);
            setError('');
        }
    }, [editingReview]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !comment.trim()) {
            setError('Please provide both a star rating and a comment.');
            return;
        }

        setIsSubmitting(true);
        setError('');

        try {
            if (isEditMode) {
                // PUT /api/reviews/:reviewId
                await axios.put(
                    `http://localhost:5000/api/reviews/${editingReview._id}`,
                    { rating, comment },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } else {
                // POST /api/reviews
                await axios.post(
                    'http://localhost:5000/api/reviews',
                    { propertyId: id, rating, comment },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            }

            if (onReviewAdded) onReviewAdded();
        } catch (err) {
            console.error("Error submitting review:", err);
            setError(err.response?.data?.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-base mb-3">
                {isEditMode ? 'Edit your review' : 'Add your review'}
            </h3>
            {user ? (
                <form onSubmit={handleReviewSubmit}>
                    {/* Star rating */}
                    <div className="flex items-center mb-3">
                        <span className="mr-2 text-sm text-gray-600">Rating:</span>
                        <div
                            className="flex"
                            onMouseLeave={() => setHoveredRating(0)}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoveredRating(star)}
                                    fill={(hoveredRating || rating) >= star ? "#FFD700" : "none"}
                                    stroke={(hoveredRating || rating) >= star ? "#FFD700" : "currentColor"}
                                    className="cursor-pointer transition-colors"
                                />
                            ))}
                        </div>
                        {rating > 0 && (
                            <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
                        )}
                    </div>

                    {/* Comment textarea */}
                    <textarea
                        rows={4}
                        placeholder="Write a comment..."
                        className="border p-2 rounded w-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />

                    {/* Error message */}
                    {error && (
                        <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400 text-sm cursor-pointer"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? (isEditMode ? 'Saving...' : 'Submitting...')
                                : (isEditMode ? 'Save Changes' : 'Submit Review')}
                        </button>
                        {isEditMode && (
                            <button
                                type="button"
                                onClick={() => {
                                    setError('');
                                    onCancelEdit();
                                }}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm cursor-pointer"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            ) : (
                <button className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 text-sm">
                    Login to leave a review
                </button>
            )}
        </div>
    );
}

export default ReviewForm