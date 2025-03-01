import { connectDB } from "../../../lib/mongodb";
import  User  from "../../../models/User";
import bcrypt from "bcryptjs";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = { 
  providers: [
    CredentialsProvider({ // Kullanıcı adı ve şifre ile giriş yapma
      name: "credentials",  // Sağlayıcının adı
      credentials: { 
        email: { label: "Email", type: "text", placeholder: "email@example.com" }, // Kullanıcı adı alanı
        password: { label: "Password", type: "password" }, // Şifre alanı
      },
      async authorize(credentials) { // Kullanıcıyı doğrula
        if (!credentials?.email || !credentials?.password) { // Kullanıcı adı ve şifre zorunlu alanlardır
          return null;
        }

        await connectDB(); // Veritabanına bağlan
        const user = await User.findOne({ email: credentials.email }); // Kullanıcıyı e-posta adresine göre bul

        if (!user) return null; // Kullanıcı bulunamazsa null döndür

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password); // Şifreleri karşılaştır
        if (!passwordsMatch) return null; // Şifreler eşleşmezse null döndür

        return { // Kullanıcı bilgilerini döndür
          id: user._id.toString(), // MongoDB ObjectId'yi dizeye çevir
          email: user.email, // E-posta adresi
          name: user.name, // Ad
          profile: user.profile || {},
          settings: user.settings || {}
        };
      },
    }),
  ],
  session: { // Oturum ayarları
    strategy: "jwt", // Oturum yönetimi stratejisi
  },
  callbacks: { 
    async jwt({ token, user, trigger }) { // JWT token'ı oluştur
      if (user) { // Kullanıcı varsa
        token.id = user.id; // Kullanıcı kimliğini token'a ekle
        token.email = user.email; // E-posta adresini token'a ekle
        token.name = user.name; // Adı token'a ekle
      }

      if (trigger === 'update') { // Eğer update session işlemi yapılıyorsa 
        // Kullanıcı bilgilerini güncelle
        await connectDB(); // Veritabanına bağlan
        const updatedUser = await User.findById(token.id); // Kullanıcıyı kimliğine göre bul
        if (!updatedUser) return token; // Kullanıcı bulunamazsa token'ı döndür
        token.email = updatedUser.email; // E-posta adresini güncelle
        token.name = updatedUser.name; // Adı güncelle
        token.profile = updatedUser.profile || {};
        token.settings = updatedUser.settings || {};
      }
      return token; // Token'ı döndür
    },
    async session({ session, token }) { // Oturumu oluştur
      // `session.user`'ı zorunlu alanlarla doldur
      session.user = {
        id: token.id as string,
        email: token.email as string,
        name: token.name as string,
        profile: token.profile as any,
        settings: token.settings as any
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Oturum bilgilerini şifreleme anahtarı
  pages: {
    signIn: "/", // Giriş sayfası
    signOut: "/login", // Çıkış sayfası
    error: "/pages/error", // Hata sayfası
    newUser: "/main", // Yeni kullanıcı sayfası
  },
};

const handler = NextAuth(authOptions); // NextAuth'ı kullanarak bir işleyici oluştur

export { handler as GET, handler as POST }; // İşleyiciyi dışa aktar

