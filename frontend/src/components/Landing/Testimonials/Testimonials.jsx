import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import './Testimonials.css';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Event Organizer",
      company: "TechConf Series",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLtTf7y7jNa-QCTpkTt3MlrtmXLpk6pUvWgg&s",
      quote: "EventHub has transformed how we manage our tech conferences. The platform's intuitive interface and powerful features have helped us increase attendance by 60%.",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Community Manager",
      company: "StartupHub",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLtTf7y7jNa-QCTpkTt3MlrtmXLpk6pUvWgg&s",
      quote: "The analytics and reporting features are outstanding. We can now make data-driven decisions for our community events and better understand our audience.",
      rating: 5
    },
    {
      id: 3,
      name: "Emma Williams",
      role: "Marketing Director",
      company: "CreativeArts Festival",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLtTf7y7jNa-QCTpkTt3MlrtmXLpk6pUvWgg&s",
      quote: "From ticket management to attendee communication, EventHub has streamlined our entire event planning process. It's been a game-changer for our festival.",
      rating: 5
    }
  ];
const handleImageLoad = (e) => {
  e.target.classList.add('loaded');
};

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => 
        current === testimonials.length - 1 ? 0 : current + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section id="testimonials" className="testimonials">
      <div className="testimonials-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          What Our Users Say
        </motion.h2>

        <div className="testimonials-carousel">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`testimonial-card ${index === activeIndex ? 'active' : ''}`}
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="quote-icon">
                <FaQuoteLeft />
              </div>
              
              <p className="testimonial-quote">{testimonial.quote}</p>
              
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="star" />
                ))}
              </div>
              
              <div className="testimonial-author">
                <img 
                onLoad={handleImageLoad}
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="author-image"
                />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                  <p className="company">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="testimonial-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;