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
      className={`relative pt-24 pb-16 min-h-[70vh] flex items-center ${className}`}
    >
      {/* Background Image with Blur */}
      <div className="absolute inset-0 bg-[url('/Hero1.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Title and Subtitle - Always shown on home page */}
        {!title && (
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Bienvenue Sur Afrique-Immo
            </h1>
            <h2 className="text-xl md:text-2xl text-white">
              Ton guide immobilier pour L&apos;Afrique
            </h2>
          </div>
        )}
        
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









