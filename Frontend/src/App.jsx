import Home from "./pages/Home";
import { Toaster } from "@/components/ui/sonner";
import "./styles/animation.css"; 

export default function App() {
  return (
    <div className="h-screen">
      <Home />
      <Toaster position="top-center" autoClose={2000} />
    </div>
  )
}
