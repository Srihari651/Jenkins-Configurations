const axios = require("axios");

const JENKINS_BASE_URL = "http://10.40.59.152:8080";
const sourceJobPath =
  "job/solvendo/job/opsengine/job/template/job/common-nodejs-template";
const destinationFolderPath = "job/solvendo/job/opsengine/job/trash";
const newJobName = "testSubject";
const JENKINS_USER = "app-user";
const JENKINS_API_TOKEN = "1126c4ab85d2018eace471a5ba78f46544";

// Jenkins crumb endpoint
const CRUMB_ENDPOINT = "/crumbIssuer/api/json";

async function getCrumb() {
  const response = await axios.get(`${JENKINS_BASE_URL}${CRUMB_ENDPOINT}`, {
    auth: {
      username: JENKINS_USER,
      password: JENKINS_API_TOKEN,
    },
  });
  return response.data.crumb;
}

async function copyJobConfig() {
  try {
    const crumb = await getCrumb();

    // Step 1: Fetch the source job configuration
    const sourceConfigResponse = await axios.get(
      `${JENKINS_BASE_URL}/${sourceJobPath}/config.xml`,
      {
        auth: {
          username: JENKINS_USER,
          password: JENKINS_API_TOKEN,
        },
        headers: {
          "Jenkins-Crumb": crumb,
        },
      }
    );

    const sourceConfigXML = sourceConfigResponse.data;

    // Step 2: Create a new job under the destination folder
    await axios.post(
      `${JENKINS_BASE_URL}/${destinationFolderPath}/createItem?name=${newJobName}`,
      sourceConfigXML,
      {
        auth: {
          username: JENKINS_USER,
          password: JENKINS_API_TOKEN,
        },
        headers: {
          "Jenkins-Crumb": crumb,
          "Content-Type": "application/xml",
        },
      }
    );

    console.log(
      `Job "${newJobName}" created under "${destinationFolderPath}" with configuration copied from "${sourceJobPath}".`
    );
  } catch (error) {
    console.error("Error copying job configuration:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

// Execute the function
copyJobConfig();
