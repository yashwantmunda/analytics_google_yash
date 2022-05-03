import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from 'react';

export default function Sidebar(){
    const [isActive, setIsActive] = useState(false);
    const router = useRouter();

    return(
        <>
            <ul className="navbar-nav bg-gradient-primary sidebar sidebar-dark accordion" id="accordionSidebar">
                <Link className="sidebar-brand d-flex align-items-center justify-content-center" href="/">
                    <a>
                        <div className="sidebar-brand-text mt-3 mb-2 mx-auto">
                            <Image src="/images/sidebar_logo.png" width={200} height={30} alt="home"/>
                        </div>
                    </a>
                </Link>
                
                {/*<hr className="sidebar-divider my-0" />
                    
                <li className={router.pathname == "/" ? "nav-item active" : "nav-item"}>
                    <Link href="/">
                        <a className="nav-link">
                            <i className="fas fa-fw fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                    </Link>
                </li>
            
                <hr className="mx-3"/>*/}

                <div className="sidebar-heading mt-2">
                    Menu
                </div>
                
                <li className="nav-item">
                    <Link href="/addclient" className="nav-item">
                        <a className="nav-link text-white">
                            <i className="fas fa-fw fa-building"></i>
                            <span>Add new client</span>
                        </a>
                    </Link>
                </li>
            </ul>
        </>
    );
};