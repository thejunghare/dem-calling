import { createContext, useContext, useEffect, useState } from "react";
import { Query } from "react-native-appwrite";
import { toast } from "../lib/toast";
import { databases } from "../lib/appwrite";

const DATABASE_ID = "66502c6e0015d7be8526";
const CALLING_EMPLOYEE_COLLECTION_ID = "6";
const SURVEY_COLLECTION_ID = "6650391e00030acc335b";

const CallerContext = createContext();

export function useCaller() {
  return useContext(CallerContext);
}

export function CallerPrvoider(props) {
  const [documents, setDocuments] = useState([]);
  const division = "Khopoli";

  async function fetch() {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        //Query.orderDesc("$createdAt"),
        //Query.limit(10),
        Query.equal("division", division),
        Query.equal("ward", "12"),
        Query.equal("area", "Veena Nagar"),
        Query.equal("building", "Veena Nagar Left Side Parisar"),
      ],
    );
    //toast("documents fetched");
    //console.info(`Documents: ${response.documents}`);
    setDocuments(response.documents);
  }

  async function details(surveyId, navigation) {
    const response = await databases.getDocument(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      surveyId,
    );
    toast("details fetched");
    //console.info(response.documents);
    navigation.navigate("DocumentDetail", { survey: response });
  }

  return (
    <CallerContext.Provider value={{ fetch, documents, details }}>
      {props.children}
    </CallerContext.Provider>
  );
}
