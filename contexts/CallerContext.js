import { createContext, useContext, useEffect, useState } from "react";
import { Query } from "react-native-appwrite";
import { toast } from "../lib/toast";
import { databases } from "../lib/appwrite";
import Toast from 'react-native-toast-message';

const DATABASE_ID = "66502c6e0015d7be8526";
const CALLING_EMPLOYEE_COLLECTION_ID = "6";
const SURVEY_COLLECTION_ID = "8";

const CallerContext = createContext();

export function useCaller() {
  return useContext(CallerContext);
}

export function CallerPrvoider(props) {
  const [fetchedDocuments, setFetchedDocuments] = useState([]);
  const [count, setCount] = useState(0);
  const [totalCallCount, setTotalCallCount] = useState(0);
  const [recallscount, setRecallscount] = useState(0);
  const [noAnswered, setNoAnswered] = useState(0);
  const [declined, setDeclined] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [updatedDate, setUpdatedDate] = useState('');

  useEffect(() => {
    const currentdate = function () {
      const date = new Date();
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      setUpdatedDate(date.toLocaleString('en-US', options))
    }

    //console.log(updatedDate)
    currentdate()
  })

  async function fetchlist(division, ward, area, building) {
    try {
      let allDocuments = [];
      let lastDocumentId = null;

      const queries = [
        Query.orderDesc("$createdAt"),
        Query.equal("division", division),
        Query.equal("ward", ward),
        Query.equal("area", area),
        Query.equal("building", building),
        Query.equal("isRoomLocked", false),
        Query.equal("surveyDenied", false),
      ];

      while (true) {
        const additionalQueries = lastDocumentId
          ? [...queries, Query.cursorAfter(lastDocumentId)]
          : queries;

        const { documents } = await databases.listDocuments(
          DATABASE_ID,
          SURVEY_COLLECTION_ID,
          additionalQueries
        );

        allDocuments = [...allDocuments, ...documents];

        if (documents.length < 25) {
          // If less than 25 documents were returned, we've fetched all available documents
          break;
        }

        // Update lastDocumentId for pagination
        lastDocumentId = documents[documents.length - 1].$id;
      }

      setFetchedDocuments(allDocuments);
      setCount(allDocuments.length);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }

  async function birhdaylist (division){
    try {
      let allDocuments = [];
      let lastDocumentId = null;

      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });

      const queries = [
        Query.orderDesc("$createdAt"),
        Query.equal("division", division),
        Query.equal("isRoomLocked", false),
        Query.equal("surveyDenied", false),
        // Query.equal("familyhead.familyHeadBirthdate", date),
      ];

      while (true) {
        const additionalQueries = lastDocumentId
          ? [...queries, Query.cursorAfter(lastDocumentId)]
          : queries;

        const { documents } = await databases.listDocuments(
          DATABASE_ID,
          SURVEY_COLLECTION_ID,
          additionalQueries
        );

        const filteredDocuments = documents.filter(doc => {
          const birthdate = doc.familyhead.familyHeadBirthdate.slice(4, 10); // Extract month and day from birthdate
          return formattedDate === birthdate;
        });

        allDocuments = [...allDocuments, ...filteredDocuments];

        if (documents.length < 25) {
          // If less than 25 documents were returned, we've fetched all available documents
          break;
        }

        // Update lastDocumentId for pagination
        lastDocumentId = documents[documents.length - 1].$id;
      }

      setFetchedDocuments(allDocuments);
      setCount(allDocuments.length);
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
      Toast.show({
        type: 'error',
        text1: 'try again!',
        position: 'bottom'
      });
    }
  }

  // total count
  async function totalcount(userID) {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("verification_employee_id", [userID]),
        Query.contains("verified_at", [updatedDate]),
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
        Query.contains("verified_at", [updatedDate]),
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
        Query.contains("verified_at", [updatedDate]),
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
        Query.contains("calling_status", "decline"),
        Query.equal("verification_employee_id", userId),
        Query.contains("verified_at", updatedDate),
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
        Query.contains("verified_at", [updatedDate]),
      ],
    );

    const completed = response.documents.length;
    setCompleted(completed);
  }

  return (
    <CallerContext.Provider
      value={{ birhdaylist,fetchlist, fetchedDocuments, details, update, count, totalcount, totalCallCount, recalls, recallscount, noanswer, noAnswered, decline, declined, complete, completed }}
    >
      {props.children}
    </CallerContext.Provider>
  );
}
