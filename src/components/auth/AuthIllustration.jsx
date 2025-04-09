'use client';

import Image from 'next/image';

const AuthIllustration = ({ illustration }) => {
  return (
    <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-pink-400 to-purple-600 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/80 to-purple-600/80"></div>
      <div className="absolute inset-0 flex items-center justify-center p-12">
        <div className="w-full max-w-lg">
          <Image
            src={illustration || '/images/logo.svg'}
            alt="Ilustración"
            width={500}
            height={500}
            className="w-full object-contain drop-shadow-xl"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default AuthIllustration;