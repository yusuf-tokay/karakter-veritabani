import { addCharacter } from './services/characterService.js';
import { addUser, syncUserWithAuth } from './services/userService.js';
import { registerUser } from './services/authService.js';
import { sampleCharacters } from './data/sampleCharacters.js';

const initialize = async () => {
  try {
    // Yeni karakterleri veritabanına ekle
    console.log('Yeni karakterler veritabanına ekleniyor...');
    for (const character of sampleCharacters) {
      try {
        await addCharacter(character);
        console.log(`${character.name} başarıyla eklendi!`);
      } catch (error) {
        // Eğer karakter zaten varsa, hata vermeden devam et
        console.log(`${character.name} zaten mevcut, atlanıyor...`);
      }
    }
    console.log('Karakter ekleme işlemi tamamlandı!');

    // Örnek kullanıcı oluştur
    const exampleUser = {
      email: 'zagross@example.com',
      password: 'test123456',
      username: 'ZagrossBey'
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