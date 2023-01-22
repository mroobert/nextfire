import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import { UserContext } from "@/lib/context";

import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <UserContext.Provider value={{ user: {}, username: "jeff" }}>
      <Navbar />
      <Component {...pageProps} />
      <Toaster />
    </UserContext.Provider>
  );
}
