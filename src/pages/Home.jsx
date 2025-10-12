import React, { useState } from 'react'
import LandingHero from '../components/LandingHero'
import FeaturedProperties from './FeaturedProperties'
import HomeFeatures from '../components/HomeFeatures';
import HomeReady from '../components/HomeReady';

const Homepage = () => {
  const [query, setQuery] = useState("");
  return (
    <>
        <LandingHero onSearch={setQuery} />
        <FeaturedProperties query={query}/>
        <HomeReady />
        <HomeFeatures />
    </>
  )
}

export default Homepage