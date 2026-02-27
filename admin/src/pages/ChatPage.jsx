import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    width: "100%",
    height: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    background: "#f5f8f8",
    overflow: "hidden",
  },
  inner: {
    flex: 1, display: "flex", flexDirection: "column",
    padding: "24px 28px", height: "100%", overflow: "hidden", minHeight: 0,
  },
  card: {
    flex: 1, display: "flex", flexDirection: "column",
    background: "#ffffff", borderRadius: "20px",
    boxShadow: "0 4px 32px rgba(13,110,110,0.10)",
    overflow: "hidden", border: "1px solid #d4e8e8", minHeight: 0,
  },
  topbar: {
    display: "flex", alignItems: "center", gap: "14px",
    padding: "16px 22px", borderBottom: "1px solid #eaf3f3",
    background: "#ffffff", flexShrink: 0,
  },
  avatar: {
    width: "42px", height: "42px", borderRadius: "50%",
    background: "linear-gradient(135deg, #e6f4f4, #b2d8d8)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: "700", fontSize: "0.85rem", color: "#0d6e6e",
    border: "2px solid #d4e8e8", flexShrink: 0,
  },
  topbarName: { fontSize: "0.92rem", fontWeight: "600", color: "#1a2a2a", margin: 0 },
  onlineRow: {
    display: "flex", alignItems: "center", gap: "5px",
    fontSize: "0.73rem", color: "#2eab7a", fontWeight: "500", marginTop: "2px",
  },
  onlineDot: { width: "7px", height: "7px", background: "#2eab7a", borderRadius: "50%" },
  messagesArea: {
    flex: 1, overflowY: "auto", padding: "18px 22px",
    display: "flex", flexDirection: "column", gap: "8px",
    background: "#fafefe", minHeight: 0,
  },
  dateSep: {
    textAlign: "center", fontSize: "0.69rem", color: "#9ab8b8",
    fontWeight: "500", display: "flex", alignItems: "center", gap: "10px", margin: "4px 0",
  },
  dateLine: { flex: 1, height: "1px", background: "#eaf3f3" },
  msgRow: (isMe) => ({
    display: "flex", alignItems: "flex-end", gap: "8px",
    flexDirection: isMe ? "row-reverse" : "row",
  }),
  msgInit: (isMe) => ({
    width: "28px", height: "28px", borderRadius: "50%",
    fontSize: "0.63rem", fontWeight: "700",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, border: "1.5px solid #d4e8e8",
    background: isMe ? "#0d6e6e" : "#e6f4f4",
    color: isMe ? "white" : "#0d6e6e",
  }),
  bubbleWrap: (isMe) => ({
    display: "flex", flexDirection: "column",
    alignItems: isMe ? "flex-end" : "flex-start", maxWidth: "62%",
  }),
  bubble: (isMe) => ({
    padding: "10px 16px", borderRadius: "16px",
    borderBottomLeftRadius: isMe ? "16px" : "4px",
    borderBottomRightRadius: isMe ? "4px" : "16px",
    fontSize: "0.875rem", lineHeight: "1.6",
    background: isMe ? "#d6f0ed" : "#ffffff", color: "#1a2a2a",
    border: isMe ? "none" : "1px solid #e4f0f0",
    boxShadow: isMe ? "0 1px 6px rgba(13,110,110,0.12)" : "0 1px 4px rgba(13,110,110,0.07)",
    wordBreak: "break-word", overflowWrap: "break-word",
    whiteSpace: "pre-wrap", display: "inline-block",
  }),
  fileBubble: (isMe) => ({
    display: "inline-flex", alignItems: "center", gap: "10px",
    padding: "10px 14px", borderRadius: "16px",
    borderBottomLeftRadius: isMe ? "16px" : "4px",
    borderBottomRightRadius: isMe ? "4px" : "16px",
    background: isMe ? "#d6f0ed" : "#ffffff",
    border: isMe ? "none" : "1px solid #e4f0f0",
    boxShadow: isMe ? "0 1px 6px rgba(13,110,110,0.12)" : "0 1px 4px rgba(13,110,110,0.07)",
    textDecoration: "none", cursor: "pointer", maxWidth: "260px",
  }),
  fileIconBox: (isPdf) => ({
    width: "36px", height: "36px", borderRadius: "8px",
    background: isPdf ? "#fee2e2" : "#dbeafe",
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  }),
  fileNameText: {
    fontSize: "0.82rem", fontWeight: "600", color: "#1a2a2a",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px",
  },
  fileSubText: { fontSize: "0.7rem", color: "#9ab8b8", marginTop: "1px" },
  msgTime: (isMe) => ({
    fontSize: "0.65rem", color: "#9ab8b8",
    marginTop: "3px", padding: "0 2px",
    textAlign: isMe ? "right" : "left",
  }),
  seenTick: (seen) => ({
    color: seen ? "#0d6e6e" : "#9ab8b8",
    fontWeight: seen ? "600" : "400",
  }),
  inputBar: {
    padding: "14px 18px", borderTop: "1px solid #eaf3f3",
    display: "flex", alignItems: "center", gap: "10px",
    background: "#ffffff", flexShrink: 0,
  },
  inputPill: {
    flex: 1, display: "flex", alignItems: "center",
    background: "#f5f8f8", border: "1.5px solid #0d6e6e",
    borderRadius: "50px", padding: "8px 16px", gap: "8px",
  },
  input: {
    flex: 1, border: "none", outline: "none",
    background: "transparent", fontFamily: "inherit",
    fontSize: "0.875rem", color: "#1a2a2a",
  },
  attachBtn: {
    width: "34px", height: "34px", borderRadius: "50%",
    border: "none", background: "transparent", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#0d6e6e", flexShrink: 0, padding: 0,
  },
  sendBtn: {
    width: "42px", height: "42px", borderRadius: "50%",
    background: "#0d6e6e", border: "none", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "white", flexShrink: 0, boxShadow: "0 4px 12px rgba(13,110,110,0.28)",
  },
  uploadingBar: {
    padding: "7px 22px", background: "#f0fafa",
    borderTop: "1px solid #eaf3f3", fontSize: "0.78rem",
    color: "#0d6e6e", display: "flex", alignItems: "center", gap: "8px", flexShrink: 0,
  },
  typingRow: { display: "flex", alignItems: "flex-end", gap: "8px" },
  typingBubble: {
    background: "#ffffff", border: "1px solid #e4f0f0",
    borderRadius: "16px", borderBottomLeftRadius: "4px",
    padding: "10px 14px", display: "flex", gap: "4px",
    boxShadow: "0 1px 4px rgba(13,110,110,0.07)",
  },
};

