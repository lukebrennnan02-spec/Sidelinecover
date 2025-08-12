"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function Register() {
  const sp = useSearchParams();
  const startingRole = (sp.get("role") ?? "physio") as "physio"|"club";
  const [role, setRole] = useState<"physio"|"club">(startingRole);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const data = new FormData(form);
    const res = await fetch("/api/register", { method: "POST", body: data });
    setLoading(false);
    if (!res.ok) {
      alert("Registration failed: " + await res.text());
      return;
    }
    alert("Registered! You can now sign in.");
    router.push("/login");
  }

  return (
    <div className="card" style={{maxWidth:720, margin:"2rem auto"}}>
      <h2>Create your account</h2>
      <div style={{display:"flex", gap:8, margin:"0.5rem 0 1rem"}}>
        <button className={"btn " + (role==="physio"?"primary":"")} onClick={()=>setRole("physio")}>Physio</button>
        <button className={"btn " + (role==="club"?"primary":"")} onClick={()=>setRole("club")}>Club</button>
      </div>

      <form onSubmit={submit} className="grid" style={{gap:"0.75rem"}}>
        <input name="role" value={role} hidden readOnly />
        <input required name="name" placeholder="Full name / Contact name" />
        <input required type="email" name="email" placeholder="Email" />
        <input required type="password" name="password" placeholder="Password (min 8 chars)" minLength={8} />
        {role === "physio" ? (
          <div className="grid" style={{gap:"0.5rem"}}>
            <input required name="coruNumber" placeholder="CORU number" />
            <label>Upload Photo ID (PDF or image): <input required type="file" name="idDoc" accept=".pdf,image/*" /></label>
            <label>Upload a selfie/headshot: <input required type="file" name="photo" accept="image/*" /></label>
          </div>
        ) : (
          <div className="grid" style={{gap:"0.5rem"}}>
            <input required name="clubName" placeholder="Club name (e.g., O'Loughlin Gaels)" />
            <input required name="county" placeholder="County (e.g., Kilkenny)" />
            <input required name="phone" placeholder="Club contact phone" />
            <input required type="email" name="officialEmail" placeholder="Official club email" />
          </div>
        )}
        <button disabled={loading} className="btn primary" type="submit">{loading ? "Submitting..." : "Create account"}</button>
      </form>
      <p style={{fontSize:".9rem", color:"#6b7280", marginTop:"0.5rem"}}>
        By creating an account you agree to our Terms and Privacy. Physio accounts require admin verification before accepting jobs.
      </p>
    </div>
  );
}
