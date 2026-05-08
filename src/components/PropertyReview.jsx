import apiClient from '../api/client';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewForm from './ReviewForm';
import { useAuth } from '../context/AuthContext';
import { Pencil, Trash2 } from 'lucide-react';

const PropertyReview = () => {
    const [reviews, setReviews] = useState([])
    const [editingReview, setEditingReview] = useState(null); // holds the review being edited
    const { id } = useParams();
    const { user, token } = useAuth();

    const fetchHouseReviews = async () => {
        try {
            const response = await apiClient.get(`/reviews/${id}`);
            const res = response.data.data
            setReviews(res)
        } catch (error) {
            console.error("Error fetching house reviews:", error);
        }
    };

    useEffect(() => {
        fetchHouseReviews();
    }, [id])

    const handleReviewAdded = () => {
        setEditingReview(null);
        fetchHouseReviews();
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete your review?')) return;
        try {
            await apiClient.delete(`/reviews/${reviewId}`);
            fetchHouseReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
            alert(error.response?.data?.message || 'Failed to delete review.');
        }
    };

    const renderStars = (rating) => {
        return [1, 2, 3, 4, 5].map((star) => (
            <span key={star} style={{ color: rating >= star ? '#FFD700' : '#ccc' }}>★</span>
        ));
    };

    return (
        <>
            <h3 className='font-semibold mt-6 text-lg'>Reviews ({reviews.length})</h3>
            {reviews.length > 0 ? (
                <ul className="space-y-3 mt-2">
                    {reviews.map((review) => {
                        const isOwner = user && review.tenant && (review.tenant._id === user._id || review.tenant._id === user.id);
                        return (
                            <li key={review._id} className="p-3 border rounded bg-white shadow-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="font-semibold">{review.tenant?.name || 'Anonymous'}</p>
                                        <div className="flex items-center gap-1 text-lg leading-none my-1">
                                            {renderStars(review.rating)}
                                            <span className="text-sm text-gray-500 ml-1">{review.rating}/5</span>
                                        </div>
                                        <p className="text-gray-700 text-sm">{review.comment}</p>
                                    </div>
                                    {isOwner && (
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => setEditingReview(review)}
                                                className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                                                title="Edit review"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(review._id)}
                                                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                title="Delete review"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 mt-2">No reviews yet. Be the first to leave one!</p>
            )}

            <ReviewForm
                onReviewAdded={handleReviewAdded}
                editingReview={editingReview}
                onCancelEdit={() => setEditingReview(null)}
            />
        </>
    )
}

export default PropertyReview