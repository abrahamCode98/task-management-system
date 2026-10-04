import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";


function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    function handleChange(event) {
        setRegisterFormData((previousRegisterFormData) => ({
            ...previousRegisterFormData,
            [event.target.name]: event.target.value
        }));
    }


    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
          await register(registerFormData);
          navigate("/login", {
            replace: true,
            state: {
              message: "Account created. Check your email and verify your address before signing in.",
            },
            });
        }catch(error) {
          setErrorMessage(error.message);
        } finally {
          setIsSubmitting(false);
        }
    };

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/10"
      >
        <div className="mb-6">
          <p className="text-sm font-medium text-teal-400">Plan ahead</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Add the details for your new account.
          </p>
        </div>

        {errorMessage && (
          <p className="mb-5 rounded-lg border border-rose-900 bg-rose-950/50 px-3 py-2 text-sm text-rose-200" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              type="text"
              id="name"
              name="name"
              value={registerFormData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              type="email"
              id="email"
              name="email"
              value={registerFormData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              type="password"
              id="password"
              name="password"
              value={registerFormData.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-slate-200"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={registerFormData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <button
            className="w-full mb-6 rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </div>

        <div>
          <p className="text-white">Already have an account? <Link to="/login" className="text-teal-400 hover:text-teal-300">Login here</Link></p>
        </div>
      </form>
      </main>
    );
}

export default RegisterPage;