import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");
  const [message, setMessage] = useState()

  // TODO: signup
  const signup = async (newUser)=>{
    try {
      const req = await fetch('https://fsa-jwt-practice.herokuapp.com/signup', {
        method:"POST",
        headers :{ 
                  "Content-Type": "application/json" 
                },
        body:JSON.stringify(newUser)
      })
      const res = await req.json()
      setToken(res.token)
      setMessage(res.message)
      setLocation("TABLET")
    } catch (error) {
      console.log(error.message)
    }
  }

  // TODO: authenticate

  const authenticate = async()=>{
    const req = await fetch('https://fsa-jwt-practice.herokuapp.com/authenticate',  { 
        method: "GET", 
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
    })
    const data = await req.json()
    setMessage(data.message)
    setLocation("TUNNEL")

  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}
