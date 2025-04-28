import Account from "@/src/components/profileComponents/account/Account";
import { redirect } from "next/navigation";

const page = async () => {
  // const session = await getSession();

  // if (!session?.isLoggedIn) {
  //   redirect('/login');
  // }

  return (
    <>
      <Account />
    </>
  );
};

export default page;
