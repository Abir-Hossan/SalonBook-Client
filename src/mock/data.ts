import type { Appointment, Customer, Service, Transaction } from "@/types";

export const services: Service[] = [
  { id:"svc-01",serviceName:"The Couture Signature Blowout & Sculpt",category:"Haircut & Styling",description:"A bespoke precision blow-dry infused with rare botanical serum, silk smoothing ritual, and a beautifully sculpted finish.",price:165,duration:60,image:"/images/service-blowout.png",status:"active",featured:true },
  { id:"svc-02",serviceName:"Dimensional French Balayage & Silk Gloss",category:"Hair Coloring",description:"Hand-painted tonal highlights sculpted to natural movement, sealed with a customised gloss and restorative bond therapy.",price:390,duration:180,image:"/images/service-balayage.png",status:"active",featured:true },
  { id:"svc-03",serviceName:"Japanese Botanical Scalp Detox & Hydro Spa",category:"Hair Treatment",description:"A restorative head ritual with acupressure massage, gentle scalp care, warm botanical oils and deep fibre conditioning.",price:240,duration:90,image:"/images/service-head-spa.png",status:"active",featured:true },
  { id:"svc-04",serviceName:"Cellular Radiance HydraFacial & Rose Quartz Sculpt",category:"Facial & Skincare",description:"Deep vortex vacuum pore purification, customised peptide infusion and a calming rose quartz sculpting ritual.",price:295,duration:75,image:"/images/service-facial.png",status:"active",featured:true },
  { id:"svc-05",serviceName:"Editorial Haute Glam & Micro-Arch Symmetry",category:"Editorial Makeup",description:"A luminous editorial complexion, tailored makeup artistry and delicate detail for a polished, camera-ready finish.",price:210,duration:75,image:"/images/service-makeup.png",status:"active",featured:true },
  { id:"svc-06",serviceName:"Cashmere Restorative Gel Manicure & Hand Therapy",category:"Manicure & Pedicure",description:"Warm linen wrap, apricot kernel cuticle recovery and gentle enzymatic exfoliation for beautifully cared-for hands.",price:120,duration:60,image:"/images/service-manicure.png",status:"active",featured:true },
  { id:"svc-07",serviceName:"Precision Brow Design",category:"Editorial Makeup",description:"A tailored brow shaping and finishing experience for a balanced, natural result.",price:55,duration:35,image:"/images/service-makeup.png",status:"active" },
  { id:"svc-08",serviceName:"Deep Conditioning Ceremony",category:"Hair Treatment",description:"A deeply conditioning treatment to restore softness, shine and manageability.",price:88,duration:50,image:"/images/service-head-spa.png",status:"active" },
  { id:"svc-09",serviceName:"Classic Manicure",category:"Manicure & Pedicure",description:"A timeless manicure with careful shaping, cuticle care and a refined finish.",price:52,duration:45,image:"/images/service-manicure.png",status:"inactive" },
];

export const appointments: Appointment[] = [
  {id:"APT-1048",serviceId:"svc-02",customerName:"Olivia Bennett",customerEmail:"olivia@example.com",serviceName:"Dimensional French Balayage & Silk Gloss",serviceImage:"/images/service-balayage.png",appointmentDate:"2026-11-22",timeSlot:"10:30 AM",servicePrice:390,status:"confirmed",paymentStatus:"unpaid",createdAt:"2026-11-16"},
  {id:"APT-1047",serviceId:"svc-04",customerName:"Amelia Carter",customerEmail:"amelia@example.com",serviceName:"Cellular Radiance HydraFacial & Rose Quartz Sculpt",serviceImage:"/images/service-facial.png",appointmentDate:"2026-11-22",timeSlot:"01:00 PM",servicePrice:295,status:"pending",paymentStatus:"unpaid",createdAt:"2026-11-17"},
  {id:"APT-1046",serviceId:"svc-06",customerName:"Sophia Williams",customerEmail:"sophia@example.com",serviceName:"Cashmere Restorative Gel Manicure & Hand Therapy",serviceImage:"/images/service-manicure.png",appointmentDate:"2026-11-21",timeSlot:"11:00 AM",servicePrice:120,status:"confirmed",paymentStatus:"paid",createdAt:"2026-11-15"},
  {id:"APT-1045",serviceId:"svc-01",customerName:"Isabella James",customerEmail:"isabella@example.com",serviceName:"The Couture Signature Blowout & Sculpt",serviceImage:"/images/service-blowout.png",appointmentDate:"2026-11-20",timeSlot:"03:30 PM",servicePrice:165,status:"cancelled",paymentStatus:"unpaid",createdAt:"2026-11-13"},
  {id:"APT-1044",serviceId:"svc-03",customerName:"Charlotte Reed",customerEmail:"charlotte@example.com",serviceName:"Japanese Botanical Scalp Detox & Hydro Spa",serviceImage:"/images/service-head-spa.png",appointmentDate:"2026-11-24",timeSlot:"09:30 AM",servicePrice:240,status:"pending",paymentStatus:"unpaid",createdAt:"2026-11-18"},
];

export const customers: Customer[] = [
  {id:"CUS-001",name:"Olivia Bennett",email:"olivia@example.com",image:"/images/service-blowout.png",joined:"2026-04-12",appointments:8,status:"active"},
  {id:"CUS-002",name:"Amelia Carter",email:"amelia@example.com",image:"/images/service-balayage.png",joined:"2026-05-03",appointments:5,status:"active"},
  {id:"CUS-003",name:"Sophia Williams",email:"sophia@example.com",image:"/images/salon-reception.png",joined:"2026-06-19",appointments:12,status:"active"},
  {id:"CUS-004",name:"Isabella James",email:"isabella@example.com",image:"/images/salon-interior-original.png",joined:"2026-08-01",appointments:2,status:"blocked"},
  {id:"CUS-005",name:"Charlotte Reed",email:"charlotte@example.com",image:"/images/service-facial.png",joined:"2026-09-15",appointments:4,status:"active"},
];

export const transactions: Transaction[] = [
  {id:"TXN-2048",customerName:"Sophia Williams",serviceName:"Cashmere Restorative Gel Manicure & Hand Therapy",appointmentDate:"2026-11-21",amount:120,currency:"USD",status:"paid",method:"Visa •••• 4242",createdAt:"2026-11-15"},
  {id:"TXN-2047",customerName:"Olivia Bennett",serviceName:"Dimensional French Balayage",appointmentDate:"2026-11-22",amount:390,currency:"USD",status:"pending",method:"Checkout pending",createdAt:"2026-11-16"},
  {id:"TXN-2046",customerName:"Amelia Carter",serviceName:"Cellular Radiance HydraFacial & Rose Quartz Sculpt",appointmentDate:"2026-11-22",amount:295,currency:"USD",status:"pending",method:"Checkout pending",createdAt:"2026-11-17"},
  {id:"TXN-2045",customerName:"Charlotte Reed",serviceName:"Japanese Botanical Scalp Detox & Hydro Spa",appointmentDate:"2026-11-18",amount:240,currency:"USD",status:"failed",method:"Card declined",createdAt:"2026-11-12"},
];
export const currentCustomer = customers[0];
export const currentAdmin = {name:"Eleanor Whitmore",email:"admin@salonbook.demo",image:"/images/service-balayage.png"};
