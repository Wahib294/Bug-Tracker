import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { pink } from '@mui/material/colors';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Modal, Typography } from '@mui/material';
import { useState } from 'react';

export default function Staff(){
    let navigate = useNavigate();
    let token = localStorage.getItem('access_token');
    const [data, setData] = useState([]);
    const [data1, setData1] = useState([]);
    const [open, setOpen] = useState(false);
    const [bugs, setBugs] = useState([]);
    const [username, setUsername] = useState(null);
    const [email,setEmail] = useState(null);
    const [role,setRole] = useState(null);
    const [selected, setSelected] = useState(null);
    const [modalId, setModalId] = useState(null);
    const handlemodal = (event) => {
        const fetchBugReports = async () => {
            try {
                const myHeaders = new Headers();
                myHeaders.append('Authorization', `Bearer ${token}`);
                setModalId(event.target.id);
                const response = await fetch('http://localhost:4000/bugreport/'+modalId,    {
                    method: 'GET',
                    headers: myHeaders,
                });

                if (response.ok) {
                    const result = await response.json();
                    setBugs(result);
                } else {
                    if(response.status === 401){
                        alert('Session Expired. Please login to continue');
                        localStorage.removeItem('access_token');
                        navigate('/')

                    }
                    alert('Failed to fetch bug reports');
                }
            } catch (error) {
                console.error('Error fetching bug reports:', error);
                alert('An error occurred while fetching bug reports');
            }
        }
        fetchBugReports();
    }

    useEffect(() => {
        if (bugs.length > 0) {
            let user ;
            for (let i = 0; i < data1.length; i++) {
                if (data1[i].id == modalId) {
                    user = data1[i];
                    break;
                }
            }
            setSelected(user);
            setOpen(true);
            console.log(modalId)
            setUsername(selected);
            console.log(user)
        }
    }, [bugs]);


    const handleClose = () => setOpen(false);
    let url;
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600,
        height: 400,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        boxShadow: "0 15px 25px rgba(0, 0, 0, 0.7)",
        borderRadius: 10,
        color: 'white',
        p: 4,
        outline: 'none'
      };
    useEffect(() => {
        if (token === null) {
            navigate('/');
            alert('Please login to continue');
        } else {
            if (localStorage.getItem('role') === 'Admin') {
                url = 'http://localhost:4000/staff';
            }
            else {
                navigate('/');
                alert('Only Admin can access this page.');
            }
                const fetchBugReports = async () => {
                    try {
                        const myHeaders = new Headers();
                        myHeaders.append('Authorization', `Bearer ${token}`);

                        const response = await fetch(url,    {
                            method: 'GET',
                            headers: myHeaders,
                        });

                        if (response.ok) {
                            const result = await response.json();
                            setData(result);
                        } else {
                            if(response.status === 401){
                                alert('Session Expired. Please login to continue');
                                localStorage.removeItem('access_token');
                                navigate('/')

                            }
                            alert('Failed to fetch bug reports');
                        }
                    } catch (error) {
                        console.error('Error fetching bug reports:', error);
                        alert('An error occurred while fetching bug reports');
                    }
                };

                fetchBugReports();   
            }
        }, [token, navigate]); 

    useEffect(() => {
        if (data) {
                setData1(data);
                console.log(data1)
            }
    }, [data]);
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const groupedData = chunkArray(data1, 4);

    const handledelete = (id) => async () => {  
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        const response = await fetch(`http://localhost:4000/staff/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        });
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert('User Deleted Successfully');
            window.location.reload();
        } else {
            alert('Failed to delete User');
        }
    }

    return (
        <div className="container">
            <Button variant="contained" onClick={() => navigate('/dashboard')} className='mt-4'><h1 className='text-white '>Bugs Report</h1></Button>
            <Button variant="contained" onClick={() => {localStorage.clear(); navigate('/')}} className='absolute mt-4 left-[1280px]'><h1 className='text-red-400 font-extrabold'>Log Out</h1></Button>
            <div className=' mt-20 '>
            {groupedData.length > 0 ? (
                groupedData.map((group, index) => (
                    <div key={index} className="row">
                        {group.map((bug) => (
                            <div key={bug.id} id={bug.id} className="bugcard cursor-pointer" onClick={handlemodal}>
                                <center><h1 id={bug.id} className='font-extrabold text-lg mb-4'>{bug.role.name}</h1></center>
                                <p id={bug.id} className='text-sky-400 font-bold'>{bug.username}</p>
                                <p id={bug.id} className='text-slate-300 mt-6'>Email: {bug.email}</p>
                                <DeleteForeverIcon className='cursor-pointer mt-4' sx={{color:pink[500]}}  onClick={handledelete(bug.id)}/>
                                <EditIcon className='cursor-pointer ml-[210px] mt-4' onClick={() => navigate(`/staffedit/?id=${bug.id}`)}/>
                                </div>
                        ))}
                    </div>
                ))
                ) : (
                    <p>No Bugs Assigned</p>
            )}
            <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box>
      </Modal>
            </div>
        </div>
    );
};
