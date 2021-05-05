import React from "react";
import { signIn, signOut, useSession } from "next-auth/client";

/**
 * Login and logout component when user wants to use Facebook or Instagram or Google account.
 * @returns template html with login and logout.
 */
const Authentication = () => {
  const [session, loading] = useSession();

  return (
    <>
      {!session && (
        <>
          Not signed in <br />
          <button onClick={() => signIn()}>Sign in</button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </>
  );
};

export default Authentication;
