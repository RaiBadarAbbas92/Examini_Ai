"use client"
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';

const testimonials = [
  {
    name: 'Jane Doe',
    testimonial: 'Examinie AI has transformed my study habits. The feedback is amazing!',
    role: 'Student',
  },
  {
    name: 'John Smith',
    testimonial: 'An incredible tool for teachers. Helps streamline grading and feedback.',
    role: 'Teacher',
  },
  {
    name: 'Alice Brown',
    testimonial: 'I love how easy it is to track my progress using Examinie AI.',
    role: 'Student',
  },
];

const TestimonialsCarousel = () => {
  const slideRefs = useRef([]);

  useEffect(() => {
    slideRefs.current.forEach((slide, index) => {
      gsap.fromTo(slide,
        {
          opacity: 0,
          scale: 0.9
        },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          delay: index * 0.2
        }
      );
    });
  }, []);

  return (
    <div className="flex justify-center items-center py-10 px-5 bg-gray-100 h-full">
      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 20,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        modules={[EffectCoverflow, Pagination]}
        className="w-full max-w-3xl"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
            <div
              ref={el => slideRefs.current[index] = el}
              className="flex flex-col items-center text-center"
            >
              <h3 className="text-xl font-semibold text-green-600 mb-2">{testimonial.name}</h3>
              <p className="text-gray-600 italic mb-4">"{testimonial.role}"</p>
              <p className="text-gray-700">{testimonial.testimonial}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TestimonialsCarousel;
