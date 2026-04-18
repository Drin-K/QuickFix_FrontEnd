const steps = [
  {
    title: "Search and filter",
    description: "Find providers by service type, city, budget and availability.",
  },
  {
    title: "Compare and book",
    description: "Review profiles, ratings and pricing before sending a booking request.",
  },
  {
    title: "Track and review",
    description: "Chat with the provider, manage the appointment and leave feedback after.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="section section--tinted" id="how-it-works">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>A simple service flow for both clients and providers.</h2>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <article key={step.title} className="step-card">
              <span className="step-card__number">0{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
