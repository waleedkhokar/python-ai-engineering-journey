// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="bg-gray-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
//       <div className="flex items-center space-x-3">
//         <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
//           AI-Ops Assistant
//         </span>
//       </div>
//       <div className="flex space-x-6 text-sm font-medium">
//         <Link href="/" className="hover:text-blue-400 transition">
//           Home
//         </Link>
//         <Link href="/support" className="hover:text-blue-400 transition">
//           Customer Support
//         </Link>
//         <Link href="/admin/analytics" className="hover:text-blue-400 transition">
//           Admin Analytics
//         </Link>
//       </div>
//     </nav>
//   );
// }
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          AI-Ops Assistant
        </span>
      </div>
      <div className="flex space-x-6 text-sm font-medium">
        <Link href="/" className="hover:text-blue-400 transition">
          Home
        </Link>
        <Link href="/support" className="hover:text-blue-400 transition">
          Customer Support
        </Link>
        <Link href="/admin/analytics" className="hover:text-blue-400 transition">
          Admin Analytics
        </Link>
      </div>
    </nav>
  );
}