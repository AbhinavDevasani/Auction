import EmailOTP from "@/components/EmailOTP";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Settings</h1>
          <p className="text-gray-500">Secure your account by verifying your email address.</p>
        </div>
        
        {/* Render the generic Email OTP component */}
        <EmailOTP />
      </div>
    </div>
  );
}
