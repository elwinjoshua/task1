import { useState } from "react";
import { useNavigate } from "react-router";


const apiUrl = import.meta.env.VITE_APP_API_URL;


function SignUp() {
    const navigate = useNavigate()
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");

    const [message, setMessage] = useState("");
    const [passwordCheck, setpasswordCheck] = useState("");


    const handleSubmit = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (password.length < 1 || password.length > 20) {
            setpasswordCheck("Password should be between 1-20")
        }
        
        if (!email.match(emailPattern)){
            setMessage("Invalid email address");
        }
        
        if (!username || !password || !name || !email || !number) {
            setMessage("Please fill all the fields")
        } else {
        fetch(`${apiUrl}/signup`, {
            method: "POST",
            body: JSON.stringify({
                username,
                password,
                name,
                email,
                number
            }),
            headers: {
                "Content-type": "application/json"
            }
        }).then((res) => {
            return res.json()
        }).then((data) => {
            console.log(data);
            localStorage.setItem("token", data.token);
            navigate(`/content/${username}`);
            window.location = `/content/${username}`;
        }).catch((err) =>{
             setMessage("Enter valid details");
             console.log(err)
            });
    }
};

    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <form className="w-40 p-3 bg-light">
                    <p>SignUp</p>
                    <div className="col my-2">
                        <input type="text" className="form-control" placeholder="Username" aria-label="First name" onChange={(e) => setUsername(e.target.value)}/>
                    </div>
                    <div className="col my-2">
                        <input type="text" className="form-control" placeholder="Password" aria-label="Last name" onChange={(e) => setPassword(e.target.value)}/>
                        <p style={{ color: "red" }}>{passwordCheck}</p>
                    </div>
                    <div className="col my-2">
                        <input type="text" className="form-control" placeholder="Name" aria-label="First name" onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="col my-2">
                        <input type="text" className="form-control" placeholder="Email" aria-label="Last name" onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="col my-2">
                        <input type="number" className="form-control" placeholder="Number" aria-label="Last name" min="10" max="10" onChange={(e) => setNumber(e.target.value)}/>
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-primary mt-3" onClick={handleSubmit}>Submit</button>
                    </div>
                    <p>{message}</p>
                </form>`
            </div>
        </>
    )
}

export default SignUp;