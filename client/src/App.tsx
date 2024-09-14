import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Saturn from './_pages/Saturn';
import Home from './_pages/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/saturn" element={<Saturn />} />
      </Routes>
    </Router>
  );
}

export default App;