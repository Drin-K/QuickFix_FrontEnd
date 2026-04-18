import { ClientLayout } from "@/layouts/ClientLayout";

export const ClientHomePage = () => {
  return (
    <ClientLayout>
      <section className="section page-placeholder">
        <div className="container">
          <div className="section-heading">
            <span className="eyebrow">Client</span>
            <h1 className="page-placeholder__title">Welcome client</h1>
            <p>This is the first post-login page for client users.</p>
          </div>
        </div>
      </section>
    </ClientLayout>
  );
};
