import Login from "../components/login";

import { useEffect } from "react";
import { useRouter } from 'next/router';

export async function getStaticProps() {
  return { props: { isBlue: true } };
};

export default function Log() {
  let router = useRouter();

  useEffect(() => {
    let token = localStorage.getItem('token');
    if(token){
      router.replace('/');
    }
  },[router]);
  return (
    <main className="bg-gradient-primary" style={{"height":"100vh"}}>
      <div className="container">
        <Login />
      </div>
    </main>
  );
};
