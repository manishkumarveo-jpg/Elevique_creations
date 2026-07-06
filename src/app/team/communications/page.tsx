import { createServerClient } from '@/shared/lib/supabase/server'
import { getConversationsForTeamMember, getMessagesForProject } from '@/dashboard/lib/queries/messages'
import { MessageThread } from '@/dashboard/components/shared/MessageThread'
import Link from 'next/link'

interface Props {
  searchParams: Promise<{ project?: string }>
}

export default async function TeamCommunicationsPage({ searchParams }: Props) {
  const { project: activeProjectId } = await searchParams
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let conversations: Awaited<ReturnType<typeof getConversationsForTeamMember>> = []
  let messages: Awaited<ReturnType<typeof getMessagesForProject>> = []
  let projectName = ''
  let dbError = false

  try {
    conversations = await getConversationsForTeamMember(user.id)
    if (activeProjectId) {
      messages = await getMessagesForProject(activeProjectId)
      projectName = conversations.find(c => c.project_id === activeProjectId)?.project_name ?? ''
    }
  } catch {
    dbError = true
  }

  if (dbError) {
    return (
      <div className="p-warn-box">
        <h2 className="p-warn-box-title">Feature not available</h2>
        <p className="p-warn-box-sub">The messaging feature requires a database migration. Please contact your administrator.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="p-eyebrow">Team</p>
        <h1 className="p-page-title">Communications</h1>
      </div>

      <div className="p-msg-shell">
        <div className="p-msg-sidebar">
          <div className="p-msg-sidebar-header">
            <span className="p-msg-sidebar-title">Messages</span>
          </div>
          <div className="p-msg-list">
            {conversations.length === 0 ? (
              <p style={{ padding: '1rem', fontSize: '0.73rem', color: 'var(--p-t3)' }}>No assigned projects.</p>
            ) : (
              conversations.map(conv => (
                <Link
                  key={conv.project_id}
                  href={`/team/communications?project=${conv.project_id}`}
                  className={`p-msg-item${activeProjectId === conv.project_id ? ' active' : ''}`}
                >
                  <div className="p-msg-item-avatar">
                    {conv.project_name[0]?.toUpperCase() ?? 'P'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="p-msg-item-name">{conv.project_name}</p>
                    <p className="p-msg-item-preview">
                      {conv.last_message || 'No messages yet'}
                    </p>
                  </div>
                  {conv.last_message_at && (
                    <span className="p-msg-item-time">
                      {new Date(conv.last_message_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="p-msg-main">
          {activeProjectId && projectName ? (
            <>
              <div className="p-msg-header">
                <div className="p-msg-item-avatar" style={{ width: 36, height: 36 }}>
                  {projectName[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="p-msg-header-name">{projectName}</p>
                  <p className="p-msg-header-role">Project Thread</p>
                </div>
              </div>
              <MessageThread
                messages={messages}
                projectId={activeProjectId}
                currentUserId={user.id}
              />
            </>
          ) : (
            <div className="p-msg-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ width: 36, height: 36, opacity: 0.3 }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>Select a project to view messages</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
