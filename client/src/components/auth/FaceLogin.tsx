import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import { signIn } from "next-auth/react";

const MODEL_URL = "/models";

export default function FaceLogin() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let detectInterval: NodeJS.Timeout | null = null;

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

            detectInterval = setInterval(async () => {
              if (!videoRef.current) return;
              const detection = await faceapi
                .detectSingleFace(videoRef.current)
                .withFaceLandmarks()
                .withFaceDescriptor();

              if (detection) {
                setMessage("Wajah terdeteksi, memverifikasi...");
                clearInterval(detectInterval!);

                const API_URL = process.env.NEXT_PUBLIC_API_URL;
                try {
                  const descriptor = Array.from(detection.descriptor);
                  const res = await fetch(`${API_URL}/auth/face-login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ descriptor }),
                  });
                  const json = await res.json();
                  if (json.success && json.token) {
                    await signIn("credentials", {
                      redirect: true,
                      callbackUrl: "/dashboard",
                      faceToken: json.token
                    });
                  } else {
                    setMessage(json.message || "Login gagal, wajah tidak dikenali.");
                  }
                } catch {
                  setMessage("Terjadi kesalahan saat login.");
                }
              }
            }, 500); 
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
      if (detectInterval) clearInterval(detectInterval);
    };
  }, []);

  return (
    <section className="bg-white rounded-xl shadow p-7 w-full">
      <div className="flex flex-col items-center">
        <h2 className="text-center text-2xl font-bold">Login dengan Face Recognition</h2>
        <p className="text-center mt-2" style={{ color: message.includes("Error") ? "red" : "blue" }}>
          {message}
        </p>
        {loading ? (
          <p>Memuat model...</p>
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
          </>
        )}
      </div>
    </section>
  );
}