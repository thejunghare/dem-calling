import { createContext, useContext, useEffect, useState } from "react";
import { Query } from "react-native-appwrite";
import { toast } from "../lib/toast";
import { databases } from "../lib/appwrite";
import Toast from "react-native-toast-message";

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

  const [updatedDate, setUpdatedDate] = useState("");

  const [birthdayDocs, setBirthdayDocs] = useState([]);
  const [birthdayCount, setBirthdayCount] = useState(0);

  useEffect(() => {
    const currentdate = function () {
      const date = new Date();
      const options = { year: "numeric", month: "short", day: "numeric" };
      setUpdatedDate(date.toLocaleString("en-US", options));
    };

    //console.log(updatedDate)
    currentdate();
  });

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
      console.error("Error fetching documents:", error);
    }
  }

  async function birhdaylist(division) {
    try {
      let allDocuments = [];
      let lastDocumentId = null;

      const today = new Date();
      const formattedDate = today.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });

      const memberFormattedDate = today.toISOString().slice(5, 10); // Get "MM-DD" for member's birthdate comparison

      const queries = [
        Query.orderDesc("$createdAt"),
        Query.equal("division", division),
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

        const filteredDocuments = documents.filter((doc) => {
          let familyheadObj;
          let memberArray = [];

          // Parse familyhead JSON string to an object
          try {
            familyheadObj = JSON.parse(doc.familyhead);
          } catch (e) {
            console.error("Error parsing familyhead:", e);
            return false; // Skip the document if parsing fails
          }

          // Handle family head birthdate format (Mon Sep 09 2024)
          const familyHeadBirthdate = familyheadObj.familyHeadBirthdate;
          const familyHeadMatch = familyHeadBirthdate
            ? formattedDate === familyHeadBirthdate.slice(4, 10)
            : false;

          // Handle member array, check if it is a valid string before parsing
          if (typeof doc.member === "string") {
            try {
              memberArray = JSON.parse(doc.member);
            } catch (e) {
              console.error("Error parsing member array:", e);
              return false; // Skip the document if parsing fails
            }
          } else if (Array.isArray(doc.member)) {
            memberArray = doc.member;
          }

          // Check if any member's birthdate matches the current date (YYYY-MM-DD format)
          const memberMatch = memberArray.some((member) => {
            const memberBirthdate = member.memberBirthdate;
            return memberBirthdate
              ? memberFormattedDate === memberBirthdate.slice(5, 10) // Compare only MM-DD
              : false;
          });

          // Return true if either family head or any member's birthdate matches
          return familyHeadMatch || memberMatch;
        });

        allDocuments = [...allDocuments, ...filteredDocuments];

        if (documents.length < 25) {
          break; // End if less than 25 documents were returned
        }

        lastDocumentId = documents[documents.length - 1].$id;
      }

      setBirthdayDocs(allDocuments);
      setBirthdayCount(allDocuments.length);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  }

  async function details(surveyId, navigation) {
    const response = await databases.getDocument(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      surveyId
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
        UPDATED_DOCUMENT
      );
      //toast("Updated Successfully");
      Toast.show({
        type: "success",
        text1: "survey updated!",
        position: "bottom",
      });
      return result;
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "try again!",
        position: "bottom",
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
      ]
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
      ]
    );

    const recallscount = response.documents.length;
    setRecallscount(recallscount);
  };

  const noanswer = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("calling_status", ["no_answer"]),
        Query.equal("verification_employee_id", [userId]),
        Query.contains("verified_at", [updatedDate]),
      ]
    );

    const noAnswered = response.documents.length;
    setNoAnswered(noAnswered);
  };

  const decline = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.contains("calling_status", "decline"),
        Query.equal("verification_employee_id", userId),
        Query.contains("verified_at", updatedDate),
      ]
    );

    const declined = response.documents.length;
    setDeclined(declined);
  };

  const complete = async (userId) => {
    const response = await databases.listDocuments(
      DATABASE_ID,
      SURVEY_COLLECTION_ID,
      [
        Query.equal("calling_status", ["complete"]),
        Query.equal("verification_employee_id", [userId]),
        Query.contains("verified_at", [updatedDate]),
      ]
    );

    const completed = response.documents.length;
    setCompleted(completed);
  };

  return (
    <CallerContext.Provider
      value={{
        birhdaylist,
        birthdayDocs,
        birthdayCount,
        fetchlist,
        fetchedDocuments,
        details,
        update,
        count,
        totalcount,
        totalCallCount,
        recalls,
        recallscount,
        noanswer,
        noAnswered,
        decline,
        declined,
        complete,
        completed,
      }}
    >
      {props.children}
    </CallerContext.Provider>
  );
}
