import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X } from "lucide-react";

import AuthGuard from "../components/AuthGuard";
import Navbar from "../components/Navbar";
import AnimatedFooter from "../components/AnimatedFooter";

import { useSweets } from "../context/SweetsContext";

import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Badge } from "../components/ui/badge";

/* ================= Admin Page ================= */

export default function Admin() {
  return (
    <AuthGuard requireAdmin>
      <div className="min-h-screen bg-background">
        <Navbar />
        <AdminContent />
        <AnimatedFooter />
      </div>
    </AuthGuard>
  );
}

/* ================= Main Content ================= */

function AdminContent() {
  const { sweets } = useSweets();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <main className="container mx-auto px-4 py-8">
      <Header onAdd={() => setShowAddForm(true)} />

      {showAddForm && <AddSweetCard onClose={() => setShowAddForm(false)} />}

      <SweetGrid sweets={sweets} />
    </main>
  );
}

/* ================= Header ================= */

function Header({ onAdd }) {
  return (
    <div className="mb-8 flex items-center justify-between">
      <div>
        <h1 className="mb-2 text-4xl font-bold">
          Admin{" "}
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Panel
          </span>
        </h1>
        <p className="text-muted-foreground">Manage your sweet inventory</p>
      </div>

      <Button
        onClick={onAdd}
        className="bg-gradient-to-r from-pink-500 to-purple-600"
      >
        <Plus className="mr-2 h-4 w-4" />
        Add Sweet
      </Button>
    </div>
  );
}

/* ================= Add Sweet ================= */

function AddSweetCard({ onClose }) {
  const { addSweet } = useSweets();

  const [form, setForm] = useState({
    name: "",
    image: "",
    price: "",
    quantity: "",
    category: "",
    description: "",
  });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    addSweet({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
    onClose();
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Add New Sweet</CardTitle>
        <CardDescription>Enter details to add a sweet</CardDescription>
      </CardHeader>

      <SweetForm
        form={form}
        onChange={update}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Card>
  );
}

/* ================= Form ================= */

function SweetForm({ form, onChange, onSave, onCancel }) {
  return (
    <>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {[
          ["name", "Name"],
          ["category", "Category"],
          ["price", "Price"],
          ["quantity", "Quantity"],
          ["image", "Image URL"],
          ["description", "Description"],
        ].map(([key, label]) => (
          <div key={key} className="space-y-1 md:col-span-1">
            <Label>{label}</Label>
            <Input
              value={form[key]}
              onChange={(e) => onChange(key, e.target.value)}
            />
          </div>
        ))}
      </CardContent>

      <CardFooter className="gap-2">
        <Button onClick={onSave}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>
        <Button variant="outline" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
      </CardFooter>
    </>
  );
}

/* ================= Grid ================= */

function SweetGrid({ sweets }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {sweets.map((sweet) => (
        <SweetCard key={sweet.id} sweet={sweet} />
      ))}
    </div>
  );
}

/* ================= Card ================= */

function SweetCard({ sweet }) {
  const { updateSweet, deleteSweet } = useSweets();
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({ ...sweet });

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    updateSweet(sweet.id, {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
    setEditing(false);
  }

  function handleDelete() {
    if (window.confirm("Delete this sweet?")) {
      deleteSweet(sweet.id);
    }
  }

  return editing ? (
    <SweetEditCard
      form={form}
      onChange={update}
      onSave={handleSave}
      onCancel={() => setEditing(false)}
    />
  ) : (
    <SweetViewCard
      sweet={sweet}
      onEdit={() => setEditing(true)}
      onDelete={handleDelete}
    />
  );
}

/* ================= View Card ================= */

function SweetViewCard({ sweet, onEdit, onDelete }) {
  return (
    <Card>
      <img
        src={sweet.image || "/placeholder.svg"}
        alt={sweet.name}
        className="aspect-square object-cover"
      />

      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{sweet.name}</CardTitle>
            <CardDescription>{sweet.category}</CardDescription>
          </div>
          <Badge>{sweet.quantity > 0 ? "In Stock" : "Out of Stock"}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{sweet.description}</p>
        <p className="mt-2 text-xl font-bold text-pink-600">₹{sweet.price}</p>
      </CardContent>

      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

/* ================= Edit Card ================= */

function SweetEditCard({ form, onChange, onSave, onCancel }) {
  return (
    <Card>
      <SweetForm
        form={form}
        onChange={onChange}
        onSave={onSave}
        onCancel={onCancel}
      />
    </Card>
  );
}
