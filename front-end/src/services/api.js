export async function getMessage() {
  const res = await fetch("/api/");   // proxied to http://127.0.0.1:8000/
  return await res.json();
}
