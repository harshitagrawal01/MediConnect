import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AgoraRTC from 'agora-rtc-sdk-ng'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const VideoCall = () => {
  const { appointmentId } = useParams()
  const navigate = useNavigate()
  const { profileData, backendUrl, dToken } = useContext(DoctorContext)

  const [agoraToken, setAgoraToken] = useState(null)
  const [remoteUser, setRemoteUser] = useState(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isJoined, setIsJoined] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const clientRef = useRef(null)
  const localTracksRef = useRef({ audioTrack: null, videoTrack: null })
  const timerRef = useRef(null)

  const joinCall = async () => {
    try {
      const appId = import.meta.env.VITE_AGORA_APP_ID
      const channelName = appointmentId
      const uid = 1

      const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      clientRef.current = client

      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'video') {
          setRemoteUser(user)
          user.videoTrack.play('remote-video')
        }
        if (mediaType === 'audio') {
          user.audioTrack.play()
        }
      })

      client.on('user-unpublished', () => {
        setRemoteUser(null)
      })

      await client.join(appId, channelName, agoraToken, uid)

      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      localTracksRef.current = { audioTrack, videoTrack }

      await client.publish([audioTrack, videoTrack])
      videoTrack.play('local-video')
      setIsJoined(true)

      // Start call timer
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)

    } catch (error) {
      console.log(error)
      toast.error('Failed to join call. Please try again.')
    }
  }

  const toggleMute = async () => {
    const audioTrack = localTracksRef.current.audioTrack
    if (audioTrack) {
      await audioTrack.setEnabled(isMuted)
      setIsMuted(!isMuted)
    }
  }

  const toggleCamera = async () => {
    const videoTrack = localTracksRef.current.videoTrack
    if (videoTrack) {
      await videoTrack.setEnabled(isCameraOff)
      setIsCameraOff(!isCameraOff)
    }
  }

  const leaveCall = async () => {
    const { audioTrack, videoTrack } = localTracksRef.current
    if (audioTrack) audioTrack.close()
    if (videoTrack) videoTrack.close()
    if (clientRef.current) await clientRef.current.leave()
    if (timerRef.current) clearInterval(timerRef.current)
    setIsJoined(false)
    navigate('/doctor-appointments')
  }

  const formatDuration = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const { data } = await axios.post(
          backendUrl + '/api/video/get-token',
          { appointmentId, uid: 1 },
          { headers: { dToken } }
        )
        if (data.success) setAgoraToken(data.token)
        else toast.error(data.message)
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
    if (profileData) fetchToken()
  }, [profileData])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1f3c 50%, #0a1628 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Background grid effect */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(20,184,166,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none'
      }} />

      {/* Glowing orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '5%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: '250px', height: '250px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      {!isJoined ? (
        /* ── WAITING ROOM ── */
        <div style={{ textAlign: 'center', zIndex: 1, maxWidth: '420px', width: '100%' }}>

          {/* Logo / Icon */}
          <div style={{
            width: '90px', height: '90px',
            background: 'linear-gradient(135deg, #14b8a6, #0ea5e9)',
            borderRadius: '28px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            boxShadow: '0 0 40px rgba(20,184,166,0.4)',
            animation: 'pulse 2s infinite'
          }}>
            <svg width="44" height="44" fill="none" stroke="white" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>

          <h1 style={{ color: '#f1f5f9', fontSize: '28px', fontWeight: '700', marginBottom: '8px', letterSpacing: '-0.5px' }}>
            MediConnect
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '36px', lineHeight: '1.6' }}>
            Your doctor is ready. Join the consultation when you're set.
          </p>

          {/* Info card */}
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '20px 24px',
            marginBottom: '28px',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Secure encrypted connection</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: '#14b8a6', borderRadius: '50%' }} />
              <span style={{ color: '#94a3b8', fontSize: '13px' }}>Session ID: #{appointmentId?.slice(-8).toUpperCase()}</span>
            </div>
          </div>

          <button
            onClick={joinCall}
            disabled={!agoraToken}
            style={{
              width: '100%',
              padding: '16px',
              background: agoraToken
                ? 'linear-gradient(135deg, #14b8a6, #0ea5e9)'
                : 'rgba(255,255,255,0.06)',
              border: 'none',
              borderRadius: '14px',
              color: agoraToken ? 'white' : '#475569',
              fontSize: '16px',
              fontWeight: '600',
              cursor: agoraToken ? 'pointer' : 'not-allowed',
              letterSpacing: '0.3px',
              boxShadow: agoraToken ? '0 8px 30px rgba(20,184,166,0.3)' : 'none',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {agoraToken ? (
              <>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                Join Consultation
              </>
            ) : (
              <>
                <div style={{
                  width: '16px', height: '16px',
                  border: '2px solid #475569',
                  borderTopColor: '#94a3b8',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Preparing session...
              </>
            )}
          </button>

          <style>{`
            @keyframes pulse { 0%,100%{box-shadow:0 0 40px rgba(20,184,166,0.4)} 50%{box-shadow:0 0 60px rgba(20,184,166,0.7)} }
            @keyframes spin { to{transform:rotate(360deg)} }
          `}</style>
        </div>

      ) : (
        /* ── ACTIVE CALL ── */
        <div style={{ width: '100%', maxWidth: '1000px', zIndex: 1 }}>

          {/* Top bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '16px', padding: '0 4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 8px #22c55e' }} />
              <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '500' }}>Live Consultation</span>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '6px 14px',
              color: '#e2e8f0',
              fontSize: '14px',
              fontWeight: '600',
              fontVariantNumeric: 'tabular-nums'
            }}>
              {formatDuration(callDuration)}
            </div>
          </div>

          {/* Video area */}
          <div style={{
            position: 'relative',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '24px',
            overflow: 'hidden',
            height: '65vh',
            marginBottom: '20px'
          }}>

            {/* Remote video */}
            {remoteUser ? (
              <div id='remote-video' style={{ width: '100%', height: '100%' }} />
            ) : (
              <div style={{
                width: '100%', height: '100%',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '16px'
              }}>
                <div style={{
                  width: '80px', height: '80px',
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="36" height="36" fill="none" stroke="#64748b" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <p style={{ color: '#475569', fontSize: '15px' }}>Waiting for doctor to join...</p>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: '8px', height: '8px',
                      background: '#14b8a6', borderRadius: '50%',
                      animation: `bounce 1.2s ${i * 0.2}s infinite`
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Local video (corner) */}
            <div style={{
              position: 'absolute', bottom: '16px', right: '16px',
              width: '160px', height: '120px',
              background: '#0f172a',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid rgba(20,184,166,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}>
              <div id='local-video' style={{ width: '100%', height: '100%' }} />
              {isCameraOff && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: '#0f172a',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <svg width="28" height="28" fill="none" stroke="#475569" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div style={{
                position: 'absolute', bottom: '6px', left: '8px',
                color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: '500'
              }}>You</div>
            </div>

          </div>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>

            {/* Mute */}
            <button onClick={toggleMute} style={{
              width: '56px', height: '56px', borderRadius: '50%', border: 'none',
              background: isMuted ? '#ef4444' : 'rgba(255,255,255,0.08)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: isMuted ? '0 4px 20px rgba(239,68,68,0.4)' : '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              {isMuted ? (
                <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>

            {/* End call */}
            <button onClick={leaveCall} style={{
              width: '68px', height: '68px', borderRadius: '50%', border: 'none',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(239,68,68,0.5)',
              transition: 'all 0.2s ease',
              transform: 'scale(1.05)'
            }}>
              <svg width="26" height="26" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
              </svg>
            </button>

            {/* Camera */}
            <button onClick={toggleCamera} style={{
              width: '56px', height: '56px', borderRadius: '50%', border: 'none',
              background: isCameraOff ? '#ef4444' : 'rgba(255,255,255,0.08)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
              boxShadow: isCameraOff ? '0 4px 20px rgba(239,68,68,0.4)' : '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                {isCameraOff && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />}
              </svg>
            </button>

          </div>

          <style>{`
            @keyframes bounce {
              0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)}
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

export default VideoCall


