import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function Header() {
    const navigate = useNavigate();
    const  [userName, setUserName] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false)
        navigate('/login');
    }

    useEffect(() => {
        console.log("useEff")
        console.log("token - " + localStorage.getItem("token"));
        fetch(`${apiUrl}/me`,{
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.username) {
                setUserName(data.username)
                console.log(data.userName)
            }
        })
    }, [isLoggedIn])

    console.log("log", isLoggedIn)

    return (
        <nav className="navbar bg-primary" data-bs-theme="dark">
            <div className="container-fluid">
                {isLoggedIn ? (
                    <a className="navbar-brand">{`Welcome, ${userName}`}</a>
                ) : (
                    <a className="navbar-brand">Login/SignUp</a>
                )}
                <button type="button" className="btn btn-light" onClick={isLoggedIn ? handleLogout : () => navigate("login")}>
                    {isLoggedIn ? "Log out" : "LogIn"}
                </button>
            </div>
        </nav>
    );
    
}

export default Header;