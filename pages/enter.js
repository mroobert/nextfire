import { useState, useCallback } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { useContext, useEffect } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";

import { auth, store, googleAuthProvider } from "@/lib/firebase";
import { UserContext } from "@/lib/context";

function EnterPage({}) {
  const { user, username } = useContext(UserContext);

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

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUserName(formValue);
  }, [formValue]);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Create refs for both documents
    const userDoc = doc(store, "users", user.uid);
    const usernameDoc = doc(store, "usernames", formValue);

    // Commit both docs together as a batch write
    const batch = writeBatch(store);
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    // Force form value typed in form to match correct format
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  // Hit the firestore database for usename match after each debounced change
  // useCallback is required for debounce to work
  const checkUserName = useCallback(
    debounce(async (username) => {
      if (username?.length >= 3) {
        const ref = doc(store, "usernames", username);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="myname"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" disabled={!isValid}>
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

export default EnterPage;
