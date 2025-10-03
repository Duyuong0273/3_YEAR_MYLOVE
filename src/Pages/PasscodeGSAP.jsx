import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import "./PasscodeScreen.css";

const KEYS = [1, 2, 3, 4, 5, 6, 7, 8, 9, "check", 0, "del"];

export default function PasscodeGSAP({ onSuccess }) {
  const CORRECT = "10102021"; // ✅ đổi mật khẩu thành 10102021
  const [pass, setPass] = useState("");
  const [message, setMessage] = useState("Nhập pass đi người đẹp 💕");
  const boxRef = useRef(null);
  const keysRef = useRef([]);
  const dotsRef = useRef([]);
  const containerRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key >= "0" && e.key <= "9") {
        pushDigit(Number(e.key));
      } else if (e.key === "Backspace") {
        del();
      } else if (e.key === "Enter") {
        submit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pass]);

  const animateKeyPress = (el) => {
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 0, scale: 1 },
      { y: 6, scale: 0.98, duration: 0.06, yoyo: true, repeat: 1 }
    );
  };

  const pushDigit = (d) => {
    if (pass.length >= CORRECT.length) return;
    animateKeyPress(keysRef.current[d === 0 ? 10 : d - 1]);
    setPass((p) => {
      const next = (p + d).slice(0, CORRECT.length);
      const idx = next.length - 1;
      const dot = dotsRef.current[idx];
      if (dot)
        gsap.fromTo(
          dot,
          { scale: 0.2, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.25,
            ease: "back.out(1.4)",
          }
        );
      return next;
    });
  };

  const del = () => {
    if (!pass) return;
    gsap.to(dotsRef.current[pass.length - 1], {
      scale: 0.2,
      opacity: 0,
      duration: 0.12,
      ease: "power1.in",
    });
    setPass((p) => p.slice(0, -1));
    animateKeyPress(keysRef.current[11]);
  };

  const submit = () => {
    animateKeyPress(keysRef.current[9]);
    if (pass.length < CORRECT.length) {
      gsap.fromTo(
        boxRef.current,
        { boxShadow: "0 8px 30px rgba(255,0,80,0.0)" },
        {
          boxShadow: "0 8px 30px rgba(255,0,80,0.25)",
          duration: 0.15,
          yoyo: true,
          repeat: 1,
        }
      );
      return;
    }
    if (pass === CORRECT) {
      setMessage("Chúc mừng em yêu 💖"); // ✅ thông báo đúng
      successAnimation();
    } else {
      setMessage("Ngại hết cả người đẹp 😳"); // ✅ thông báo sai
      failAnimation();
    }
  };

  const failAnimation = () => {
    const tl = gsap.timeline();
    tl.to(boxRef.current, {
      x: -10,
      duration: 0.06,
      repeat: 5,
      yoyo: true,
      ease: "power3.inOut",
    });
    tl.to(boxRef.current, { x: 0, duration: 0.06 });
    dotsRef.current.forEach((d) => {
      if (d)
        gsap.to(d, {
          backgroundColor: "#ff6b9d",
          duration: 0.12,
          yoyo: true,
          repeat: 1,
        });
    });
    tl.call(() => {
      setPass("");
      dotsRef.current.forEach((d) => {
        if (d) gsap.set(d, { scale: 0, opacity: 0, backgroundColor: "#ffd7e3" });
      });
    }, null, "+=0.02");
  };

  const successAnimation = () => {
    const tl = gsap.timeline();
    tl.to(boxRef.current, { scale: 0.9, duration: 0.15 });
    tl.to(boxRef.current, {
      y: -40,
      opacity: 0,
      scale: 0.6,
      duration: 0.6,
      ease: "power2.in",
    });
    tl.call(() => {
      onSuccess?.();
    });
  };

  const handleKeyClick = (key, idx) => {
    if (key === "check") submit();
    else if (key === "del") del();
    else pushDigit(key);
    animateKeyPress(keysRef.current[idx]);
  };

  return (
    <div className="pass-root" ref={containerRef}>
      <h2 className="pass-title">{message}</h2>

      <div className="pass-box" ref={boxRef}>
        <div className="left-card">
          <img
            className="avatar"
            src="/assets/Couple-CbjWpml5.png"
            alt="avatar"
          />
        </div>

        <div className="right-panel">
          <div className="display">
            <div className="dots">
              {Array.from({ length: CORRECT.length }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (dotsRef.current[i] = el)}
                  className={`dot ${i < pass.length ? "filled" : ""}`}
                  style={{
                    transform: i < pass.length ? "scale(1)" : "scale(0)",
                    opacity: i < pass.length ? 1 : 0,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="keypad">
            {KEYS.map((k, idx) => {
              return (
                <button
                  key={idx}
                  ref={(el) => (keysRef.current[idx] = el)}
                  className={`key ${k === "check" ? "ok" : ""} ${
                    k === "del" ? "del" : ""
                  }`}
                  onClick={() => handleKeyClick(k, idx)}
                >
                  {k === "check" ? "✔" : k === "del" ? "✖" : k}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
