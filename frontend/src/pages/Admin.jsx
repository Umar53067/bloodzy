// AdminDashboard.jsx
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  LogOut,
} from "lucide-react";

function AdminDashboard() {
  const [active, setActive] = useState("Dashboard");

  // 📊 Dummy Data
  const monthlyDonations = [
    { month: "Jan", donations: 20 },
    { month: "Feb", donations: 35 },
    { month: "Mar", donations: 25 },
    { month: "Apr", donations: 40 },
    { month: "May", donations: 50 },
    { month: "Jun", donations: 30 },
  ];

  const bloodGroups = [
    { name: "A+", value: 25 },
    { name: "B+", value: 20 },
    { name: "O+", value: 30 },
    { name: "AB+", value: 15 },
    { name: "A-", value: 5 },
    { name: "B-", value: 3 },
    { name: "O-", value: 2 },
  ];

  const COLORS = [
    "#1E3A8A",
    "#DC2626",
    "#16A34A",
    "#F59E0B",
    "#9333EA",
    "#2563EB",
    "#EA580C",
  ];

  const donors = [
    { id: 1, name: "John Smith", bloodGroup: "A+", phone: "555-1234", donations: 5 },
    { id: 2, name: "Sarah Johnson", bloodGroup: "O-", phone: "555-5678", donations: 3 },
    { id: 3, name: "Ali Khan", bloodGroup: "B+", phone: "555-9012", donations: 7 },
  ];

  const requests = [
    { id: 1, patient: "Ahmed Raza", bloodGroup: "A+", status: "Pending", date: "2025-09-10" },
    { id: 2, patient: "Maria Lee", bloodGroup: "O-", status: "Completed", date: "2025-09-12" },
    { id: 3, patient: "James Brown", bloodGroup: "B+", status: "Pending", date: "2025-09-14" },
  ];

  const reports = [
    { id: 1, title: "Monthly Donations", date: "2025-09-01", file: "Report-Jan.pdf" },
    { id: 2, title: "Pending Requests", date: "2025-09-05", file: "Pending-Req.pdf" },
    { id: 3, title: "Active Donors", date: "2025-09-08", file: "Donors-List.pdf" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h1 className="text-2xl font-bold text-red-600 mb-10">Bloodzy Admin</h1>
        <nav className="space-y-4">
          <button
            onClick={() => setActive("Dashboard")}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg ${
              active === "Dashboard"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>

          <button
            onClick={() => setActive("Donors")}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg ${
              active === "Donors"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users className="w-5 h-5" />
            Donors
          </button>

          <button
            onClick={() => setActive("Requests")}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg ${
              active === "Requests"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ClipboardList className="w-5 h-5" />
            Requests
          </button>

          <button
            onClick={() => setActive("Reports")}
            className={`flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg ${
              active === "Reports"
                ? "bg-red-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Reports
          </button>
        </nav>

        <div className="absolute bottom-6">
          <button className="flex items-center gap-3 text-gray-600 hover:text-red-600">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Dashboard Page */}
        {active === "Dashboard" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl">Total Donors</h2>
                <p className="text-3xl font-bold mt-2">250</p>
              </div>
              <div className="bg-green-600 text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl">Total Donations</h2>
                <p className="text-3xl font-bold mt-2">120</p>
              </div>
              <div className="bg-red-600 text-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl">Pending Requests</h2>
                <p className="text-3xl font-bold mt-2">18</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Donations Per Month</h2>
                <LineChart width={400} height={250} data={monthlyDonations}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="donations" stroke="#2563EB" strokeWidth={3} />
                </LineChart>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Blood Groups Distribution</h2>
                <PieChart width={400} height={250}>
                  <Pie
                    data={bloodGroups}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {bloodGroups.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
          </>
        )}

        {/* Donors Page */}
        {active === "Donors" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Manage Donors</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Name</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Donations</th>
                  </tr>
                </thead>
                <tbody>
                  {donors.map((donor) => (
                    <tr key={donor.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{donor.name}</td>
                      <td className="p-3">{donor.bloodGroup}</td>
                      <td className="p-3">{donor.phone}</td>
                      <td className="p-3">{donor.donations}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Requests Page */}
        {active === "Requests" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Blood Requests</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Patient</th>
                    <th className="p-3">Blood Group</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{req.patient}</td>
                      <td className="p-3">{req.bloodGroup}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded text-sm ${
                            req.status === "Pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="p-3">{req.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Reports Page */}
        {active === "Reports" && (
          <>
            <h1 className="text-3xl font-bold mb-6">Reports & Analytics</h1>
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Title</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">File</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">{report.title}</td>
                      <td className="p-3">{report.date}</td>
                      <td className="p-3 text-blue-600 underline cursor-pointer">
                        {report.file}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
