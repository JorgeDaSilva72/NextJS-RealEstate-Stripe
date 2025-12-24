import { redirect } from "next/navigation";

// Redirect /post-ad to /user/properties/add
export default function PostAdPage({
  params,
}: {
  params: { locale: string };
}) {
  redirect(`/${params.locale}/user/properties/add`);
}