const TypingDot = ({ delay }) => (
  <div style={{
    width: "6px", height: "6px", borderRadius: "50%",
    background: "#9ab8b8", animation: `dcBounce 1.2s ${delay}s infinite`,
  }} />
);

const FileBubble = ({ m, isMe }) => {
  const isPdf = m.fileUrl && (m.fileUrl.includes(".pdf") || m.fileUrl.includes("/raw/"));
  if (isPdf) {
    return (
      <a href={m.fileUrl} target="_blank" rel="noreferrer" style={S.fileBubble(isMe)}>
        <div style={S.fileIconBox(true)}>
          <svg width="18" height="18" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="15" y2="17"/>
          </svg>
        </div>
        <div>
          <div style={S.fileNameText}>{m.fileName || "Document"}</div>
          <div style={S.fileSubText}>PDF • Tap to open</div>
        </div>
      </a>
    );
  }
  return (
    <a href={m.fileUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block" }}>
      <img
        src={m.fileUrl}
        alt={m.fileName || "image"}
        style={{ maxWidth: "220px", borderRadius: "14px", display: "block", cursor: "pointer" }}
      />
    </a>
  );
};

const ChatPage = () => {
  const { appointmentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [online, setOnline] = useState({ patient: false, doctor: false });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const isInitialLoad = useRef(true);
  const myRole = "doctor";

  useEffect(() => {
    // ✅ Wait for connection then join with role info
    const emitJoin = () => {
      socket.emit("join_room", { room: appointmentId, role: "doctor" });
    };

    if (socket.connected) {
      emitJoin();
    } else {
      socket.once("connect", emitJoin);
    }
    const handleReceive = (data) => {
      // Only clear typing indicator when OTHER person's message arrives
      if (data.senderRole !== myRole) setIsTyping(false);
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
      // Mark seen only when the OTHER person sends me a message
      if (data.senderRole !== myRole) {
        fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/chat/seen/${appointmentId}/${myRole}`,
          { method: "POST" }
        ).then(() => {
          socket.emit("message_seen", { appointmentId, seenBy: myRole });
        }).catch(console.error);
      }
    };
    socket.on("receive_message", handleReceive);

    // ✅ Listen for typing events from the other person
    const handleTyping = ({ senderRole }) => {
      if (senderRole !== myRole) setIsTyping(true);
    };
    const handleStopTyping = ({ senderRole }) => {
      if (senderRole !== myRole) setIsTyping(false);
    };
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("connect", emitJoin);
      socket.off("receive_message", handleReceive);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [appointmentId]);

  useEffect(() => {
    if (isInitialLoad.current) return; // skip scroll on history load
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/${appointmentId}`);
        const data = await res.json();
        if (data.success) {
          setMessages(data.messages);
          isInitialLoad.current = false; // history loaded, enable scroll for new msgs
          // Mark seen once on load — not in a loop
          fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/chat/seen/${appointmentId}/${myRole}`,
            { method: "POST" }
          ).then(() => {
            socket.emit("message_seen", { appointmentId, seenBy: myRole });
          }).catch(console.error);
        }
      } catch (err) { console.error(err); }
    };
    loadMessages();
  }, [appointmentId]);


  // ✅ Listen for seen — update MY sent messages
  useEffect(() => {
    const handleSeen = ({ seenBy }) => {
      if (seenBy === myRole) return;
      setMessages((prev) =>
        prev.map((msg) =>
          msg.senderRole === myRole && !msg.seen ? { ...msg, seen: true } : msg
        )
      );
    };
    socket.on("message_seen", handleSeen);
    return () => socket.off("message_seen", handleSeen);
  }, []);

  // Online/offline status
  useEffect(() => {
    const handleOnlineStatus = (status) => setOnline(status);
    socket.on("online_status", handleOnlineStatus);
    return () => socket.off("online_status", handleOnlineStatus);
  }, []);

  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    // Stop typing indicator when message sent
    clearTimeout(typingTimeoutRef.current);
    socket.emit("stop_typing", { room: appointmentId, senderRole: myRole });
    socket.emit("send_message", {
      room: appointmentId,
      message: currentMessage,
      senderRole: myRole,
      messageType: "text",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    setCurrentMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/chat/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        socket.emit("send_message", {
          room: appointmentId,
          senderRole: myRole,
          message: "",
          messageType: "file",
          fileUrl: data.fileUrl,
          fileName: data.fileName,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
      }
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = "";
    uploadFile(file);
  };

  return (
    <>
      <style>{`
        @keyframes dcBounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-5px); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .dchat-input::placeholder { color: #9ab8b8; }
        .dchat-send:hover { background: #1a9090!important; transform: scale(1.07); }
        .dchat-attach:hover { background: #e6f4f4!important; border-radius: 50%; }
      `}</style>

      <div style={S.root}>
        <div style={S.inner}>
          <div style={S.card}>

            <div style={S.topbar}>
              <div style={S.avatar}>P</div>
              <div>
                <p style={S.topbarName}>Patient</p>
                <div style={{ ...S.onlineRow, color: online.patient ? "#2eab7a" : "#aaa" }}>
                  <span style={{ ...S.onlineDot, background: online.patient ? "#2eab7a" : "#ccc" }} />
                  {online.patient ? "Online" : "Offline"}
                </div>
              </div>
            </div>

            <div style={S.messagesArea}>
              <div style={S.dateSep}>
                <div style={S.dateLine} />Today<div style={S.dateLine} />
              </div>

              {messages.map((m, i) => {
                const isMe = m.senderRole === myRole;
                return (
                  <div key={m._id || i} style={S.msgRow(isMe)}>
                    <div style={S.msgInit(isMe)}>{isMe ? "Dr" : "P"}</div>
                    <div style={S.bubbleWrap(isMe)}>
                      {/* ✅ File or text */}
                      {m.messageType === "file" && m.fileUrl
                        ? <FileBubble m={m} isMe={isMe} />
                        : <div style={S.bubble(isMe)}>{m.message}</div>
                      }
                      {isMe ? (
                        <span style={S.msgTime(true)}>
                          <span style={S.seenTick(m.seen)}>
                            {m.seen ? "✔✔ Seen" : "✔ Delivered"}
                          </span>
                          {" • "}{m.timestamp}
                        </span>
                      ) : (
                        m.timestamp && <span style={S.msgTime(false)}>{m.timestamp}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div style={S.typingRow}>
                  <div style={S.msgInit(false)}>P</div>
                  <div style={S.typingBubble}>
                    <TypingDot delay={0} /><TypingDot delay={0.2} /><TypingDot delay={0.4} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {uploading && (
              <div style={S.uploadingBar}>
                <div style={{ width: "13px", height: "13px", borderRadius: "50%", border: "2px solid #0d6e6e", borderTopColor: "transparent", animation: "spin 0.7s linear infinite" }} />
                Uploading file…
              </div>
            )}

            <div style={S.inputBar}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileSelect}
              />
              <div style={S.inputPill}>
                {/* ✅ Attach button — was missing in doctor's original file */}
                <button
                  className="dchat-attach"
                  style={S.attachBtn}
                  onClick={() => fileInputRef.current.click()}
                  title="Attach file (PDF, JPG, PNG)"
                  disabled={uploading}
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <input
                  className="dchat-input"
                  style={S.input}
                  type="text"
                  value={currentMessage}
                  onChange={(e) => {
                    setCurrentMessage(e.target.value);
                    // Emit typing event
                    socket.emit("typing", { room: appointmentId, senderRole: myRole });
                    // Stop typing after 1.5s of inactivity
                    clearTimeout(typingTimeoutRef.current);
                    typingTimeoutRef.current = setTimeout(() => {
                      socket.emit("stop_typing", { room: appointmentId, senderRole: myRole });
                    }, 1500);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message or attach a file…"
                  autoComplete="off"
                />
              </div>
              <button className="dchat-send" style={S.sendBtn} onClick={sendMessage}>
                <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;











