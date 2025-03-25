import Link from "next/link";

export default function ReturnsPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 font-['Helvetica_Neue']">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6">Return Policy</h1>
        <div className="text-lg sm:text-xl space-y-6">
          <p>We are a small company who does not accept returns.</p>
          <p>
            If you have any issues with the product or order, please contact us{" "}
            <Link
              href="/contact"
              className="text-blue-600 hover:text-blue-800 underline font-medium"
            >
              here
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
