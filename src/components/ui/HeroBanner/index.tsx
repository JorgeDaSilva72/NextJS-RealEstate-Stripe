import React from "react";
import Image from "next/image";

interface HeroBannerProps {
  /** Image source URL */
  imageSrc: string;
  /** Image alt text */
  imageAlt: string;
  /** Main heading text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional image quality (1-100) */
  imageQuality?: number;
  /** Optional banner height */
  height?: string;
  /** Optional overlay opacity (0-100) */
  overlayOpacity?: number;
  /** Optional custom classes for the title */
  titleClassName?: string;
  /** Optional custom classes for the subtitle */
  subtitleClassName?: string;
  /** Optional blur effect intensity */
  blurIntensity?: number;
  /** Optional custom sizes attribute for responsive images */
  imageSizes?: string;
  /** Optional boolean to control image loading priority */
  isPriority?: boolean;
  /** Optional children to render in banner */
  children?: React.ReactNode;
}

const HeroBanner: React.FC<HeroBannerProps> = ({
  imageSrc,
  imageAlt,
  title,
  subtitle,
  imageQuality = 90,
  height = "h-[60vh]",
  overlayOpacity = 50,
  titleClassName = "text-4xl md:text-6xl font-bold text-center mb-6 drop-shadow-lg",
  subtitleClassName = "text-xl md:text-2xl text-center max-w-3xl leading-relaxed drop-shadow-md",
  blurIntensity = 0,
  imageSizes = "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw",
  isPriority = true,
  children,
}) => (
  <section className={`relative w-full ${height}`}>
    <Image
      src={imageSrc}
      alt={imageAlt}
      fill
      className="object-cover"
      priority={isPriority}
      sizes={imageSizes}
      quality={imageQuality}
    />
    <div
      className={`absolute inset-0 bg-black/${overlayOpacity} ${
        blurIntensity > 0 ? `backdrop-blur-[${blurIntensity}px]` : ""
      }`}
    />
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 max-w-6xl mx-auto">
      <h1 className={titleClassName}>{title}</h1>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default HeroBanner;
