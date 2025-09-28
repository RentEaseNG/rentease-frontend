import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const PropertyReview = () => {
    const [reviews, setReviews] = useState([])
    const { user } = useAuth();
    const { id } = useParams();
    useEffect(() => {
        const fetchHouseReviews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/reviews/${id}`);
                const res = response.data.data
                setReviews(res)
            } catch (error) {
                console.error("Error fetching house details:", error);
            }
        };
        fetchHouseReviews();
    }, [id])
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

            {/* to be implemented soon */}
            {/* <h3 className="mt-4">Add your comment</h3>
            {user ? (
                <form>
                    <input
                        type="text"
                        placeholder="Write a comment..."
                        className="border p-2 rounded w-full"
                    />
                    <button type="submit" className="mt-2 bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800">
                        Submit
                    </button>
                </form>
            ) : (
                <button className="bg-green-900 text-white px-4 py-2 rounded hover:bg-green-800">
                    Login to Continue
                </button>
            )} */}
        </>
    )
}

export default PropertyReview