import { type FormEvent, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { routePaths } from "@/routes/routePaths";
import {
  adminService,
  type AdminProvider,
  type AdminProviderType,
  type AdminProvidersQuery,
} from "@/services/admin.service";
import { clearAuthSession } from "@/utils/auth";

type VerificationFilter = "all" | "verified" | "unverified";
type TypeFilter = "all" | AdminProviderType;

const formatProviderType = (type: AdminProvider["type"]) => {
  if (!type) {
    return "Unknown";
  }

  return type === "individual" ? "Individual" : "Company";
};

const formatStatus = (provider: AdminProvider) => {
  if (provider.verificationStatus === "pending") {
    return "Pending";
  }

  return provider.isVerified ? "Verified" : "Unverified";
};

const formatDate = (value?: string) => {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const AdminProvidersPage = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<AdminProvider[]>([]);
  const [totalProviders, setTotalProviders] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [verificationFilter, setVerificationFilter] =
    useState<VerificationFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filters = useMemo<AdminProvidersQuery>(
    () => ({
      search: submittedSearch || undefined,
      verificationStatus:
        verificationFilter === "all" ? undefined : verificationFilter,
      type: typeFilter === "all" ? undefined : typeFilter,
    }),
    [submittedSearch, typeFilter, verificationFilter],
  );

  const loadProviders = async (query: AdminProvidersQuery = filters) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await adminService.getProviders(query);
      setProviders(response.providers);
      setTotalProviders(response.total);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError && error.status === 403) {
        setErrorMessage("Only admins can view providers.");
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Providers could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProviders(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(searchValue.trim());
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSubmittedSearch("");
    setVerificationFilter("all");
    setTypeFilter("all");
  };

  const activeFilterCount = [
    submittedSearch,
    verificationFilter !== "all",
    typeFilter !== "all",
  ].filter(Boolean).length;

  return (
    <AdminLayout>
      <section className="section admin-providers">
        <div className="container">
          <div className="admin-providers__header">
            <div>
              <span className="eyebrow">Admin providers</span>
              <h1>Provider directory.</h1>
              <p>
                Search providers by name and filter the list by verification status or
                profile type.
              </p>
            </div>

            <aside className="admin-providers__summary">
              <span>Total results</span>
              <strong>{totalProviders}</strong>
              <p>{activeFilterCount} active filter(s)</p>
            </aside>
          </div>

          <div className="admin-providers-toolbar">
            <form className="admin-providers-search" onSubmit={handleSearchSubmit}>
              <label htmlFor="admin-provider-search">Search</label>
              <div className="admin-providers-search__row">
                <input
                  id="admin-provider-search"
                  placeholder="Search by display name"
                  type="search"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <button className="button" type="submit">
                  Search
                </button>
              </div>
            </form>

            <label className="admin-providers-filter">
              <span>Status</span>
              <select
                value={verificationFilter}
                onChange={(event) =>
                  setVerificationFilter(event.target.value as VerificationFilter)
                }
              >
                <option value="all">All statuses</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </label>

            <label className="admin-providers-filter">
              <span>Type</span>
              <select
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value as TypeFilter)}
              >
                <option value="all">All types</option>
                <option value="individual">Individual</option>
                <option value="company">Company</option>
              </select>
            </label>

            <button
              className="button button--ghost admin-providers-clear"
              type="button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>

          {errorMessage ? (
            <div className="admin-providers-state admin-providers-state--error">
              <strong>Providers could not be loaded.</strong>
              <p>{errorMessage}</p>
              <button
                className="button"
                type="button"
                onClick={() => {
                  void loadProviders(filters);
                }}
              >
                Try again
              </button>
            </div>
          ) : null}

          {!errorMessage ? (
            <div className="admin-providers-panel">
              <div className="admin-providers-panel__header">
                <h2>Providers</h2>
                <span>{loading ? "Loading..." : `${providers.length} shown`}</span>
              </div>

              {loading ? (
                <div className="admin-providers-state">
                  <strong>Loading providers.</strong>
                  <p>Fetching the latest provider list from the backend.</p>
                </div>
              ) : null}

              {!loading && providers.length === 0 ? (
                <div className="admin-providers-state">
                  <strong>No providers found.</strong>
                  <p>Try a different search term or clear filters.</p>
                </div>
              ) : null}

              {!loading && providers.length > 0 ? (
                <div className="admin-providers-table-wrap">
                  <table className="admin-providers-table">
                    <thead>
                      <tr>
                        <th>Provider</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Location</th>
                        <th>Services</th>
                        <th>Documents</th>
                        <th>Created</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {providers.map((provider) => (
                        <tr key={provider.id}>
                          <td>
                            <strong>{provider.displayName}</strong>
                            <span>#{provider.id}</span>
                          </td>
                          <td>{formatProviderType(provider.type)}</td>
                          <td>
                            <span
                              className={
                                provider.isVerified
                                  ? "admin-provider-status admin-provider-status--verified"
                                  : "admin-provider-status admin-provider-status--unverified"
                              }
                            >
                              {formatStatus(provider)}
                            </span>
                          </td>
                          <td>
                            <strong>{provider.ownerName ?? "Not available"}</strong>
                            <span>{provider.ownerEmail ?? "No email"}</span>
                          </td>
                          <td>{provider.city ?? provider.address ?? "Not available"}</td>
                          <td>{provider.servicesCount ?? 0}</td>
                          <td>{provider.documentsCount ?? 0}</td>
                          <td>{formatDate(provider.createdAt)}</td>
                          <td className="admin-providers-table__actions">
                            <Link
                              className="button button--ghost admin-provider-details-link"
                              to={routePaths.adminProviderDetails.replace(
                                ":id",
                                encodeURIComponent(String(provider.id)),
                              )}
                            >
                              View details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </section>
    </AdminLayout>
  );
};
