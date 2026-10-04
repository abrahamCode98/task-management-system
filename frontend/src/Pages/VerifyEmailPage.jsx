import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/authApi.js";

function VerifyEmailPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [token] = useState(() => searchParams.get("token"));
  const [status, setStatus] = useState(token ? "confirm" : "invalid");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleVerify() {
    if (!token) {
      setStatus("invalid");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      await verifyEmail(token);
      setStatus("success");
    } catch (error) {
      if (/invalid or expired/i.test(error.message)) {
        setStatus("invalid");
      } else {
        setErrorMessage(error.message);
        setStatus("error");
      }
    } finally {
      setSearchParams({}, { replace: true });
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-black/10">
        <p className="text-sm font-medium text-teal-400">Account security</p>
        <h1 className="mt-1 text-2xl font-semibold text-white">
          Verify your email
        </h1>

        {status === "confirm" && (
          <div className="mt-4 space-y-5">
            <p className="text-sm leading-6 text-slate-400">
              Confirm that you want to verify this email address. The link will
              be used only after you select the button below.
            </p>
            <button
              className="w-full rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 focus:ring-offset-slate-900"
              onClick={handleVerify}
              type="button"
            >
              Confirm email verification
            </button>
          </div>
        )}

        {status === "loading" && (
          <p
            className="mt-4 text-sm text-slate-300"
            role="status"
            aria-live="polite"
          >
            Verifying your email...
          </p>
        )}

        {status === "success" && (
          <div className="mt-4 space-y-5">
            <p
              className="rounded-lg border border-teal-900 bg-teal-950/50 px-3 py-2 text-sm text-teal-200"
              role="status"
            >
              Your email is verified. You can now sign in.
            </p>
            <Link
              className="inline-flex rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-300"
              to="/login"
            >
              Continue to login
            </Link>
          </div>
        )}

        {status === "invalid" && (
          <div className="mt-4 space-y-5">
            <p
              className="rounded-lg border border-amber-900 bg-amber-950/50 px-3 py-2 text-sm text-amber-200"
              role="alert"
            >
              This verification link is invalid or has expired. Request a new
              verification email to continue.
            </p>
            <Link
              className="text-sm font-medium text-teal-400 hover:text-teal-300"
              to="/login"
            >
              Return to login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 space-y-5">
            <p
              className="rounded-lg border border-rose-900 bg-rose-950/50 px-3 py-2 text-sm text-rose-200"
              role="alert"
            >
              {errorMessage ||
                "We could not verify your email. Please try again."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-lg bg-teal-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-teal-300"
                onClick={() => {
                  setStatus("confirm");
                }}
                type="button"
              >
                Try again
              </button>
              <Link
                className="self-center text-sm font-medium text-teal-400 hover:text-teal-300"
                to="/login"
              >
                Return to login
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default VerifyEmailPage;
