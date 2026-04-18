import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { type AuthUserRole, login } from "@/services/authApi";
import { ApiError } from "@/services/api";
import { saveAuthSession } from "@/services/authStorage";
import { AuthLayout } from "@/layouts/AuthLayout";

type LoginFormState = {
  email: string;
  password: string;
};

type LoginFormErrors = Partial<Record<keyof LoginFormState, string>>;

const initialFormState: LoginFormState = {
  email: "",
  password: "",
};

const validateForm = (values: LoginFormState): LoginFormErrors => {
  const errors: LoginFormErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.password.trim()) {
    errors.password = "Password is required.";
  } else if (values.password.trim().length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  return errors;
};

const getPostLoginRoute = (role?: AuthUserRole): string => {
  switch (role) {
    case "provider":
      return "/provider-home";
    case "admin":
    case "platform_admin":
      return "/admin-home";
    case "client":
      return "/client-home";
    default:
      return "/";
  }
};

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<LoginFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<LoginFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof LoginFormState, value: string) => {
    setFormValues((current) => ({
      ...current,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validateForm(formValues);
    setFormErrors(errors);
    setSubmitError("");
    setSuccessMessage("");

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await login({
        email: formValues.email.trim(),
        password: formValues.password,
      });

      saveAuthSession(response);

      setSuccessMessage(response.message || "Login successful.");
      setFormValues(initialFormState);
      navigate(getPostLoginRoute(response.user?.role));
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Something went wrong during login.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <section className="section auth-page">
        <div className="container auth-page__grid">
          <div className="auth-page__intro">
            <span className="eyebrow">Login</span>
            <h1>Sign in and keep your next service request moving.</h1>
            <p>
              Access your QuickFix account to manage bookings, follow provider responses,
              and keep every repair request in one place.
            </p>

            <div className="auth-page__benefits">
              <div className="auth-page__benefit-card">
                <strong>Track every booking</strong>
                <span>See statuses, schedules, and service updates without leaving the app.</span>
              </div>
              <div className="auth-page__benefit-card">
                <strong>Talk to providers faster</strong>
                <span>Keep communication focused in one thread for each service request.</span>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-card__header">
              <h2>Welcome back</h2>
              <p>Use your email and password to sign in.</p>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
              <label className="auth-form__field">
                <span>Email address</span>
                <input
                  autoComplete="email"
                  className={formErrors.email ? "auth-form__input auth-form__input--error" : "auth-form__input"}
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => handleChange("email", event.target.value)}
                />
                {formErrors.email ? <small className="auth-form__error">{formErrors.email}</small> : null}
              </label>

              <label className="auth-form__field">
                <span>Password</span>
                <input
                  autoComplete="current-password"
                  className={formErrors.password ? "auth-form__input auth-form__input--error" : "auth-form__input"}
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  value={formValues.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                />
                {formErrors.password ? (
                  <small className="auth-form__error">{formErrors.password}</small>
                ) : null}
              </label>

              <div className="auth-form__meta">
                <label className="auth-form__checkbox">
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
                <Link className="auth-form__link" to="/register">
                  Forgot password?
                </Link>
              </div>

              <button className="button auth-form__submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Signing in..." : "Login"}
              </button>

              {submitError ? <p className="auth-form__error">{submitError}</p> : null}
              {successMessage ? <p className="auth-form__success">{successMessage}</p> : null}
            </form>

            <p className="auth-card__footer">
              Don&apos;t have an account yet? <Link to="/register">Create one here</Link>.
            </p>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
};
