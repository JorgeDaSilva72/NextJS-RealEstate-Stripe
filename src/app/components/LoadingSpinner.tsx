import { Spinner } from "@nextui-org/react";

export const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center p-4">
    <Spinner size="md" color="primary" label="Chargement..." />
  </div>
);
