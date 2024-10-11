import React from 'react'
import { Button} from '@material-ui/core'
import { Link} from 'react-router-dom'
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useState } from 'react';
import "./register.css"
import { useNavigate } from "react-router-dom";

const Register=()=>{
    const [role, setrole] = useState('Admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const navigate = useNavigate();

    function handleChange(event){
        setrole(event.target.value);
      }
    async function handleSubmit(event){
        console.log("ASD")
        const data = {
            username: username,
            email: mail,
            password: password,
            role: role
        }
        if(username === '' || password === ''){
            alert('Please fill all the fields')
            return
        }
        var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!re.test(mail)){
            alert('Please enter a valid email')
            return
        }
        console.log(data)
        const response = await fetch('http://localhost:4000/staff',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        console.log(response)
        if(response.status === 201){
            alert('User Registered Successfully')
            navigate('/')
        }
        else{
            alert('User Registration Failed')
        }
    }
    return(
         <div className="box">
            <h2>Register</h2>
            <form action="">
                <div className="inputBox">
                    <input type="text" name="username" value={username} onChange={(e)=>{setUsername(e.target.value)}} required />
                    <label htmlFor="username">Username</label>
                </div>
                <div className="inputBox">
                    <input type="email" name="email" value={mail} onChange={(e)=>{setMail(e.target.value)}} required />
                    <label htmlFor="email">Email</label>
                </div>
                <div className="inputBox">
                    <input type="password" name="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
                    <label htmlFor="password">Password</label>
                </div>
                </form>
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
                    Register
                </Button>
                </div>
            <div className='flex justify-center mt-7 -mb-6 text-white hover:text-blue-500 font-thin text-xs'>
                <Link to="/"> Already a User? Log In</Link>
            </div>
         </div>
    )
}

export default Register