import React from 'react';
import Image from 'next/image';

const AuthIllustration = ({ illustration }) => {
  return (
    <div>
      <Image
        src={illustration}
        alt="Auth Illustration"
        width={500} // Ajusta según necesidad
        height={300} // Ajusta según necesidad
      />
    </div>
  );
};

export default AuthIllustration;