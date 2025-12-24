import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface Props {
  title?: string;
  href?: string;
  linkCaption?: string;
}
const PageTitle = (props: Props) => {
  return (
    <div className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold text-foreground">
          {props.title}
        </h1>
        {props.href && (
          <Button variant="outline" size="sm" asChild>
            <Link href={props.href} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{props.linkCaption}</span>
              <span className="sm:hidden">{props.linkCaption?.split(' ')[0]}</span>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default PageTitle;
