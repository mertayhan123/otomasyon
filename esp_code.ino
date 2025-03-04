#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <WebSocketsClient.h>
#include <SocketIOclient.h>
#include <Hash.h>

// WiFi ayarları - 2.4GHz ağı kullanın, ESP8266 5GHz desteklemez
const char* ssid = "hmm";   // Wi-Fi SSID
const char* password = "omer123456";  // Wi-Fi şifresi

// Sunucu bilgileri - Kendi bilgisayarınızın IP adresini girin
const char* serverAddress = "192.168.135.14";  // Sunucu IP - kendi bilgisayarınızın IP adresi
const uint16_t serverPort = 3000;  // Sunucu Portu

SocketIOclient socketIO;
#define USE_SERIAL Serial

const int ledPin = 2; // LED bağlı olduğu pin (ESP8266'da GPIO2 genellikle D4 pinine karşılık gelir)
// ESP8266'da GPIO2 (D4) pini ters çalışabilir, LOW = LED açık, HIGH = LED kapalı
const bool LED_ON = LOW;  // LED'i açmak için gereken pin durumu
const bool LED_OFF = HIGH; // LED'i kapatmak için gereken pin durumu

// Bağlantı durumu
bool isConnected = false;
unsigned long lastReconnectAttempt = 0;
unsigned long lastPingTime = 0;
const int reconnectInterval = 5000; // 5 saniye
const int pingInterval = 10000;     // 10 saniye
bool ledState = false; // LED'in mevcut durumu

// Ping gönderme fonksiyonu - bağlantıyı canlı tutmak için
void sendPing() {
  if (isConnected && millis() - lastPingTime > pingInterval) {
    DynamicJsonDocument doc(128);
    JsonArray array = doc.to<JsonArray>();
    array.add("ping");
    
    String output;
    serializeJson(doc, output);
    socketIO.sendEVENT(output);
    USE_SERIAL.println("Ping gönderildi");
    
    lastPingTime = millis();
  }
}

// LED durumunu değiştir ve sunucuya bildir
void setLedState(bool state) {
  // LED durumu değiştiyse
  if (ledState != state) {
    ledState = state;
    // LED'i doğru şekilde kontrol et (ESP8266'da GPIO2 ters çalışabilir)
    digitalWrite(ledPin, state ? LED_ON : LED_OFF);
    USE_SERIAL.println(state ? "LED AÇIK" : "LED KAPALI");
    
    // Sunucuya LED durumunu bildir
    if (isConnected) {
      DynamicJsonDocument doc(128);
      JsonArray array = doc.to<JsonArray>();
      array.add("updateButtonState");
      array.add(state ? 1 : 0);
      
      String output;
      serializeJson(doc, output);
      socketIO.sendEVENT(output);
      USE_SERIAL.println("LED durumu sunucuya bildirildi: " + String(state ? "AÇIK" : "KAPALI"));
    }
  }
}

