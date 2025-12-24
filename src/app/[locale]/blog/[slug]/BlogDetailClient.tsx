"use client";

import React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ArrowLeft, MessageCircle } from "lucide-react";
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

interface BlogDetailClientProps {
  post: BlogPost;
  locale: string;
}

export default function BlogDetailClient({
  post,
  locale,
}: BlogDetailClientProps) {
  const dateLocale = locale === "fr" ? fr : enUS;

  const formatDateAgo = (date: Date) => {
    const distance = formatDistanceToNow(date, { 
      addSuffix: true, 
      locale: dateLocale 
    });
    return distance;
  };

  return (
    <div className="w-full min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              asChild
              variant="ghost"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <Link href={`/${locale}/blog`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === "fr" ? "Retour au blog" : "Back to Blog"}
              </Link>
            </Button>
          </div>

          {/* Category Badge */}
          <div className="mb-4">
            <Badge 
              variant="secondary" 
              className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm font-medium"
            >
              {post.category}
            </Badge>
          </div>

          {/* Title */}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            {post.title}
          </h1>

          {/* Featured Image */}
          <div className="relative w-full h-96 lg:h-[500px] mb-8 rounded-lg overflow-hidden bg-gray-200">
            <Image
              src={post.imageUrl || "/Hero1.jpg"}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
              priority
            />
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-8 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {format(new Date(post.publishedAt), "PPP", {
                  locale: dateLocale,
                })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime} {locale === "fr" ? "min de lecture" : "min read"}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>0 {locale === "fr" ? "commentaires" : "comments"}</span>
            </div>
          </div>

          {/* Content */}
          <div 
            className="blog-content mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 mb-12">
            <div className="flex items-start gap-4">
              {post.author.avatarUrl && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {post.author.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {locale === "fr" 
                    ? "Expert en immobilier africain" 
                    : "African real estate expert"}
                </p>
              </div>
            </div>
          </div>

          {/* Back to Blog Button */}
          <div className="flex justify-center">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-md font-medium"
            >
              <Link href={`/${locale}/blog`}>
                {locale === "fr" ? "Voir tous les articles" : "View All Articles"}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

