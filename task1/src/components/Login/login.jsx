import { useNavigate } from "react-router-dom";
import { useState } from "react";

const apiUrl = import.meta.env.VITE_APP_API_URL;

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${apiUrl}/login`, {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then((res) => {
            if (res.ok) {
                return res.json();
            } else {
                throw new Error('Failed to log in');
            }
        }).then((data) => {
            console.log(data);
            localStorage.setItem("token", data.token);
            navigate(`/content/${username}`)
            window.location = `/content/${username}`
        }).catch((err) => setMessage("Invalid username or password"));

    }

    return(
        <>  
            <div className="d-flex justify-content-center align-items-center min-vh-100 mw-100">
                <form className="w-50 p-3 bg-light"> 
                    <p>LogIn</p>
                    <div className="mb-3">
                        <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                        <input type="password" className="form-control" id="exampleInputPassword1" value={password} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="d-flex justify-content-between">
                        <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        <span onClick={() => navigate('/signup')} className="cursor-pointer">SignUp here</span>
                    </div>
                    <p>{message}</p>
                </form>
            </div>

        </>
    )
} 

export default Login;