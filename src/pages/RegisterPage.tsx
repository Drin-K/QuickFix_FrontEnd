import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "@/services/authApi";
import { ApiError } from "@/services/api";
import { AuthLayout } from "@/layouts/AuthLayout";

type RegisterFormState = {
  fullName: string;
  email: string;
  accountType: "client" | "provider";
  password: string;
  confirmPassword: string;
};

type RegisterFormErrors = Partial<Record<keyof RegisterFormState, string>>;

const initialFormState: RegisterFormState = {
  fullName: "",
  email: "",
  accountType: "client",
  password: "",
  confirmPassword: "",
};

const validateForm = (values: RegisterFormState): RegisterFormErrors => {
  const errors: RegisterFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Full name is required.";
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters.";
  }

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

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<RegisterFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<RegisterFormErrors>({});
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = <T extends keyof RegisterFormState>(field: T, value: RegisterFormState[T]) => {
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

      const response = await register({
        fullName: formValues.fullName.trim(),
        email: formValues.email.trim(),
        password: formValues.password,
        accountType: formValues.accountType,
      });

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
      }

      setSuccessMessage(response.message || "Registration successful.");
      setFormValues(initialFormState);
      navigate("/login");
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message);
        return;
      }

      setSubmitError("Something went wrong during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <section className="section auth-page">
        <div className="container auth-page__grid">
          <div className="auth-page__intro">
            <span className="eyebrow">Register</span>
            <h1>Create your QuickFix account and start booking faster.</h1>
            <p>
              Join as a customer to find reliable help, or register as a provider and turn
              your services into booked jobs.
            </p>

            <div className="auth-page__benefits">
              <div className="auth-page__benefit-card">
                <strong>Find trusted professionals</strong>
                <span>Compare providers, availability, and pricing from one account.</span>
              </div>
              <div className="auth-page__benefit-card">
                <strong>Grow your service business</strong>
                <span>Register as a provider and showcase your expertise to new clients.</span>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-card__header">
              <h2>Create account</h2>
              <p>Fill in the basics to get started with QuickFix.</p>
            </div>

            <form className="auth-form" noValidate onSubmit={handleSubmit}>
              <label className="auth-form__field">
                <span>Full name</span>
                <input
                  className={formErrors.fullName ? "auth-form__input auth-form__input--error" : "auth-form__input"}
                  name="fullName"
                  placeholder="Enter your full name"
                  type="text"
                  value={formValues.fullName}
                  onChange={(event) => handleChange("fullName", event.target.value)}
                />
                {formErrors.fullName ? (
                  <small className="auth-form__error">{formErrors.fullName}</small>
                ) : null}
              </label>

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
                <span>Account type</span>
                <select
                  className="auth-form__input"
                  name="accountType"
                  value={formValues.accountType}
                  onChange={(event) => handleChange("accountType", event.target.value as RegisterFormState["accountType"])}
                >
                  <option value="client">Client</option>
                  <option value="provider">Provider</option>
                </select>
              </label>

              <label className="auth-form__field">
                <span>Password</span>
                <input
                  autoComplete="new-password"
                  className={formErrors.password ? "auth-form__input auth-form__input--error" : "auth-form__input"}
                  name="password"
                  placeholder="Create a password"
                  type="password"
                  value={formValues.password}
                  onChange={(event) => handleChange("password", event.target.value)}
                />
                {formErrors.password ? (
                  <small className="auth-form__error">{formErrors.password}</small>
                ) : null}
              </label>

              <label className="auth-form__field">
                <span>Confirm password</span>
                <input
                  autoComplete="new-password"
                  className={formErrors.confirmPassword ? "auth-form__input auth-form__input--error" : "auth-form__input"}
                  name="confirmPassword"
                  placeholder="Repeat your password"
                  type="password"
                  value={formValues.confirmPassword}
                  onChange={(event) => handleChange("confirmPassword", event.target.value)}
                />
                {formErrors.confirmPassword ? (
                  <small className="auth-form__error">{formErrors.confirmPassword}</small>
                ) : null}
              </label>

              <button className="button auth-form__submit" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating account..." : "Register"}
              </button>

              {submitError ? <p className="auth-form__error">{submitError}</p> : null}
              {successMessage ? <p className="auth-form__success">{successMessage}</p> : null}
            </form>

            <p className="auth-card__footer">
              Already have an account? <Link to="/login">Sign in here</Link>.
            </p>
          </div>
        </div>
      </section>
    </AuthLayout>
  );
};