void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT: {
      USE_SERIAL.printf("[IO] Bağlantı koptu!\n");
      isConnected = false;
      break;
    }
      
    case sIOtype_CONNECT: {
      USE_SERIAL.printf("[IO] Bağlandı: %s\n", payload);
      isConnected = true;
      lastPingTime = millis(); // Ping zamanlayıcısını sıfırla
      
      // Socket.IO sunucusuna katılma
      socketIO.send(sIOtype_CONNECT, "/");

      // ESP8266'nın bilgilerini JSON olarak sunucuya gönder
      DynamicJsonDocument doc(1024);
      JsonArray array = doc.to<JsonArray>();
      array.add("clientInfo");
      JsonObject param1 = array.createNestedObject();
      param1["device"] = "ESP8266";
      param1["ip"] = WiFi.localIP().toString();
      param1["status"] = "connected";
      param1["rssi"] = WiFi.RSSI();
      param1["version"] = "1.0.0"; // Yazılım versiyonu
      param1["chipId"] = String(ESP.getChipId(), HEX); // Benzersiz cihaz kimliği
      param1["ledState"] = ledState; // Mevcut LED durumu
      
      String output;
      serializeJson(doc, output);
      socketIO.sendEVENT(output);
      
      USE_SERIAL.println("Bağlantı bilgileri sunucuya gönderildi.");
      break;
    }
      
    case sIOtype_EVENT: {
      USE_SERIAL.printf("[IO] Event geldi: %s\n", payload);

      // JSON verisini ayrıştır
      DynamicJsonDocument doc(1024);
      DeserializationError error = deserializeJson(doc, payload, length);

      if (error) {
        USE_SERIAL.print("JSON Parse Hatası: ");
        USE_SERIAL.println(error.c_str());
        return;
      }

      // Gelen veriyi kontrol et
      String eventName = doc[0];
      USE_SERIAL.printf("Olay: %s\n", eventName.c_str());
      
      if (eventName == "buttonState") { // 'buttonState' olayını kontrol et
        int state = doc[1]; // Buton durumunu al
        USE_SERIAL.printf("Buton durumu: %d\n", state);

        // LED'i kontrol et
        setLedState(state == 1);
      } else if (eventName == "pong") {
        USE_SERIAL.println("Pong alındı");
        lastPingTime = millis(); // Ping zamanlayıcısını sıfırla
      }
      break;
    }
    
    case sIOtype_ACK: {
      USE_SERIAL.printf("[IO] ACK alındı: %u\n", length);
      break;
    }
      
    case sIOtype_ERROR: {
      USE_SERIAL.printf("[IO] Hata alındı: %u\n", length);
      isConnected = false;
      break;
    }
      
    case sIOtype_BINARY_EVENT: {
      USE_SERIAL.printf("[IO] Binary event alındı: %u\n", length);
      break;
    }
      
    case sIOtype_BINARY_ACK: {
      USE_SERIAL.printf("[IO] Binary ACK alındı: %u\n", length);
      break;
    }
  }
}

void scanNetworks() {
  USE_SERIAL.println("Çevredeki WiFi ağları taranıyor...");
  
  // WiFi tarama modunu ayarla
  WiFi.mode(WIFI_STA);
  WiFi.disconnect();
  delay(100);
  
  int n = WiFi.scanNetworks();
  
  if (n == 0) {
    USE_SERIAL.println("Hiçbir ağ bulunamadı! Lütfen şunları kontrol edin:");
    USE_SERIAL.println("1. ESP8266 cihazınız yönlendiriciye yakın mı?");
    USE_SERIAL.println("2. Yönlendiriciniz 2.4GHz ağı yayınlıyor mu? (ESP8266 sadece 2.4GHz destekler)");
    USE_SERIAL.println("3. Yönlendiriciniz SSID yayını yapıyor mu? (Gizli ağlar görünmeyebilir)");
  } else {
    USE_SERIAL.print(n);
    USE_SERIAL.println(" ağ bulundu:");
    
    bool targetNetworkFound = false;
    
    for (int i = 0; i < n; ++i) {
      // SSID ve RSSI değerlerini yazdır
      USE_SERIAL.print(i + 1);
      USE_SERIAL.print(": ");
      USE_SERIAL.print(WiFi.SSID(i));
      USE_SERIAL.print(" (");
      USE_SERIAL.print(WiFi.RSSI(i));
      USE_SERIAL.print(" dBm)");
      USE_SERIAL.print(" - Kanal: ");
      USE_SERIAL.print(WiFi.channel(i));
      USE_SERIAL.println((WiFi.encryptionType(i) == ENC_TYPE_NONE) ? " - Açık" : " - Şifreli");
      
      // Hedef ağımızı bulup bulmadığımızı kontrol et
      if (WiFi.SSID(i) == ssid) {
        targetNetworkFound = true;
        USE_SERIAL.print(">>> Hedef ağ '");
        USE_SERIAL.print(ssid);
        USE_SERIAL.println("' bulundu! <<<");
      }
      
      delay(10);
    }
    
    if (!targetNetworkFound) {
      USE_SERIAL.print("!!! Hedef ağ '");
      USE_SERIAL.print(ssid);
      USE_SERIAL.println("' bulunamadı! SSID adını kontrol edin !!!");
    }
  }
  USE_SERIAL.println("");
}

