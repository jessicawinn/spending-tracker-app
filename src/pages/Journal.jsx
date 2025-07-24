import { useEffect, useState } from "react";
import spendingData from "../spending_data.json";

export default function Journal() {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
  });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem("spendingRecords")) || [];
    setRecords(storedRecords);

    const storedCategories = JSON.parse(localStorage.getItem("spendingCategories")) || [];
    if (storedCategories.length > 0) {
      setCategories(storedCategories);
    } else {
      const formatted = spendingData.map((item) => ({
        id: String(item.spending_id),
        name: item.category,
        description: item.description,
      }));
      setCategories(formatted);
      localStorage.setItem("spendingCategories", JSON.stringify(formatted));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.amount) return;

    const newRecord = {
      id: crypto.randomUUID(),
      date: formData.date,
      category: formData.category,
      amount: parseFloat(formData.amount),
    };

    const updated = [...records, newRecord];
    setRecords(updated);
    localStorage.setItem("spendingRecords", JSON.stringify(updated));

    setFormData({
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: "",
    });
  };
  
  const handleRemoveRecord = (id) => {
      const filtered = records.filter((rec) => rec.id !== id);
      setRecords(filtered);
      localStorage.setItem("spendingRecords", JSON.stringify(filtered));
    };

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed) return;

    if (categories.some((c) => c.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Category already exists!");
      return;
    }

    const maxId = categories.reduce((max, c) => {
      const num = Number(c.id);
      return num > max ? num : max;
    }, 0);

    const newCat = {
      id: String(maxId + 1),
      name: trimmed,
      description: "",
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem("spendingCategories", JSON.stringify(updated));
    setNewCategory("");

  

  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-900">Journal Page</h1>
      <p className="mb-12 text-gray-600 max-w-xl">
        Record your spending and manage your expenses with ease.
      </p>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left column: Form and Add Category */}
        <div className="flex-1 max-w-lg space-y-8">
          {/* Add Record Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6 space-y-6"
          >
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Spending Record</h2>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Amount</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-700 transition"
            >
              Add Record
            </button>
          </form>

          {/* Add New Category */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Add Custom Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Snacks"
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleAddCategory}
              className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Right column: Spending Records */}
        <div className="flex-1 max-w-3xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Spending Records</h2>
          {records.length === 0 ? (
            <p className="text-gray-500">No records yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                <thead className="bg-indigo-100 text-indigo-900">
                  <tr>
                    <th className="py-3 px-6 text-left font-semibold">Date</th>
                    <th className="py-3 px-6 text-left font-semibold">Category</th>
                    <th className="py-3 px-6 text-right font-semibold">Amount</th>
                    <th className="py-3 px-6 text-center font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {[...records].reverse().map((rec) => (
                    <tr
                      key={rec.id}
                      className="border-b last:border-b-0 hover:bg-indigo-50 transition"
                    >
                      <td className="py-3 px-6">{rec.date}</td>
                      <td className="py-3 px-6">
                        {categories.find((c) => c.id === rec.category)?.name || rec.category}
                      </td>
                      <td className="py-3 px-6 text-right font-mono">
                        ${rec.amount.toFixed(2)}
                      </td>
                      <td className="py-3 px-6 text-center">
                        <button
                          onClick={() => handleRemoveRecord(rec.id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                          aria-label={`Remove record on ${rec.date}`}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
