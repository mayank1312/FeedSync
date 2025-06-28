const currentYear = new Date().getFullYear();

export const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-center gap-5 text-sm text-slate-600 dark:text-slate-400">
        <p>
          © {currentYear} <span className="font-semibold text-blue-600 dark:text-blue-400">FeedSync</span>. All rights reserved.
        </p>
        <p className="mt-2 sm:mt-0">
         Author: <span className="font-medium text-slate-700 dark:text-white">Mayank Dhingra</span>
        </p>
      </div>
    </footer>
  );
};