bool connectToWiFi() {
  // Önce mevcut ağları tara
  scanNetworks();
  
  USE_SERIAL.printf("WiFi ağına bağlanılıyor: %s\n", ssid);
  
  // WiFi modunu ayarla ve önceki bağlantıları temizle
  WiFi.persistent(false);  // Flash belleğe yazma (daha az aşınma)
  WiFi.mode(WIFI_STA);     // İstasyon modunu ayarla
  WiFi.disconnect();       // Önceki bağlantıları temizle
  delay(100);
  
  // WiFi bağlantı parametrelerini ayarla
  WiFi.begin(ssid, password);
  
  // Bağlantı durumunu yazdır
  USE_SERIAL.print("Bağlanılıyor");
  
  int attempts = 0;
  const int maxAttempts = 20;
  
  while (WiFi.status() != WL_CONNECTED && attempts < maxAttempts) {
    delay(500);
    USE_SERIAL.print(".");
    attempts++;
    
    // Her 5 denemede bir durum bilgisi yazdır
    if (attempts % 5 == 0) {
      USE_SERIAL.print(" (Deneme ");
      USE_SERIAL.print(attempts);
      USE_SERIAL.print("/");
      USE_SERIAL.print(maxAttempts);
      USE_SERIAL.print(", Durum: ");
      printWiFiStatus(WiFi.status());
      USE_SERIAL.println(")");
      USE_SERIAL.print("Bağlanılıyor");
    }
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    USE_SERIAL.println();
    USE_SERIAL.println("=================================");
    USE_SERIAL.println("WiFi BAĞLANTISI BAŞARILI!");
    USE_SERIAL.print("Bağlanılan ağ: ");
    USE_SERIAL.println(WiFi.SSID());
    USE_SERIAL.print("IP adresi: ");
    USE_SERIAL.println(WiFi.localIP());
    USE_SERIAL.print("Sinyal gücü (RSSI): ");
    USE_SERIAL.print(WiFi.RSSI());
    USE_SERIAL.println(" dBm");
    USE_SERIAL.println("=================================");
    return true;
  } else {
    USE_SERIAL.println();
    USE_SERIAL.println("=================================");
    USE_SERIAL.println("WiFi BAĞLANTISI BAŞARISIZ!");
    USE_SERIAL.print("Son durum kodu: ");
    USE_SERIAL.print(WiFi.status());
    USE_SERIAL.print(" (");
    printWiFiStatus(WiFi.status());
    USE_SERIAL.println(")");
    USE_SERIAL.println("=================================");
    
    // WiFi bağlantı sorunları için öneriler
    USE_SERIAL.println("\nÖneriler:");
    USE_SERIAL.println("1. SSID ve şifrenin doğru olduğundan emin olun");
    USE_SERIAL.println("2. ESP8266 cihazınızın yönlendiriciye yakın olduğundan emin olun");
    USE_SERIAL.println("3. Yönlendiricinizin 2.4GHz ağı yayınladığından emin olun (ESP8266 5GHz desteklemez)");
    USE_SERIAL.println("4. Yönlendiricinizin maksimum bağlantı sayısını aşmadığından emin olun");
    USE_SERIAL.println("5. Yönlendiriciyi yeniden başlatmayı deneyin");
    USE_SERIAL.println("6. ESP8266 cihazını yeniden başlatmayı deneyin");
    
    return false;
  }
}

