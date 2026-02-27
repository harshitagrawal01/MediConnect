import React, { useState } from 'react'

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      location: "Mumbai, Maharashtra",
      image: "https://images.unsplash.com/photo-1619895862022-09114b41f16f?w=400&h=400&fit=crop",
      rating: 5,
      text: "Dr. Riya Mehta was very professional and patient. She took the time to explain everything clearly. Booking was easy through this platform!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Rahul Verma",
      location: "Delhi, NCR",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      rating: 4,
      text: "Good experience overall. Dr. Ankit Sharma was knowledgeable. The appointment was on time but the waiting area could be better. Still, I would recommend.",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Anjali Patel",
      location: "Ahmedabad, Gujarat",
      image: "https://images.unsplash.com/photo-1593104547489-5cfb3839a3b5?w=400&h=400&fit=crop",
      rating: 5,
      text: "Excellent service! Dr. Sarah Patel was incredibly caring and explained my skin condition in detail. The online booking saved me a lot of time.",
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "Arjun Reddy",
      location: "Hyderabad, Telangana",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      rating: 3,
      text: "Decent experience. Dr. Neha Patel was okay with my son, though the consultation felt a bit rushed. The platform itself is good and easy to navigate.",
      date: "1 week ago"
    },
    {
      id: 5,
      name: "Sneha Iyer",
      location: "Bangalore, Karnataka",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      rating: 5,
      text: "Amazing experience! The doctors are highly qualified and the booking system is super convenient. Dr. Arjun Iyer helped me tremendously. Highly recommended!",
      date: "2 months ago"
    },
    {
      id: 6,
      name: "Vikram Singh",
      location: "Jaipur, Rajasthan",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      rating: 4,
      text: "Pretty satisfied with the service. Dr. Patel was professional and thorough. The platform could improve on reminder notifications, but overall a good experience.",
      date: "5 days ago"
    },
    {
      id: 7,
      name: "Kavya Menon",
      location: "Kochi, Kerala",
      image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=400&fit=crop",
      rating: 5,
      text: "Best healthcare platform I've used in India! Found an excellent dermatologist and got an appointment the same day. Very impressed with the service quality.",
      date: "1 week ago"
    },
    {
      id: 8,
      name: "Amit Kumar",
      location: "Pune, Maharashtra",
      image: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=400&h=400&fit=crop",
      rating: 4,
      text: "Good platform for finding doctors. The search filters are helpful. Had a positive consultation with Dr. James. Would use again for future appointments.",
      date: "3 weeks ago"
    }
  ];

  // Function to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${
          i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
        }`}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ));
  };

  // Navigate testimonials
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Get visible testimonials (3 at a time on desktop)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <div className='py-16 bg-gradient-to-br from-teal-50 via-white to-blue-50'>
      <div className='max-w-7xl mx-auto px-4 md:px-10'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
            What Our Patients Say
          </h2>
          <p className='text-gray-600 text-sm md:text-base max-w-2xl mx-auto'>
            Real experiences from real patients who found trusted healthcare through our platform
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className='hidden md:grid md:grid-cols-3 gap-6 mb-8'>
          {getVisibleTestimonials().map((testimonial) => (
            <div
              key={testimonial.id}
              className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100 hover:-translate-y-1'
            >
              {/* Quote Icon */}
              <div className='mb-4'>
                <svg className='w-10 h-10 text-teal-500 opacity-50' fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Rating */}
              <div className='flex items-center gap-1 mb-4'>
                {renderStars(testimonial.rating)}
              </div>

              {/* Review Text */}
              <p className='text-gray-700 text-sm leading-relaxed mb-6'>
                "{testimonial.text}"
              </p>

              {/* Patient Info */}
              <div className='flex items-center gap-4 pt-4 border-t border-gray-100'>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className='w-12 h-12 rounded-full object-cover border-2 border-teal-100'
                />
                <div className='flex-1'>
                  <h4 className='font-semibold text-gray-900 text-sm'>{testimonial.name}</h4>
                  <p className='text-xs text-gray-500'>{testimonial.location}</p>
                </div>
                <span className='text-xs text-gray-400'>{testimonial.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile View - Single Testimonial */}
        <div className='md:hidden mb-8'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-teal-100'>
            {/* Quote Icon */}
            <div className='mb-4'>
              <svg className='w-10 h-10 text-teal-500 opacity-50' fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
            </div>

            {/* Rating */}
            <div className='flex items-center gap-1 mb-4'>
              {renderStars(testimonials[currentIndex].rating)}
            </div>

            {/* Review Text */}
            <p className='text-gray-700 text-sm leading-relaxed mb-6'>
              "{testimonials[currentIndex].text}"
            </p>

            {/* Patient Info */}
            <div className='flex items-center gap-4 pt-4 border-t border-gray-100'>
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className='w-12 h-12 rounded-full object-cover border-2 border-teal-100'
              />
              <div className='flex-1'>
                <h4 className='font-semibold text-gray-900 text-sm'>{testimonials[currentIndex].name}</h4>
                <p className='text-xs text-gray-500'>{testimonials[currentIndex].location}</p>
              </div>
              <span className='text-xs text-gray-400'>{testimonials[currentIndex].date}</span>
            </div>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className='flex items-center justify-center gap-4'>
          {/* Previous Button */}
          <button
            onClick={prevTestimonial}
            className='p-3 rounded-full bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg'
            aria-label="Previous testimonial"
          >
            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className='flex items-center gap-2'>
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-8 h-3 bg-teal-600'
                    : 'w-3 h-3 bg-teal-200 hover:bg-teal-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={nextTestimonial}
            className='p-3 rounded-full bg-white border-2 border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg'
            aria-label="Next testimonial"
          >
            <svg className='w-5 h-5' fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Testimonials

