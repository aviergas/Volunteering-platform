import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';

interface UserContextType {
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

type UserProviderProps = {
  children: ReactNode;
};

export interface DecodedToken{
  id:string;
  email:string;
  password:string;
}

const isEmpty = (obj:any) => {
  return Object.keys(obj).length === 0;
};
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("user_token"));
  const [admin , setAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/users/me", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status !== 200) {
          setToken(null);
        //   console.log(response);
        //   console.log(response.status);
        }

        if (token !== null) {
          localStorage.setItem("user_token", token);
          const decodedToken: DecodedToken = jwtDecode<DecodedToken>(token);

        if(decodedToken.id)
        {
          // console.log("ok");
          const obj_id = JSON.parse(
            decodedToken.id.trim()
                                    .replace(/'/g, '"')
                                    .replace(/([{,])\s*([a-zA-Z_$][a-zA-Z_$0-9]*)\s*:/g, '$1"$2":')
                                  );
          // setMyId();
          localStorage.setItem("user_id", obj_id.$oid);
          // console.log(obj_id.$oid);
        }


          // console.log("ayooooo the token was updated !!!!!\n "+token);
          console.log(decodedToken.email);
          if(decodedToken.email)
          {
            const admin_response = await axios.get('http://127.0.0.1:8000/api/users/admins/'+decodedToken.email, {
              headers: {
                'accept': 'application/json'
              }
            });
            console.log(admin_response.data);
            if(!isEmpty(admin_response.data))
              {
                setAdmin(true);
                localStorage.setItem("admin", "true");
              }
            else
            {
              localStorage.removeItem("admin");
            }
          }
        }
         else {
          localStorage.removeItem("user_token");
          localStorage.removeItem("user_id");
        }
      } catch (error) {
        // console.log(error);
        // console.log("the token was NOOOOOTTTT updated yoooo");
        // console.log(error.message);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};
