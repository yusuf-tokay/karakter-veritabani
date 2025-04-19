import { db } from '../config/firebase.js';
import { collection, setDoc, getDocs, updateDoc, deleteDoc, doc, getDoc, query, where } from 'firebase/firestore';
import { createCharacter, calculateLevelUp } from '../data/characters.js';

const CHARACTERS_COLLECTION = 'characters';

const createCustomId = (name) => {
  // Türkçe karakterleri İngilizce karakterlere çevir
  const turkishToEnglish = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  
  return name
    .toLowerCase()
    .split('')
    .map(char => turkishToEnglish[char] || char)
    .join('')
    .replace(/[^a-z0-9]/g, '_');
};

export const addCharacter = async (characterData) => {
  const character = createCharacter(characterData);
  const customId = createCustomId(characterData.name);
  const docRef = doc(db, CHARACTERS_COLLECTION, customId);
  
  // Önce karakterin var olup olmadığını kontrol et
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    // Karakter zaten varsa, güncelleme yapma
    return { id: customId, ...docSnap.data() };
  }
  
  // Karakter yoksa yeni karakter oluştur
  await setDoc(docRef, character);
  return { id: customId, ...character };
};

export const getAllCharacters = async () => {
  const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCharacter = async (id, characterData) => {
  const characterRef = doc(db, CHARACTERS_COLLECTION, id);
  await updateDoc(characterRef, {
    ...characterData,
    updatedAt: new Date()
  });
};

export const deleteCharacter = async (id) => {
  const characterRef = doc(db, CHARACTERS_COLLECTION, id);
  await deleteDoc(characterRef);
};

export const deleteAllCharacters = async () => {
  const querySnapshot = await getDocs(collection(db, CHARACTERS_COLLECTION));
  const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

export const addExperience = async (characterId, experience) => {
  const characterRef = doc(db, CHARACTERS_COLLECTION, characterId);
  const characterDoc = await getDoc(characterRef);
  if (characterDoc.exists()) {
    const character = characterDoc.data();
    const updatedCharacter = {
      ...character,
      experience: character.experience + experience,
      updatedAt: new Date()
    };
    
    const levelUp = calculateLevelUp(updatedCharacter);
    if (levelUp) {
      await updateDoc(characterRef, levelUp);
      return { ...updatedCharacter, ...levelUp, leveledUp: true };
    }
    
    await updateDoc(characterRef, updatedCharacter);
    return { ...updatedCharacter, leveledUp: false };
  }
  return null;
}; 