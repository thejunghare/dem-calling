import { createContext, useContext, useEffect, useState } from "react";
import { Query } from "react-native-appwrite";
import { toast } from "../lib/toast";
import { databases } from "../lib/appwrite";
import Toast from 'react-native-toast-message';

const DATABASE_ID = "66502c6e0015d7be8526";
const CALLING_EMPLOYEE_COLLECTION_ID = "6";
const SURVEY_COLLECTION_ID = "6650391e00030acc335b";

const CallerContext = createContext();

export function useCaller() {
  return useContext(CallerContext);
}

export function CallerPrvoider(props) {
  const [fetchedDocuments, setFetchedDocuments] = useState([]);
  const [count, setCount] = useState(0);
  const [totalCallCount, setTotalCallCount] = useState(0);
  const [todaysCallCount, setTodaysCallCount] = useState(0);

  const [recallscount, setRecallscount] = useState(0);
  const [noAnswered, setNoAnswered] = useState(0);
  const [declined, setDeclined] = useState(0);
  const [completed, setCompleted] = useState(0);


  // const division = "Airoli Vidhan Sabha";
  async function fetchlist(division, ward, area, building) {
    try {
      const queries = [
        Query.orderDesc("$createdAt"),
        Query.equal("division", division),
        Query.equal("ward", ward), //"Ghansoli"
        Query.equal("area", area), //"Sector 4"
        Query.equal("building", building), //"Vigneshwar CHS"
        Query.equal("isRoomLocked", false),
        Query.equal("surveyDenied", false),
      ];

      const { documents } = await databases.listDocuments(
        DATABASE_ID,
        SURVEY_COLLECTION_ID,
        queries,
      );

      setFetchedDocuments(documents);
      setCount(documents.length);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
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
      //toast("Updated Successfully");
      Toast.show({
        type: 'success',
        text1: 'survey updated!',
        position: 'bottom'
      });
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  // count based on date
  async function todayscount(userID, date) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.contains('$updatedAt', [date]),
        Query.equal("verification_employee_id", userID),
      ],
    );

    const todaysCallCount = response.documents.length;
    setTodaysCallCount(todaysCallCount);
  }

  // total count
  async function totalcount(userID) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("verification_employee_id", [userID])
      ],
    );
    const totalCallCount = response.documents.length;
    setTotalCallCount(totalCallCount);
  }

  const recalls = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("calling_status", ["recall"]),
        Query.equal("verification_employee_id", [userId]),
      ],
    );

    const recallscount = response.documents.length;
    setRecallscount(recallscount);
  }

  const noanswer = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("calling_status", ["no_answer"]),
        Query.equal("verification_employee_id", [userId]),
      ],
    );

    const noAnswered = response.documents.length;
    setNoAnswered(noAnswered);
  }

  const decline = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("calling_status", ["decline"]),
        Query.equal("verification_employee_id", [userId]),
      ],
    );

    const declined = response.documents.length;
    setDeclined(declined);
  }

  const complete = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("calling_status", ["complete"]),
        Query.equal("verification_employee_id", [userId]),
      ],
    );

    const completed = response.documents.length;
    setCompleted(completed);
  }

  return (
    <CallerContext.Provider
      value={{ fetchlist, fetchedDocuments, details, update, count, totalcount, totalCallCount, todayscount, todaysCallCount, recalls, recallscount, noanswer, noAnswered, decline, declined, complete, completed }}
    >
      {props.children}
    </CallerContext.Provider>
  );
}
