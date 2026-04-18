import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ error: "Tidak ada gambar" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const sightengineForm = new FormData();
    sightengineForm.append("models", "genai");
    sightengineForm.append("api_user", process.env.SIGHTENGINE_USER);
    sightengineForm.append("api_secret", process.env.SIGHTENGINE_SECRET);
    sightengineForm.append(
      "media",
      new Blob([buffer], { type: file.type }),
      file.name || "image.jpg"
    );

    const response = await fetch("https://api.sightengine.com/1.0/check.json", {
      method: "POST",
      body: sightengineForm,
    });

    const result = await response.json();

    console.log("Sightengine response:", JSON.stringify(result));

    if (result.status !== "success") {
      return NextResponse.json({ error: "API error", detail: result }, { status: 500 });
    }

    const aiScore = result.type?.ai_generated ?? 0;

    return NextResponse.json({
      isAI: aiScore > 0.5,
      score: Math.round(aiScore * 100),
      label: aiScore > 0.5 ? "AI Generated" : "Foto Asli",
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}