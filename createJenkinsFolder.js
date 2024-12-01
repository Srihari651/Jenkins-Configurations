const axios = require("axios")

const createJenkinsFolder = async (folderName) => {
    try {
      let crumb = await getJenkinsCrumb();
      
      let folderUrl = `${JENKINS_BASE_URL}/${jenkinsPathString}organizations/createItem?name=${folderName}&mode=com.cloudbees.hudson.plugins.folder.Folder`;
      const folderConfigXml = `
        <com.cloudbees.hudson.plugins.folder.Folder plugin="cloudbees-folder@6.15">
        <actions/>
        <description>Folder created via API</description>
        <properties/>
      </com.cloudbees.hudson.plugins.folder.Folder>
      `;
      let config = {
        headers: {
          "Content-Type": "application/xml",
          "Jenkins-Crumb": crumb,
          accept: "*/*",
          "accept-encoding": "gzip, deflate",
          "accept-language": "en-US,en;q=0.9",
          connection: "keep-alive",
          "content-length": 0,
          "content-type": "application/x-www-form-urlencoded",
          cookie:
            "jenkins-timestamper-offset=-19800000; JSESSIONID.d9eb0c0b=node0dgiuewim6kmt15eb9vzk0n007440.node0; remember-me=YXBwLXVzZXI6MTczMzgzMDA1NDg4Mzo5ODk0MGUzYWMxNWM0Mjg3NzQzZWZiMzA1ZDYzOTZhNTUwMjZjZjAwMjZmZDJiNDFiMTRiNGY2Mjk3ZmI2Njc0",
          host: "jenkins.solvendo.io",
          origin: "http://jenkins.solvendo.io",
          referer: "http://jenkins.solvendo.io/job/item/configure",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        },
        auth: {
          username: JENKINS_USER,
          password: JENKINS_TOKEN,
        },
        maxRedirects: 0,
      };
      await axios.post(folderUrl, folderConfigXml, config);
      return { success: true, message: "Jenkins folder created successfully and configured" };
    } catch (error) {
      if (error.response?.status === 302) {
        logger.info(
          "Jenkins folder created but not configured",
          error.response.headers || error.message
        );
        return { status:302, success: true, message: "Jenkins folder created but not configured" };
      } else {
        logger.error(
          "Error creating Jenkins folder:",
          error.response?.data || error.message
        );
        return { status: error.response?.status, success: false, message: "Error creating Jenkins folder" };
      }
    }
  };