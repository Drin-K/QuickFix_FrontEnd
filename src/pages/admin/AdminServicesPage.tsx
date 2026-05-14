import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiError } from "@/api/api";
import { AdminLayout } from "@/layouts/AdminLayout";
import { routePaths } from "@/routes/routePaths";
import {
  adminService,
  type AdminService,
  type AdminServicesQuery,
  type AdminServiceStatus,
} from "@/services/admin.service";
import { clearAuthSession } from "@/utils/auth";

type StatusFilter = "all" | AdminServiceStatus;

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

const formatPrice = (value: string) => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return value;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  }).format(parsedValue);
};

export const AdminServicesPage = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<AdminService[]>([]);
  const [filterOptions, setFilterOptions] = useState<AdminService[]>([]);
  const [totalServices, setTotalServices] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filters = useMemo<AdminServicesQuery>(
    () => ({
      search: submittedSearch || undefined,
      providerId: providerFilter === "all" ? undefined : Number(providerFilter),
      categoryId: categoryFilter === "all" ? undefined : Number(categoryFilter),
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    [categoryFilter, providerFilter, statusFilter, submittedSearch],
  );

  const providerOptions = useMemo(() => {
    const options = new Map<string, NonNullable<AdminService["provider"]>>();

    filterOptions.forEach((service) => {
      if (service.provider) {
        options.set(String(service.provider.id), service.provider);
      }
    });

    return Array.from(options.values()).sort((left, right) =>
      left.displayName.localeCompare(right.displayName),
    );
  }, [filterOptions]);

  const categoryOptions = useMemo(() => {
    const options = new Map<string, NonNullable<AdminService["category"]>>();

    filterOptions.forEach((service) => {
      if (service.category) {
        options.set(String(service.category.id), service.category);
      }
    });

    return Array.from(options.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [filterOptions]);

  const loadServices = async (query: AdminServicesQuery = filters) => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await adminService.getServices(query);
      setServices(response.services);
      setTotalServices(response.total);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAuthSession();
        navigate(routePaths.login);
        return;
      }

      if (error instanceof ApiError && error.status === 403) {
        setErrorMessage("Only admins can view services.");
        return;
      }

      setErrorMessage(
        error instanceof Error ? error.message : "Services could not be loaded.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadServices(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await adminService.getServices();
        setFilterOptions(response.services);
      } catch {
        setFilterOptions([]);
      }
    };

    void loadFilterOptions();
  }, []);

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedSearch(searchValue.trim());
  };

  const handleClearFilters = () => {
    setSearchValue("");
    setSubmittedSearch("");
    setProviderFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
  };

  const activeFilterCount = [
    submittedSearch,
    providerFilter !== "all",
    categoryFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  return (
    <AdminLayout>
      <section className="section admin-providers">
        <div className="container">
          <div className="admin-providers__header">
            <div>
              <span className="eyebrow">Admin services</span>
              <h1>Service directory.</h1>
              <p>
                Search services and filter the marketplace by provider, category, or
                active status.
              </p>
            </div>

            <aside className="admin-providers__summary">
              <span>Total results</span>
              <strong>{totalServices}</strong>
              <p>{activeFilterCount} active filter(s)</p>
            </aside>
          </div>

          <div className="admin-providers-toolbar">
            <form className="admin-providers-search" onSubmit={handleSearchSubmit}>
              <label htmlFor="admin-service-search">Search</label>
              <div className="admin-providers-search__row">
                <input
                  id="admin-service-search"
                  placeholder="Search by title, provider, or category"
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
              <span>Provider</span>
              <select
                value={providerFilter}
                onChange={(event) => setProviderFilter(event.target.value)}
              >
                <option value="all">All providers</option>
                {providerOptions.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.displayName}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-providers-filter">
              <span>Category</span>
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
              >
                <option value="all">All categories</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-providers-filter">
              <span>Status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
              >
                <option value="all">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
              <strong>Services could not be loaded.</strong>
              <p>{errorMessage}</p>
              <button
                className="button"
                type="button"
                onClick={() => {
                  void loadServices(filters);
                }}
              >
                Try again
              </button>
            </div>
          ) : null}

          {!errorMessage ? (
            <div className="admin-providers-panel">
              <div className="admin-providers-panel__header">
                <h2>Services</h2>
                <span>{loading ? "Loading..." : `${services.length} shown`}</span>
              </div>

              {loading ? (
                <div className="admin-providers-state">
                  <strong>Loading services.</strong>
                  <p>Fetching the latest service list from the backend.</p>
                </div>
              ) : null}

              {!loading && services.length === 0 ? (
                <div className="admin-providers-state">
                  <strong>No services found.</strong>
                  <p>Try a different search term or clear filters.</p>
                </div>
              ) : null}

              {!loading && services.length > 0 ? (
                <div className="admin-providers-table-wrap">
                  <table className="admin-providers-table">
                    <thead>
                      <tr>
                        <th>Service</th>
                        <th>Provider</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Price</th>
                        <th>Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((service) => (
                        <tr key={service.id}>
                          <td>
                            <strong>{service.title}</strong>
                            <span>#{service.id}</span>
                          </td>
                          <td>
                            <strong>
                              {service.provider?.displayName ?? "Not available"}
                            </strong>
                            <span>
                              {service.provider
                                ? `#${service.provider.id}`
                                : "No provider"}
                            </span>
                          </td>
                          <td>{service.category?.name ?? "Uncategorized"}</td>
                          <td>
                            <span
                              className={
                                service.isActive
                                  ? "admin-provider-status admin-provider-status--verified"
                                  : "admin-provider-status admin-provider-status--unverified"
                              }
                            >
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td>{formatPrice(service.basePrice)}</td>
                          <td>{formatDate(service.createdAt)}</td>
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
