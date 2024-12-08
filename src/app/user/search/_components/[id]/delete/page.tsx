import SubmitButton from "@/app/components/SubmitButton";
// import { deleteProperty } from "@/lib/actions/property";
import { deleteFilter } from "@/lib/actions/savesearch";
// import savesear
import prisma from "@/lib/prisma";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: { id: string };
}

async function DeletePropertyPage({ params }: Props) {
  console.log('delete trouvé')
  const { getUser } = getKindeServerSession();
  const savedSearchPromise = prisma.savedSearch.findUnique({
    where: {
      id: +params.id, //+ to transform params(string) into a number
    },
  });
  const [filter, user] = await Promise.all([savedSearchPromise, getUser()]);

  if (!filter) return notFound();
  if (!user || filter.userId !== user.id) redirect("/unauthorized");
  //savedSearch
  const deleteAction = async () => {
    "use server";
    try {
      await deleteFilter(+params.id);

      redirect("/user/search");
    } catch (e) {
      throw e;
    }
  };

  return (
    <form
      action={deleteAction}
      className="mt-9 flex f flex-col items-center justify-center gap-3"
    >
      <p>Êtes-vous sûr de supprimer cette filtre ?</p>
      <p>
        <span className="text-slate-400">Titre: </span>{" "}
        <span className="text-slate-700">{filter.name}</span>
      </p>
      <div className="flex justify-center gap-3">
        <Link href={"/user/properties"}>
          <Button>Annuler</Button>
        </Link>
        <SubmitButton type="submit" color="danger" variant="light">
          Supprimer
        </SubmitButton>
      </div>
    </form>
  );
}

export default DeletePropertyPage;
