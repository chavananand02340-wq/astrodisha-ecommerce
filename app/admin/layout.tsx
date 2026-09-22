export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        backgroundColor: "#F7F3EC",
        minHeight: "100vh",
        color: "#3E2237",
      }}
    >
      {children}
    </div>
  );
}
