"use client"
import React, {
  createContext,
  ReactNode,
  useContext,
  useReducer,
} from "react";

interface IUser {
  user: {
    token: string;
  };
}

interface IActionUserContext {
  type: "login" | "logout";
  payload?: any;
}

export interface IUserContext {
  state: IUser;
  login: () => Promise<{msg: 'success' | 'fail'}>;
  logout: () => void;
}

const initialState: IUser = {
  user: {
    token: "",
  },
};

const reducer = (state: IUser, action: IActionUserContext) => {
  switch (action.type) {
    case "login":
      return {
        user: {
          token: "fixToLogin",
        },
      };

    case "logout":
      return {
        user: {
          token: "",
        },
      };
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

type Props = {
  children: ReactNode;
};

const UserContext = createContext<IUserContext | null>(null);
const UserContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  async function login():Promise<{msg: 'success' | 'fail'}> {
    console.log('login with context');
    
    await dispatch({ type: "login" });
    
    return { msg: 'success'}
  }

  async function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <UserContext.Provider value={{ state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};


export function useUserContext() {
    return useContext(UserContext);
}
export default UserContextProvider
