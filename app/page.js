"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();

  function handleFile(file) {
    if (!file || !file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, WebP)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 10MB");
      return;
    }
    setError(null);
    setResult(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }

  async function handleDetect() {
    if (!image) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const res = await fetch("/api/detect", { method: "POST", body: formData });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError("Gagal mendeteksi: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  }

  return (
    <main style={{ background: "#0f0f13", minHeight: "100vh", padding: "36px 24px", fontFamily: "-apple-system, sans-serif" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "460px", margin: "0 auto 36px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "32px", height: "32px", background: "#6366f1", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", color: "#fff", fontSize: "15px" }}>R</div>
          <div>
            <div style={{ fontSize: "15px", fontWeight: "600", color: "#fff" }}>Rayhan<span style={{ color: "#6366f1" }}>.ai</span></div>
            <div style={{ fontSize: "11px", color: "#444" }}>AI Image Detector</div>
          </div>
        </div>
        <div style={{ background: "#1a1a24", border: "1px solid #2a2a3a", borderRadius: "20px", padding: "5px 14px", fontSize: "12px", color: "#555" }}>
          made by <span style={{ color: "#6366f1", fontWeight: "600" }}>Rayhan</span>
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ fontSize: "32px", fontWeight: "700", color: "#fff", marginBottom: "8px" }}>
          Is this image <span style={{ color: "#6366f1" }}>AI?</span>
        </div>
        <div style={{ fontSize: "14px", color: "#555" }}>
          Upload gambar — Rayhan's detector akan menganalisisnya dalam detik
        </div>
      </div>

      <div style={{ background: "#16161f", border: "1px solid #222230", borderRadius: "20px", padding: "24px", maxWidth: "460px", margin: "0 auto" }}>

        {!preview ? (
          <div
            onClick={() => inputRef.current.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            style={{
              border: `1.5px dashed ${dragging ? "#6366f1" : "#2a2a3a"}`,
              borderRadius: "14px",
              padding: "48px 24px",
              textAlign: "center",
              cursor: "pointer",
              background: dragging ? "#1a1a2e" : "transparent",
              transition: "all .2s"
            }}
          >
            <div style={{ width: "48px", height: "48px", background: "#1e1e2e", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "6px" }}>Drag & drop gambar di sini</div>
            <div style={{ fontSize: "12px", color: "#555", marginBottom: "16px" }}>atau klik untuk browse file</div>
            <div style={{ display: "inline-block", background: "#6366f1", color: "#fff", fontSize: "13px", fontWeight: "500", padding: "8px 20px", borderRadius: "8px" }}>Pilih Gambar</div>
            <input ref={inputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
          </div>
        ) : (
          <div>
            <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", background: "#0f0f13", marginBottom: "14px" }}>
              <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: "240px", objectFit: "cover", display: "block" }} />
              <button onClick={handleReset} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(0,0,0,.65)", border: "none", borderRadius: "8px", padding: "4px 10px", color: "#aaa", cursor: "pointer", fontSize: "18px", lineHeight: 1 }}>×</button>
              <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(0,0,0,.65)", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", color: "#888" }}>{image?.name}</div>
            </div>

            {!result && (
              <button
                onClick={handleDetect}
                disabled={loading}
                style={{ width: "100%", padding: "14px", background: loading ? "#3f3f8f" : "#6366f1", color: "#fff", fontSize: "15px", fontWeight: "600", border: "none", borderRadius: "12px", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
              >
                {loading && (
                  <div style={{ width: "16px", height: "16px", border: "2px solid rgba(255,255,255,.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                )}
                {loading ? "Menganalisis..." : "Deteksi Sekarang"}
              </button>
            )}

            {result && (
              <div style={{ borderRadius: "14px", padding: "20px", textAlign: "center", background: result.isAI ? "#1f1018" : "#0f1f14", border: `1px solid ${result.isAI ? "#4a1528" : "#173404"}` }}>
                <div style={{ fontSize: "36px", marginBottom: "8px" }}>{result.isAI ? "🤖" : "📷"}</div>
                <div style={{ fontSize: "20px", fontWeight: "700", color: result.isAI ? "#f472b6" : "#4ade80", marginBottom: "4px" }}>{result.label}</div>
                <div style={{ fontSize: "12px", color: "#555", marginBottom: "12px" }}>
                  Confidence: <span style={{ color: "#aaa", fontWeight: "600" }}>{result.score}%</span>
                </div>
                <div style={{ background: "#1a1a1a", borderRadius: "99px", height: "5px", overflow: "hidden", marginBottom: "14px" }}>
                  <div style={{ height: "5px", borderRadius: "99px", width: `${result.score}%`, background: result.isAI ? "#f472b6" : "#4ade80", transition: "width .8s ease" }} />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ background: "#1a1a24", borderRadius: "10px", padding: "10px" }}>
                    <div style={{ fontSize: "17px", fontWeight: "700", color: "#f472b6" }}>{result.isAI ? result.score : 100 - result.score}%</div>
                    <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>AI Score</div>
                  </div>
                  <div style={{ background: "#1a1a24", borderRadius: "10px", padding: "10px" }}>
                    <div style={{ fontSize: "17px", fontWeight: "700", color: "#4ade80" }}>{result.isAI ? 100 - result.score : result.score}%</div>
                    <div style={{ fontSize: "11px", color: "#444", marginTop: "2px" }}>Real Score</div>
                  </div>
                </div>
                <span onClick={handleReset} style={{ fontSize: "12px", color: "#444", textDecoration: "underline", cursor: "pointer" }}>← Coba gambar lain</span>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ marginTop: "14px", padding: "12px", background: "#1f1018", border: "1px solid #4a1528", borderRadius: "10px", color: "#f472b6", fontSize: "13px", textAlign: "center" }}>
            {error}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "24px", fontSize: "12px", color: "#2a2a3a" }}>
        Rayhan's AI Detector · Powered by Sightengine · <span style={{ color: "#6366f1" }}>© Rayhan 2025</span>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}