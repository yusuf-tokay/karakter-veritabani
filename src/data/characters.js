export const characterSchema = {
  name: String,
  age: Number,
  gender: String,
  description: String,
  level: Number,
  experience: Number,
  strength: Number,
  agility: Number,
  intelligence: Number,
  health: Number,
  maxHealth: Number,
  createdAt: Date,
  updatedAt: Date
};

export const createCharacter = (data) => {
  return {
    ...data,
    level: 1,
    experience: 0,
    maxHealth: data.health,
    createdAt: new Date(),
    updatedAt: new Date()
  };
};

export const calculateLevelUp = (character) => {
  const experienceNeeded = character.level * 100;
  if (character.experience >= experienceNeeded) {
    return {
      level: character.level + 1,
      experience: character.experience - experienceNeeded,
      strength: Math.floor(character.strength * 1.1),
      agility: Math.floor(character.agility * 1.1),
      intelligence: Math.floor(character.intelligence * 1.1),
      health: Math.floor(character.health * 1.1),
      maxHealth: Math.floor(character.maxHealth * 1.1)
    };
  }
  return null;
}; 