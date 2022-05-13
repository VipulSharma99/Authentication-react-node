import React, { useEffect } from 'react'
import {Navigate, useSearchParams} from "react-router-dom";
import Axios from 'axios';
import Cookies from 'universal-cookie';


function Auth() {
  const [searchParams] = useSearchParams();
  const cookie = new Cookies();
  useEffect(()=>{
    Axios.post("http://localhost:3001/auth",{token: searchParams.get("token")})
    .then((response)=>{
      console.log(response);
      cookie.set("sessionToken",response.data);
    });
  })
  return (
    <Navigate to="/" replace />
  )
}

export default Auth;