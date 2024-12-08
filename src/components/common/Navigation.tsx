import Link from 'next/link';
import { useRouter } from 'next/router';

const Navigation = () => {
  const router = useRouter();
  
  const navItems = [
    {
      label: "Create",
      href: "/mint"
    },
    {
      label: "Docs",
      href: "/docs"
    },
    {
      label: "About",
      href: "/about"
    },
    {
      label: "Pricing",
      href: "/pricing"
    }
  ];

  return (
    <nav className="bg-[#0F1424]/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" passHref>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF]">
                TokenForge
              </span>
            </Link>
            
            <div className="ml-10 flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  passHref
                >
                  <span className={`px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer
                    ${router.pathname === item.href 
                      ? 'text-[#00FFA3] bg-[#00FFA3]/10' 
                      : 'text-gray-300 hover:text-[#00FFA3] hover:bg-[#00FFA3]/10'
                    }`}
                  >
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              SOL: <span className="text-[#00FFA3]">4.592</span>
            </div>
            <Link 
              href="/mint"
              passHref
            >
              <span className="px-4 py-2 bg-gradient-to-r from-[#00FFA3] to-[#DC1FFF] text-white rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer">
                GET 1 SOL
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 