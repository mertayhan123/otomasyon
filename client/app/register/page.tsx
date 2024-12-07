"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from "react";

export default function SignUp() {
    const [name, setname] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState("");
    const router = useRouter();
    
  
    const handleSubmit = async (e: any) => {
      e.preventDefault();
  
      if (!name || !email || !password) {
        seterror("Lütfen tüm alanları doldurunuz");
        setTimeout(() => {
          seterror("");
        }, 5000);
        return;
      }
  
      try {
  
        const resuser =await fetch("/api/userExists", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({  email  }),
        })
  
        const {user}=await  resuser.json();
        if(user){
          seterror("Bu e-posta adresi zaten kullanılmakta");
          return;
        }
          
  
  
        await fetch("/api/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }).then((res) => {
          if (res.ok) {
            console.log("kayıt başarılı");
            router.push("/");
          } else {
            console.log("kayıt başarısız");
          }
        });
  
        
      }
      catch (error) {
        console.log(error);
      }
    };
  
    return (
      <div className="bg-red-900 flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-1/2">
          <input
            type="text"
            placeholder="Adınız"
            className="input w-full "
            onChange={(e) => setname((e.target.value).toUpperCase())}
          />
          <input
            type="email"
            className="input w-full"
            placeholder="E-posta"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            className="input w-full   "
            placeholder="Şifre"
            onChange={(e) => setpassword(e.target.value)}
          />
         {error &&  <div className="toast toast-top toast-start">
            <div className="alert alert-danger">
              <span>{error}</span>
            </div>
            
          </div>}
         
          <button className="btn">Kayıt Ol</button>
        </form>
      </div>
    );
}
