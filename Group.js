
// --- SAVAGE_XMD Anti-Link and Anti-Bot Feature with Mode Control ---
const antilinkRegex = /chat\.whatsapp\.com\//i
let antiLinkMode = 'warn' // options: 'warn', 'delete', 'remove'

async function checkAntiLinkAntiBot(m, conn) {
    try {
        if (!m.isGroup || !m.message) return
        const sender = m.key.participant || m.key.remoteJid
        const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net'
        const text = m.message?.conversation || m.message?.extendedTextMessage?.text || ''

        // Anti-Link
        if (antilinkRegex.test(text)) {
            if (antiLinkMode === 'warn') {
                await conn.sendMessage(m.chat, { text: '⚠️ Group links are not allowed. You have been warned!' })
            } else if (antiLinkMode === 'delete') {
                await conn.sendMessage(m.chat, { delete: m.key })
                await conn.sendMessage(m.chat, { text: '🗑️ Group link message deleted.' })
            } else if (antiLinkMode === 'remove') {
                await conn.sendMessage(m.chat, { text: '🚫 Group link detected. User removed.' })
                await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
            }
        }

        // Anti-Bot
        if (m.messageStubType === 27 || m.messageStubType === 'add') {
            const addedParticipants = m.messageStubParameters || []
            for (let participant of addedParticipants) {
                if (participant.endsWith('bot')) {
                    await conn.sendMessage(m.chat, { text: '🤖 Bot detected and removed!' })
                    await conn.groupParticipantsUpdate(m.chat, [participant], 'remove')
                }
            }
        }
    } catch (err) {
        console.error('AntiLink/AntiBot Error:', err)
    }
}

module.exports = { checkAntiLinkAntiBot, antiLinkMode }
