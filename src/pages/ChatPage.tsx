import { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { subscribeToChatMessages, sendChatMessage } from '../services/firestore';
import { formatDate } from '../utils';
import { ArrowLeft, Send, User, MessageCircle } from 'lucide-react';
import type { Chat, ChatMessage, User } from '../types';

interface Props {
  chats: Chat[];
  users: User[];
  currentUser: User | null;
}

export function ChatPage({ chats, users, currentUser }: Props) {
  const { navigateToChatRoom, selectedChatId, navigateBackToChats } = useApp();

  if (selectedChatId) {
    return <ChatRoom chatId={selectedChatId} currentUser={currentUser} onBack={navigateBackToChats} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">المحادثات</h1>
      </div>

      {chats.length === 0 ? (
        <div className="bg-[#111c2d] rounded-2xl p-6 border border-white/5 text-center py-16">
          <MessageCircle className="mx-auto mb-4 text-white/20" size={48} />
          <p className="text-white/50 text-lg">لا توجد محادثات</p>
          <p className="text-white/30 text-sm mt-2">سيتم إنشاء المحادثات تلقائياً عند بدء التواصل</p>
        </div>
      ) : (
        <div className="space-y-3">
          {chats.map((chat) => {
            const otherParticipants = chat.participants
              ?.filter(p => p !== currentUser?.uid)
              .map(p => users.find(u => (u.id || u.uid) === p))
              .filter(Boolean) || [];

            return (
              <div
                key={chat.id}
                onClick={() => navigateToChatRoom(chat.id)}
                className="bg-[#111c2d] rounded-2xl p-5 border border-white/5 hover:border-cyan-400/20 hover:bg-[#162032] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400/10 flex items-center justify-center text-cyan-400">
                    <User size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">
                      {otherParticipants.map(u => u?.name || u?.displayName).join(', ') || 'محادثة'}
                    </h3>
                    <p className="text-white/40 text-xs truncate mt-1">{chat.lastMessage || 'لا توجد رسائل'}</p>
                  </div>
                  {chat.lastMessageAt && (
                    <span className="text-white/30 text-xs">{formatDate(chat.lastMessageAt)}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ChatRoom({ chatId, currentUser, onBack }: { chatId: string; currentUser: User | null; onBack: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = subscribeToChatMessages(chatId, (msgs) => {
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim() || !currentUser) return;
    setIsSending(true);
    try {
      await sendChatMessage(
        chatId,
        currentUser.uid || currentUser.id || '',
        currentUser.name || currentUser.displayName || 'مجهول',
        newMessage.trim()
      );
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-[#111c2d] rounded-2xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center gap-3">
        <button onClick={onBack} className="text-white/70 hover:text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-white font-bold">المحادثة</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/30 text-sm">ابدأ المحادثة الآن...</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === (currentUser?.uid || currentUser?.id);
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                  isMe 
                    ? 'bg-cyan-400 text-black rounded-br-md' 
                    : 'bg-white/5 text-white rounded-bl-md'
                }`}>
                  {!isMe && <p className="text-xs opacity-60 mb-1 font-medium">{msg.senderName}</p>}
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                  <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-black/40' : 'text-white/30'}`}>
                    {formatDate(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="اكتب رسالة..."
            className="flex-1 bg-[#0b1422] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-cyan-400/50 placeholder-white/30"
          />
          <button
            onClick={handleSend}
            disabled={isSending || !newMessage.trim()}
            className="bg-cyan-400 text-black px-5 rounded-xl font-bold hover:bg-cyan-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
