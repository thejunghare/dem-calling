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
  const [count, setCount] = useState(0);
  const division = "Airoli Vidhan Sabha";

  async function fetch() {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.orderDesc("$createdAt"),
        Query.equal("division", division),
        Query.equal("ward", "Ghansoli"),
        Query.equal("area", "Sector 4"),
        Query.equal("building", "Vigneshwar CHS"),
        Query.equal("isRoomLocked", false),
        Query.equal("surveyDenied", false),
      ],
    );
    //toast("documents fetched");
    //console.info(`Documents: ${response.documents}`);
    const count = response.documents.length;
    setDocuments(response.documents);
    setCount(count);
  }

  async function details(surveyId, navigation) {
    const response = await databases.getDocument(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      surveyId,
    );
    //toast("details fetched");
    //console.info(response.documents);
    navigation.navigate("DocumentDetail", { survey: response });
  }

  async function update(DOCUMENT_ID, UPDATED_DOCUMENT) {
    try {
      const result = await databases.updateDocument(
        DATABASE_ID,
        SURVEY_COLLECTION_ID,
        DOCUMENT_ID,
        UPDATED_DOCUMENT,
      );
      toast("Updated Successfully");
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <CallerContext.Provider
      value={{ fetch, documents, details, update, count }}
    >
      {props.children}
    </CallerContext.Provider>
  );
}
