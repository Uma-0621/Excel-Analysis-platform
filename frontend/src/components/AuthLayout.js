const AuthLayout = ({ title, children }) => {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-indigo-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-white/40 backdrop-blur-md border border-white/30 dark:bg-white/10 dark:border-white/20 animate-fadeIn transition-all duration-500">
          <h2 className="text-3xl font-bold text-center text-indigo-800 dark:text-white mb-6">
            {title}
          </h2>
          {children}
        </div>
      </div>
    );
  };
  
  export default AuthLayout;
  