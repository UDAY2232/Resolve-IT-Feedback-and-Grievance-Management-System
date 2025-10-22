import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './signup';
import Login from './login';
import Home from './home';
import Dashboard from "./Dashboard";
import AdminDashboard from './AdminDashboard';

 
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admindashboard/*" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
 
export default App;