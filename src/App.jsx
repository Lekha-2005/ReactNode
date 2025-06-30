import { useState,useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const[users,setUsers]=useState([]);
  const[filter,setFilters]=useState([]);
  const[modelOpen,setModelOpen]=useState(false);
  const[userD,setUserD]=useState({name:"",age:"",city:""});

  useEffect(()=>{
    getAll();
  },[]);


  const getAll = async()=>{
    await axios.get("https://reactnodebackend-o0x5.onrender.com/users")
    .then((res) => {
      setFilters(res.data);
      setUsers(res.data);
    });
  };

  
  const handleSearch=(e)=>
  {
    const searchText=e.target.value.toLowerCase();
    const filterUsers=users.filter((user)=>user.name.toLowerCase().includes(searchText) ||
    user.city.toLowerCase().includes(searchText));
    setFilters(filterUsers);
  };

  const handleDelete = async(id)=>
    {
      const isConfirm=window.confirm("Are you sure you want to delete?");
      if(isConfirm){
      await axios.delete(`https://reactnodebackend-o0x5.onrender.com/users/${id}`).then((res)=>{
        setFilters(res.data);
        setUsers(res.data);
      })
    }
    };

    const handleAdd =()=>
    {
      setUserD({name:"",age:"",city:""});
      setModelOpen(true);
    };

    const handleUser=(e)=>{
      setUserD({...userD,[e.target.name]:e.target.value}); //take the name attribute and parse the values in that field
    }

    const handleSubmit= async(e)=>{
      e.preventDefault();
      if(userD.id){
        await axios.patch(`https://reactnodebackend-o0x5.onrender.com/users/${userD.id}`,userD).then((res)=>{
          console.log(res);
        });
      }else{
      await axios.post("https://reactnodebackend-o0x5.onrender.com/users",userD).then((res)=>{
        console.log(res);
      });
    }
    
    closeModel();
    setUserD({name:"",age:"",city:""});
    };

    const closeModel=()=>
    {
      setModelOpen(false);
      getAll();
    }

    const UpdateRecord=(user)=>
    {
      setUserD(user);
      setModelOpen(true);
    }

  return (
    <>
      <div className="container">
        <h3>CRUD APPLICATION</h3>
        <div className='input-search'>
          <input type="search" placeholder="search users" onChange={handleSearch}/>
          <button className='btn green' onClick={handleAdd}>Add Record</button>
        </div>
        <table className='table'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Age</th>
              <th>City</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
          {filter && 
          filter.map((user,index) => {
              return(
              <tr key={user.id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.city}</td>
              <td><button className='btn green' onClick={()=>UpdateRecord(user)}>Edit</button></td>
              <td><button className='btn red' onClick={()=>handleDelete(user.id)}>Delete</button></td>
              </tr>
              );
            })
          }
          </tbody>
        </table>
        {modelOpen && (
          <div className="model">
            <div className="model-content">
              <span className="close" onClick={closeModel}>&times;</span>
              <h2>{userD.id ? "Update Record " : "Add Record"}</h2>
              <div className="input-grp">
                <label htmlFor="name">Full Name</label>
                <input type="text" value={userD.name} onChange={handleUser} name="name" id="name"/>
              </div>
              <div className="input-grp">
                <label htmlFor="age">Age</label>
                <input type="number" name="age" value={userD.age} onChange={handleUser} id="age"/>
              </div>
              <div className="input-grp">
                <label htmlFor="city">City</label>
                <input type="text" name="city"  value={userD.city} onChange={handleUser} id="city"/>
              </div>
              <button className=" btn green" onClick={handleSubmit}>Add User</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
