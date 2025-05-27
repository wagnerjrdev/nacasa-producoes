"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Play,
  Camera,
  Mic,
  Monitor,
  Users,
  Award,
  ArrowRight,
  Star,
  Quote,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  User,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Dashboard from "../components/dashboard"

interface UserCredentials {
  id: string
  email: string
  password: string
  name: string
  role: "admin" | "moderator" | "user"
  status: "active" | "inactive"
  lastSeen: Date
  avatar: string
  createdAt: Date
}

export default function HomePage() {
  const [currentView, setCurrentView] = useState<"home" | "dashboard">("home")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserCredentials | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Base de dados simulada de usuários com senhas
  const [userDatabase] = useState<UserCredentials[]>([
    {
      id: "1",
      email: "admin@nacasaproducoes.com",
      password: "admin123",
      name: "Admin Sistema",
      role: "admin",
      status: "active",
      lastSeen: new Date(),
      avatar: "AS",
      createdAt: new Date(2023, 0, 1),
    },
    {
      id: "2",
      email: "moderador@nacasaproducoes.com",
      password: "mod123",
      name: "Moderador Sistema",
      role: "moderator",
      status: "active",
      lastSeen: new Date(),
      avatar: "MS",
      createdAt: new Date(2023, 5, 1),
    },
    {
      id: "3",
      email: "usuario@nacasaproducoes.com",
      password: "user123",
      name: "Usuário Teste",
      role: "user",
      status: "active",
      lastSeen: new Date(),
      avatar: "UT",
      createdAt: new Date(2024, 0, 1),
    },
    {
      id: "4",
      email: "carlos@techinnovations.com",
      password: "carlos123",
      name: "Carlos Silva",
      role: "user",
      status: "active",
      lastSeen: new Date(2024, 0, 15, 14, 30),
      avatar: "CS",
      createdAt: new Date(2024, 0, 1),
    },
    {
      id: "5",
      email: "ana@marketingpro.com",
      password: "ana123",
      name: "Ana Costa",
      role: "user",
      status: "active",
      lastSeen: new Date(2024, 0, 15, 13, 15),
      avatar: "AC",
      createdAt: new Date(2024, 0, 5),
    },
  ])

  const handleLogin = async () => {
    setIsLoading(true)
    setLoginError("")

    // Simular delay de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Verificar credenciais
    const user = userDatabase.find(
      (u) => u.email === loginForm.email && u.password === loginForm.password && u.status === "active",
    )

    if (user) {
      setCurrentUser(user)
      setIsAuthenticated(true)
      setShowLogin(false)
      setCurrentView("dashboard")
      setLoginForm({ email: "", password: "" })
    } else {
      setLoginError("Email ou senha incorretos, ou usuário inativo.")
    }

    setIsLoading(false)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
    setCurrentView("home")
    setLoginForm({ email: "", password: "" })
    setLoginError("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin()
    }
  }

  if (showLogin && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">NaCasa</span>
                <span className="text-purple-400 ml-1">Produções</span>
              </div>
            </div>
            <CardTitle className="text-white">Dashboard Administrativo</CardTitle>
            <CardDescription className="text-gray-400">Faça login para acessar o painel de controle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loginError && (
              <div className="flex items-center space-x-2 p-3 bg-red-900/20 border border-red-600/30 rounded-md">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <span className="text-sm text-red-400">{loginError}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-300">
                Login
              </Label>
              <Input
                id="email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                onKeyPress={handleKeyPress}
                className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-300">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  onKeyPress={handleKeyPress}
                  className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500 pr-10"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <Button
                onClick={handleLogin}
                disabled={!loginForm.email || !loginForm.password || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
              >
                {isLoading ? "Entrando..." : "Entrar no Dashboard"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLogin(false)}
                disabled={isLoading}
                className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
              >
                Cancelar
              </Button>
            </div>

            <Separator className="bg-gray-700" />

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Não tem acesso?{" "}
                <button className="text-purple-400 hover:text-purple-300 underline">Entre em contato</button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentView === "dashboard" && isAuthenticated && currentUser) {
    return (
      <Dashboard
        currentUser={currentUser}
        userDatabase={userDatabase}
        onBack={() => setCurrentView("home")}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold">NaCasa</span>
                <span className="text-purple-400 ml-1">Produções</span>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#inicio" className="text-gray-300 hover:text-white transition-colors">
                Início
              </Link>
              <Link href="#servicos" className="text-gray-300 hover:text-white transition-colors">
                Serviços
              </Link>
              <Link href="#portfolio" className="text-gray-300 hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link href="#sobre" className="text-gray-300 hover:text-white transition-colors">
                Sobre
              </Link>
              <Link href="#contato" className="text-gray-300 hover:text-white transition-colors">
                Contato
              </Link>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowLogin(true)}
                className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
              >
                <User className="h-4 w-4" />
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                Orçamento
              </Button>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <nav className="flex flex-col space-y-4">
                <Link href="#inicio" className="text-gray-300 hover:text-white transition-colors">
                  Início
                </Link>
                <Link href="#servicos" className="text-gray-300 hover:text-white transition-colors">
                  Serviços
                </Link>
                <Link href="#portfolio" className="text-gray-300 hover:text-white transition-colors">
                  Portfolio
                </Link>
                <Link href="#sobre" className="text-gray-300 hover:text-white transition-colors">
                  Sobre
                </Link>
                <Link href="#contato" className="text-gray-300 hover:text-white transition-colors">
                  Contato
                </Link>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button onClick={() => setShowLogin(true)} className="bg-gradient-to-r from-purple-600 to-pink-600">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600">Orçamento</Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
          <Badge className="mb-6 bg-purple-600/20 text-purple-300 border-purple-600/30">
            Produção Audiovisual Profissional
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transformamos suas
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block">
              ideias em realidade
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Especialistas em produção audiovisual, edição profissional e soluções criativas para empresas e criadores de
            conteúdo.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4"
            >
              Começar Projeto
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-white hover:text-black text-lg px-8 py-4"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Portfolio
            </Button>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">500+</div>
              <div className="text-gray-400">Projetos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">150+</div>
              <div className="text-gray-400">Clientes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">5+</div>
              <div className="text-gray-400">Anos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-pink-400">24/7</div>
              <div className="text-gray-400">Suporte</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-600/30">Nossos Serviços</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Soluções Completas em Audiovisual</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Oferecemos uma gama completa de serviços para atender todas as suas necessidades de produção audiovisual
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Video Production */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Produção de Vídeo</CardTitle>
                <CardDescription className="text-gray-400">
                  Criação de conteúdo audiovisual profissional do conceito à entrega final
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Vídeos corporativos</li>
                  <li>• Documentários</li>
                  <li>• Videoclipes</li>
                  <li>• Conteúdo para redes sociais</li>
                  <li>• Transmissões ao vivo</li>
                </ul>
              </CardContent>
            </Card>

            {/* Audio Production */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-pink-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Mic className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Produção de Áudio</CardTitle>
                <CardDescription className="text-gray-400">
                  Gravação, mixagem e masterização de áudio com qualidade profissional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Gravação em estúdio</li>
                  <li>• Mixagem e masterização</li>
                  <li>• Trilhas sonoras</li>
                  <li>• Podcasts</li>
                  <li>• Áudio para vídeo</li>
                </ul>
              </CardContent>
            </Card>

            {/* Post Production */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Monitor className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Pós-Produção</CardTitle>
                <CardDescription className="text-gray-400">
                  Edição profissional, efeitos visuais e finalização de projetos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Edição de vídeo</li>
                  <li>• Motion graphics</li>
                  <li>• Correção de cor</li>
                  <li>• Efeitos visuais</li>
                  <li>• Animações 2D/3D</li>
                </ul>
              </CardContent>
            </Card>

            {/* Live Streaming */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-pink-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Transmissão Ao Vivo</CardTitle>
                <CardDescription className="text-gray-400">
                  Soluções completas para eventos e transmissões em tempo real
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Eventos corporativos</li>
                  <li>• Webinars</li>
                  <li>• Shows e apresentações</li>
                  <li>• Streaming multi-plataforma</li>
                  <li>• Suporte técnico 24/7</li>
                </ul>
              </CardContent>
            </Card>

            {/* Consulting */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-purple-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Consultoria</CardTitle>
                <CardDescription className="text-gray-400">
                  Orientação estratégica para projetos audiovisuais e marketing digital
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Estratégia de conteúdo</li>
                  <li>• Planejamento de produção</li>
                  <li>• Otimização de workflow</li>
                  <li>• Treinamento de equipes</li>
                  <li>• Análise de performance</li>
                </ul>
              </CardContent>
            </Card>

            {/* Equipment Rental */}
            <Card className="bg-gray-800/50 border-gray-700 hover:border-pink-600/50 transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-pink-600 to-pink-800 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-white">Locação de Equipamentos</CardTitle>
                <CardDescription className="text-gray-400">
                  Equipamentos profissionais de última geração para suas produções
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li>• Câmeras profissionais</li>
                  <li>• Equipamentos de áudio</li>
                  <li>• Iluminação</li>
                  <li>• Drones</li>
                  <li>• Suporte técnico incluso</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-600/30">Portfolio</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Nossos Trabalhos</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Conheça alguns dos projetos que desenvolvemos para nossos clientes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Card
                key={item}
                className="bg-gray-800/50 border-gray-700 overflow-hidden group hover:border-purple-600/50 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={`/placeholder.svg?height=300&width=400`}
                    alt={`Projeto ${item}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <Badge className="bg-purple-600/80 text-white">Vídeo Corporativo</Badge>
                  </div>
                  <Button size="icon" className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                    <Play className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2">Projeto Empresa XYZ</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Vídeo institucional desenvolvido para apresentar os valores e serviços da empresa.
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300">
                      Ver mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white"
            >
              Ver Portfolio Completo
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-600/30">Depoimentos</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">O que nossos clientes dizem</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Carlos Silva",
                company: "Tech Innovations",
                text: "A NaCasa Produções superou nossas expectativas. O vídeo institucional ficou incrível e aumentou significativamente nosso engajamento.",
              },
              {
                name: "Ana Costa",
                company: "Marketing Digital Pro",
                text: "Profissionais excepcionais! Entregaram nosso projeto no prazo e com qualidade superior. Recomendo para qualquer empresa.",
              },
              {
                name: "Roberto Santos",
                company: "Eventos Premium",
                text: "Trabalho impecável na transmissão do nosso evento. Equipamentos de primeira e equipe muito competente.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 p-6">
                <CardContent className="p-0">
                  <Quote className="h-8 w-8 text-purple-400 mb-4" />
                  <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mr-4"></div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.name}</p>
                      <p className="text-sm text-gray-400">{testimonial.company}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-600/30">Sobre Nós</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Criatividade e Tecnologia em Harmonia</h2>
              <p className="text-xl text-gray-400 mb-6">
                Somos uma equipe apaixonada por audiovisual, dedicada a transformar ideias em conteúdo impactante e
                memorável.
              </p>
              <p className="text-gray-300 mb-8">
                Com mais de 5 anos de experiência no mercado, já realizamos centenas de projetos para empresas de
                diversos segmentos, sempre priorizando a qualidade, criatividade e satisfação do cliente.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">500+</div>
                  <div className="text-gray-400">Projetos Concluídos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400 mb-2">150+</div>
                  <div className="text-gray-400">Clientes Satisfeitos</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400 mb-2">24/7</div>
                  <div className="text-gray-400">Suporte Disponível</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-pink-400 mb-2">100%</div>
                  <div className="text-gray-400">Projetos Entregues</div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Conhecer Equipe
              </Button>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden">
                <Image
                  src="/placeholder.svg?height=600&width=500"
                  alt="Equipe NaCasa Produções"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600/20 text-purple-300 border-purple-600/30">Contato</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Vamos Conversar</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Entre em contato conosco e vamos discutir como podemos ajudar seu projeto a se tornar realidade
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="bg-gray-800/50 border-gray-700 p-8">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-white text-2xl">Envie uma Mensagem</CardTitle>
                  <CardDescription className="text-gray-400">
                    Preencha o formulário e entraremos em contato em breve
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Nome</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">E-mail</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="seu@email.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Empresa</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Nome da sua empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Tipo de Projeto</label>
                    <select className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option>Selecione o tipo de projeto</option>
                      <option>Vídeo Corporativo</option>
                      <option>Produção de Áudio</option>
                      <option>Transmissão Ao Vivo</option>
                      <option>Pós-Produção</option>
                      <option>Consultoria</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Mensagem</label>
                    <textarea
                      className="w-full min-h-[120px] px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Conte-nos mais sobre seu projeto..."
                    />
                  </div>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Enviar Mensagem
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Informações de Contato</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Endereço</h4>
                      <p className="text-gray-400">
                        Rua das Produções, 123
                        <br />
                        Centro, São Paulo - SP
                        <br />
                        CEP: 01234-567
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">Telefone</h4>
                      <p className="text-gray-400">
                        +55 (11) 9999-8888
                        <br />
                        +55 (11) 3333-4444
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-1">E-mail</h4>
                      <p className="text-gray-400">
                        contato@nacasaproducoes.com.br
                        <br />
                        orcamento@nacasaproducoes.com.br
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 border border-gray-700 p-6 rounded-lg">
                <h4 className="font-semibold text-white mb-4">Horário de Atendimento</h4>
                <div className="space-y-2 text-gray-400">
                  <div className="flex justify-between">
                    <span>Segunda - Sexta:</span>
                    <span>8h às 18h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sábado:</span>
                    <span>9h às 14h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Domingo:</span>
                    <span>Fechado</span>
                  </div>
                  <Separator className="my-3 bg-gray-700" />
                  <div className="flex justify-between text-purple-400">
                    <span>Suporte 24/7:</span>
                    <span>Dashboard</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white">NaCasa</span>
                  <span className="text-purple-400 ml-1">Produções</span>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Transformando ideias em realidade através da produção audiovisual profissional.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-xs text-white">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-xs text-white">@</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-xs text-white">in</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-purple-600 transition-colors cursor-pointer">
                  <span className="text-xs text-white">yt</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Produção de Vídeo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Produção de Áudio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Pós-Produção
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Transmissão Ao Vivo
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Consultoria
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#sobre" className="hover:text-purple-400 transition-colors">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="#portfolio" className="hover:text-purple-400 transition-colors">
                    Portfolio
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Equipe
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-purple-400 transition-colors">
                    Carreiras
                  </Link>
                </li>
                <li>
                  <Link href="#contato" className="hover:text-purple-400 transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Receba novidades e dicas sobre produção audiovisual</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Seu e-mail"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-l-none">
                  Inscrever
                </Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 NaCasa Produções. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
