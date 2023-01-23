import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, onSnapshot } from "firebase/firestore";

import { auth, store } from "@/lib/firebase";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUserName] = useState(null);

  useEffect(
    function ReadUsername() {
      // turn off realtime subscription
      let unsubscribe;

      if (user) {
        const ref = doc(store, "users", user.uid);
        unsubscribe = onSnapshot(ref, (doc) => {
          setUserName(doc.data()?.username);
        });
      } else {
        setUserName(null);
      }

      return unsubscribe;
    },
    [user]
  );

  return { user, username };
}
