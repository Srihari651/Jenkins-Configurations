const axios = require("axios");

let JENKINS_BASE_URL
let sourceJobPath
let destinationFolderPath
let newJobName
let JENKINS_USER
let JENKINS_API_TOKEN

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
