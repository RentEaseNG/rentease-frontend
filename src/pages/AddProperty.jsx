import apiClient from '../api/client';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CloudinaryUploader from '../components/CloudinaryUploader';

const AddProperty = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    apartmentType: '',
    images: []
  });


  const [apartmentTypes, setApartmentTypes] = useState([]); // 👈 Store fetched types
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
  }

  // 👇 Fetch apartment types when component mounts
  useEffect(() => {
    const fetchApartmentTypes = async () => {
      try {
        const res = await apiClient.get('/apartment-types');
        if (res.data.success) {
          setApartmentTypes(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching apartment types:', err);
        setError('Failed to load apartment types.');
      }
    };

    fetchApartmentTypes();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  // Handle image list changes from CloudinaryUploader
  const handleImagesChange = (urls) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  // Validate before submit
  const validateForm = () => {
    if (!formData.title.trim()) return setError('Property title is required'), false;
    if (!formData.description.trim()) return setError('Property description is required'), false;
    if (!formData.price || formData.price <= 0) return setError('Please enter a valid price'), false;
    if (!formData.location.trim()) return setError('Property location is required'), false;
    if (!formData.apartmentType.trim()) return setError('Please select an apartment type'), false;
    if (formData.images.length === 0) return setError('Please upload at least one image'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        apartmentType: formData.apartmentType, // 👈 This is now the selected _id
        images: formData.images
      };

      const res = await apiClient.post(
        '/properties',
        propertyData
      );

      console.log('Property created successfully:', res.data);
      const houseId = res.data.data._id
      alert("property listed succesfully")
      navigate(`/house/${houseId}`); // 👈 redirect after success (optional)
    } catch (err) {
      console.error('Error listing property:', err);
      setError('Failed to list property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">List a New Property</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Property Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="e.g. 2 Bedroom Apartment"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            placeholder="Describe your property"
            rows="4"
            required
          />
        </div>

        {/* Price + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price (per year)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder="e.g. 500000"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder="e.g. Ajah, Lagos"
              required
            />
          </div>
        </div>

        {/* 👇 Apartment Type Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Apartment Type
          </label>
          <select
            name="apartmentType"
            value={formData.apartmentType}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-green-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-800"
            required
          >
            <option value="">-- Select Apartment Type --</option>
            {apartmentTypes.map((type) => (
              <option key={type._id} value={type._id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {/* Images */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Images</label>
          <CloudinaryUploader
            value={formData.images}
            onChange={handleImagesChange}
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-blue-300"
          >
            {loading ? 'Listing Property...' : 'List Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProperty;
