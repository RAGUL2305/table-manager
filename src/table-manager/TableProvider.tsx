import React, {
  ChangeEvent,
  createContext,
  PropsWithChildren,
  RefObject,
  useContext,
  useReducer,
  useRef,
} from "react";
import produce from "immer";
import _ from "lodash";

type View = "" | "details" | "log" | "delete";

type Action =
  | { type: "SELECT_NUTRITIONS"; payload: string }
  | { type: "SET_FORMDATA"; payload: { name: string; value: string } }
  | { type: "SUBMIT_DETAILS" }
  | { type: "DELETE_DETAILS"; payload: number }
  | { type: "REMOVE_CHECKED_ITEMS" }
  | { type: "CHECKED_DATA"; payload: number }
  | { type: "CLOSE_DELETE" }
  | { type: "SET_VIEW"; payload: View }
  | { type: "FOCUS_THE_INPUT"; payload: RefObject<HTMLInputElement> }
  | { type: "MAKE_DROPDOWN" };

interface Form {
  id: number;
  name: string;
  description: string;
  link: string;
  shouldcook: string;
  nutritions?: string[];
  maxintakeperday: string;
}

const initialData: Form = {
  id: 1,
  name: " ",
  description: " ",
  link: " ",
  shouldcook: " ",
  maxintakeperday: " ",
};
interface State {
  selectedOptions: string[];
  formData: Form;
  values: Form[];
  checkedItems: number[];
  selectedData: Form[];
  view: View;
  deleteDetails: boolean;
  drop: boolean;
}
const initialState: State = {
  selectedOptions: [],
  formData: initialData,
  values: [],
  checkedItems: [],
  selectedData: [],
  view: "",
  deleteDetails: false,
  drop: false,
};

export interface ContextType {
  selectedOptions: string[];
  formData: Form;
  values: Form[];
  checkedItems: number[];
  selectedData: Form[];
  view: View;
  deleteDetails: boolean;
  drop: boolean;
  inputRef: RefObject<HTMLInputElement>;
  handleInputChange: (item: string) => void;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: ChangeEvent<HTMLFormElement>) => void;
  handleDeleteClick: (item: Form) => void;
  handleCheckedRemoveClick: () => void;
  handleCheckboxChange: (item: Form) => void;
  handleNoClick: () => void;
  setView: (option: View) => void;
  handleDropClick: () => void;
}

const reducer = produce((state: State, action: Action) => {
  switch (action.type) {
    case "SELECT_NUTRITIONS":
      let checkedNutritions = [...state.selectedOptions];

      if (!checkedNutritions.includes(action.payload)) {
        checkedNutritions.push(action.payload);
      } else {
        _.remove(checkedNutritions, (detail) => detail === action.payload);
      }
      state.selectedOptions = checkedNutritions;

      break;
    case "SET_FORMDATA":
      state.formData = {
        ...state.formData,
        [action.payload.name]: action.payload.value,
      };
      break;
    case "SUBMIT_DETAILS":
      const newValues = [...state.values];
      // console.log(_.fromPairs(_.toPairs(state.formData)));
      if (!newValues.includes(state.formData)) {
        newValues.push({
          ...state.formData,
          nutritions: [state.selectedOptions.join(",")],
        });
      }
      state.values = newValues;
      state.formData = { ...initialData, id: state.formData.id + 1 };
      state.selectedOptions = [];
      state.drop = false;
      break;

    case "FOCUS_THE_INPUT":
      if (state.values !== null && action.payload.current) {
        action.payload.current.focus();
      }
      break;

    case "CHECKED_DATA":
      let checkedDetails = [...state.checkedItems];

      if (!checkedDetails.includes(action.payload)) {
        checkedDetails.push(action.payload);
      } else {
        _.remove(checkedDetails, (detail) => detail === action.payload);
      }
      state.checkedItems = checkedDetails;
      console.log(state.checkedItems);
      break;

    case "DELETE_DETAILS":
      state.values = state.values.filter(
        (option) => option.id !== action.payload
      );
      break;
    case "REMOVE_CHECKED_ITEMS":
      state.values = state.values.filter(
        (option) => !state.checkedItems.includes(option.id)
      );
      state.deleteDetails = !state.deleteDetails;
      break;

    case "CLOSE_DELETE":
      state.deleteDetails = !state.deleteDetails;
      break;

    case "MAKE_DROPDOWN":
      state.drop = !state.drop;
      break;

    case "SET_VIEW":
      if (state.view === action.payload) {
        state.view = "";
      } else {
        state.view = action.payload;
      }
      state.selectedData =
        state.checkedItems.length === 1
          ? state.values.filter((detail) =>
              state.checkedItems.includes(detail.id)
            )
          : [];
      switch (state.view) {
        case "details":
          state.selectedData = state.selectedData;
          break;
        case "log":
          console.log(_.fromPairs(_.toPairs(state.selectedData[0])));
          break;
        case "delete":
          if (state.checkedItems.length !== 0) {
            state.deleteDetails = !state.deleteDetails;
          }
          break;
      }
      break;
  }
});

const FormContext = createContext<ContextType | undefined>(undefined);

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("The components should be enclosed within provider");
  }
  return context;
};

function TableProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const handleInputChange = (item: string) => {
    dispatch({
      type: "SELECT_NUTRITIONS",
      payload: item,
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: "SET_FORMDATA",
      payload: { name: e.target.name, value: e.target.value },
    });
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: "SUBMIT_DETAILS",
    });
    dispatch({
      type: "FOCUS_THE_INPUT",
      payload: inputRef,
    });
  };

  const handleCheckboxChange = (item: Form) => {
    dispatch({
      type: "CHECKED_DATA",
      payload: item.id,
    });
  };

  const handleDeleteClick = (item: Form) => {
    dispatch({
      type: "DELETE_DETAILS",
      payload: item.id,
    });
  };

  const handleCheckedRemoveClick = () => {
    dispatch({
      type: "REMOVE_CHECKED_ITEMS",
    });
  };

  const handleNoClick = () => {
    dispatch({
      type: "CLOSE_DELETE",
    });
  };
  const setView = (option: View) => {
    dispatch({
      type: "SET_VIEW",
      payload: option,
    });
  };

  const handleDropClick = () => {
    dispatch({
      type: "MAKE_DROPDOWN",
    });
  };
  return (
    <FormContext.Provider
      value={{
        selectedOptions: state.selectedOptions,
        formData: state.formData,
        values: state.values,
        checkedItems: state.checkedItems,
        selectedData: state.selectedData,
        view: state.view,
        deleteDetails: state.deleteDetails,
        drop: state.drop,
        inputRef,
        handleInputChange,
        handleChange,
        handleSubmit,
        handleCheckboxChange,
        handleDeleteClick,
        handleCheckedRemoveClick,
        handleNoClick,
        handleDropClick,
        setView,
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
export default TableProvider;
