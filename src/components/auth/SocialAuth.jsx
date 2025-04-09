'use client';

const SocialAuth = ({ onSocialLogin, isLoading }) => {
  return (
    <div className="mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            O continúa con
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSocialLogin('google')}
          className="group flex justify-center items-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-700 
                     rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                     transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.1711 8.36788H17.5V8.33362H10V11.6669H14.6898C14.1077 13.6501 12.2809 15.0003 10 15.0003C7.23859 15.0003 5.00002 12.7617 5.00002 10.0003C5.00002 7.23883 7.23859 5.00026 10 5.00026C11.2843 5.00026 12.4549 5.48451 13.3519 6.26863L15.8582 3.76236C14.2555 2.29851 12.221 1.36694 10 1.36694C5.2257 1.36694 1.36694 5.22569 1.36694 10C1.36694 14.7744 5.2257 18.6331 10 18.6331C14.7744 18.6331 18.6331 14.7744 18.6331 10C18.6331 9.43622 18.5803 8.89006 18.1711 8.36788Z" fill="#FFC107"/>
            <path d="M2.62988 6.12445L5.5132 8.15288C6.28113 6.30316 8.01103 5.00026 10 5.00026C11.2843 5.00026 12.4549 5.48451 13.3519 6.26863L15.8582 3.76236C14.2555 2.29851 12.221 1.36694 10 1.36694C6.8565 1.36694 4.08752 3.29345 2.62988 6.12445Z" fill="#FF3D00"/>
            <path d="M10 18.6331C12.1755 18.6331 14.1685 17.7323 15.7589 16.307L13.0484 13.9878C12.1554 14.6364 11.0697 15.0003 10 15.0003C7.72818 15.0003 5.90652 13.6591 5.31739 11.6844L2.49579 13.9297C3.93249 16.7841 6.74217 18.6331 10 18.6331Z" fill="#4CAF50"/>
            <path d="M18.1711 8.36788H17.5V8.33362H10V11.6669H14.6898C14.4159 12.6185 13.8578 13.4548 13.0468 14.0872L13.0484 14.0862L15.7589 16.4055C15.5773 16.5698 18.6331 14.2503 18.6331 10.0003C18.6331 9.43622 18.5803 8.89006 18.1711 8.36788Z" fill="#1976D2"/>
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Google
          </span>
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={() => onSocialLogin('facebook')}
          className="group flex justify-center items-center gap-3 py-2.5 px-4 border border-gray-300 dark:border-gray-700 
                     rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 
                     transition-all duration-200"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="#1877F2"/>
            <path d="M13.8926 12.8906L14.3359 10H11.5625V8.125C11.5625 7.3334 11.95 6.5625 13.1922 6.5625H14.4531V4.10156C14.4531 4.10156 13.3084 3.90625 12.2146 3.90625C9.93047 3.90625 8.4375 5.29063 8.4375 7.79688V10H5.89844V12.8906H8.4375V19.8785C9.47287 20.0405 10.5271 20.0405 11.5625 19.8785V12.8906H13.8926Z" fill="white"/>
          </svg>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Facebook
          </span>
        </button>
      </div>
    </div>
  );
};

export default SocialAuth;