import { useAuthContext } from '../../context/AuthContext';

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuthContext();

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <span className="text-2xl">🏥</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                MedVault
              </h1>
            </div>
            {isAuthenticated && (
              <>
                <div className="flex items-center space-x-2 ml-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-green-700">Connected</span>
                </div>
                {user && (
                  <div className="flex items-center space-x-2 ml-1">
                    {user.picture && (
                      <img
                        src={user.picture}
                        alt={user.name}
                        className="w-7 h-7 rounded-full border-2 border-blue-200"
                      />
                    )}
                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">{user.name}</span>
                  </div>
                )}
              </>
            )}
          </div>

          {isAuthenticated && (
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
