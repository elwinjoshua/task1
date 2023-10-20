import { useEffect, useState } from "react";
import { useParams } from "react-router";


function About() {
    const {username} = useParams();
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState(null);

    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");

    const [message, setMessage] = useState("")


    const apiUrl = import.meta.env.VITE_APP_API_URL;

    useEffect(() => {
        if(username){
            setLoading(true);
        fetch(`${apiUrl}/content/${username}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        })
        .then((res) => res.json())
        .then((data) => {
            setDetails(data.userDetails);
            setPassword(data.userDetails.password);
            setName(data.userDetails.name);
            setEmail(data.userDetails.email);
            setNumber(data.userDetails.number);
            console.log(details)
        }).catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
    }, [username])

    const handleUpdate = () => {
        const requestBody = {
            password,
            name,
            email,
            number,
        };
        console.log('Request Body:', requestBody);
        fetch(`${apiUrl}/about/${username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(requestBody)
        })
        .then((res) => res.json())
        .then((data) => {
            setMessage("Updated Successfully")
            console.log(data)
        })
        .catch((err) => {
            console.error(err)
        })
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100">
                <form className="w-40 p-3 bg-light">
                    <p>Update Details</p>
                    <div className="d-flex col my-2">
                        <p className="p-2">Username:</p>
                        <input type="text" className="form-control" placeholder={details.username} aria-label="First name" style={{height: 40}} disabled/>
                    </div>
                    <div className="d-flex col my-2">
                        <p className="p-2">Password:</p>
                        <input type="text" className="form-control" placeholder={details.password} value={password} aria-label="Last name" style={{height: 40}} onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                    <div className="d-flex col my-2">
                        <p className="p-2">Name:</p>
                        <input type="text" className="form-control" placeholder={details.name} value={name} aria-label="First name" style={{height: 40}} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="d-flex col my-2">
                        <p className="p-2">Email:</p>
                        <input type="text" className="form-control" placeholder={details.email} value={email} aria-label="Last name" style={{height: 40}} onChange={(e) => setEmail(e.target.value)}/>
                    </div>
                    <div className="d-flex col my-2">
                        <p className="p-2">Number:</p>
                        <input type="number" className="form-control" placeholder={details.number} value={number} aria-label="Last name" style={{height: 40}}  min="10" max="10" onChange={(e) => setNumber(e.target.value)}/>
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-primary mt-3" onClick={handleUpdate} >Update</button>
                        {message && <p>{message}</p>}
                    </div>
                </form>`
            </div>
        </>
    )
}

export default About;