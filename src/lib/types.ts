
type Team ={
  name:string,
  email:string
}
export interface Student {
    id: number
    name: string
    email: string
    events: string
    registrationDate: string
    isPaid: boolean
    paymentMethod?: string
    paymentImage: string,
    teamMembers: Team[]
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
  
  