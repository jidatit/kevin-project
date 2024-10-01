import express from "express";
import axios from "axios";
import { stringify } from "querystring";
import cron from "node-cron";
import { Buffer } from "buffer";
import { setTimeout } from "timers/promises";

const router = express.Router();

let client_id = "";
let client_secret = "";
let access_token = "";
let refresh_token = "";
let cronJob;

router.post("/accessAndRefreshToken", async (req, res) => {
  const { redirect_uri, code, scope, access_type } = req.body;

  client_id = req.body.client_id;
  client_secret = req.body.client_secret;

  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      stringify({
        grant_type: "authorization_code",
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        code: code,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Response Data: ", response.data);
    access_token = response.data.access_token;
    refresh_token = response.data.refresh_token;
    console.log("Access Token : ", access_token);
    console.log("Refresh Token : ", refresh_token);
    res.json(response.data);

    scheduleTokenRefresh();
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).send("Error fetching tokens");
  }
});

router.get("/leads", async (req, res) => {
  try {
    const modules = await fetchModules(access_token);
    res.json(modules);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

async function fetchModules(access_token) {
  try {
    const response = await axios.get("https://www.zohoapis.com/crm/v2/Leads", {
      headers: {
        Authorization: `Zoho-oauthtoken ${access_token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Leads modules : ", error);
    throw error;
  }
}

router.post("/zoho", async (req, res) => {
  const { email } = req.body;
  try {
    const response = await axios.post(
      "https://www.zohoapis.com/crm/v6/coql",
      {
        select_query: `select Full_Name, RF_CAMPAIGN_NAME, Company_RF_LINK, PARTNER_TYPE, LEAD_Source1, AGENT_RF_CODE from Contacts where (Email = '${email}') limit 2000`,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    if (response.status !== 200) {
      console.error("Error from Zoho CRM:", response.data);

      return res.status(200).json({
        success: false,
        message: "Error from Zoho CRM",
        error: response.data,
      });
    }

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching data from Zoho CRM:", error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching data from Zoho CRM",
      error: error.message,
    });
  }
});

router.post("/agentData", async (req, res) => {
  const { AGENT_RF_CODE } = req.body;
  try {
    const response = await axios.post(
      "https://www.zohoapis.com/crm/v6/coql",
      {
        select_query: `select id, Full_Name, Est_Move_Date, Created_Time, Sold_Date, First_Name, Last_Name, Lead_Status, Provider, Internet_Sold, T_V_Sold, Phone_Sold, Move_Ref_Sold, Home_Monitoring, Utilities_set_up, Change_of_Address, New_State, New_City, Call_DispositionX, Agent_APP_Credentials, Agent_Preferred_Method_of_Reward_Fulfillment, Agent_Reimbursement from Leads where AgentReferralCode = '${AGENT_RF_CODE}' limit 2000`,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    if (response.status !== 200) {
      console.error("Error from Zoho CRM:", response.data);

      return res.status(200).json({
        success: false,
        message: "Error from Zoho CRM",
        error: response.data,
      });
    }

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching agent data from Zoho CRM:", error.message);

    res.status(500).json({
      success: false,
      message: "Error fetching agent data from Zoho CRM",
      error: error.message,
    });
  }
});

router.post("/pmData", async (req, res) => {
  const { LEAD_Source1 } = req.body;

  try {
    const response = await axios.post(
      "https://www.zohoapis.com/crm/v6/coql",
      {
        select_query: `select id, Full_Name , Est_Move_Date, Created_Time, Sold_Date, First_Name, Last_Name, Lead_Status, Provider, Internet_Sold, T_V_Sold, Phone_Sold, Move_Ref_Sold, Home_Monitoring, Utilities_set_up, Change_of_Address, New_State, New_City, Call_DispositionX, Electric_Acct, Gas_Acct, Renters_Insurance_Policy from Leads where Lead_Source = '${LEAD_Source1}' order by Created_Time desc limit 2000`,
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${access_token}`,
        },
      }
    );

    if (response.status !== 200) {
      console.error("Error from Zoho CRM:", response.data);

      return res.status(200).json({
        success: false,
        message: "Error from Zoho CRM",
        error: response.data,
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...response.data,
      },
    });
  } catch (error) {
    console.error("Error fetching PM data from Zoho CRM:", error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching PM data from Zoho CRM",
      error: error.message,
      errorStack: error.stack,
    });
  }
});

router.post("/lead/:id/attachments", async (req, res) => {
  const { id } = req.params;

  try {
    const leadRecordResponse = await fetchLeadRecord(id, access_token);

    if (!leadRecordResponse || !leadRecordResponse.attachments) {
      return res.status(200).json({
        success: false,
        message: "Attachments not found for the specified lead.",
      });
    }

    res.status(200).json({
      success: true,
      data: leadRecordResponse.attachments,
    });
  } catch (error) {
    console.error(`Error fetching attachments for lead ${id}:`, error.message);
    res.status(500).json({
      success: false,
      message: "Error fetching attachments",
      error: error.message,
      errorStack: error.stack,
    });
  }
});

async function fetchLeadRecord(leadId, accessToken) {
  try {
    const fields = [
      "Proof_of_Gas",
      "Proof_of_Renters_Insurance",
      "Proof_of_Electric",
    ].join(",");

    const response = await axios.get(
      `https://www.zohoapis.com/crm/v6/Leads/${leadId}?fields=${fields}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
      }
    );

    if (
      !response.data ||
      !response.data.data ||
      !Array.isArray(response.data.data) ||
      response.data.data.length === 0
    ) {
      console.log("Unexpected response structure:", response.data);
      return { data: {} };
    }

    const leadRecord = response.data.data[0];

    // Fetch file details for each proof document
    const proofFields = [
      "Proof_of_Gas",
      "Proof_of_Renters_Insurance",
      "Proof_of_Electric",
    ];
    for (const field of proofFields) {
      if (leadRecord[field] && leadRecord[field].length > 0) {
        const fileId = leadRecord[field][0].File_Id__s;
        const fileDetails = await fetchFileDetails(fileId, accessToken);
        leadRecord[field][0].fileDetails = fileDetails;
      }
    }

    return {
      ...response.data,
      leadRecord: leadRecord,
    };
  } catch (error) {
    console.error(
      "Error fetching lead record:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

async function fetchFileDetails(fileId, accessToken) {
  console.log("fileId : ", fileId);
  try {
    const response = await axios.get(
      `https://www.zohoapis.com/crm/v6/files?id=${fileId}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
        },
        responseType: "arraybuffer",
      }
    );

    // Log the response headers
    console.log("File Details Response Headers:", response.headers);

    // Get the file name from the Content-Disposition header
    const contentDisposition = response.headers["content-disposition"] || "";
    let fileName = "unknown";

    // Handle the new format: attachment;filename*=UTF-8''DScarpelli-SPECTRUM.pdf
    if (contentDisposition.includes("filename*=UTF-8''")) {
      fileName = decodeURIComponent(
        contentDisposition.split("filename*=UTF-8''")[1]
      );
    } else {
      // Fallback to the previous method
      fileName =
        contentDisposition.split("filename=")[1]?.replace(/"/g, "") ||
        "unknown";
    }

    // Convert binary data to Base64
    const base64Data = Buffer.from(response.data).toString("base64");

    return {
      fileName: fileName,
      fileSize: response.headers["content-length"],
      fileType: response.headers["content-type"],
      fileData: base64Data,
    };
  } catch (error) {
    console.error(
      "Error fetching file details:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
}

export async function refreshAccessToken() {
  try {
    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      stringify({
        grant_type: "refresh_token",
        client_id: client_id,
        client_secret: client_secret,
        refresh_token: refresh_token,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Refresh Response Data: ", response.data);
    access_token = response.data.access_token;
    console.log("New Access Token : ", access_token);
    return response;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
}

function scheduleTokenRefresh() {
  if (cronJob) cronJob.stop();
  cronJob = cron.schedule(
    "*/55 * * * *",
    async () => {
      console.log("Refreshing access token...");
      console.log("New Cron Job");
      try {
        await refreshAccessToken();
      } catch (error) {
        console.error("Failed to refresh access token:", error);
      }
    },
    {
      scheduled: true,
      timezone: "Etc/UTC",
    }
  );

  console.log("Token refresh scheduled for every 55 minutes.");
}

export default router;
