# Karakter Veritabanı Projesi

Bu proje, karakterlerin özelliklerini ve kullanıcı ilerlemelerini takip eden bir Firebase uygulamasıdır.

## Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/yusuf-tokay/karakter-veritabani.git
cd karakter-veritabani
```

2. Gerekli paketleri yükleyin:
```bash
npm install
```

3. Firebase yapılandırma bilgilerini `src/config/firebase.js` dosyasında güncelleyin:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDDX-cc30STbaAWpo5Ach_EIjwV_N6ao_U",
  authDomain: "karakterozelikleri.firebaseapp.com",
  projectId: "karakterozelikleri",
  storageBucket: "karakterozelikleri.firebasestorage.app",
  messagingSenderId: "561430374008",
  appId: "1:561430374008:web:314cad50712f5471062f8d",
  measurementId: "G-5997DKLEJ8"
};
```

4. Veritabanını başlatın:
```bash
npm run init-db
```

## Kullanım

1. Karakterleri görüntüleme ve yönetme
2. Kullanıcı profili oluşturma
3. Karakter seçimi ve ilerleme takibi
4. İstatistiklerin görüntülenmesi

## Özellikler

- 12 farklı karakter sınıfı
- Kullanıcı yetkilendirme sistemi
- Karakter ilerleme sistemi
- İstatistik takibi

## Güvenlik Notları

1. Firebase yapılandırma bilgilerini güvenli bir şekilde saklayın
2. Kullanıcı şifrelerini güçlü tutun
3. Veritabanı kurallarını düzgün yapılandırın

## Firebase Güvenlik Kuralları

Firestore güvenlik kurallarını şu şekilde ayarlayın:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Karakterleri herkes okuyabilir, sadece yetkililer yazabilir
    match /characters/{characterId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email_verified;
    }
    
    // Kullanıcı verilerini sadece ilgili kullanıcı okuyup yazabilir
    match /users/{userId} {
      allow read, write: if request.auth != null && 
        (request.auth.uid == userId || request.auth.token.email_verified);
    }
  }
}
```

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Feature branch'i oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## İletişim

Sorularınız için: [E-POSTA_ADRESİNİZ] 