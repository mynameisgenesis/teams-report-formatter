import { useState } from 'react'
import './App.css'

function App() {
  const [project, setProject] = useState('')
  const [taskId, setTaskId] = useState('')
  const [taskLink, setTaskLink] = useState('')
  const [commits, setCommits] = useState([{ message: '', link: '' }])
  const [zfHarnessLink, setZfHarnessLink] = useState('')
  const [caesarsLink, setCaesarsLink] = useState('')
  const [copied, setCopied] = useState(false)

  const addCommit = () => setCommits([...commits, { message: '', link: '' }])
  const removeCommit = (i) => setCommits(commits.filter((_, idx) => idx !== i))
  const updateCommit = (i, field, value) => {
    const updated = [...commits]
    updated[i][field] = value
    setCommits(updated)
  }

  const generateReport = () => {
    const lines = []
    lines.push(`**Project:** \`${project}\``)
    lines.push(`**Task:** [${taskId}](${taskLink})`)
    lines.push(`**Commits:**`)
    commits.forEach(c => {
      if (c.message || c.link) lines.push(`- [${c.message}](${c.link})`)
    })
    if (zfHarnessLink) lines.push(`**ZF Harness:** [ZF Harness](${zfHarnessLink})`)
    if (caesarsLink) lines.push(`**Caesars:** [Caesars](${caesarsLink})`)
    return lines.join('\n')
  }

  const handleCopy = async () => {
    const text = generateReport()
    // Build HTML for rich paste into Teams
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^- /gm, '• ')
      .split('\n').join('<br>')

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([text], { type: 'text/plain' }),
        })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="container">
      <h1>Teams Report Formatter</h1>

      <label>Project Name</label>
      <input value={project} onChange={e => setProject(e.target.value)} placeholder="e.g. portal" />

      <label>Task ID</label>
      <input value={taskId} onChange={e => setTaskId(e.target.value)} placeholder="e.g. PROJ-1234" />

      <label>Task Link</label>
      <input value={taskLink} onChange={e => setTaskLink(e.target.value)} placeholder="https://..." />

      <label>Commits</label>
      {commits.map((c, i) => (
        <div key={i} className="commit-row">
          <input value={c.message} onChange={e => updateCommit(i, 'message', e.target.value)} placeholder="Commit message" />
          <input value={c.link} onChange={e => updateCommit(i, 'link', e.target.value)} placeholder="Commit link" />
          {commits.length > 1 && <button className="remove-btn" onClick={() => removeCommit(i)}>✕</button>}
        </div>
      ))}
      <button className="add-btn" onClick={addCommit}>+ Add Commit</button>

      <label>ZF Harness Link</label>
      <input value={zfHarnessLink} onChange={e => setZfHarnessLink(e.target.value)} placeholder="https://..." />

      <label>Caesars Link</label>
      <input value={caesarsLink} onChange={e => setCaesarsLink(e.target.value)} placeholder="https://..." />

      <hr />
      <h2>Preview</h2>
      <div className="preview" dangerouslySetInnerHTML={{
        __html: generateReport()
          .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/^- /gm, '• ')
          .split('\n').join('<br>')
      }} />

      <button className="copy-btn" onClick={handleCopy}>
        {copied ? '✓ Copied!' : 'Copy to Clipboard'}
      </button>
    </div>
  )
}

export default App
