import { create } from "zustand";

interface User {
  name: string;
  birth_year: string;
  eye_color: string;
  gender: string;
  hair_color: string;
  height: string;
  mass: string;
  skin_color: string;
  homeworld: string;
  films: [];
  species: [];
  starships: [];
  vehicles: [];
  url: string;
  created: string;
  edited: string;
}

interface HostState {
  user: User;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const getUser = async (username: string, password: string) => {
  const res = await fetch("https://swapi.dev/api/people/4", {
    keepalive: true,
  });
  console.log(
    fetch("https://swapi.dev/api/people/4", {
      headers: {
        Connection: "keep-alive",
        "Keep-Alive": "timeout=5; max=30;",
      },
      keepalive: true,
    })
  );
  const data = await res.json();

  return data;
};

export const useHostStore = create<HostState>()((set) => ({
  user: <User>{},
  login: async (username, password) => {
    set({ user: await getUser(username, password) });
  },
  logout: () => {
    set({ user: <User>{} });
  },
}));
