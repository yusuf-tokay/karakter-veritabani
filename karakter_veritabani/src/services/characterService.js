import { db } from '../config/firebase.js';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { createCharacter, calculateLevelUp } from '../data/characters.js';

const CHARACTERS_COLLECTION = 'characters';

export const addCharacter = async (characterData) => {
  const character = createCharacter(characterData);
  const docRef = await addDoc(collection(db, CHARACTERS_COLLECTION), character);
  return { id: docRef.id, ...character };
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