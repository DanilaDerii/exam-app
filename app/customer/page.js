"use client";

import { useEffect, useState } from "react";

export default function CustomerListPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    dateOfBirth: "",
    memberNumber: "",
    interests: ""
  });
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customer", { cache: "no-store" });
      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e) {
    e.preventDefault();
    setError("");
    // basic validation
    if (!form.name || !form.dateOfBirth || !form.memberNumber) {
      setError("name, dateOfBirth, memberNumber are required");
      return;
    }
    try {
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dateOfBirth: form.dateOfBirth, // ISO date string
          memberNumber: Number(form.memberNumber),
          interests: form.interests
        })
      });
      if (!res.ok) throw new Error("create failed");
      setForm({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
      await load();
    } catch {
      setError("Failed to add customer");
    }
  }

  async function onDelete(id) {
    if (!confirm("Delete this customer?")) return;
    try {
      await fetch(`/api/customer/${id}`, { method: "DELETE" });
      await load();
    } catch {
      setError("Failed to delete");
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Customers</h1>

      {/* Add form */}
      <form onSubmit={onAdd} className="grid gap-4 max-w-xl p-4 border rounded-xl">
        <div className="grid gap-1">
          <label className="text-sm">Name*</label>
          <input
            className="border rounded p-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Date of Birth* (YYYY-MM-DD)</label>
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
            placeholder="1"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm">Interests</label>
          <input
            className="border rounded p-2"
            value={form.interests}
            onChange={(e) => setForm({ ...form, interests: e.target.value })}
            placeholder="movies, football, gym"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button className="bg-black text-white px-4 py-2 rounded">Add Customer</button>
      </form>

      {/* List */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">All Customers</h2>
        {loading ? (
          <p>Loading…</p>
        ) : customers.length === 0 ? (
          <p>No customers yet</p>
        ) : (
          <ul className="divide-y">
            {customers.map((c) => (
              <li key={c._id} className="py-3 flex items-center justify-between">
                <div className="space-y-1">
                  <a href={`/customer/${c._id}`} className="font-medium underline">
                    {c.name}
                  </a>
                  <div className="text-sm text-gray-600">
                    DOB: {c.dateOfBirth ? new Date(c.dateOfBirth).toISOString().slice(0, 10) : "-"} • #
                    {c.memberNumber} • {c.interests || "-"}
                  </div>
                </div>
                <button
                  onClick={() => onDelete(c._id)}
                  className="text-red-600 border border-red-600 px-3 py-1 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
