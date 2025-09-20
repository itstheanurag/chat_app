const Footer = () => {
  return (
    <footer className="w-full bg-neutral-50 border-t-2 border-gray-200 mt-16 font-mono">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Left: Branding */}
        <div className="text-lg font-bold text-orange-500 font-secondary">
          ChatApp
        </div>

        {/* Center: Links */}
        <div className="flex flex-col md:flex-row gap-4 text-neutral-600 text-sm tracking-tighter">
          <a href="#home" className="hover:text-orange-500 transition-colors">
            Home
          </a>
          <a
            href="#features"
            className="hover:text-orange-500 transition-colors"
          >
            Features
          </a>
          <a
            href="#contact"
            className="hover:text-orange-500 transition-colors"
          >
            Contact
          </a>
          <a href="#about" className="hover:text-orange-500 transition-colors">
            About
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-neutral-500 text-sm tracking-tighter">
          &copy; {new Date().getFullYear()} ChatApp. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
