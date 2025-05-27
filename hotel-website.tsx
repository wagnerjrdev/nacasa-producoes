"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarDays,
  Users,
  Wifi,
  Car,
  Utensils,
  Waves,
  Dumbbell,
  Coffee,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Bed,
  Bath,
  Maximize,
  Menu,
  X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

export default function Component() {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Hotel Paraíso</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">
                Início
              </Link>
              <Link href="#quartos" className="text-gray-700 hover:text-blue-600 transition-colors">
                Quartos
              </Link>
              <Link href="#amenidades" className="text-gray-700 hover:text-blue-600 transition-colors">
                Amenidades
              </Link>
              <Link href="#galeria" className="text-gray-700 hover:text-blue-600 transition-colors">
                Galeria
              </Link>
              <Link href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contato
              </Link>
              <Button>Reservar Agora</Button>
            </nav>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <nav className="flex flex-col space-y-4">
                <Link href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Início
                </Link>
                <Link href="#quartos" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Quartos
                </Link>
                <Link href="#amenidades" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Amenidades
                </Link>
                <Link href="#galeria" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Galeria
                </Link>
                <Link href="#contato" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contato
                </Link>
                <Button className="w-full">Reservar Agora</Button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Hotel Paraíso"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">Bem-vindo ao Hotel Paraíso</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Experimente o luxo e conforto em um ambiente paradisíaco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Fazer Reserva
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3"
            >
              Ver Quartos
            </Button>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Card className="max-w-6xl mx-auto shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Faça sua Reserva</CardTitle>
              <CardDescription className="text-lg">Reserve agora e garante as melhores tarifas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkin">Check-in</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="checkout">Check-out</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guests">Hóspedes</Label>
                  <Select>
                    <SelectTrigger>
                      <Users className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Hóspede</SelectItem>
                      <SelectItem value="2">2 Hóspedes</SelectItem>
                      <SelectItem value="3">3 Hóspedes</SelectItem>
                      <SelectItem value="4">4 Hóspedes</SelectItem>
                      <SelectItem value="5">5+ Hóspedes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rooms">Quartos</Label>
                  <Select>
                    <SelectTrigger>
                      <Bed className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Selecionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Quarto</SelectItem>
                      <SelectItem value="2">2 Quartos</SelectItem>
                      <SelectItem value="3">3 Quartos</SelectItem>
                      <SelectItem value="4">4+ Quartos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Buscar Quartos</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Rooms Section */}
      <section id="quartos" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Nossos Quartos</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha entre nossas acomodações luxuosas, cada uma projetada para proporcionar máximo conforto
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Standard Room */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Quarto Standard"
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-green-600">Disponível</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Quarto Standard</h3>
                    <p className="text-gray-600">Vista para o jardim</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">R$ 280</p>
                    <p className="text-sm text-gray-500">por noite</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>1 Cama Queen</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>1 Banheiro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>25m²</span>
                  </div>
                </div>

                <ul className="text-sm text-gray-600 mb-6 space-y-1">
                  <li>• Wi-Fi gratuito</li>
                  <li>• Ar condicionado</li>
                  <li>• TV a cabo</li>
                  <li>• Frigobar</li>
                </ul>

                <Button className="w-full">Reservar Agora</Button>
              </CardContent>
            </Card>

            {/* Deluxe Room */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image src="/placeholder.svg?height=400&width=600" alt="Quarto Deluxe" fill className="object-cover" />
                <Badge className="absolute top-4 left-4 bg-blue-600">Mais Popular</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Quarto Deluxe</h3>
                    <p className="text-gray-600">Vista para o mar</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">R$ 450</p>
                    <p className="text-sm text-gray-500">por noite</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>1 Cama King</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>1 Banheiro</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>35m²</span>
                  </div>
                </div>

                <ul className="text-sm text-gray-600 mb-6 space-y-1">
                  <li>• Wi-Fi gratuito</li>
                  <li>• Varanda privativa</li>
                  <li>• Banheira de hidromassagem</li>
                  <li>• Serviço de quarto 24h</li>
                </ul>

                <Button className="w-full">Reservar Agora</Button>
              </CardContent>
            </Card>

            {/* Suite */}
            <Card className="overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative h-64">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Suíte Presidencial"
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-purple-600">Luxo</Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">Suíte Presidencial</h3>
                    <p className="text-gray-600">Vista panorâmica</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">R$ 850</p>
                    <p className="text-sm text-gray-500">por noite</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span>1 Cama King</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span>2 Banheiros</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span>65m²</span>
                  </div>
                </div>

                <ul className="text-sm text-gray-600 mb-6 space-y-1">
                  <li>• Sala de estar separada</li>
                  <li>• Jacuzzi privativa</li>
                  <li>• Butler service</li>
                  <li>• Terraço privativo</li>
                </ul>

                <Button className="w-full">Reservar Agora</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section id="amenidades" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Amenidades</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Desfrute de nossas instalações de classe mundial</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wifi className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Wi-Fi Gratuito</h3>
              <p className="text-gray-600">Internet de alta velocidade em todo o hotel</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Waves className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Piscina</h3>
              <p className="text-gray-600">Piscina aquecida com vista para o mar</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Academia</h3>
              <p className="text-gray-600">Equipamentos modernos disponíveis 24h</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Restaurante</h3>
              <p className="text-gray-600">Culinária internacional e local</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Car className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Estacionamento</h3>
              <p className="text-gray-600">Valet parking gratuito para hóspedes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coffee className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Spa & Wellness</h3>
              <p className="text-gray-600">Tratamentos relaxantes e revigorantes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Recepção 24h</h3>
              <p className="text-gray-600">Atendimento disponível a qualquer hora</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Room Service</h3>
              <p className="text-gray-600">Serviço de quarto 24 horas</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="galeria" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Galeria</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Conheça nossos espaços através de imagens</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Lobby do hotel"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Piscina"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Restaurante"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Quarto deluxe"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Spa"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 overflow-hidden rounded-lg">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Vista do mar"
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">O que nossos hóspedes dizem</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Experiências reais de quem já se hospedou conosco</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Experiência incrível! O atendimento foi excepcional e as instalações são de primeira qualidade.
                Voltarei com certeza!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Maria Silva</p>
                  <p className="text-sm text-gray-500">São Paulo, SP</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Hotel maravilhoso com vista espetacular. Os quartos são confortáveis e o café da manhã é delicioso.
                Recomendo!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">João Santos</p>
                  <p className="text-sm text-gray-500">Rio de Janeiro, RJ</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Perfeito para lua de mel! Ambiente romântico, serviço impecável e localização privilegiada. Superou
                nossas expectativas!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div>
                  <p className="font-semibold">Ana Costa</p>
                  <p className="text-sm text-gray-500">Belo Horizonte, MG</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Estamos aqui para ajudar você a planejar sua estadia perfeita
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="p-8">
                <CardHeader>
                  <CardTitle>Envie uma Mensagem</CardTitle>
                  <CardDescription>Preencha o formulário e entraremos em contato em breve</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome</Label>
                      <Input id="name" placeholder="Seu nome completo" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" placeholder="seu@email.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input id="phone" placeholder="(11) 99999-9999" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem</Label>
                    <textarea
                      id="message"
                      className="w-full min-h-[120px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Como podemos ajudá-lo?"
                    />
                  </div>
                  <Button className="w-full">Enviar Mensagem</Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Informações de Contato</h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Endereço</h4>
                      <p className="text-gray-600">
                        Av. Atlântica, 1500
                        <br />
                        Copacabana, Rio de Janeiro - RJ
                        <br />
                        CEP: 22021-000
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Telefone</h4>
                      <p className="text-gray-600">
                        +55 (21) 3333-4444
                        <br />
                        +55 (21) 99999-8888
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">E-mail</h4>
                      <p className="text-gray-600">
                        reservas@hotelparaiso.com.br
                        <br />
                        contato@hotelparaiso.com.br
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Horário de Atendimento</h4>
                      <p className="text-gray-600">
                        24 horas por dia
                        <br />7 dias por semana
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Localização</h4>
                <div className="w-full h-64 bg-gray-300 rounded-lg flex items-center justify-center">
                  <p className="text-gray-600">Mapa interativo aqui</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-xl font-bold">Hotel Paraíso</span>
              </div>
              <p className="text-gray-400 mb-4">
                Experimente o luxo e conforto em um ambiente paradisíaco no coração do Rio de Janeiro.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">@</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#inicio" className="hover:text-white transition-colors">
                    Início
                  </Link>
                </li>
                <li>
                  <Link href="#quartos" className="hover:text-white transition-colors">
                    Quartos
                  </Link>
                </li>
                <li>
                  <Link href="#amenidades" className="hover:text-white transition-colors">
                    Amenidades
                  </Link>
                </li>
                <li>
                  <Link href="#galeria" className="hover:text-white transition-colors">
                    Galeria
                  </Link>
                </li>
                <li>
                  <Link href="#contato" className="hover:text-white transition-colors">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Reservas Online</li>
                <li>Concierge</li>
                <li>Room Service</li>
                <li>Spa & Wellness</li>
                <li>Eventos Corporativos</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">Receba ofertas especiais e novidades do hotel</p>
              <div className="flex">
                <Input placeholder="Seu e-mail" className="bg-gray-800 border-gray-700 text-white" />
                <Button className="ml-2">Inscrever</Button>
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2024 Hotel Paraíso. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Política de Cancelamento
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
