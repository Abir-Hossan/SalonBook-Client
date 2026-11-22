"use client";
import Link from "next/link";
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){
 return <main className="system-page"><span className="system-mark">✳</span><p className="eyebrow">A MOMENTARY PAUSE</p><h1>Something needs a moment.</h1><p>We couldn’t prepare this page just now. Please try again.</p><div className="button-row"><button className="button button-dark" onClick={reset}>Try again</button><Link className="button button-outline" href="/">Return home</Link></div></main>;
}
