import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      try {
        const userRef = doc(db, "users", token.sub);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          const newUser = {
            uid: token.sub,
            name: session.user.name,
            image: session.user.image || "",
            tag: session.user.name.split(" ").join("").toLowerCase(),
            bio: "",
            type: "user",
            banner: "",
          };

          await setDoc(userRef, newUser);
          session.user = newUser;
        } else {
          session.user = userDoc.data();
        }

        return session;
      } catch (error) {
        console.error("Error in session callback:", error);
        return session; // Return session even if an error occurs.
      }
    },
  },

  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);
