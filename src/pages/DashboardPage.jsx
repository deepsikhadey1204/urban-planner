import Dashboard from "../components/Dashboard";

export default function DashboardPage({ selectedAreaData }) {
    return (
        <div className="dashboard-page">
            <Dashboard selectedAreaData={selectedAreaData} />
        </div>
    );
}