const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');

// JSON body parser
app.use(express.json());

// CORS ayarları - spesifik origin kullan
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Socket.IO sunucusu - spesifik origin kullan
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  // Ping timeout ve interval ayarları - bağlantı kararlılığı için önemli
  pingTimeout: 60000,    // 60 saniye
  pingInterval: 25000,   // 25 saniye
  connectTimeout: 30000, // 30 saniye
  // Diğer ayarlar
  transports: ['websocket', 'polling'],
  allowUpgrades: true,
  upgradeTimeout: 10000,
  cookie: false
});

// MongoDB bağlantı URI
const uri = process.env.MONGODB_URI || "mongodb+srv://mertayhandev:NhCuGlnMg0kWvpwi@cluster0.pcypi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);
const dbName = 'test'; // Veritabanı adı

// ESP cihazlarının bağlantı durumlarını takip etmek için
const connectedESPDevices = new Map();

// Buton durumunu almak için API endpoint
app.get('/api/button/status', async (req, res) => {
  try {
    const db = client.db(dbName);
    const buttonsCollection = db.collection('buttons');
    const espButton = await buttonsCollection.findOne({ name: "esp" });
    
    if (espButton) {
      res.json({ name: espButton.name, status: espButton.status });
    } else {
      res.status(404).json({ error: "Button not found" });
    }
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Buton durumunu değiştirmek için API endpoint
app.post('/api/button/toggle', async (req, res) => {
  try {
    const db = client.db(dbName);
    const buttonsCollection = db.collection('buttons');
    const espButton = await buttonsCollection.findOne({ name: "esp" });
    
    if (espButton) {
      // Buton durumunu tersine çevir
      const newStatus = !espButton.status;
      
      // Veritabanını güncelle
      await buttonsCollection.updateOne(
        { name: "esp" },
        { 
          $set: { 
            status: newStatus,
            updatedAt: new Date()
          } 
        }
      );
      
      console.log(`Buton durumu güncellendi: ${newStatus ? 'AÇIK' : 'KAPALI'}`);
      
      // Tüm bağlı cihazlara yeni durumu bildir
      io.emit("buttonState", newStatus ? 1 : 0);
      
      res.json({ name: "esp", status: newStatus });
    } else {
      res.status(404).json({ error: "Button not found" });
    }
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Buton durumunu belirli bir değere ayarlamak için API endpoint
app.post('/api/button/set', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (status === undefined || (typeof status !== 'boolean')) {
      return res.status(400).json({ error: "Invalid status value. Must be a boolean." });
    }
    
    const db = client.db(dbName);
    const buttonsCollection = db.collection('buttons');
    
    // Veritabanını güncelle
    await buttonsCollection.updateOne(
      { name: "esp" },
      { 
        $set: { 
          status: status,
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );
    
    console.log(`Buton durumu ayarlandı: ${status ? 'AÇIK' : 'KAPALI'}`);
    
    // Tüm bağlı cihazlara yeni durumu bildir
    io.emit("buttonState", status ? 1 : 0);
    
    res.json({ name: "esp", status: status });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        
        // Koleksiyon adını düzelt - Mongoose 'Button' modelini kullanıyor, bu da 'buttons' koleksiyonuna karşılık gelir
        const buttonsCollection = db.collection('buttons');
        
        // Başlangıçta ESP butonunun varlığını kontrol et
        const espButton = await buttonsCollection.findOne({ name: "esp" });
        if (!espButton) {
            console.log("ESP butonu veritabanında bulunamadı, oluşturuluyor...");
            await buttonsCollection.insertOne({
                name: "esp",
                status: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            console.log("ESP butonu oluşturuldu (açık durumda)");
        } else {
            console.log("ESP butonu veritabanında bulundu:", espButton);
            // Mevcut butonu açık duruma getir
            await buttonsCollection.updateOne(
                { name: "esp" },
                { $set: { status: true, updatedAt: new Date() } }
            );
            console.log("ESP butonu açık duruma getirildi");
        }

        io.on("connection", (socket) => {
            console.log('Client connected');
            console.log('Client ID:', socket.id);
            console.log('Client IP:', socket.handshake.address);
            console.log('Transport:', socket.conn.transport.name);

            // Client'dan gelen clientInfo olayını dinle
            socket.on("clientInfo", (data) => {
                console.log("Client info received:", data);
                
                // ESP8266 cihazı bağlandığında özel işlemler
                if (data && data.device === "ESP8266") {
                    console.log("ESP8266 cihazı bağlandı! IP:", data.ip);
                    
                    // ESP cihazını bağlı cihazlar listesine ekle
                    connectedESPDevices.set(socket.id, {
                        ip: data.ip,
                        connectedAt: new Date(),
                        lastPing: new Date(),
                        ...data
                    });
                    
                    // Mevcut buton durumunu hemen gönder
                    sendButtonState(socket);
                }
            });

            // ESP cihazından gelen ping mesajlarını dinle
            socket.on("ping", () => {
                console.log(`Ping received from ${socket.id}`);
                
                // ESP cihazının son ping zamanını güncelle
                if (connectedESPDevices.has(socket.id)) {
                    const deviceInfo = connectedESPDevices.get(socket.id);
                    deviceInfo.lastPing = new Date();
                    connectedESPDevices.set(socket.id, deviceInfo);
                }
                
                // Pong yanıtı gönder
                socket.emit("pong");
            });

            // ESP cihazından gelen buton durumu güncellemelerini dinle
            socket.on("updateButtonState", async (state) => {
                try {
                    console.log(`Button state update received from ${socket.id}: ${state}`);
                    
                    // Boolean'a dönüştür
                    const boolState = state === 1 || state === true;
                    
                    // Veritabanını güncelle
                    await buttonsCollection.updateOne(
                        { name: "esp" },
                        { 
                            $set: { 
                                status: boolState,
                                updatedAt: new Date()
                            } 
                        },
                        { upsert: true }
                    );
                    
                    console.log(`Buton durumu güncellendi: ${boolState ? 'AÇIK' : 'KAPALI'}`);
                    
                    // Tüm bağlı cihazlara yeni durumu bildir
                    io.emit("buttonState", boolState ? 1 : 0);
                } catch (err) {
                    console.error("Buton durumu güncellenirken hata:", err);
                }
            });

            // Bağlantı kesildiğinde
            socket.on("disconnect", (reason) => {
                console.log(`Client disconnected. Reason: ${reason}`);
                
                // ESP cihazını bağlı cihazlar listesinden çıkar
                if (connectedESPDevices.has(socket.id)) {
                    console.log(`ESP8266 cihazı bağlantısı kesildi: ${socket.id}`);
                    connectedESPDevices.delete(socket.id);
                }
            });

            // Hata durumunda
            socket.on("error", (error) => {
                console.error("Socket error:", error);
            });

            // Buton durumunu gönderme fonksiyonu
            async function sendButtonState(targetSocket = null) {
                try {
                    // ESP butonunu bul
                    const espButton = await buttonsCollection.findOne({ name: "esp" });
                    
                    if (espButton) {
                        // status alanını kontrol et (boolean değer)
                        const state = espButton.status === true ? 1 : 0;
                        
                        // Belirli bir sokete veya tüm soketlere gönder
                        if (targetSocket) {
                            targetSocket.emit("buttonState", state);
                            console.log(`ESP buton durumu ${targetSocket.id} soketine gönderildi:`, state);
                        } else {
                            io.emit("buttonState", state);
                            console.log("ESP buton durumu tüm soketlere gönderildi:", state);
                        }
                        
                        console.log("ESP buton durumu gönderildi:", state, "Gerçek değer:", espButton.status);
                    } else {
                        console.log("ESP butonu bulunamadı");
                    }
                } catch (err) {
                    console.error("ESP buton verisi alınırken hata:", err);
                }
            }

            // Her saniye buton durumunu kontrol et ve gönder
            const intervalId = setInterval(() => sendButtonState(), 1000);

            // Bağlantı kesildiğinde interval'i temizle
            socket.on("disconnect", () => {
                clearInterval(intervalId);
            });
        });

        // 3000 portunda dinle
        const PORT = process.env.PORT || 3000;
        server.listen(PORT, () => {
            console.log(`Socket.IO server running on port ${PORT}`);
            console.log(`Server IP: ${getLocalIpAddress()}`);
        });

    } catch (err) {
        console.error("MongoDB bağlantı hatası:", err);
    }
}

// Yerel IP adresini almak için yardımcı fonksiyon
function getLocalIpAddress() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    const results = {};

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // IPv4 ve dahili olmayan adresleri atla
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }
    
    // İlk bulunan IPv4 adresini döndür
    for (const name of Object.keys(results)) {
        if (results[name].length > 0) {
            return results[name][0];
        }
    }
    
    return 'localhost';
}

run().catch(console.dir); 