// WiFi durum kodlarını açıklayan yardımcı fonksiyon
void printWiFiStatus(wl_status_t status) {
  switch (status) {
    case WL_NO_SHIELD:
      USE_SERIAL.print("WiFi shield bulunamadı");
      break;
    case WL_IDLE_STATUS:
      USE_SERIAL.print("WiFi taranıyor");
      break;
    case WL_NO_SSID_AVAIL:
      USE_SERIAL.print("SSID bulunamadı");
      break;
    case WL_SCAN_COMPLETED:
      USE_SERIAL.print("Tarama tamamlandı");
      break;
    case WL_CONNECT_FAILED:
      USE_SERIAL.print("Bağlantı başarısız (muhtemelen yanlış şifre)");
      break;
    case WL_CONNECTION_LOST:
      USE_SERIAL.print("Bağlantı kaybedildi");
      break;
    case WL_DISCONNECTED:
      USE_SERIAL.print("Bağlantı kesildi");
      break;
    case WL_CONNECTED:
      USE_SERIAL.print("Bağlandı");
      break;
    default:
      USE_SERIAL.print("Bilinmeyen hata");
  }
}

void connectToSocketIO() {
  // Socket.IO sunucusuna bağlan
  USE_SERIAL.printf("Socket.IO sunucusuna bağlanılıyor: %s:%d\n", serverAddress, serverPort);
  
  // Socket.IO bağlantı parametrelerini ayarla
  socketIO.setExtraHeaders("Connection: keep-alive");
  socketIO.setReconnectInterval(5000); // 5 saniye
  
  // Bağlantıyı başlat
  socketIO.begin(serverAddress, serverPort, "/socket.io/?EIO=4");
  socketIO.onEvent(socketIOEvent);
  lastReconnectAttempt = millis();
}

void setup() {
  USE_SERIAL.begin(115200);  // Serial iletişimini başlat
  USE_SERIAL.setDebugOutput(true);
  
  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println("ESP8266 WiFi ve Socket.IO Testi");
  USE_SERIAL.println("-------------------------------");

  for(uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BAŞLATILIYOR %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  pinMode(ledPin, OUTPUT); // LED pinini çıkış olarak ayarla
  digitalWrite(ledPin, LED_OFF); // Başlangıçta LED'i kapalı tut
  ledState = false;

  // WiFi'ye bağlanmayı dene
  if (connectToWiFi()) {
    // Socket.IO sunucusuna bağlan
    connectToSocketIO();
  } else {
    USE_SERIAL.println("WiFi bağlantısı kurulamadı. Lütfen SSID ve şifreyi kontrol edin.");
    // Başarısız bağlantı durumunda LED'i hızlıca yanıp söndür
    for (int i = 0; i < 10; i++) {
      digitalWrite(ledPin, HIGH);
      delay(100);
      digitalWrite(ledPin, LOW);
      delay(100);
    }
  }
}

void loop() {
  // WiFi bağlantısını kontrol et
  if (WiFi.status() != WL_CONNECTED) {
    USE_SERIAL.println("WiFi bağlantısı kesildi. Yeniden bağlanılıyor...");
    
    if (connectToWiFi()) {
      // WiFi bağlantısı başarılı, Socket.IO'ya yeniden bağlan
      connectToSocketIO();
    } else {
      // WiFi bağlantısı başarısız, bir süre bekle ve tekrar dene
      delay(reconnectInterval);
    }
  } else {
    // WiFi bağlı, Socket.IO işlemlerini yürüt
    socketIO.loop();
    
    // Ping gönder - bağlantıyı canlı tutmak için
    sendPing();
    
    // Socket.IO bağlantısını kontrol et
    if (!isConnected && millis() - lastReconnectAttempt > reconnectInterval) {
      USE_SERIAL.println("Socket.IO bağlantısı kesildi. Yeniden bağlanılıyor...");
      connectToSocketIO();
      lastReconnectAttempt = millis();
    }
  }
} 