"use client";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Check, ChevronDown, Search, X, Eye, EyeOff, LockKeyhole } from "lucide-react";
export function SearchInput({value,onChange,placeholder="Search"}:{value:string;onChange:(v:string)=>void;placeholder?:string}){
 return <label className="search-input"><Search size={16}/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/>{value&&<button type="button" onClick={()=>onChange("")} aria-label="Clear search"><X size={14}/></button>}</label>
}
export function ConfirmButton({label,confirmTitle,confirmText,onConfirm,variant="outline"}:{label:string;confirmTitle:string;confirmText:string;onConfirm:()=>void|boolean;variant?:"outline"|"danger"|"dark"}){
 const [confirming,setConfirming]=useState(false);
 if(confirming)return <span className="confirm-inline"><span>{confirmTitle}</span><button className="button button-danger button-xs" onClick={()=>{const result=onConfirm();setConfirming(false);if(result!==false)toast.success("Action completed in preview mode.")}}>Confirm</button><button className="button button-quiet button-xs" onClick={()=>setConfirming(false)}>Keep</button><small>{confirmText}</small></span>;
 return <button className={`button button-${variant} button-xs`} onClick={()=>setConfirming(true)}>{label}</button>
}
export function DemoForm({title,submitLabel="Continue",children}:{title:string;submitLabel?:string;children:ReactNode}){
 const [busy,setBusy]=useState(false);
 return <form className="form-stack" onSubmit={e=>{e.preventDefault();setBusy(true);setTimeout(()=>{setBusy(false);toast.success("Preview submitted successfully. No data was saved.");},650);}}>
  {children}<button className="button button-dark button-full" disabled={busy}>{busy?"Please wait…":submitLabel}<Check size={15}/></button><p className="form-disclaimer">{title} · Demonstration only. No account or payment is created.</p>
 </form>
}
export function SelectField({label,options}:{label:string;options:string[]}){
 return <label className="field"><span>{label}</span><span className="select-wrap"><select defaultValue={options[0]}>{options.map(o=><option key={o}>{o}</option>)}</select><ChevronDown size={15}/></span></label>
}

export function PasswordField({placeholder="Enter your password",required=true,minLength=6,pattern,id,autoComplete,onChange}:{placeholder?:string;required?:boolean;minLength?:number;pattern?:string;id?:string;autoComplete?:string;onChange?:(value:string)=>void}){
 const [visible,setVisible]=useState(false);
 return <span className="input-icon"><LockKeyhole size={15}/><input id={id} autoComplete={autoComplete} onChange={event=>onChange?.(event.target.value)} type={visible?"text":"password"} placeholder={placeholder} minLength={minLength} pattern={pattern} required={required}/><button type="button" className="password-toggle" aria-label={visible?"Hide password":"Show password"} onClick={()=>setVisible(!visible)}>{visible?<EyeOff size={15}/>:<Eye size={15}/>}</button></span>;
}
