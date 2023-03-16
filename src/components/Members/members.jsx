import React, { useEffect, useState } from 'react';
import "./members.css"
import { getDataFromFirestore } from "../../Firebase";
import { Link } from 'react-router-dom';

const Members = () => {
const [members, setMembers] = useState([]);

useEffect(() => {
    const fetchData = async () => {
        const data = await getDataFromFirestore();
        setMembers(data);
    };
    fetchData();
}, []);
    
    return (
        <div className="members container">
            <Link to="/">
                        <button type="submit" className="btn btn-success mb-4" style={{width:"100%"}}>Go to Main Page</button>
                </Link>
            <div className='members-list'>
                <div className="row">
                    <div className="col list-title">
                        <h1>Members</h1>
                    </div>
                </div>
                {members.map((member) => (
                    <div key={member.id} className="member-card row">
                        <div className="col">
                            <img className='card-image' src={member.photo ? member.photo : 'https://cdn-icons-png.flaticon.com/512/3364/3364044.png'} alt={member.lastName} />
                        </div>
                        <div className="col">
                            <h5>{member.firstName} {member.lastName}</h5>
                        </div>
                        <div className="col">
                            <p>{member.subject}</p>
                        </div>
                        <div className="col">
                            <a href={`mailto:${member.email}`}>{member.email}</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Members;
