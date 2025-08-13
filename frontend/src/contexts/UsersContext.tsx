import React, {  createContext, useContext, useReducer, useCallback } from 'react';
import axios from 'axios';

export type User = {
  name: string;
  email: string;
  token: string;
};

type State = {
  user: User | null;
};

type Action =
  | { type: 'login'; user: User }
  | { type: 'logout' };

const AUTH_URL = 'http://localhost:3001';

const UserContext = createContext<State | null>(null);
const UserDispatchContext = createContext<React.Dispatch<Action> | null>(null);
const UserActionsContext = createContext<{
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'login':
      return { user: action.user };
    case 'logout':
      return { user: null };
    default:
      throw new Error('Unknown action');
  }
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { user: null });

  const login = useCallback(async (username: string, password: string): Promise<string | null> => {
  try {
    const response = await axios.post(`${AUTH_URL}/login`, { username, password });
    dispatch({ type: 'login', user: response.data });
    return null;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data?.error) {
      return err.response.data.error;
    }
    return 'Login failed';
  }
}, []);


  const logout = useCallback(() => {
    dispatch({ type: 'logout' });
  }, []);

  return (
    <UserContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        <UserActionsContext.Provider value={{ login, logout }}>
          {children}
        </UserActionsContext.Provider>
      </UserDispatchContext.Provider>
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
}

export function useUserDispatch() {
  const context = useContext(UserDispatchContext);
  if (!context) throw new Error('useUserDispatch must be used within UserProvider');
  return context;
}

export function useUserActions() {
  const context = useContext(UserActionsContext);
  if (!context) throw new Error('useUserActions must be used within UserProvider');
  return context;
}
