import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext';

const AddPropertyButton = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const addNewHouse = () => {
        navigate('/new')
    }

    const LANDLORD_ROLES = ['Landlord', 'Admin', 'SuperAdmin'];

    if (!user || !LANDLORD_ROLES.includes(user.role)) {
      return null;
    }

  return (
    <div className='bg-green-600 p-4 rounded-full fixed bottom-4 right-4 cursor-pointer' onClick={addNewHouse} title='Add New Property'>
        <Plus className='text-white' />
    </div>
  )
}

export default AddPropertyButton