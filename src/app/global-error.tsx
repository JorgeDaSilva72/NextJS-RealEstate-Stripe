"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "20px",
          fontFamily: "system-ui, sans-serif",
        }}>
          <h1 style={{ fontSize: "24px", marginBottom: "16px" }}>
            Something went wrong!
          </h1>
          <p style={{ marginBottom: "24px", color: "#666" }}>
            An unexpected error occurred. Please try again.
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={reset}
              style={{
                padding: "10px 20px",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              style={{
                padding: "10px 20px",
                backgroundColor: "transparent",
                color: "#0070f3",
                border: "1px solid #0070f3",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Go home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

