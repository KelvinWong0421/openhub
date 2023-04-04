import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";




export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],

  
  callbacks: {
    async session({session ,token}){

      try {
        // Check if user exists in Firebase
        const userRef = doc(db, "users", token.sub);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // User does not exist, create a new user in Firebase

          const newUser = {
            uid: token.sub,
            name: session.user.name,
            image: session?.user?.image,
            tag: session.user.name.split(" ").join("").toLocaleLowerCase(),
            bio: "",
            followers: [],
            following: [],
            type: 'user',
          };
          await setDoc(userRef, newUser);

          session.user = newUser;
        } else {
          // User exists in Firebase, use the user info from Firebase
          session.user = userDoc.data();
        }

        return session;
      } 
      catch (error) {
        console.log(error);
      }

    },
  },
// session.user.tag = session.user.name
//         .split(" ")
//         .join("")
//         .toLocaleLowerCase();
//         session.user.uid = token.sub;

//         return session;

  secret: process.env.JWT_SECRET
}

export default NextAuth(authOptions)