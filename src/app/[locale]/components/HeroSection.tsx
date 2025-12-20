import { ReactNode } from "react";

interface HeroSectionProps {
  children?: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export default function HeroSection({
  children,
  title,
  description,
  className = "",
}: HeroSectionProps) {
  return (
    <section
      className={`relative pt-24 pb-12 bg-gradient-to-b from-gray-900 to-gray-800 ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 bg-[url('/Hero1.jpg')] bg-cover bg-center opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}




