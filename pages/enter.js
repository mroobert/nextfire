import { auth, googleAuthProvider } from "@/lib/firebase";

import { signInWithPopup, signOut } from "firebase/auth";

function EnterPage({}) {
  const user = null;
  const username = null;

  // 1. User is signed-out => <SignInButton />
  // 2. User is signed-in, but missing username =>  <UsernameForm />
  // 3. User is signed-in, has username => <SignOutButton />
  return (
    <main className="center-buttons">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    //TODO: add try catch
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}

function SignOutButton() {
  const signOutUser = async () => {
    //TODO: add try catch
    await signOut(auth);
  };
  return <button onClick={signOutUser}>Sign Out</button>;
}

function UsernameForm() {}

export default EnterPage;
