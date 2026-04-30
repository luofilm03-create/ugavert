import { useState, useEffect } from "react";

const ADJ = ["Quick", "Bold", "Sharp", "Calm", "Bright", "Smart", "Fast", "Wise", "Cool", "Keen"];
const NOUN = ["Panda", "Eagle", "Tiger", "Falcon", "Wolf", "Fox", "Bear", "Hawk", "Lion", "Shark"];

function randomName() {
  return ADJ[Math.floor(Math.random() * ADJ.length)] + NOUN[Math.floor(Math.random() * NOUN.length)];
}

function randomId() {
  return Math.random().toString(36).slice(2, 10);
}

export type UserProfile = { uid: string; username: string };

export function useUser() {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const s = localStorage.getItem("ugavert_user");
      if (s) return JSON.parse(s) as UserProfile;
    } catch { /* ignore */ }
    const profile = { uid: randomId(), username: randomName() };
    localStorage.setItem("ugavert_user", JSON.stringify(profile));
    return profile;
  });

  const updateUsername = (name: string) => {
    const trimmed = name.trim().slice(0, 24);
    if (!trimmed) return;
    const next = { ...user, username: trimmed };
    setUser(next);
    localStorage.setItem("ugavert_user", JSON.stringify(next));
  };

  return { user, updateUsername };
}
