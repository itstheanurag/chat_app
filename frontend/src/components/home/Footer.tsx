const Footer = () => {
  return (
    <footer className="w-full bg-white border-t-4 border-gray-900 mt-0 font-mono">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
        {/* Left: Branding */}
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-violet-500 border-2 border-gray-900"></div>
          <div className="text-xl font-bold text-gray-900 font-tertiary uppercase tracking-wider">
            ChatApp
          </div>
        </div>

        {/* Center: Links */}
        <div className="flex flex-wrap justify-center gap-8 text-gray-900 font-bold text-sm uppercase tracking-wide">
          <a
            href="#home"
            className="hover:text-violet-600 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Home
          </a>
          <a
            href="#features"
            className="hover:text-violet-600 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Features
          </a>
          <a
            href="#contact"
            className="hover:text-violet-600 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            Contact
          </a>
          <a
            href="#about"
            className="hover:text-violet-600 hover:underline decoration-2 underline-offset-4 transition-all"
          >
            About
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-gray-500 text-sm font-bold">
          &copy; {new Date().getFullYear()} CHAT_APP_INC.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
