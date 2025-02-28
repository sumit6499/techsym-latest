export interface Student {
    id: number
    name: string
    email: string
    eventName: string
    registrationDate: string
    isPaid: boolean
    paymentMethod?: string
  }
  
  export interface Event {
    id: string
    title: string
    description: string
    time: string
    location: string
    category: string
    date: string
    name?: string | undefined
    image:string
    registrationCount?: number
  }
  
  