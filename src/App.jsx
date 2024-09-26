import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'

const App = () => {

  const [data, setdata] = useState({
    username: "",
    email: ""
  });
  const [resData, setResData] = useState([]);
  const [gId, setgId] = useState('');
  const [toggle, settoggle] = useState(false);

  const handleChange = (e) => {
    try {
      const { name, value } = e.target
      setdata({
        ...data,
        [name]: value
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  const sendData = async e => {
    e.preventDefault()
    try {
      const res = await axios.post(`${import.meta.env.VITE_KEY}api/createData`, data)
      if (res.data.error) {
        return toast.error(res.data.error)
      }
      fetchData()
      setdata({
        username: "",
        email: ""
      })
    } catch (error) {
      toast.error(error.message)
    }
  }

  const fetchData = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_KEY}api/getdata`)
      console.log(res.data);
      setResData(res.data)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_KEY}api/deleteUser/${id}`)
      fetchData()
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  
  const handleSendUpdateData = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`${import.meta.env.VITE_KEY}api/updateUser/${gId}`, data)
      fetchData()
      settoggle(false)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }

  const handleUpdate = (info) => {
    setdata({
      username: info?.username,
      email: info?.email
    })
    setgId(info?.id)
    settoggle(true)
  }

  useEffect(() => {
    fetchData()
    
  }, []);

  return (
    <>
    <Toaster />
    <div className='flex flex-col gap-5 w-full justify-center bg-blue-400 h-[100vh] items-center' >
      <form onSubmit={e => !toggle ? sendData(e) : handleSendUpdateData(e) } >
        <div className='flex flex-col gap-5'>
          <div className='flex justify-between' >
            <label>Username :</label>
            <input type="text" value={data.username} onChange={e => handleChange(e)} name='username' required />
          </div>
          <div className='flex justify-between'>
            <label>Email :</label>
            <input type="text" value={data.email} onChange={e => handleChange(e)} name='email' required />
          </div>
          <button type='submit' className='bg-yellow-500 rounded-lg' >{ !toggle ? "Sub" : "Update"}</button>
        </div>
      </form>
      {
        resData.length > 0 && (
          <div className={`bg-white rounded-lg p-5 `} >
            { 
              resData?.map((info) => (
                <div key={info?.id} className={`flex gap-4 justify-center items-center ${resData.length > 1 ? 'border-b-2 border-black p-4' : ''}`} >
                  <div>
                    <p><span className=' underline'>Name:</span> {info?.username}</p>
                    <p><span className=' underline' >email:</span> {info?.email}</p>
                  </div>
                  <div className='flex flex-col gap-2' >
                    <button className='bg-yellow-500 rounded-lg text-white p-1 ' onClick={() => handleUpdate(info)} >update</button>
                    <button className='bg-yellow-500 rounded-lg text-white p-1 ' onClick={() => handleDelete(info?.id)} >delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
    </>
  )
}

export default App
