import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

function Content() {

    const [details, setDetails] = useState(null)
    const {username} = useParams();
    const [loading, setLoading] = useState(true)
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("")
    const navigate = useNavigate();

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
            setDetails(data.userDetails)
            console.log(details)
        }).catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
    }, [username, setNewPassword])

    const handlePasswordUpdate = () => {
        fetch(`${apiUrl}/content/${username}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({newPassword: newPassword}),
        }).then((res) => res.json())
          .then((data) => {
            console.log(data.message);
            setNewPassword("")
            setMessage("Password updated")
            setDetails({...details, password: newPassword})
          })
          .catch((err) => {
            console.error(err);
            setMessage("Error updating password")
          })
    }

    if (loading) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100 ">
                <div className="container bg-light" style={{width: '60%'}}>
                    <div className="row" style={{ height: '70px' }}>
                        <div className="col p-3">
                            <h5>Content Info</h5>
                        </div>
                        <div className="col p-3">
                            <p>Update password</p>
                            <div className="d-flex">
                                <input type="password" className="form-control" placeholder={details.password} aria-label="First name" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} style={{width: 150, margin: 4}}></input>
                                <button className="btn btn-primary" style={{height: 40}} onClick={handlePasswordUpdate}>Update</button>
                            </div>
                            {message && <p>{message}</p>}
                        </div>
                    </div>
                    <div className="row" style={{ height: '300px' }}>
                        <div className="col" style={{marginTop: 40}}>
                            <p>Username: {details.username}</p> 
                            <p>Password: {details.password}</p>
                            <p>Name: {details.name}</p>
                            <p>Email: {details.email}</p>
                            <p>Number: {details.number}</p>
                        </div>
                        <div className="col" style={{marginTop: 60}}>
                            <button className="btn btn-primary" style={{height: 40}} onClick={() => navigate(`/about/${details.username}`)}>Update Details</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Content;