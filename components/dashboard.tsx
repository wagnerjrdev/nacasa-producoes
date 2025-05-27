"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Users,
  MessageCircle,
  CalendarIcon,
  Settings,
  Plus,
  Edit,
  Eye,
  Clock,
  TrendingUp,
  Activity,
  Shield,
  Crown,
  User,
  LogOut,
  Home,
  BarChart3,
  Trash2,
  UserPlus,
  Save,
  EyeOff,
} from "lucide-react"
import { format, isSameDay, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import ChatSystem from "./chat-system"
import { createClient } from "@supabase/supabase-js"

// Configuração do Supabase (opcional - com fallback)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

// Fallback para localStorage quando Supabase não estiver configurado
const STORAGE_KEY = "nacasa_users_db"

// Função para salvar no localStorage
const saveToLocalStorage = (users: any[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
  }
}

// Função para carregar do localStorage
const loadFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }
  return []
}

// Função para criar usuário (com fallback)
const createUserInDatabase = async (userData: {
  name: string
  email: string
  password: string
  role: string
  status: string
}) => {
  try {
    if (supabase) {
      // Usar Supabase se estiver configurado
      const passwordHash = btoa(userData.password) // Temporário - use bcrypt em produção

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            name: userData.name,
            email: userData.email,
            password_hash: passwordHash,
            role: userData.role,
            status: userData.status,
          },
        ])
        .select()

      if (error) throw error
      return data[0]
    } else {
      // Fallback para localStorage
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password_hash: btoa(userData.password),
        role: userData.role,
        status: userData.status,
        created_at: new Date().toISOString(),
        last_seen: new Date().toISOString(),
      }

      const existingUsers = loadFromLocalStorage()
      const updatedUsers = [...existingUsers, newUser]
      saveToLocalStorage(updatedUsers)

      return newUser
    }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    throw error
  }
}

// Função para carregar usuários (com fallback)
const loadUsersFromDatabase = async () => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
      if (error) throw error
      return data || []
    } else {
      // Fallback para localStorage
      return loadFromLocalStorage()
    }
  } catch (error) {
    console.error("Erro ao carregar usuários:", error)
    return []
  }
}

// Função para atualizar usuário (com fallback)
const updateUserInDatabase = async (userId: string, userData: any) => {
  try {
    if (supabase) {
      const { data, error } = await supabase.from("users").update(userData).eq("id", userId).select()
      if (error) throw error
      return data[0]
    } else {
      // Fallback para localStorage
      const existingUsers = loadFromLocalStorage()
      const updatedUsers = existingUsers.map((user: any) => (user.id === userId ? { ...user, ...userData } : user))
      saveToLocalStorage(updatedUsers)
      return updatedUsers.find((user: any) => user.id === userId)
    }
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error)
    throw error
  }
}

// Função para deletar usuário (com fallback)
const deleteUserFromDatabase = async (userId: string) => {
  try {
    if (supabase) {
      const { error } = await supabase.from("users").delete().eq("id", userId)
      if (error) throw error
      return true
    } else {
      // Fallback para localStorage
      const existingUsers = loadFromLocalStorage()
      const filteredUsers = existingUsers.filter((user: any) => user.id !== userId)
      saveToLocalStorage(filteredUsers)
      return true
    }
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    throw error
  }
}

interface UserCredentials {
  id: string
  login: string
  password: string
  name: string
  role: "admin" | "moderator" | "user"
  status: "active" | "inactive"
  lastSeen: Date
  avatar: string
  createdAt: Date
}

interface DashboardProps {
  currentUser: UserCredentials
  userDatabase: UserCredentials[]
  onBack: () => void
  onLogout: () => void
}

interface UserType {
  id: string
  name: string
  login: string
  role: "admin" | "moderator" | "user"
  status: "active" | "inactive"
  lastSeen: Date
  avatar: string
  createdAt: Date
  email: string
}

interface Event {
  id: string
  title: string
  description: string
  date: Date
  time: string
  type: "meeting" | "project" | "deadline" | "call"
  client?: string
  priority: "low" | "medium" | "high"
}

