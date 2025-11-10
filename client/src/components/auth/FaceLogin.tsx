import React, { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

export default function FaceLogin() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadModelsAndStartVideo = async () => {
      try {
        setMessage("Loading face recognition models...");
        
        // Load models
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        setMessage("Starting camera...");
        setLoading(false);
        
        // Tunggu sedikit agar video element ter-render
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Start camera
        if (navigator.mediaDevices && videoRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 320, height: 240 } 
          });
          videoRef.current.srcObject = stream;
          
          // Pastikan video playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setMessage("Camera ready!");
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
    
    // Cleanup: stop camera saat component unmount
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleLogin = async () => {
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

    setMessage("Memverifikasi...");
    // Lanjutkan dengan verifikasi...
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login dengan Face Recognition</h2>
      <p style={{ color: message.includes("Error") ? "red" : "blue" }}>
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
            style={{ border: "1px solid #ccc", display: "block" }}
          />
          <br />
          <button onClick={handleLogin}>Login dengan Wajah</button>
        </>
      )}
    </div>
  );
}