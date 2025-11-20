import { GoogleSignIn } from '../auth/GoogleSignIn';

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* Header */}
      <header className="p-6 bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
              <span className="text-2xl">🏥</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              MedVault
            </span>
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Icon/Illustration */}
          <div className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl">
            <span className="text-5xl">🔒</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Own Medical
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Vault
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed whitespace-nowrap">
            Only you have access to the files and pictures uploaded on MedVault
          </p>

          <div className="mb-8">
            <GoogleSignIn />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-gray-500 bg-white/50">
        <p>© 2025 MedVault • Your privacy, our priority</p>
      </footer>
    </div>
  );
};
