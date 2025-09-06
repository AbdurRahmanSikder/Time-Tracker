import Home from "./pages/Home";
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <div >
      <Home />
      <Toaster
        position="top-center"
        autoClose={2000}
      />
    </div>
  );
}
