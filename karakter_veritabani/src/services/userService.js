import { db, auth } from '../config/firebase.js';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { createUser } from '../data/users.js';

const USERS_COLLECTION = 'users';

export const addUser = async (userData) => {
  const user = createUser(userData);
  const docRef = await addDoc(collection(db, USERS_COLLECTION), user);
  return { id: docRef.id, ...user };
};

export const getUserByEmail = async (email) => {
  const q = query(collection(db, USERS_COLLECTION), where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
};

export const updateUserCharacter = async (userId, characterId) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  await updateDoc(userRef, {
    selectedCharacterId: characterId,
    updatedAt: new Date()
  });
};

export const addCharacterToUser = async (userId, characterId) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const user = await getUserById(userId);
  const updatedCharacters = [...user.characters, characterId];
  await updateDoc(userRef, {
    characters: updatedCharacters,
    updatedAt: new Date()
  });
};

export const getUserById = async (userId) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const updateCharacterProgress = async (userId, characterId, progress) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const user = await getUserById(userId);
  const updatedProgress = {
    ...user.characterProgress,
    [characterId]: {
      ...user.characterProgress[characterId],
      ...progress,
      lastUpdated: new Date()
    }
  };
  await updateDoc(userRef, {
    characterProgress: updatedProgress,
    updatedAt: new Date()
  });
};

export const updatePlayTime = async (userId, playTime) => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const user = await getUserById(userId);
  await updateDoc(userRef, {
    totalPlayTime: user.totalPlayTime + playTime,
    lastLogin: new Date(),
    updatedAt: new Date()
  });
};

export const getCurrentUserProfile = async () => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return await getUserByEmail(currentUser.email);
  }
  return null;
};

export const syncUserWithAuth = async (authUser) => {
  const existingUser = await getUserByEmail(authUser.email);
  if (!existingUser) {
    const newUser = {
      email: authUser.email,
      username: authUser.displayName || authUser.email.split('@')[0]
    };
    return await addUser(newUser);
  }
  return existingUser;
}; 