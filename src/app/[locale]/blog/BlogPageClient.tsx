"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { fr, enUS } from "date-fns/locale";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: Date;
  author: {
    name: string;
    avatarUrl?: string;
  };
  category: string;
  readTime: number;
}

interface BlogPageClientProps {
  posts: BlogPost[];
  locale: string;
}

export default function BlogPageClient({
  posts,
  locale,
}: BlogPageClientProps) {
  const dateLocale = locale === "fr" ? fr : enUS;

  const formatDateAgo = (date: Date) => {
    try {
      const distance = formatDistanceToNow(date, { 
        addSuffix: false, 
        locale: dateLocale 
      });
      // For French, format it like "Il y a 1 mois"
      if (locale === "fr") {
        return `Il y a ${distance}`;
      }
      return `${distance} ago`;
    } catch (error) {
      return format(date, "PPP", { locale: dateLocale });
    }
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Blog Posts - Vertical Layout */}
          <div className="space-y-8 lg:space-y-12">
            {posts.map((post) => (
              <Card
                key={post.id}
                className="group hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Image - Large horizontal */}
                  <div className="relative w-full lg:w-2/5 h-64 lg:h-auto overflow-hidden bg-gray-200">
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <Image
                        src={post.imageUrl || "/Hero1.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        sizes="(max-width: 1024px) 100vw, 40vw"
                      />
                    </Link>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col">
                    {/* Category Badge */}
                    <div className="mb-3">
                      <Badge 
                        variant="secondary" 
                        className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium"
                      >
                        {post.category}
                      </Badge>
                    </div>

                    {/* Title */}
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>

                    {/* Metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {locale === "fr" 
                            ? `Il y a ${formatDateAgo(post.publishedAt)}`
                            : formatDateAgo(post.publishedAt)
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>0</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div className="mt-auto">
                      <Button
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
                      >
                        <Link href={`/${locale}/blog/${post.slug}`}>
                          {locale === "fr" ? "Lire la suite" : "Read More"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

