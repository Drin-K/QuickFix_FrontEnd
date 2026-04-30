const steps = [
  {
    title: "Explore services",
    description: "Start from the public page and check the categories that match your repair.",
  },
  {
    title: "Log in to request",
    description: "Create an account or sign in when you are ready to send a booking request.",
  },
  {
    title: "Manage the job",
    description: "Track your booking, coordinate with the provider, and review the work after.",
  },
];

export const HowItWorksSection = () => {
  return (
    <section className="section section--tinted" id="how-it-works">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">How it works</span>
          <h2>A clear path from public browsing to confirmed booking.</h2>
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
