import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { pink } from '@mui/material/colors';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export const Dashboard = () => {
    let navigate = useNavigate();
    let token = localStorage.getItem('access_token');
    const [data, setData] = React.useState([]);
    const [data1, setData1] = React.useState([]);
    let url
    useEffect(() => {
        if (token === null) {
            navigate('/');
            alert('Please login to continue');
        } else {
            if (localStorage.getItem('role') === 'Admin') {
                url = 'http://localhost:4000/bugreport';
            }
            else {
                url = 'http://localhost:4000/bugreport/'+localStorage.getItem('id');
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
            if (localStorage.getItem('role') === 'Developer') {
                let filteredData = data.filter(bug => bug.assignee.id === parseInt(localStorage.getItem('id')));
                setData1(filteredData);
                console.log(data1)
            }
            else if (localStorage.getItem('role') === 'QA') {
                let filteredData = data.filter(bug => bug.reporter.id === parseInt(localStorage.getItem('id')));
                setData1(filteredData);
                console.log(data1)
            }
            else{
                setData1(data);
                console.log(data1)
            }
        }
    }, [data]);
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    // Chunk the data into groups of 4
    const groupedData = chunkArray(data1, 4);

    const handledelete = (id) => async () => {  
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${token}`);
        const response = await fetch(`http://localhost:4000/bugreport/${id}`, {
            method: 'DELETE',
            headers: myHeaders,
        });
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            alert('Bug Deleted Successfully');
            window.location.reload();
        } else {
            alert('Failed to delete bug');
        }
    }

    return (
        <div className="container">
            <Button variant="contained" onClick={() => navigate('/staff')} className='mt-4'><h1 className='text-white '>Staff List</h1></Button>
            <Button variant="contained" onClick={() => navigate('/addbug')} className='absolute left-[605px]'><h1 className='text-white '>Add Bug</h1></Button>
            <Button variant="contained" onClick={() => {localStorage.clear(); navigate('/')}} className='absolute mt-4 left-[1280px]'><h1 className='text-red-400 font-extrabold'>Log Out</h1></Button>
            <div className='mt-20'>
            {groupedData.length > 0 ? (
                groupedData.map((group, index) => (
                    <div key={index} className="row">
                        {group.map((bug) => (
                            <div key={bug.id} className="bugcard">
                                <center><h1 className='font-extrabold text-lg mb-4'>{bug.title}</h1></center>
                                <p className='text-sky-400 font-bold'>{bug.description}</p>
                                <p className='text-slate-300 mt-6'>Reporter: {bug.reporter.username}</p>
                                <p className='text-slate-300 mt-2'>Assigned To: {bug.assignee.username}</p>
                                <p className='mt-5'>{bug.status ? <p className='text-green-400'>Open</p> : <p className='text-red-500'>Closed</p>}</p>
                                <DeleteForeverIcon className='cursor-pointer mt-4' sx={{color:pink[500]}}  onClick={handledelete(bug.id)}/>
                                <EditIcon className='cursor-pointer ml-[210px] mt-4' onClick={() => navigate(`/bugedit/?id=${bug.id}`)}/>
                                </div>
                        ))}
                    </div>
                ))
                ) : (
                    <p className='font-extrabold text-white text-4xl'>No Bugs Assigned</p>
                    )}
            </div>
        </div>
    );
};
