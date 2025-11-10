export async function faceLogin(descriptor: number[]) {
  const res = await fetch("/api/auth/face-login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ descriptor }),
  });
  return res.json();
}