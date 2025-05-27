"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Send,
  Phone,
  Video,
  Calendar,
  Clock,
  Users,
  MessageCircle,
  Paperclip,
  Smile,
  MoreVertical,
  Search,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  type: "text" | "meeting" | "file"
  isOwn: boolean
}

interface Chat {
  id: string
  name: string
  lastMessage: string
  timestamp: Date
  unread: number
  avatar: string
  status: "online" | "offline" | "busy"
  type: "client" | "team"
}

interface ChatSystemProps {
  onBack: () => void
}

export default function ChatSystem({ onBack }: ChatSystemProps) {
  const [selectedChat, setSelectedChat] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chats: Chat[] = [
    {
      id: "1",
      name: "Carlos Silva - Tech Innovations",
      lastMessage: "Quando podemos agendar a reunião para discutir o projeto?",
      timestamp: new Date(2024, 0, 15, 14, 30),
      unread: 2,
      avatar: "CS",
      status: "online",
      type: "client",
    },
    {
      id: "2",
      name: "Ana Costa - Marketing Pro",
      lastMessage: "Adorei o primeiro corte do vídeo! Apenas alguns ajustes...",
      timestamp: new Date(2024, 0, 15, 13, 15),
      unread: 0,
      avatar: "AC",
      status: "offline",
      type: "client",
    },
    {
      id: "3",
      name: "Equipe Produção",
      lastMessage: "Equipamentos prontos para a gravação de amanhã",
      timestamp: new Date(2024, 0, 15, 12, 45),
      unread: 1,
      avatar: "EP",
      status: "online",
      type: "team",
    },
    {
      id: "4",
      name: "Roberto Santos - Eventos Premium",
      lastMessage: "Preciso de um orçamento para transmissão ao vivo",
      timestamp: new Date(2024, 0, 15, 11, 20),
      unread: 0,
      avatar: "RS",
      status: "busy",
      type: "client",
    },
  ]

  const messages: Message[] = [
    {
      id: "1",
      sender: "Carlos Silva",
      content: "Olá! Gostaria de discutir um projeto de vídeo corporativo para nossa empresa.",
      timestamp: new Date(2024, 0, 15, 10, 0),
      type: "text",
      isOwn: false,
    },
    {
      id: "2",
      sender: "Você",
      content: "Olá Carlos! Ficamos felizes com seu interesse. Pode me contar mais detalhes sobre o projeto?",
      timestamp: new Date(2024, 0, 15, 10, 5),
      type: "text",
      isOwn: true,
    },
    {
      id: "3",
      sender: "Carlos Silva",
      content:
        "Precisamos de um vídeo institucional de aproximadamente 3 minutos para apresentar nossa empresa e serviços.",
      timestamp: new Date(2024, 0, 15, 10, 10),
      type: "text",
      isOwn: false,
    },
    {
      id: "4",
      sender: "Você",
      content: "Perfeito! Vou agendar uma reunião para discutirmos todos os detalhes do projeto.",
      timestamp: new Date(2024, 0, 15, 10, 15),
      type: "text",
      isOwn: true,
    },
    {
      id: "5",
      sender: "Você",
      content: "Reunião agendada para amanhã às 14h - Discussão do projeto vídeo institucional",
      timestamp: new Date(2024, 0, 15, 10, 16),
      type: "meeting",
      isOwn: true,
    },
    {
      id: "6",
      sender: "Carlos Silva",
      content: "Quando podemos agendar a reunião para discutir o projeto?",
      timestamp: new Date(2024, 0, 15, 14, 30),
      type: "text",
      isOwn: false,
    },
  ]

  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const selectedChatData = chats.find((chat) => chat.id === selectedChat)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Enviando mensagem:", message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "busy":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-400 hover:text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Chat</h1>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className={`p-4 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors ${
                  selectedChat === chat.id ? "bg-gray-800" : ""
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {chat.avatar}
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(chat.status)} rounded-full border-2 border-gray-900`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-sm font-medium text-white truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-400">{format(chat.timestamp, "HH:mm", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400 truncate">{chat.lastMessage}</p>
                      {chat.unread > 0 && <Badge className="bg-purple-600 text-white text-xs">{chat.unread}</Badge>}
                    </div>
                    <div className="mt-1">
                      <Badge
                        variant="outline"
                        className={`text-xs ${
                          chat.type === "client" ? "border-blue-600 text-blue-400" : "border-green-600 text-green-400"
                        }`}
                      >
                        {chat.type === "client" ? "Cliente" : "Equipe"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-800">
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-pink-600 text-pink-400 hover:bg-pink-600 hover:text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Reunião
              </Button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedChatData?.avatar}
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(selectedChatData?.status || "offline")} rounded-full border-2 border-gray-900`}
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">{selectedChatData?.name}</h2>
                      <p className="text-sm text-gray-400">
                        {selectedChatData?.status === "online"
                          ? "Online"
                          : selectedChatData?.status === "busy"
                            ? "Ocupado"
                            : "Offline"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <Phone className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <Video className="h-5 w-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs lg:max-w-md ${msg.isOwn ? "order-2" : "order-1"}`}>
                      {msg.type === "meeting" ? (
                        <Card className="bg-purple-600/20 border-purple-600/30">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <Calendar className="h-4 w-4 text-purple-400" />
                              <span className="text-sm font-medium text-purple-300">Reunião Agendada</span>
                            </div>
                            <p className="text-sm text-white">{msg.content}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-purple-300">
                              <Clock className="h-3 w-3" />
                              <span>{format(msg.timestamp, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div
                          className={`rounded-lg p-3 ${
                            msg.isOwn
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.isOwn ? "text-purple-100" : "text-gray-400"}`}>
                            {format(msg.timestamp, "HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      )}
                    </div>
                    {!msg.isOwn && (
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold order-0 mr-2 mt-auto">
                        {selectedChatData?.avatar}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800 bg-gray-900">
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Digite sua mensagem..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="bg-gray-800 border-gray-700 text-white pr-12"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Selecione uma conversa</h3>
                <p className="text-gray-500">Escolha uma conversa da lista para começar a conversar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
