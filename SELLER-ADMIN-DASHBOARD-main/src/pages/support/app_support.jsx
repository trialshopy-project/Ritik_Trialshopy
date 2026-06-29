
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage';
// import Support from './components/Support';
import IssueCategoryPage from './pages/IssueCategoryPage';
import IssueSubCat from './pages/IssueSubCat';
import SupportHomePage from './pages/HomePage';

function App_support() {
    return (
        <Router>
            {/* <nav>
                <ul className="flex space-x-4 p-4 bg-gray-200">
                    <li>
                        <Link to="/" className="text-blue-500">Home</Link>
                    </li>
                    <li>
                        <Link to="/about" className="text-blue-500">About</Link>
                    </li>
                </ul>
            </nav> */}
            <Routes>
                <Route path="/support Home" element={<SupportHomePage />} />
                <Route path="/support" element={<IssueCategoryPage/>} />
                <Route path="/support/issue" element={<IssueSubCat/>} />
                
            </Routes>
        </Router>
    );
}

export default App_support
