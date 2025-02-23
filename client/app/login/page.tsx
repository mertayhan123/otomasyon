import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "@/app/components/login/loginform";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/main");
  return <LoginForm />;
}
