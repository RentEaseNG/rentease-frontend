import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReviewForm from './ReviewForm';

const PropertyReview = () => {
    const [reviews, setReviews] = useState([])
    const { id } = useParams();
    
    const fetchHouseReviews = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/reviews/${id}`);
            const res = response.data.data
            setReviews(res)
        } catch (error) {
            console.error("Error fetching house details:", error);
        }
    };
    
    useEffect(() => {
        fetchHouseReviews();
    }, [id])
    
    // This function will be passed to ReviewForm to refresh reviews after submission
    const handleReviewAdded = () => {
        fetchHouseReviews();
    };
    
    return (
        <>
            <h3 className='font-semibold'>Reviews</h3>
            {reviews.length > 0 ? (
                <ul className="space-y-2">
                    {reviews.map((review, index) => (
                        <li key={index} className="p-2 border rounded">
                            <p><strong>{review.tenant?.name || "Anonymous"}:</strong></p>
                            <p>{review.rating}/5 ⭐</p>
                            <p>{review.comment}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No reviews yet.</p>
            )}

            <ReviewForm onReviewAdded={handleReviewAdded} />
        </>
    )
}

export default PropertyReview