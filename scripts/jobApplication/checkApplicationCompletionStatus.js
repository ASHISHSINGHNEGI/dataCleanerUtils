export function checkApplicationCompletionStatus({
  applicationDetails,
  jobDetails,
}) {
  //   console.log({
  //     message: "Starting application completion check",
  //     applicationDetails
  //   });

  /* ---------------------------------------------
     1️⃣ Check Mandatory Questions
     --------------------------------------------- */
  if (
    jobDetails.mandatoryQuestions &&
    jobDetails.mandatoryQuestions.length > 0
  ) {
    console.log({
      message: "Checking mandatory questions",
      totalQuestions: jobDetails.mandatoryQuestions.length,
    });

    for (let i = 0; i < jobDetails.mandatoryQuestions.length; i++) {
      const requiredQuestion = jobDetails.mandatoryQuestions[i];
      let found = false;

      //   console.log({
      //     message: "Checking required question",
      //     requiredQuestion,
      //   });

      for (let j = 0; j < applicationDetails.mandatoryQuestions.length; j++) {
        const userQuestion = applicationDetails.mandatoryQuestions[j];

        if (
          userQuestion.question === requiredQuestion &&
          typeof userQuestion.answer === "string" &&
          userQuestion.answer.trim() !== ""
        ) {
          //   console.log({
          //     message: "Mandatory question answered",
          //     question: userQuestion.question,
          //     answer: userQuestion.answer,
          //   });

          found = true;
          break;
        }
      }

      if (!found) {
        console.log({
          message: "Mandatory question missing or unanswered",
          missingQuestion: requiredQuestion,
        });
        return false;
      }
    }
  }

  /* ---------------------------------------------
     2️⃣ Check Required Documents
     --------------------------------------------- */
  if (jobDetails.requiredDocuments && jobDetails.requiredDocuments.length > 0) {
    console.log({
      message: "Checking required documents",
      totalRequiredDocs: jobDetails.requiredDocuments.length,
    });

    for (let i = 0; i < jobDetails.requiredDocuments.length; i++) {
      const requiredDoc = jobDetails.requiredDocuments[i];
      let found = false;

      console.log({
        message: "Checking required document",
        requiredDoc,
      });

      for (let j = 0; j < applicationDetails.additionalDocuments.length; j++) {
        const userDoc = applicationDetails.additionalDocuments[j];

        if (
          userDoc.documentType === requiredDoc.name &&
          userDoc.mediaAssetId &&
          userDoc.mediaAssetId !== "" &&
          userDoc.mediaAssetId !== null
        ) {
          console.log({
            message: "Required document found",
            documentType: userDoc.documentType,
            mediaAssetId: userDoc.mediaAssetId,
          });

          found = true;
          break;
        }
      }

      if (!found) {
        console.log({
          message: "Required document missing",
          missingDocumentType: requiredDoc.name,
        });
        return false;
      }
    }
  }

  //   console.log({
  //     message: "Application is complete",
  //   });

  return true;
}
