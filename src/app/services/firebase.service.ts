import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword} from 'firebase/auth';

import { User } from '../interfaces/user';

import { getFirestore, getDoc, doc, addDoc, collection, collectionData, query, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL, deleteObject } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  UtilsSvc = inject(UtilsService);
  storage = inject(AngularFireStorage);

  getAuth(){
    return getAuth();
  }

  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }

  signOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.UtilsSvc.routerLink('/login');
  }
  
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(),email);
  }

  // ------------------- BASE DE DATOS --------------------

  // ------------------- AGREGAR UN DOCUMENTO --------------------
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }

  updateDocument(path: string, data: any){
    return updateDoc(doc(getFirestore(), path), data);
  }

  deleteDocument(path: string){
    return deleteDoc(doc(getFirestore(), path));
  }

  // ------------------- SUBIR IMAGEN A BD --------------------
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() =>{
      return getDownloadURL(ref(getStorage(), path))
    })
  }

  async getFilePath(url: string){
    return ref(getStorage(), url).fullPath
  }

  // ------------------- OBTENER VIAJES DE UN USER --------------------
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'});
  }

  // ------------------- ELIMINAR COLECCION --------------------
  deleteFile(path: string){
    return deleteObject(ref(getStorage(), path));
  }
}
