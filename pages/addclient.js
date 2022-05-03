import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import AddCompany from "../components/addCompany";
import { useEffect, useState } from "react";
import { useRouter } from 'next/router';


export default function Addcompany(props) {

  const router = useRouter();
  const [loggedInUser, setLoggedInUser] = useState('');
  const [tokenCheck, setTokenCheck] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem('token');
    let user = localStorage.getItem('user');
    if(!token){
      router.push('/login');
    }
    else{
      setTokenCheck(true);
      setLoggedInUser(user);
    }
  },[router]);
  return (
    <>
    {
      tokenCheck && 
      <main>
      <div id="wrapper">
        <Sidebar/>
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            <Navbar user={loggedInUser}/>
            <div className="container-fluid">
              <AddCompany />
            </div>
          </div>
        </div>
      </div>
    </main>
    }
    </>
  )
}



export async function getStaticProps(){
  
    return {
      props: {
        isBlue: false
      }
    }
}