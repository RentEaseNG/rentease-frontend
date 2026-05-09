import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PropertyCard from './PropertyCard';

const mockHouse = {
  _id: '123',
  title: 'Luxury Villa',
  price: 500000,
  location: 'Lagos, Nigeria',
  images: ['house1.jpg'],
  apartmentType: { name: 'Duplex' }
};

describe('PropertyCard', () => {
  it('renders property details correctly', () => {
    render(<PropertyCard house={mockHouse} onClick={() => {}} />);
    
    expect(screen.getByText('Luxury Villa')).toBeInTheDocument();
    expect(screen.getByText('₦500,000')).toBeInTheDocument();
    expect(screen.getByText('Lagos, Nigeria')).toBeInTheDocument();
    expect(screen.getByText('Duplex')).toBeInTheDocument();
  });

  it('calls onClick with house ID when clicked', () => {
    const handleClick = vi.fn();
    render(<PropertyCard house={mockHouse} onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Luxury Villa'));
    expect(handleClick).toHaveBeenCalledWith('123');
  });
});
