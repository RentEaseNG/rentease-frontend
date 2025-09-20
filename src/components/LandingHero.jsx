import React from 'react';
import { FaSearchLocation } from 'react-icons/fa';

const LandingHero = () => {
  return (
    <section
      style={{
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundImage:
          "linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMUHF-Nab0w5arAuNU_DpNBV8yRO-hwtD43fzhCxQ5fbnSJBAS7QdKrNnHYl9AQMnFXqb3Grftx6YwUk0L9RnXm0dXyeCE-YA3MXLQRIr0pa705PaTh2JSWz0rSFK-230_XSayAlWekUTgMSKsbYAOkFOOJnMbjnc8zAVgpwrof1LV-JV-aLYvmb4fom_h3dJXc7OvJD58URcN8gNcQMIXctYBaiZnGe9T3DW41XNlg-lmR1O7nI3UrOV_yoy9DOf9MlGDEixvlg')",
      }}
    >
      <div className="min-h-screen flex flex-col justify-center items-center text-center text-white p-4">
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Find Your Perfect Home Anywhere in Nigeria
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">
          Discover a wide range of rental properties across Nigeria. Your next
          home is just a search away.
        </p>

        <div className="mt-10 max-w-2xl mx-auto w-full">
          <form className="flex w-full items-center rounded-full bg-white/90 shadow-2xl backdrop-blur-sm p-2">
            <div className="flex-shrink-0 pl-4 pr-2">
              <span className="material-symbols-outlined text-gray-500">
                <FaSearchLocation />
              </span>
            </div>

            <input
              className="form-input w-full flex-1 appearance-none border-none bg-transparent text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-0 text-lg"
              placeholder="Search by city, area, or property type"
              type="text"
            />

            <button
              className="flex-shrink-0 rounded-full h-12 px-8 bg-blue-600 text-white text-base font-bold tracking-wide hover:bg-[var(--primary-color-hover)] transition-all duration-300"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
