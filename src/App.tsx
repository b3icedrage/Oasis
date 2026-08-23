import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { Home } from './pages/Home';
import { Explore } from './pages/Explore';
import { Create } from './pages/Create';
import { Activity } from './pages/Activity';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen w-screen bg-glitch-bg overflow-hidden scanline-overlay flex items-center justify-center">
        <div className="w-full max-w-[430px] h-full bg-glitch-bg relative overflow-hidden border-x border-glitch-border/30">
        <main className="h-full pb-14">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create" element={<Create />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
        <BottomNav />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
