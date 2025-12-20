"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Property } from "@/data/mockProperties";
import { MessageCircle } from "lucide-react";

interface PropertyDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PropertyDialog({
  property,
  open,
  onOpenChange,
}: PropertyDialogProps) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [keepInfo, setKeepInfo] = useState(false);

  if (!property) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ name, message, keepInfo });
  };

  const handleWhatsApp = () => {
    const text = `Bonjour, je suis intéressé(e) par la propriété: ${property.title}`;
    const url = `https://wa.me/1234567890?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Section - Image and Details */}
          <div className="relative">
            <div className="relative h-64 lg:h-full min-h-[400px]">
              <Image
                src={property.image}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {property.title}
              </h2>
              <p className="text-3xl font-bold text-orange-500">
                {formatPrice(property.price)}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                {property.description}
              </p>
            </div>
          </div>

          {/* Right Section - Characteristics and Contact Form */}
          <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900">
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Caractéristiques
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Chambres:
                  </span>{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {property.characteristics.bedrooms}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Salles de bain:
                  </span>{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {property.characteristics.bathrooms}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Pièces:
                  </span>{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {property.characteristics.rooms}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    Surface:
                  </span>{" "}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {property.characteristics.area} m²
                  </span>
                </div>
                {property.characteristics.parking && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Parking
                    </span>
                  </div>
                )}
                {property.characteristics.garden && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Jardin
                    </span>
                  </div>
                )}
                {property.characteristics.pool && (
                  <div className="text-sm">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Piscine
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="keepInfo"
                  checked={keepInfo}
                  onChange={(e) => setKeepInfo(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label
                  htmlFor="keepInfo"
                  className="text-sm text-gray-600 dark:text-gray-400"
                >
                  Conserver mes informations
                </label>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white"
              >
                Envoyer
              </Button>
            </form>

            {/* WhatsApp Button */}
            <Button
              onClick={handleWhatsApp}
              className="w-full h-12 bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Discuter sur WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

