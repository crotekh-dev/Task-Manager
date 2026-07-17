import "./SplashScreen.css";

export default function SplashScreen() {
  return (
    <div className="splash">
      <div className="glow"></div>

      <img src="../public/icon.png" alt="Task Manger Logo" className="logo" />

      <h1>Task Manager</h1>

      <p>Organize • Focus • Achieve</p>

      <div className="progress">
        <div className="progress-fill"></div>
      </div>
    </div>
  );
}
