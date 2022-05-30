import { auth, db } from "./FireBase-config"
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, addDoc, doc, setDoc, getDocs,getDoc } from "firebase/firestore";
import { User } from "../Models/Models";



export const Login = async (Email: string, Password: any) => {
  try {
    const res = await signInWithEmailAndPassword(auth, Email, Password);
    return res;
  } catch (error) {
    return error;
  }
}


export const createDoc = async (collectionName: string, data: any) => {
  try {
    const res = await addDoc(collection(db, collectionName), data);
    return res;
  } catch (error) {
    return error;
  }
}

export const createDocCustomID = async (id: string, collectionName: string, data: any) => {
  try {
    const res = await setDoc(doc(db, collectionName, id), data);
    return res;
  } catch (error) {
    return error;
  }
}

export const getAll = async (collectionName: string) => {
  try {
    let user: User[] = [];
    const res = await getDocs(collection(db, collectionName));
    console.log(res.empty);
    
    res.forEach((doc) => {
      if (doc.exists()) {
        user.push({ ...doc.data(), id: doc.id });
      }
    });
    return user;
  } catch (error) {
    return error;
  }
}

export const getById = async (collectionName: string, id: string) => {
  try {
    let user: User[] = [];
    const res = await getDoc(doc(db, collectionName, id));
    console.log(res.data());
    
    
    // if (res.exists()) {
    //   user.push({ ...res.data(), id: res.id });
    // }
    return user;
  } catch (error) {
    return error;
  }
}

export const getOne = async (collectionName: string, where: any) => {}

export const update = async (collectionName: string, id: string, data: any) => {}

export const deleteOne = async (collectionName: string, id: string) => {}

