import { useEffect, useRef } from "react";

export function PongAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const paddleHeight = 60;
    const paddleWidth = 8;
    const ballSize = 8;

    let ballX = canvas.width / 2;
    let ballY = canvas.height / 2;
    let ballSpeedX = 3;
    let ballSpeedY = 2;

    let leftPaddleY = canvas.height / 2 - paddleHeight / 2;
    let rightPaddleY = canvas.height / 2 - paddleHeight / 2;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Left paddle
      ctx.fillStyle = "#06b6d4";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#06b6d4";
      ctx.fillRect(10, leftPaddleY, paddleWidth, paddleHeight);

      // Right paddle
      ctx.fillStyle = "#ec4899";
      ctx.shadowColor = "#ec4899";
      ctx.fillRect(
        canvas.width - 10 - paddleWidth,
        rightPaddleY,
        paddleWidth,
        paddleHeight
      );

      // Ball
      ctx.fillStyle = "#fff";
      ctx.shadowColor = "#fff";
      ctx.shadowBlur = 15;
      ctx.fillRect(ballX - ballSize / 2, ballY - ballSize / 2, ballSize, ballSize);

      // Center line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 10]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const update = () => {
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Ball collision with top/bottom
      if (ballY <= ballSize / 2 || ballY >= canvas.height - ballSize / 2) {
        ballSpeedY = -ballSpeedY;
      }

      // Ball collision with paddles
      if (
        ballX <= 10 + paddleWidth + ballSize / 2 &&
        ballY >= leftPaddleY &&
        ballY <= leftPaddleY + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        ballX = 10 + paddleWidth + ballSize / 2;
      }

      if (
        ballX >= canvas.width - 10 - paddleWidth - ballSize / 2 &&
        ballY >= rightPaddleY &&
        ballY <= rightPaddleY + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width - 10 - paddleWidth - ballSize / 2;
      }

      // Reset ball if it goes out
      if (ballX < 0 || ballX > canvas.width) {
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
      }

      // AI paddle movement
      const leftPaddleCenter = leftPaddleY + paddleHeight / 2;
      if (leftPaddleCenter < ballY - 20) {
        leftPaddleY += 2;
      } else if (leftPaddleCenter > ballY + 20) {
        leftPaddleY -= 2;
      }

      const rightPaddleCenter = rightPaddleY + paddleHeight / 2;
      if (rightPaddleCenter < ballY - 20) {
        rightPaddleY += 2;
      } else if (rightPaddleCenter > ballY + 20) {
        rightPaddleY -= 2;
      }

      // Keep paddles in bounds
      leftPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddleY));
      rightPaddleY = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddleY));
    };

    const animate = () => {
      update();
      draw();
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
