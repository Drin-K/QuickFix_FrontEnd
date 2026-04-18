import { ProviderLayout } from "@/layouts/ProviderLayout";

export const ProviderHomePage = () => {
  return (
    <ProviderLayout>
      <section className="section page-placeholder">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Provider</span>
            <h1 className="page-placeholder__title">Welcome provider</h1>
            <p>This is the first post-login page for provider users.</p>
          </div>
        </div>
      </section>
    </ProviderLayout>
  );
};
