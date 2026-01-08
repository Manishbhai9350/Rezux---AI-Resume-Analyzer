import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import TileBg from "~/components/TileBg";
import { usePuterStore } from "~/lib/puter";

const auth = () => {
  const { isLoading, auth } = usePuterStore();

  const navigate = useNavigate();
  const location = useLocation();
  const next = location.search.split("?next=")[1];

  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (next && auth.isAuthenticated) {
      navigate(next);
    }

    return () => {};
  }, [next, auth]);

  return (
    <main
      ref={parentRef}
      className="auth-page w-full h-screen flex justify-center items-center"
    >
      <TileBg parentRef={parentRef} />
      <section className="auth-section bg-white p-6 px-12 rounded-md border border-slate-300 relative z-20 flex flex-col justify-center items-center">
        <h1>Welcome</h1>
        <p className="text-black/50">Login to continue your job journey.</p>

        {isLoading ? (
          <button className="primary-gradient animate-pulse fade-in text-white px-12 py-2 text-3xl mt-5 rounded-lg">
            Signing You In...
          </button>
        ) : auth.isAuthenticated ? (
          <button
            onClick={auth.signOut}
            className="primary-gradient cursor-pointer text-white px-12 py-2 text-3xl mt-5 rounded-lg"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={auth.signIn}
            className="primary-gradient cursor-pointer text-white px-12 py-2 text-3xl mt-5 rounded-lg"
          >
            Login
          </button>
        )}
      </section>
    </main>
  );
};

export default auth;
