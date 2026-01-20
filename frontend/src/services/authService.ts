import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    UserCredential
} from "firebase/auth";
import { auth } from "./firebase";
import { createUserDocument } from "./userService";

export const register = async (email: string, pass: string, name: string, referralCode?: string): Promise<UserCredential> => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await createUserDocument(userCredential.user, name, referralCode);
    return userCredential;
};

export const login = (email: string, pass: string) => {
    return signInWithEmailAndPassword(auth, email, pass);
};

export const logout = () => {
    return signOut(auth);
};

export const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};
