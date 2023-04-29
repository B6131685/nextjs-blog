import {
  useReducer,
  createContext,
  useContext,
  ReactNode,
  Dispatch,
} from "react";

type Props = {
  children: ReactNode;
};

interface IQuery {
  title: string;
  tag: string;
}

const initialState: IQuery = {
  title: "",
  tag: "",
};


type Payload1 = {
  title: string;
}
type Payload2 = {
  tag: string
}

type IAction
  = { type: "setTitle", payload: Payload1 }
  | { type: "addTage", payload: Payload2 }
  | { type: "deleteTage", payload: Payload2 }
const QueryContext = createContext<{state:IQuery, dispatch: Dispatch<IAction> | null } | null>(null)

function reducer(state: IQuery, action: IAction){
  switch (action.type) {
    case "setTitle":
      return { ...state, title:action.payload.title };
    case "addTage":{
      
      return { ...state, tag: action.payload.tag };
    }
    case "deleteTage":{
      
      return { ...state, tag:""};
    }
    default:
        {
            throw Error("Unknown action");
        }
  }
};

const QueryProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer( reducer, initialState  )
  return <QueryContext.Provider value={{state, dispatch}}>{children}</QueryContext.Provider>;  
};

export default QueryProvider;

export function useQueryBlog() {
  return useContext(QueryContext);
}