interface Message {
  id: string
  sender: string
  content: string
  timestamp: Date
  isOwn: boolean
}

export default function Dashboard({ currentUser, userDatabase, onBack, onLogout }: DashboardProps) {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showChat, setShowChat] = useState(false)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [isViewUserOpen, setIsViewUserOpen] = useState(false)
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    time: "",
    type: "meeting" as "meeting" | "project" | "deadline" | "call",
    client: "",
    priority: "medium" as "low" | "medium" | "high",
  })

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user" as "admin" | "moderator" | "user",
    status: "active" as "active" | "inactive",
  })

  const [editUser, setEditUser] = useState({
    id: "",
    name: "",
    login: "",
    password: "",
    role: "user" as "admin" | "moderator" | "user",
    status: "active" as "active" | "inactive",
  })

  // Converter userDatabase para UserType para compatibilidade
  const [users, setUsers] = useState<UserType[]>(
    userDatabase.map((user) => ({
      id: user.id,
      name: user.name,
      login: user.login,
      role: user.role,
      status: user.status,
      lastSeen: user.lastSeen,
      avatar: user.avatar,
      createdAt: user.createdAt,
      email: user.login,
    })),
  )

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Reunião com Carlos Silva",
      description: "Discussão sobre projeto de vídeo institucional",
      date: new Date(2024, 0, 16, 14, 0),
      time: "14:00",
      type: "meeting",
      client: "Tech Innovations",
      priority: "high",
    },
    {
      id: "2",
      title: "Entrega do Projeto Marketing Pro",
      description: "Finalização e entrega do vídeo promocional",
      date: new Date(2024, 0, 18, 10, 0),
      time: "10:00",
      type: "deadline",
      client: "Marketing Pro",
      priority: "high",
    },
    {
      id: "3",
      title: "Gravação Estúdio",
      description: "Sessão de gravação para podcast corporativo",
      date: new Date(2024, 0, 17, 9, 0),
      time: "09:00",
      type: "project",
      priority: "medium",
    },
    {
      id: "4",
      title: "Call com Equipe",
      description: "Reunião semanal da equipe de produção",
      date: new Date(),
      time: "15:30",
      type: "call",
      priority: "low",
    },
  ])

  const [messages] = useState<Message[]>([
    {
      id: "1",
      sender: "Carlos Silva",
      content: "Olá! Como está o andamento do projeto?",
      timestamp: new Date(2024, 0, 15, 14, 30),
      isOwn: false,
    },
    {
      id: "2",
      sender: "Você",
      content: "Oi Carlos! O projeto está indo muito bem. Já finalizamos 70% da edição.",
      timestamp: new Date(2024, 0, 15, 14, 35),
      isOwn: true,
    },
    {
      id: "3",
      sender: "Ana Costa",
      content: "Preciso agendar uma reunião para revisar o material",
      timestamp: new Date(2024, 0, 15, 15, 0),
      isOwn: false,
    },
  ])

  // Funções para gerenciamento de eventos
  const handleAddEvent = () => {
    if (newEvent.title && newEvent.time) {
      const event: Event = {
        id: Date.now().toString(),
        title: newEvent.title,
        description: newEvent.description,
        date: selectedDate,
        time: newEvent.time,
        type: newEvent.type,
        client: newEvent.client,
        priority: newEvent.priority,
      }
      setEvents([...events, event])
      setNewEvent({
        title: "",
        description: "",
        time: "",
        type: "meeting",
        client: "",
        priority: "medium",
      })
      setIsAddEventOpen(false)
    }
  }

  // Funções para gerenciamento de usuários
  const handleAddUser = async () => {
    if (newUser.name && newUser.email && newUser.password && currentUser.role === "admin") {
      try {
        setIsLoading(true)

        // Criar usuário no banco de dados ou localStorage
        const createdUser = await createUserInDatabase(newUser)

        // Atualizar estado local
        const userForState: UserType = {
          id: createdUser.id,
          name: createdUser.name,
          login: createdUser.email,
          email: createdUser.email,
          role: createdUser.role,
          status: createdUser.status,
          lastSeen: new Date(createdUser.last_seen || createdUser.created_at),
          avatar: createdUser.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase(),
          createdAt: new Date(createdUser.created_at),
        }

        setUsers([...users, userForState])
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "user",
          status: "active",
        })
        setIsAddUserOpen(false)

        // Mostrar sucesso
        alert("Usuário criado com sucesso!")
      } catch (error) {
        console.error("Erro ao criar usuário:", error)
        alert("Erro ao criar usuário. Tente novamente.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleEditUser = () => {
    if (editUser.name && editUser.login && currentUser.role === "admin") {
      setUsers(
        users.map((user) =>
          user.id === editUser.id
            ? {
                ...user,
                name: editUser.name,
                login: editUser.login,
                role: editUser.role,
                status: editUser.status,
                avatar: editUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase(),
              }
            : user,
        ),
      )
      setIsEditUserOpen(false)
      setSelectedUser(null)
      setEditUser({
        id: "",
        name: "",
        login: "",
        password: "",
        role: "user",
        status: "active",
      })
    }
  }

  const handleDeleteUser = () => {
    if (userToDelete && currentUser.role === "admin") {
      setUsers(users.filter((user) => user.id !== userToDelete.id))
      setIsDeleteUserOpen(false)
      setUserToDelete(null)
    }
  }

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user)
    setIsViewUserOpen(true)
  }

  const handleEditUserClick = (user: UserType) => {
    if (currentUser.role === "admin") {
      setEditUser({
        id: user.id,
        name: user.name,
        login: user.login,
        password: "",
        role: user.role,
        status: user.status,
      })
      setSelectedUser(user)
      setIsEditUserOpen(true)
    }
  }

  const handleDeleteUserClick = (user: UserType) => {
    if (currentUser.role === "admin") {
      setUserToDelete(user)
      setIsDeleteUserOpen(true)
    }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date))
  }

  const getTodayEvents = () => {
    return events.filter((event) => isSameDay(event.date, new Date()))
  }

  const getUpcomingEvents = () => {
    const today = new Date()
    return events
      .filter((event) => event.date >= today)
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-yellow-600"
      case "low":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "meeting":
        return <Users className="h-4 w-4" />
      case "project":
        return <BarChart3 className="h-4 w-4" />
      case "deadline":
        return <Clock className="h-4 w-4" />
      case "call":
        return <MessageCircle className="h-4 w-4" />
      default:
        return <CalendarIcon className="h-4 w-4" />
    }
  }

  const isAdmin = currentUser.role === "admin"

  if (showChat) {
    return <ChatSystem onBack={() => setShowChat(false)} />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-400 hover:text-white">
                <Home className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Dashboard NaCasa Produções</h1>
                <p className="text-sm text-gray-400">Painel de controle administrativo</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                  {currentUser.avatar}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{currentUser.name}</p>
                  <Badge variant="outline" className="border-purple-600 text-purple-400 text-xs">
                    {currentUser.role === "admin"
                      ? "Administrador"
                      : currentUser.role === "moderator"
                        ? "Moderador"
                        : "Usuário"}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => setShowChat(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </Button>
              <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                <Settings className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" onClick={onLogout} className="text-red-400 hover:text-red-300">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-600">
              <Activity className="h-4 w-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-purple-600">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-600">
              <Users className="h-4 w-4 mr-2" />
              Usuários ({users.length})
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Eventos Hoje</CardTitle>
                    <CalendarIcon className="h-4 w-4 text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{getTodayEvents().length}</div>
                  <div className="flex items-center text-sm text-purple-400 mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    Próximas atividades
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Usuários Ativos</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {users.filter((u) => u.status === "active").length}
                  </div>
                  <div className="flex items-center text-sm text-green-400 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Online agora
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Mensagens</CardTitle>
                    <MessageCircle className="h-4 w-4 text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{messages.length}</div>
                  <div className="flex items-center text-sm text-blue-400 mt-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Conversas ativas
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-400">Projetos</CardTitle>
                    <BarChart3 className="h-4 w-4 text-pink-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {events.filter((e) => e.type === "project").length}
                  </div>
                  <div className="flex items-center text-sm text-pink-400 mt-1">
                    <Activity className="h-3 w-3 mr-1" />
                    Em andamento
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Today's Events and Recent Messages */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Eventos de Hoje</CardTitle>
                  <CardDescription className="text-gray-400">Sua agenda para hoje</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getTodayEvents().length > 0 ? (
                    getTodayEvents().map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                            {getTypeIcon(event.type)}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{event.title}</p>
                            <p className="text-xs text-gray-400">{event.time}</p>
                          </div>
                        </div>
                        <Badge className={`${getPriorityColor(event.priority)} text-white`}>
                          {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Média" : "Baixa"}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-center py-4">Nenhum evento agendado para hoje</p>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Mensagens Recentes</CardTitle>
                  <CardDescription className="text-gray-400">Últimas conversas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {messages.slice(-3).map((message) => (
                    <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                        {message.sender
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{message.sender}</p>
                        <p className="text-xs text-gray-400 truncate">{message.content}</p>
                        <p className="text-xs text-gray-500">{format(message.timestamp, "HH:mm", { locale: ptBR })}</p>
                      </div>
                    </div>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => setShowChat(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Abrir Chat
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Events */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Próximos Eventos</CardTitle>
                <CardDescription className="text-gray-400">Agenda dos próximos dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {getUpcomingEvents().map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                          {getTypeIcon(event.type)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{event.title}</p>
                          <p className="text-sm text-gray-400">{event.description}</p>
                          <p className="text-xs text-purple-400">
                            {format(event.date, "dd/MM 'às' HH:mm", { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getPriorityColor(event.priority)} text-white`}>
                          {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Média" : "Baixa"}
                        </Badge>
                        {isAdmin && (
                          <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Agenda de Trabalho</h2>
                <p className="text-gray-400">Gerencie seus eventos e compromissos</p>
              </div>
              {isAdmin && (
                <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Novo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Evento</DialogTitle>
                      <DialogDescription className="text-gray-400">
                        Crie um novo evento para {format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input
                          id="title"
                          value={newEvent.title}
                          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Digite o título do evento"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Input
                          id="description"
                          value={newEvent.description}
                          onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Descrição do evento"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="time">Horário</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newEvent.time}
                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="type">Tipo</Label>
                          <Select
                            value={newEvent.type}
                            onValueChange={(value: "meeting" | "project" | "deadline" | "call") =>
                              setNewEvent({ ...newEvent, type: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="meeting" className="text-white">
                                Reunião
                              </SelectItem>
                              <SelectItem value="project" className="text-white">
                                Projeto
                              </SelectItem>
                              <SelectItem value="deadline" className="text-white">
                                Prazo
                              </SelectItem>
                              <SelectItem value="call" className="text-white">
                                Chamada
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="client">Cliente (opcional)</Label>
                          <Input
                            id="client"
                            value={newEvent.client}
                            onChange={(e) => setNewEvent({ ...newEvent, client: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white"
                            placeholder="Nome do cliente"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="priority">Prioridade</Label>
                          <Select
                            value={newEvent.priority}
                            onValueChange={(value: "low" | "medium" | "high") =>
                              setNewEvent({ ...newEvent, priority: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="low" className="text-white">
                                Baixa
                              </SelectItem>
                              <SelectItem value="medium" className="text-white">
                                Média
                              </SelectItem>
                              <SelectItem value="high" className="text-white">
                                Alta
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => setIsAddEventOpen(false)}
                        className="border-gray-600 text-gray-400"
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleAddEvent} className="bg-gradient-to-r from-purple-600 to-pink-600">
                        <Save className="h-4 w-4 mr-2" />
                        Adicionar Evento
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <Card className="lg:col-span-2 bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Calendário</CardTitle>
                  <CardDescription className="text-gray-400">
                    Clique em uma data para ver os eventos ou adicionar novos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border border-gray-700"
                    modifiers={{
                      hasEvents: (date) => getEventsForDate(date).length > 0,
                    }}
                    modifiersStyles={{
                      hasEvents: {
                        backgroundColor: "rgb(147 51 234 / 0.3)",
                        color: "white",
                      },
                    }}
                  />
                </CardContent>
              </Card>

              {/* Events for Selected Date */}
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">{format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}</CardTitle>
                  <CardDescription className="text-gray-400">
                    {isToday(selectedDate) ? "Hoje" : format(selectedDate, "EEEE", { locale: ptBR })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getEventsForDate(selectedDate).length > 0 ? (
                    getEventsForDate(selectedDate).map((event) => (
                      <div key={event.id} className="p-3 bg-gray-700/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                              {getTypeIcon(event.type)}
                            </div>
                            <span className="font-medium text-white text-sm">{event.title}</span>
                          </div>
                          <Badge className={`${getPriorityColor(event.priority)} text-white text-xs`}>
                            {event.priority === "high" ? "Alta" : event.priority === "medium" ? "Média" : "Baixa"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{event.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-purple-400">{event.time}</span>
                          {event.client && <span className="text-xs text-gray-500">{event.client}</span>}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 text-sm">Nenhum evento nesta data</p>
                      {isAdmin && (
                        <Button
                          size="sm"
                          onClick={() => setIsAddEventOpen(true)}
                          className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Gerenciamento de Usuários</h2>
                <p className="text-gray-400">Gerencie usuários e suas permissões</p>
              </div>
              {isAdmin && (
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Novo Usuário
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                      <DialogDescription className="text-gray-400">Crie um novo usuário no sistema</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="userName">Nome Completo</Label>
                        <Input
                          id="userName"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Digite o nome completo"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userEmail">E-mail</Label>
                        <Input
                          id="userEmail"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="bg-gray-700 border-gray-600 text-white"
                          placeholder="Digite o e-mail"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="userPassword">Senha</Label>
                        <div className="relative">
                          <Input
                            id="userPassword"
                            type={showNewPassword ? "text" : "password"}
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="bg-gray-700 border-gray-600 text-white pr-10"
                            placeholder="Digite a senha"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="userRole">Cargo</Label>
                          <Select
                            value={newUser.role}
                            onValueChange={(value: "admin" | "moderator" | "user") =>
                              setNewUser({ ...newUser, role: value })
                            }
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="user" className="text-white">
                                Usuário
                              </SelectItem>
                              <SelectItem value="moderator" className="text-white">
                                Moderador
                              </SelectItem>
                              <SelectItem value="admin" className="text-white">
                                Administrador
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="userStatus">Status</Label>
                          <Select
                            value={newUser.status}
                            onValueChange={(value: "active" | "inactive") => setNewUser({ ...newUser, status: value })}
                          >
                            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600">
                              <SelectItem value="active" className="text-white">
                                Ativo
                              </SelectItem>
                              <SelectItem value="inactive" className="text-white">
                                Inativo
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddUserOpen(false)
                          setNewUser({
                            name: "",
                            email: "",
                            password: "",
                            role: "user",
                            status: "active",
                          })
                        }}
                        className="border-gray-600 text-gray-400"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleAddUser}
                        disabled={!newUser.name || !newUser.email || !newUser.password}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Criar Usuário
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <Card key={user.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{user.name}</h3>
                        <p className="text-sm text-gray-400">{user.login}</p>
                      </div>
                      <div
                        className={`w-3 h-3 rounded-full ${user.status === "active" ? "bg-green-500" : "bg-gray-500"}`}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Cargo:</span>
                        <Badge
                          variant="outline"
                          className={
                            user.role === "admin"
                              ? "border-red-600 text-red-400"
                              : user.role === "moderator"
                                ? "border-purple-600 text-purple-400"
                                : "border-blue-600 text-blue-400"
                          }
                        >
                          <div className="flex items-center space-x-1">
                            {user.role === "admin" ? (
                              <Crown className="h-3 w-3" />
                            ) : user.role === "moderator" ? (
                              <Shield className="h-3 w-3" />
                            ) : (
                              <User className="h-3 w-3" />
                            )}
                            <span>
                              {user.role === "admin"
                                ? "Administrador"
                                : user.role === "moderator"
                                  ? "Moderador"
                                  : "Usuário"}
                            </span>
                          </div>
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Último acesso:</span>
                        <span className="text-sm text-white">
                          {format(user.lastSeen, "dd/MM HH:mm", { locale: ptBR })}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Membro desde:</span>
                        <span className="text-sm text-white">
                          {format(user.createdAt, "dd/MM/yyyy", { locale: ptBR })}
                        </span>
                      </div>
                    </div>

                    <Separator className="my-4 bg-gray-700" />

                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewUser(user)}
                        className="flex-1 border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      {isAdmin && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditUserClick(user)}
                            className="flex-1 border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteUserClick(user)}
                            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* View User Dialog */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Detalhes do Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">Informações completas do usuário</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {selectedUser.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">{selectedUser.name}</h3>
                  <p className="text-gray-400">{selectedUser.login}</p>
                </div>
              </div>
              <Separator className="bg-gray-700" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-400">Cargo</Label>
                  <p className="text-white">
                    {selectedUser.role === "admin"
                      ? "Administrador"
                      : selectedUser.role === "moderator"
                        ? "Moderador"
                        : "Usuário"}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Status</Label>
                  <p className="text-white">{selectedUser.status === "active" ? "Ativo" : "Inativo"}</p>
                </div>
                <div>
                  <Label className="text-gray-400">Último acesso</Label>
                  <p className="text-white">
                    {format(selectedUser.lastSeen, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-400">Membro desde</Label>
                  <p className="text-white">{format(selectedUser.createdAt, "dd/MM/yyyy", { locale: ptBR })}</p>
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              onClick={() => setIsViewUserOpen(false)}
              className="border-gray-600 text-gray-400"
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription className="text-gray-400">Altere as informações do usuário</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editUserName">Nome Completo</Label>
              <Input
                id="editUserName"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserLogin">Login</Label>
              <Input
                id="editUserLogin"
                type="text"
                value={editUser.login}
                onChange={(e) => setEditUser({ ...editUser, login: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editUserPassword">Nova Senha (opcional)</Label>
              <div className="relative">
                <Input
                  id="editUserPassword"
                  type={showEditPassword ? "text" : "password"}
                  value={editUser.password}
                  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white pr-10"
                  placeholder="Deixe em branco para manter a senha atual"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                >
                  {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="editUserRole">Cargo</Label>
                <Select
                  value={editUser.role}
                  onValueChange={(value: "admin" | "moderator" | "user") => setEditUser({ ...editUser, role: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="user" className="text-white">
                      Usuário
                    </SelectItem>
                    <SelectItem value="moderator" className="text-white">
                      Moderador
                    </SelectItem>
                    <SelectItem value="admin" className="text-white">
                      Administrador
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="editUserStatus">Status</Label>
                <Select
                  value={editUser.status}
                  onValueChange={(value: "active" | "inactive") => setEditUser({ ...editUser, status: value })}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="active" className="text-white">
                      Ativo
                    </SelectItem>
                    <SelectItem value="inactive" className="text-white">
                      Inativo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditUserOpen(false)
                setEditUser({
                  id: "",
                  name: "",
                  login: "",
                  password: "",
                  role: "user",
                  status: "active",
                })
              }}
              className="border-gray-600 text-gray-400"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleEditUser}
              disabled={!editUser.name || !editUser.login}
              className="bg-gradient-to-r from-purple-600 to-pink-600 disabled:opacity-50"
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete User Alert Dialog */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja excluir o usuário "{userToDelete?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700 text-white">
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir Usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
