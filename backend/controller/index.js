const service = require('./service')
const bcrypt = require('bcrypt')
const fs = require('fs');
const path = require('path');

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Received username:", username);
    console.log("Received password:", password);
    try {
        const user = await service.loginUser(username, password);
        console.log("User:", user);
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const updatedata = async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await service.updatePassword(username, password);
        res.json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Error updating password:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


const fetchAlldata = async (req, res) => {
    try {
        const data = await service.getAllData();
        console.log("response",data)
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

const getSingledata = async (req, res) => {
    const mobileNumber = req.params.rdl_mobile_No;
    try {
        const data = await service.getDataByMobileNumber(mobileNumber);
        console.log("Response:", data); 
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};




const getdatabydate = async (req, res) => {
    try {
        const { start_date, end_date, rdl_mobile_No } = req.params;

        console.log("Received data in getFlowDifferenceByDate:", { start_date, end_date, rdl_mobile_No }); 

        const { dailyFlows, totalFlow } = await service.getCumulativeDataByTimeanddate(start_date, end_date, rdl_mobile_No);
        
        if (!dailyFlows || !Array.isArray(dailyFlows)) {
            throw new Error("Invalid dailyFlows data");
        }

        // Filter out null values from dailyFlows array
        const filteredDailyFlows = dailyFlows.filter(flow => flow !== null);

        const formattedDailyFlows = filteredDailyFlows.map((flowDifference, index) => {
            const date = new Date(start_date);
            date.setDate(date.getDate() + index);
            return {
                date: date.toISOString().split('T')[0],
                flowDifference
            };
        });

        res.status(200).json({
            success: true,
            data: {
                dailyFlows: formattedDailyFlows,
                totalFlowDifference: totalFlow
            }
        });
    } catch (error) {
        console.error("Error fetching flow difference:", error); 
        res.status(400).json({
            success: false,
            message: error.message || "Error fetching flow difference"
        });
    }
}


const downloadExcelReport = async (req, res) => {
    try {
        const { startDate, endDate, mobileNumber } = req.params;

        // Get data for the cumulative flow by time and date
        const responseData = await service.getCumulativeDataByTimeanddate(startDate, endDate, mobileNumber);

        if (!responseData.dailyFlows || !Array.isArray(responseData.dailyFlows)) {
            throw new Error("Invalid dailyFlows data");
        }

        const { dailyFlows, totalFlow } = responseData;

        // Get data for the max cumulative flow by mobile number
        const maxCumDataResponse = await service.getMaxCumFlowByMobileNumber(mobileNumber);

        console.log("maxCumDataResponse:", maxCumDataResponse); // Log maxCumDataResponse

        if (!maxCumDataResponse || !maxCumDataResponse.max_date || !maxCumDataResponse.cum_flow_m3) {
            throw new Error("Invalid maxCumData: Missing max_date or cum_flow_m3");
        }

        const { max_date, cum_flow_m3 } = maxCumDataResponse;

        // Generate Excel report
        const excelBuffer = await service.generateExcelReport(dailyFlows, totalFlow, max_date, cum_flow_m3);

        // Define file path to save the Excel file
        const filePath = path.join(__dirname, 'views', 'reports', `CumulativeReport_${startDate}_${endDate}_${mobileNumber}.xlsx`);

        // Write Excel buffer to file
        fs.writeFileSync(filePath, excelBuffer);

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=CumulativeReport.xlsx');
        res.send(excelBuffer);

    } catch (error) {
        console.error("Error generating Excel report:", error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};




const fetchAlldatafromsite = async (req, res) => {
    try {
        const data = await service.getAllDatafromsite()
        console.log("response",data)
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
const getSiteData =  async(req,res) =>
{
    try {
        const data = await service.getSiteData()
        console.log("response",data)
        res.json({ success: true, data });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
const getLastDateAndCum = async (req, res) => {
    try {
        const rdl_mobile_No = req.params.rdl_mobile_No; // Assuming rdl_mobile_No is in the request body

        if (!rdl_mobile_No) {
            throw new Error("rdl_mobile_No is required");
        }

        const data = await service.getMaxCumFlowByMobileNumber(rdl_mobile_No);
        console.log(data);

        if (data.max_date === null && data.cum_flow_m3 === null) {
            res.status(404).json({
                success: false,
                message: "No data found for the provided rdl_mobile_No"
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Error fetching max cumulative flow data:", error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {           
    fetchAlldata,
    login,
    updatedata,
    getSingledata,
    getdatabydate,
    fetchAlldatafromsite,
    getSiteData,
    getLastDateAndCum,
    downloadExcelReport
 

}