import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export default function Navbar({user}){
	const [isActive, setIsActive] = useState(false);
	const dropdown = useRef(null);

	useEffect(() => {
	    // only add the event listener when the dropdown is opened
	    if (!isActive) return;
	    function handleClick(event) {
	      	if (dropdown.current && !dropdown.current.contains(event.target)) {
	        	setIsActive(false);
	      	}
	    }
	    window.addEventListener("click", handleClick);
	    // clean up
	    return () => window.removeEventListener("click", handleClick);
	}, [isActive]);

	// let user = JSON.parse(localStorage.getItem("user-info"));
	// console.log(user);

	const history=useRouter();

	function logout(){
		localStorage.clear();
		history.push("/login");
	}

	return(
        <>
			<nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
			    <button id="sidebarToggleTop" className="btn btn-link d-md-none rounded-circle mr-3">
			        <i className="fa fa-bars"></i>
			    </button>
			    <ul className="navbar-nav ml-auto">
			        <li className="nav-item dropdown no-arrow">
			        	<Link href="#">
			        		<>
					            <a className="nav-link dropdown-toggle" id="userDropdown" role="button"
					                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" onClick={() => setIsActive(!isActive)}>
					                <span className="d-none d-lg-inline text-gray-600 small">{user}</span>
					                {
					            		!isActive &&
					                	<i className="mr-2 fas fa-fw fa-angle-down"></i>
					            	}
					                {
					            		isActive &&
					                	<i className="mr-2 fas fa-fw fa-angle-up"></i>
					            	}
					                <img className="img-profile rounded-circle" src="/images/logo@2x.png" />
					            </a>
					            {
					            	isActive &&
						            <div ref={dropdown} className="dropdown-menu dropdown-menu-right shadow animated--grow-in show"
						                aria-labelledby="userDropdown">
						                <Link href="#">
							                <a className="dropdown-item" data-toggle="modal" data-target="#logoutModal" onClick={logout}>
							                    <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400"></i>
							                    Logout
							                </a>
							            </Link>
						            </div>
					        	}
					        </>
				        </Link>
			        </li>
			    </ul>
			</nav>
		</>
	);
};