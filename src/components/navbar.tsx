import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center gap-6 hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.svg" alt="Lago Logo" width={65} height={65} />
            <span className="font-semibold text-gray-600 text-lg">
              Billing Examples
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Examples
            </Link>
            <a
              href="https://getlago.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Documentation
            </a>
            <a
              href="https://github.com/getlago/lago-billing-examples"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
