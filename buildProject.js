const axios = require("axios");

const JENKINS_BASE_URL = "http://10.40.59.152:8080";
const JENKINS_USER = "app-user";
const JENKINS_API_TOKEN = "1126c4ab85d2018eace471a5ba78f46544";

async function getCrumb() {
  try {
    const response = await axios.get(
      `${JENKINS_BASE_URL}/crumbIssuer/api/json`,
      {
        auth: {
          username: JENKINS_USER,
          password: JENKINS_API_TOKEN,
        },
      }
    );
    return {
      crumb: response.data.crumb,
      crumbField: response.data.crumbRequestField,
    };
  } catch (error) {
    console.error(
      "Error fetching CSRF crumb:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function triggerJobWithParameters(jobName, parameters) {
  try {
    const { crumb, crumbField } = await getCrumb();

    const params = new URLSearchParams(parameters).toString(); // Convert parameters to query string format

    const response = await axios.post(
      `${JENKINS_BASE_URL}/job/solvendo/job/opsengine/job/trash/job/${jobName}/buildWithParameters?${params}`,
      null,
      {
        auth: {
          username: JENKINS_USER,
          password: JENKINS_API_TOKEN,
        },
        headers: {
          [crumbField]: crumb,
        },
      }
    );

    console.log(`Job "${jobName}" triggered successfully.`);
    console.log(response.statusText);
  } catch (error) {
    console.error(
      `Error triggering job "${jobName}":`,
      error.response?.data || error.message
    );
  }
}

const jobParameters = {
  GIT_URL: "ggg",
  BRANCH: "ggg",
  DEPLOY_COMMAND: "node index.js",
};

triggerJobWithParameters("testSubject", jobParameters);
