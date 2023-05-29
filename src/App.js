import { Outlet, Link } from "react-router-dom";
export default function App() {
    return (
        <div className="p-2">
            <Link to='/add' className="float-right font-medium bg-blue-400 p-2 text-white rounded">New Activity</Link>
            <h1 className="text-4xl font-bold">
                <Link to="/">Cadence</Link>
            </h1>
            <Outlet />
        </div>
    )
}