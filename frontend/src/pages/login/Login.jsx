import React, { useEffect } from 'react'
import { Button} from '@material-ui/core'
import "./login.css"
import { Link } from 'react-router-dom'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
const Login=()=>{
    const [role, setrole] = useState('Admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    useEffect(()=>{
        if (localStorage.getItem('access_token')) {
            console.log("Token FOund")
            navigate('/dashboard');
        }
    },[])
    function handleChange(event){
        setrole(event.target.value);
      }
    async function handleSubmit(event){
        const data = {
            username: username,
            password: password,
            role: role
        }
        if(username === '' || password === ''){
            alert('Please fill all the fields')
            return
        }
        console.log(data)
        const response = await fetch('http://localhost:4000/auth/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if(response.status === 201){
            const response = await fetch('http://localhost:4000/staff/user/'+username,{
                method: 'GET',
        })  
            const result1 = await response.json()
            console.log(result1)
            localStorage.setItem('access_token', result.access_token)
            localStorage.setItem('role', role)
            localStorage.setItem('username', username)
            localStorage.setItem('id', result1.id)
            navigate('/dashboard')
            alert('User Logged In Successfully')
        }
        else{
            alert(result.error)
        }
    }
    return(
         <div className="box">
            <h2>Login</h2>
            <form action="">
                <div className="inputBox">
                    <input type="text" name="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="inputBox">
                    <input type="password" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
                    <label htmlFor="password">Password</label>
                </div>
        <FormControl required sx={{ m: 1, minWidth: 120 }} >
        <InputLabel id="demo-simple-select-required-label">Role</InputLabel>
        <Select
          labelId="demo-simple-select-required-label"
          id="demo-simple-select-required"
          value={role}
          label="Age *"
          onChange={handleChange}
        >
          <MenuItem value={"Admin"} >Admin</MenuItem>
          <MenuItem value={"QA"}>QA</MenuItem>
          <MenuItem value={"Developer"}>Developer</MenuItem>
        </Select>
      </FormControl>
      <br/>
                <div className="flex justify-center">
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Log In
                </Button>
                </div>
            </form>
            <div className='flex justify-center mt-7 -mb-6 text-white hover:text-blue-500 font-thin text-xs'>
                <Link to="/register"> New User? Register Now</Link>
            </div>
         </div>
    )
}

export default Login