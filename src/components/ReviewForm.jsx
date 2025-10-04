import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Star } from 'lucide-react';

const ReviewForm = ({ onReviewAdded }) => {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user, token } = useAuth();
    const { id } = useParams();

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!rating || !comment.trim()) return;
        
        setIsSubmitting(true);
        
        try {
            const response = await axios.post('http://localhost:5000/api/reviews', {
                propertyId: id,
                rating,
                comment
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            
            // Reset the form
            setComment('');
            setRating(0);
            setHoveredRating(0);
            
            // Call the callback to refresh reviews
            if (onReviewAdded) {
                onReviewAdded();
            }
        } catch (error) {
            console.error("Error submitting review:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleStarHover = (hoveredStar) => {
        setHoveredRating(hoveredStar);
    };

    const handleMouseLeave = () => {
        setHoveredRating(0);
    };

    return (
        <div>
            <h3 className="mt-4">Add your review</h3>
            {user ? (
                <form onSubmit={handleReviewSubmit}>
                    <div className="flex items-center my-3">
                        <span className="mr-2">Rating: </span>
                        <div 
                            className="flex" 
                            onMouseLeave={handleMouseLeave}
                        >
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={24}
                                    onClick={() => handleStarClick(star)}
                                    onMouseEnter={() => handleStarHover(star)}
                                    fill={(hoveredRating || rating) >= star ? "#FFD700" : "none"}
                                    stroke={(hoveredRating || rating) >= star ? "#FFD700" : "currentColor"}
                                    className="cursor-pointer transition-colors"
                                />
                            ))}
                        </div>
                        <span className="ml-2">{rating > 0 ? `${rating}/5` : ""}</span>
                    </div>
                    <textarea
                        type="text"
                        rows={4}
                        placeholder="Write a comment..."
                        className="border p-2 rounded w-full"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    
                    <button 
                        type="submit" 
                        className="mt-2 bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            ) : (
                <button className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800">
                    Login to Continue
                </button>
            )}
        </div>
    )
}

export default ReviewForm