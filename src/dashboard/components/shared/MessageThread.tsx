'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import { sendMessage } from '@/dashboard/lib/actions/messages/send-message'
import type { MessageWithSender } from '@/dashboard/lib/queries/messages'

export function MessageThread({
  messages,
  projectId,
  currentUserId,
}: {
  messages: MessageWithSender[]
  projectId: string
  currentUserId: string
}) {
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  function handleSend() {
    if (!body.trim()) return
    const text = body
    setBody('')
    startTransition(() => sendMessage(projectId, text))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Thread */}
      <div className="p-msg-thread">
        {messages.length === 0 && (
          <div className="p-msg-empty">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 28, height: 28, opacity: 0.4 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>No messages yet. Start the conversation.</span>
          </div>
        )}
        {messages.map(msg => {
          const isOwn = msg.sender?.id === currentUserId
          const initials = msg.sender?.full_name?.[0]?.toUpperCase() ?? '?'
          const time = new Date(msg.created_at).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

          return (
            <div key={msg.id} className={`p-msg-bubble-wrap${isOwn ? ' p-msg-bubble-wrap--own' : ''}`}>
              {!isOwn && (
                <div className="p-msg-group-header">
                  <div className="p-msg-item-avatar" style={{ width: 28, height: 28, fontSize: '0.65rem' }}>{initials}</div>
                  <span className="p-msg-sender">{msg.sender?.full_name ?? 'Unknown'}</span>
                  <span className="p-msg-time">{time}</span>
                </div>
              )}
              <div className={`p-msg-bubble${isOwn ? ' p-msg-bubble--own' : ''}`}>
                {msg.body}
              </div>
              {isOwn && <span className="p-msg-seen">{time}</span>}
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* Compose */}
      <div className="p-msg-compose">
        <textarea
          className="p-msg-input"
          placeholder={`Type your message…`}
          value={body}
          onChange={e => setBody(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          type="button"
          className="p-msg-send-btn"
          onClick={handleSend}
          disabled={isPending || !body.trim()}
        >
          <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 16, height: 16 }}>
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </>
  )
}
