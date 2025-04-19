export const userSchema = {
  username: String,
  email: String,
  selectedCharacterId: String,
  characters: Array,
  characterProgress: Object,
  totalPlayTime: Number,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
};

export const createUser = (data) => {
  return {
    ...data,
    characters: [],
    selectedCharacterId: '',
    characterProgress: {},
    totalPlayTime: 0,
    lastLogin: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
}; 