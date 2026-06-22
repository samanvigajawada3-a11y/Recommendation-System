import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      const message = this.state.error?.stack || this.state.error?.message || "Unknown frontend error";

      return (
        <main className="grid min-h-screen place-items-center bg-ink px-6 text-center text-white">
          <div>
            <h1 className="text-3xl font-black text-netflix">StreamFlix</h1>
            <p className="mt-4 max-w-md text-zinc-300">
              The page could not load. Reset the saved session and refresh, or copy the error below.
            </p>
            <pre className="mt-5 max-h-64 max-w-3xl overflow-auto whitespace-pre-wrap rounded bg-red-950/40 p-4 text-left text-sm text-red-100 ring-1 ring-red-500/30">
              {message}
            </pre>
            <button
              className="mt-6 rounded bg-netflix px-5 py-3 font-semibold hover:bg-red-700"
              onClick={() => {
                localStorage.removeItem("streamflix_user");
                sessionStorage.clear();
                window.location.reload();
              }}
              type="button"
            >
              Reset Session
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
