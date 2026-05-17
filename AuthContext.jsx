"import { createContext, useContext, useEffect, useState } from \"react\";
import { http } from \"../lib/api\";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await http.get(\"/auth/me\");
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const { data } = await http.post(\"/auth/login\", { email, password });
    if (data.token) localStorage.setItem(\"wc_token\", data.token);
    setUser(data.user);
    return data.user;
  };
  const register = async (payload) => {
    const { data } = await http.post(\"/auth/register\", payload);
    if (data.token) localStorage.setItem(\"wc_token\", data.token);
    setUser(data.user);
    return data.user;
  };
  const logout = async () => {
    try { await http.post(\"/auth/logout\"); } catch {}
    localStorage.removeItem(\"wc_token\");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, loading, login, register, logout, setUser }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
"