import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";


function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
    const [loginFormData, setLoginFormData] = useState({
        email: "",
        password: "",
    });

    function handleChange(event) {
        setLoginFormData((previousLoginFormData) => ({
            ...previousLoginFormData,
            [event.target.name]: event.target.value
        }));
    }


    async function handleSubmit(event) {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
          await login(loginFormData);

            setLoginFormData({
                email: "",
                password: ""
            });
          navigate("/dashboard", { replace: true });
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
        <div className="mb-6 ">
          <p className="text-sm font-medium text-teal-400">Plan ahead</p>
          <h2 className="mt-1 text-xl font-semibold text-white">
            Login to your account
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Enter your credentials to access your account.
          </p>
        </div>

          {location.state?.message && (
            <p className="mb-5 rounded-lg border border-teal-900 bg-teal-950/50 px-3 py-2 text-sm text-teal-200" role="status">
              {location.state.message}
            </p>
          )}
          {errorMessage && (
            <p className="mb-5 rounded-lg border border-rose-900 bg-rose-950/50 px-3 py-2 text-sm text-rose-200" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col gap-2 mb-6">
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
              value={loginFormData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>
          <div className="flex flex-col gap-2 mb-6">
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
              value={loginFormData.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>
          <button
            className="w-full mb-6 rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-900"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Login"}
          </button>

          <div>
            <p className="text-white">Don't have an account? <Link to="/register" className="text-teal-400 hover:text-teal-300">Register here</Link></p>
          </div>
          
          
      </form>
      </main>
    );
}

export default LoginPage;