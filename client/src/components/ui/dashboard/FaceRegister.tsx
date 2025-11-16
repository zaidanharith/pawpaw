import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { useSession } from "next-auth/react";

const MODEL_URL = "/models";

const roleColors: Record<string, string> = {
  ADMIN: "#3f9065",
  TEACHER: "#f5bb00",
  PARENT: "#58baab",
};

export default function FaceRegister() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const { data: session } = useSession();
  const userId = session?.user?.id;
  const token = session?.accessToken;
  const role = session?.user?.role || "ADMIN";
  const accentColor = roleColors[role] || roleColors.ADMIN;
  const textColor = role === "ADMIN" ? "#FFFFFF" : "#282828";

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        setMessage("Memuat model Face Recognition...");
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

        setMessage("Memulai kamera...");
        setLoading(false);

        await new Promise(resolve => setTimeout(resolve, 100));

        if (navigator.mediaDevices && videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 320, height: 240 }
          });
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setMessage("Kamera siap!");
          };
        } else {
          setMessage("Browser tidak mendukung kamera");
        }
      } catch (err) {
        console.error("Error:", err);
        setMessage("Error: " + (err as Error).message);
        setLoading(false);
      }
    };

    loadModelsAndStartVideo();

    const videoEl = videoRef.current;
    return () => {
      if (videoEl?.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleRegister = async () => {
    setMessage("Mendeteksi wajah...");
    if (!videoRef.current) return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptor();

    if (!detection) {
      setMessage("Wajah tidak terdeteksi, coba lagi.");
      return;
    }

    setMessage("Mendaftarkan wajah...");

    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    try {
      const descriptor = Array.from(detection.descriptor);
      const res = await fetch(`${API_URL}/auth/register-face`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userId, descriptor }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setMessage("Wajah berhasil didaftarkan!");
      } else {
        setMessage(json.message || "Gagal mendaftarkan wajah.");
        console.error("Register face error:", json);
      }
    } catch {
      setMessage("Gagal mendaftarkan wajah.");
    }
  };

  return (
    <section className="rounded-xl shadow p-7 w-full">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-2xl font-bold">Daftarkan Wajah Anda</h2>
        <p className="text-center mt-2" style={{ color: message.includes("Error") ? "red" : (success ? "green" : "#282828") }}>
          {message}
        </p>
        {loading ? (
          <p>Loading model...</p>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              width={320}
              height={240}
              className="mt-3 rounded-xl border border-gray-300"
            />
            <br />
            <button
              className="font-bold px-4 py-2 rounded-lg mt-2"
              style={{
                backgroundColor: accentColor,
                color: textColor,
                cursor: success ? "not-allowed" : "pointer"
              }}
              onClick={handleRegister}
              disabled={success}
            >
              {success ? "Wajah Sudah Terdaftar" : "Daftarkan Wajah"}
            </button>
          </>
        )}
      </div>
    </section>
  );
}