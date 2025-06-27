import { Image } from "lucide-react";



export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            
             <img
  src="/logo.png"
  className="w-[30px] h-[30px] transform scale-[1.8] origin-center border-2 border-blue-500 rounded-full ms-2"
/>


            
            <div>
              <h1 className="text-xl font-bold text-slate-800 ms-4">User Feedback System</h1>
              <p className="text-sm text-slate-500 ms-4">Collect and manage user feedback efficiently</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
