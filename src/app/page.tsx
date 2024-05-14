import { auth } from "@/auth";

export default async function Home() {
  const userAuth = await auth();

  return (
    <div className=" text-black bg-red-400 p-5">

    </div>
  );
}
