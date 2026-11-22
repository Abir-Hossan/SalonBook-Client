import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import type { Service } from "@/types";
import { money } from "@/lib/utils";
export function ServiceCard({service,index=0}:{service:Service;index?:number}){
 return <article className="service-card"><Link href={`/services/${service.id}`} className="service-image-wrap"><Image src={service.image} alt={service.serviceName} fill sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 33vw" className="service-image"/><span className="image-index">0{index+1}</span><span className="image-arrow"><ArrowUpRight size={18}/></span></Link><div className="service-card-body"><div className="service-meta"><span>{service.category}</span><span><Clock3 size={13}/>{service.duration} min</span></div><Link href={`/services/${service.id}`}><h3>{service.serviceName}</h3></Link><p>{service.description}</p><div className="service-card-bottom"><strong>{money(service.price)}</strong><Link href={`/services/${service.id}`}>Discover <ArrowUpRight size={14}/></Link></div></div></article>
}
