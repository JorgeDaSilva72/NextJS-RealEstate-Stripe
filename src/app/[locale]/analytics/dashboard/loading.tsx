import { Spinner } from "@nextui-org/react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}

