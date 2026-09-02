export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()}
      </div>
    </footer>
  );
}
