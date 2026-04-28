export default function ProRoute({ user, children }) {
  if (user?.plan !== "pro") {
    return (
      <div>
        <h3>🔒 Pro Feature</h3>
        <button onClick={() => (window.location.href = "/upgrade")}>
          Upgrade to Pro
        </button>
      </div>
    );
  }

  return children;
}