import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { backendUrl } = useContext(AppContext)
  const { token } = useParams()
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return toast.error("Passwords don't match!")
    }

    setLoading(true)
    try {
      const { data } = await axios.post(backendUrl + `/api/user/reset-password/${token}`, { password })
      if (data.success) {
        toast.success(data.message)
        navigate('/login')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>Reset Password</p>
        <p>Enter your new password below</p>
        <div className='w-full'>
          <p>New Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <div className='w-full'>
          <p>Confirm Password</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            required
          />
        </div>
        <button
          type='submit'
          disabled={loading}
          className='bg-primary text-white w-full py-2 rounded-md text-base'
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </div>
    </form>
  )
}

export default ResetPassword