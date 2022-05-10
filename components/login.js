import Link from "next/link";
import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";

export default function Login(){
	
	const [email, setEmail]=useState("");
	const [password, setPassword]=useState("");
	const email_error="";
	const password_error="";
	const history=useRouter();


	async function signin(e){
        e.preventDefault();
		//console.warn(email, password);	
		//email check
		var email_regex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		if(email.length<1 || !email_regex.test(email)){
			document.getElementById("emailerror").style.display="block";
		}else{
			document.getElementById("emailerror").style.display="none";
		}

		//password check
		if(password.length<1){
			document.getElementById("passworderror").style.display="block";
		}else if(password.length>1 && password.length<8){
			document.getElementById("passworderror").style.display="block";
		}else{
			document.getElementById("passworderror").style.display="none";
		}

		if(email.length>0 && email_regex.test(email) && password.length>0){
			let item={email, password};
			let response=await fetch("/api/login", {
				method:"POST",
				headers:{
					"Content-Type":"application/json",
					"Accept":"application/json"
				},
				body: JSON.stringify(item)
			});
			let result=await response.json();
			
			if(result.status==="Error"){
				document.getElementById("passworderror").textContent = "Invalid email or password";
				document.getElementById("passworderror").style.display="block";
				return false;
			}
			else{
				localStorage.clear();		
				localStorage.setItem("user", result.user);
				localStorage.setItem("token", result.token);
				history.replace("/");
			}
			
		}
	}

	return(
		<>
	        <div className="row justify-content-center align-items-center vh-100">
	            <div className="col-xl-10 col-lg-12 col-md-9">
	                <div className="card o-hidden border-0 shadow-lg my-5">
	                    <div className="card-body p-0">
	                        <div className="row">
	                            <div className="col-lg-6 d-none d-lg-block bg-login-image"></div>
	                            <div className="col-lg-6">
	                                <div className="p-5">
	                                    <div className="text-center">
	                                    	<div className="login-img">
	                                    		<img src="/images/logo.png" alt="DataSensei" />
	                                    	</div>
	                                        {/* <h1 className="h4 text-gray-900 mb-4">Login</h1> */}
	                                    </div>
	                                    <form className="user">
	                                        <div className="form-group">
	                                            <input 
	                                            	type="email" 
	                                            	className="form-control form-control-user" 
	                                            	id="email" 
	                                                placeholder="Email" 
	                                                onChange={(e)=>setEmail(e.target.value)}/>
	                                                <div id="emailerror" className="invalid-feedback">Invalid Email</div>
	                                        </div>
	                                        <div className="form-group">
	                                            <input 
		                                            type="password" 
		                                            className="form-control form-control-user" 
		                                            id="password" 
		                                            placeholder="Password" 
		                                            onChange={(e)=>setPassword(e.target.value)}/>
		                                        <div id="passworderror" className="invalid-feedback">Invalid Password</div>
	                                        </div>
	                                        <button 
	                                        	className="btn btn-primary btn-user btn-block"
	                                        	onClick={signin}>Login</button>
	                                    </form>
	                                </div>
	                            </div>
	                        </div>
	                    </div>
	                </div>
	            </div>
	        </div>
		</>
	);
};