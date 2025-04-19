import { db, auth } from '../config/firebase.js';
import { collection, setDoc, getDocs, updateDoc, doc, query, where, getDoc } from 'firebase/firestore';
import { createUser } from '../data/users.js';

const USERS_COLLECTION = 'users';

const createCustomId = (username) => {
  // Türkçe karakterleri İngilizce karakterlere çevir
  const turkishToEnglish = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  
  return username
    .toLowerCase()
    .split('')
    .map(char => turkishToEnglish[char] || char)
    .join('')
    .replace(/[^a-z0-9]/g, '_');
};

export const addUser = async (userData) => {
  const user = createUser(userData);
  const customId = createCustomId(userData.username);
  const docRef = doc(db, USERS_COLLECTION, customId);
  await setDoc(docRef, user);
  return { id: customId, ...user };
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
      username: 'ZagrossBey'
    };
    return await addUser(newUser);
  }
  // Mevcut kullanıcının ismini güncelle
  const userRef = doc(db, USERS_COLLECTION, existingUser.id);
  await updateDoc(userRef, {
    username: 'ZagrossBey',
    updatedAt: new Date()
  });
  return { ...existingUser, username: 'ZagrossBey' };
}; 