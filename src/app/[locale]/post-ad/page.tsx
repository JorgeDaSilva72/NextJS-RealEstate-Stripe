import { redirect } from "@/i18n/routing";

// Redirect /post-ad to /user/properties/add
export default function PostAdPage() {
  redirect("/user/properties/add");
}




