import { addCharacter } from './services/characterService.js';
import { addUser, syncUserWithAuth } from './services/userService.js';
import { registerUser } from './services/authService.js';
import { sampleCharacters } from './data/sampleCharacters.js';

const initialize = async () => {
  try {
    // Örnek karakterleri veritabanına ekle
    console.log('Karakterler veritabanına ekleniyor...');
    for (const character of sampleCharacters) {
      await addCharacter(character);
    }
    console.log('Tüm karakterler başarıyla eklendi!');

    // Örnek kullanıcı oluştur
    const exampleUser = {
      email: 'test@example.com',
      password: 'test123456'
    };

    try {
      // Kullanıcıyı Firebase Authentication'a kaydet
      const authUser = await registerUser(exampleUser.email, exampleUser.password);
      console.log('Kullanıcı Firebase Authentication\'a kaydedildi:', authUser.uid);

      // Kullanıcıyı Firestore'a senkronize et
      const user = await syncUserWithAuth(authUser);
      console.log('Kullanıcı Firestore\'a senkronize edildi:', user);

    } catch (error) {
      console.error('Kullanıcı oluşturma hatası:', error);
    }

  } catch (error) {
    console.error('Hata:', error);
  }
};

initialize(); 