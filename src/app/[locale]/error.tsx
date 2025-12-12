"use client";

import { useEffect } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col bg-gray-50">
        <div className="min-h-screen flex items-center justify-center p-6">
          <Card className="max-w-md w-full border-2 border-red-200 shadow-lg">
            <CardBody className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Something went wrong!
              </h2>
              <p className="text-gray-600 mb-6">
                An unexpected error occurred. Please try again.
              </p>
              {process.env.NODE_ENV === "development" && error.message && (
                <div className="mb-4 p-3 bg-red-50 rounded text-left">
                  <p className="text-xs text-red-800 font-mono break-all">
                    {error.message}
                  </p>
                  {error.digest && (
                    <p className="text-xs text-red-600 mt-2">
                      Error ID: {error.digest}
                    </p>
                  )}
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Button
                  color="primary"
                  onClick={reset}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try again
                </Button>
                <Button
                  variant="bordered"
                  onClick={() => (window.location.href = "/")}
                >
                  Go home
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </body>
    </html>
  );
}

