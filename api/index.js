const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer);
const { MongoClient } = require('mongodb');

// MongoDB bağlantı URI
const uri = process.env.MONGODB_URI || "mongodb+srv://mertayhandev:7DmcxFEIdQ1gj4gm@cluster0.d0jvq.mongodb.net/";
const client = new MongoClient(uri);
const dbName = 'test'; // Veritabanı adı
const buttonsCollectionName = 'butons'; // Buton verilerini içeren koleksiyon adı

async function run() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const db = client.db(dbName);
        const buttonsCollection = db.collection(buttonsCollectionName);

        io.on("connection", (socket) => {
            console.log('Client connected');

            setInterval(async () => {
                try {
                    // Buttons koleksiyonundaki verilerden sadece state alanını al
                    const buttonsData = await buttonsCollection
                        .find({}, { projection: { state: 1, _id: 0 } })
                        .toArray();
                    
                    // "Açık" için 1, "Kapalı" için 0 değerini hesapla
                    const states = buttonsData.map(button => button.state === "Açık" ? 1 : 0);
                    io.emit("buttonsData", states);
                    console.log("Sent state data to clients:", states);
                } catch (err) {
                    console.error("Error fetching buttons data:", err);
                }
            }, 1000); // 0.1 saniyede bir veriyi gönder 
        });
    } catch (err) {
        console.error(err);
    }
}

run().catch(console.error);

httpServer.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});