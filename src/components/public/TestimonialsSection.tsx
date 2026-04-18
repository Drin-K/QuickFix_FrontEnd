const testimonials = [
  {
    quote: "QuickFix made it incredibly easy to find an electrician in less than 10 minutes.",
    author: "Elira, homeowner",
  },
  {
    quote: "Our company profile now brings steady requests with clear communication from clients.",
    author: "Beni, service provider",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="section section--compact" id="reviews">
      <div className="container testimonials">
        {testimonials.map((testimonial) => (
          <blockquote key={testimonial.author} className="testimonial-card">
            <p>"{testimonial.quote}"</p>
            <footer>{testimonial.author}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
};
