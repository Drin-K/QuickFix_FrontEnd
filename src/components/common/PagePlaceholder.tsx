import { Link } from "react-router-dom";

type PagePlaceholderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export const PagePlaceholder = ({
  eyebrow,
  title,
  description,
}: PagePlaceholderProps) => {
  return (
    <section className="section page-placeholder">
      <div className="container">
        <div className="section-heading">
          <span className="eyebrow">{eyebrow}</span>
          <h1 className="page-placeholder__title">{title}</h1>
          <p>{description}</p>
        </div>

        <div className="page-placeholder__card">
          <p>
            This is a placeholder page for the next implementation phase. You can now connect
            navigation, add forms, and build the real feature flow here.
          </p>

          <div className="page-placeholder__actions">
            <Link className="button" to="/">
              Go to homepage
            </Link>
            <Link className="button button--ghost" to="/dashboard">
              Open dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
