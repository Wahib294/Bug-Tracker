import React, { useEffect } from 'react'
import { Button} from '@material-ui/core'
import { Link } from 'react-router-dom'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
function Staffedit(){
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const queryParameters = new URLSearchParams(window.location.search)
    const staffid = queryParameters.get("id")
    const handleChange1 = (event) => {
        setRole(event.target.value);
    };
    useEffect(()=>{
        const bug = async()=>{
            const myHeaders = new Headers();
            const token = localStorage.getItem('access_token');
            myHeaders.append('Authorization', `Bearer ${token}`);
            const response = await fetch('http://localhost:4000/staff/'+staffid,{
                method: 'GET',
                headers:myHeaders
        })
        const result = await response.json()
        console.log("respo")
        console.log(result)
        if(response.status === 200){
        setUsername(result.username)
        setEmail(result.email)
        setRole(result.role.name)
        }}
        bug()
            },[])

    
    return(
         <div className="box">
            <h2>Staff Edit</h2>
            <form action="">
                <div className="inputBox">
                    <input type="text" name="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} required />
                    <label htmlFor="Title">Username</label>
                </div>
                <div className="inputBox">
                    <input type="text" name="description" value={email} onChange={(e)=>{setEmail(e.target.value)}} required />
                    <label htmlFor="Description">Email</label>
                </div>
        <FormControl required sx={{ m: 1, minWidth: 120 }} >
        <InputLabel id="demo-simple-select-required-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={role}
          label="Role"
            onChange={handleChange1}
        >
          <MenuItem value={"Admin"} >Admin</MenuItem>
          <MenuItem value={"QA"}>QA</MenuItem>
          <MenuItem value={"Developer"}>Developer</MenuItem>
        </Select>
      </FormControl>
      <br/>
                <div className="flex justify-center">
                <Button variant="contained" color="primary" onClick={async()=>{
                    const data = {
            username: username,
            email: email,
            role: role,
        }
        console.log("THe DAta");
        console.log(data)
        const myHeaders = new Headers();
        const token = localStorage.getItem('access_token');
        myHeaders.append('Authorization', `Bearer ${token}`);
        myHeaders.append('Content-Type', 'application/json');
        const response = await fetch('http://localhost:4000/staff/'+staffid,{
            method: 'PATCH',
            headers:myHeaders,
            body: JSON.stringify(data)
        })
            if(response.status === 200){
                alert('Staff Updated Successfully')
                navigate('/staff')
            }
            else{
                const result = await response.json()
                alert(result.error)
            }
        }
                    
                }>
                    Submit
                </Button>
                </div>
            </form>
            <div className='flex justify-center mt-7 -mb-6 text-white hover:text-blue-500 font-thin text-xs'>
                <Link to="/dashboard"> Cancel</Link>
            </div>
         </div>
    )
}

export default Staffedit;