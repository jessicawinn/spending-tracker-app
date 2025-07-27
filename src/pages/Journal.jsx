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
    <div className="p-8 max-w-7xl mx-auto min-h-screen">
      <h1 className="text-3xl font-extrabold text-black-700 tracking-wide">
        Spending Journal
      </h1>
      <p className="mb-16 text-gray-600 max-w-xl">
        Track your expenses easily and customize your spending categories.
      </p>

      <div className="flex flex-col lg:flex-row gap-14">
        {/* Left: Form & Add Category */}
        <div className="flex-1 max-w-lg space-y-10">
          {/* Add Spending Record */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
          >
            <h2 className="text-3xl font-semibold mb-6 text-black-800">
              Add Spending Record
            </h2>

            <div className="space-y-5">
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-black-500 transition"
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Amount
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black-500 transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-400 text-white font-semibold rounded-lg py-3 hover:bg-gray-600  transition shadow-md"
              >
                Add Record
              </button>
            </div>
          </form>

          {/* Add Custom Category */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 space-y-6">
            <h2 className="text-3xl font-semibold text-black-800">Add Category</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Snacks"
              className="w-full rounded-lg border border-gray-300 px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
            <button
              onClick={handleAddCategory}
              className="w-full bg-gray-400 text-white font-semibold rounded-lg py-3 hover:bg-gray-600 transition shadow-md"
            >
              Add Category
            </button>
          </div>
        </div>

        {/* Right: Spending Records */}
        <div className="flex-1 max-w-4xl p-8 border border-gray-200 shadow-lg rounded-2xl">
          <h2 className="text-3xl font-semibold mb-8 text-black-800">
            Spending Records
          </h2>

          {records.length === 0 ? (
            <p className="text-gray-500 italic text-lg">No records yet.</p>
          ) : (
            <div className="space-y-5 max-h-[600px] overflow-y-auto">
              {[...records]
                .reverse()
                .map(({ id, date, category, amount }) => {
                  const cat = categories.find((c) => c.id === category);
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between bg-white rounded-xl shadow-md border border-gray-200 px-6 py-4 hover:shadow-lg transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-gray-700">{cat?.name || category}</p>
                        <p className="text-gray-500 text-sm">{date}</p>
                      </div>
                      <div className="font-mono text-black-600 text-lg w-24 text-right">
                        ${amount.toFixed(2)}
                      </div>
                      <button
                        onClick={() => handleRemoveRecord(id)}
                        className="ml-6 text-red-600 hover:text-red-800 font-semibold transition"
                        aria-label={`Remove record on ${date}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );


}
