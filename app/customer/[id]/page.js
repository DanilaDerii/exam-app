"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CustomerDetail({ params }) {
  const { id } = params;
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/customer/${id}`);
        const data = await res.json();
        setCustomer(data);
        setForm({
          name: data.name || "",
          dateOfBirth: data.dateOfBirth
            ? new Date(data.dateOfBirth).toISOString().slice(0, 10)
            : "",
          memberNumber: data.memberNumber || "",
          interests: data.interests || ""
        });
      } catch {
        setError("Failed to load customer");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function onUpdate(e) {
    e.preventDefault();
    try {
      await fetch(`/api/customer/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dateOfBirth: form.dateOfBirth,
          memberNumber: Number(form.memberNumber),
          interests: form.interests
        })
      });
      router.push("/customer");
    } catch {
      setError("Update failed");
    }
  }

  async function onDelete() {
    if (!confirm("Delete this customer?")) return;
    try {
      await fetch(`/api/customer/${id}`, { method: "DELETE" });
      router.push("/customer");
    } catch {
      setError("Delete failed");
    }
  }

  if (loading) return <p className="p-6">Loading…</p>;

  if (!customer) return <p className="p-6">No customer found</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Customer Detail</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <form onSubmit={onUpdate} className="grid gap-4 max-w-xl p-4 border rounded-xl">
        <div className="grid gap-1">
          <label className="text-sm">Name*</label>
          <input
            className="border rounded p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Date of Birth*</label>
          <input
            type="date"
            className="border rounded p-2"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Member Number*</label>
          <input
            className="border rounded p-2"
            value={form.memberNumber}
            onChange={(e) => setForm({ ...form, memberNumber: e.target.value })}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Interests</label>
          <input
            className="border rounded p-2"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button className="bg-black text-white px-4 py-2 rounded">Update</button>
          <button
            type="button"
            onClick={onDelete}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
