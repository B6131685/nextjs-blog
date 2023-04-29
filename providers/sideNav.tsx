import {
  useReducer,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

interface ISideNav {
  open: boolean;
}

interface IAction {
  type: "open" | "close";
}

const initail:ISideNav = { open: false };

const SideNavContext = createContext<ISideNav>(initail);

const SideNavDispatchContext = createContext<Dispatch<IAction> | any>({});

function sideNavReducer(state: ISideNav, action: IAction) {
  switch (action.type) {
    case "open": {
      return { open: true };
    }
    case "close": {
      return { open: false };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
}

const SideNavProvider = ({ children }: { children: ReactNode }) => {
  const [sideNav, dispatch] = useReducer(sideNavReducer, initail);
  return (
    <SideNavContext.Provider value={sideNav}>
      <SideNavDispatchContext.Provider value={dispatch}>
        {children}
      </SideNavDispatchContext.Provider>
    </SideNavContext.Provider>
  );
};

export default SideNavProvider;

export function useSideNav() {
  return useContext(SideNavContext);
}

export function useSideNavDispatch() {
  return useContext(SideNavDispatchContext);
}
